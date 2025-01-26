"use client";

import useSWR from "swr";
import useSound from "use-sound";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Loader, Send } from "lucide-react";
import { useSWRConfig } from "swr";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// utils
import useSupabase from "@/lib/supabase.client";

// hooks
import { useToast } from "@/hooks/use-toast";

const notificationSound = "/sounds/beep.wav";
export enum Role {
  Human = "human",
  System = "system",
}

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

const OPEN_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const llm = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: OPEN_API_KEY,
  maxTokens: 3000,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 8500,
  chunkOverlap: 20,
  separators: ["/n"],
});

const CreateMessage = () => {
  const { id } = useParams();
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const [play] = useSound(notificationSound, {
    playbackRate: 1,
    volume: 1,
    interrupt: true,
  });

  const supabase = useSupabase();
  const { data: conversation } = useSWR(
    `/api/conversations/${id}/info`,
    async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .match({ assistant_id: id })
        .single();

      return data;
    }
  );

  const { data: ragChain, isLoading: isLoadingRagChain } = useSWR(
    "/articulosff.txt",
    async () => {
      const response = await fetch("/articulosff.txt");
      const text = await response.text();

      const docs = await textSplitter.createDocuments([text]);

      const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings({
          apiKey: OPEN_API_KEY,
        })
      );

      const retriever = vectorStore.asRetriever();

      const contextualizeQSystemPrompt =
        "Given a chat history and the latest user question " +
        "which might reference context in the chat history, " +
        "formulate a standalone question which can be understood " +
        "without the chat history. Do NOT answer the question, " +
        "just reformulate it if needed and otherwise return it as is.";

      const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
        [Role.System, contextualizeQSystemPrompt],
        new MessagesPlaceholder("chat_history"),
        [Role.Human, "{input}"],
      ]);

      const historyAwareRetriever = await createHistoryAwareRetriever({
        llm,
        retriever,
        rephrasePrompt: contextualizeQPrompt,
      });

      const systemPrompt =
        "You are an assistant for question-answering tasks. " +
        "Use the following pieces of retrieved context to answer " +
        "the question. If you don't know the answer, say that you " +
        "don't know. Use three sentences maximum and keep the " +
        "answer concise." +
        "\n\n" +
        "{context}";

      const qaPrompt = ChatPromptTemplate.fromMessages([
        [Role.System, systemPrompt],
        new MessagesPlaceholder("chat_history"),
        [Role.Human, "{input}"],
      ]);

      const questionAnswerChain = await createStuffDocumentsChain({
        llm,
        prompt: qaPrompt,
      });

      const ragChain = await createRetrievalChain({
        retriever: historyAwareRetriever,
        combineDocsChain: questionAnswerChain,
      });

      return { ragChain, docs };
    },
    {
      fallbackData: undefined,
    }
  );

  const handleSubmit = async ({ message }: { message: string }) => {
    const { data: newMessageHumanOnDB, error: errorHuman } = await supabase
      .from("messages")
      .insert([
        {
          role: Role.Human,
          content: message,
          conversation_id: conversation!.id,
        },
        {
          role: Role.System,
          content: "ANSWER_PLACEHOLDER",
          conversation_id: conversation!.id,
        },
      ])
      .select("id, content, created_at, role");

    if (errorHuman || !newMessageHumanOnDB) {
      toast({
        title: "Error",
        description: errorHuman?.message || "Error al enviar el mensaje",
        variant: "destructive",
      });
      return;
    }

    const answerId = newMessageHumanOnDB.find(
      (message) => message.role === Role.System
    )?.id;

    await mutate(
      `/api/conversations/${conversation!.id}/messages`,
      (currentData: { role: string; content: string }[] = []) => {
        return [...currentData, ...newMessageHumanOnDB];
      },
      {
        revalidate: false,
      }
    );

    form.reset({
      message: "",
    });

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation!.id);

    let chatHistory: ChatMessage[] = [];

    if (error || !data || data.length === 0) {
      chatHistory = [
        { role: Role.Human, content: "", id: nanoid() },
        { role: Role.System, content: "", id: nanoid() },
      ];
    } else {
      chatHistory = data.map(({ role, content, id }) => ({
        role: role as Role,
        content,
        id,
      }));
    }

    const answer = await ragChain!.ragChain!.invoke({
      input: message,
      chat_history: chatHistory
        .map(
          ({ role, content }) =>
            `${role}: ${content === "ANSWER_PLACEHOLDER" ? "" : content}`
        )
        .join("\n"),
    });

    const answerContent = answer.answer;

    await supabase
      .from("messages")
      .update({
        content: answerContent,
      })
      .eq("id", answerId);

    await mutate(
      `/api/conversations/${conversation!.id}/messages`,
      (currentData: ChatMessage[] = []) => {
        return currentData.map((message) => {
          if (message.id === answerId) {
            return {
              ...message,
              content: answerContent,
            };
          }
          return message;
        });
      },
      false
    );

    form.setFocus("message");

    play({ forceSoundEnabled: true });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="px-4 flex justify-center flex-1 items-center gap-2 h-full"
    >
      <Input
        placeholder="Escribe un mensaje"
        className="h-10 placeholder:text-gray-500"
        disabled={isLoadingRagChain || form.formState.isSubmitting}
        {...form.register("message")}
      />
      <Button
        variant="outline"
        type="submit"
        disabled={isLoadingRagChain || form.formState.isSubmitting || !ragChain}
      >
        {form.formState.isSubmitting ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : (
          <Send className="w-6 h-6" />
        )}
      </Button>
    </form>
  );
};

export default CreateMessage;
