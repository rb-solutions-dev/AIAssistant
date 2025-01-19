"use client";

import { Loader, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { useSWRConfig } from "swr";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// utils
import useSupabase from "@/lib/supabase.client";

// interface
import useSWR from "swr";

enum Role {
  Human = "human",
  System = "system",
}

type ChatMessage = {
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
  const { mutate } = useSWRConfig();

  const supabase = useSupabase();
  const { data: documents, isLoading: isLoadingDocuments } = useSWR(
    "/articulosff.txt",
    async () => {
      const response = await fetch("/articulosff.txt");
      const text = await response.text();

      return text;
    },
    {
      fallbackData: "",
    }
  );

  const handleSubmit = async ({ message }: { message: string }) => {
    const docs = await textSplitter.createDocuments([documents]);

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
      ["system", contextualizeQSystemPrompt],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
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
      ["system", systemPrompt],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: qaPrompt,
    });

    const ragChain = await createRetrievalChain({
      retriever: historyAwareRetriever,
      combineDocsChain: questionAnswerChain,
    });

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id")
      .match({ assistant_id: id })
      .single();

    if (conversationError) {
      throw new Error("Error getting conversation");
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation!.id);

    let chatHistory: ChatMessage[] = [];

    if (error || !data || data.length === 0) {
      chatHistory = [
        { role: "human" as Role, content: "" },
        { role: "system" as Role, content: "" },
      ];
    } else {
      chatHistory = data.map(({ role, content }) => ({
        role: role as Role,
        content,
      }));
    }

    const answer = await ragChain.invoke({
      input: message,
      chat_history: chatHistory
        .map(({ role, content }) => `${role}: ${content}`)
        .join("\n"),
    });

    await supabase.from("messages").insert([
      { role: "human", content: message, conversation_id: conversation!.id },
      {
        role: "system",
        content: answer.answer,
        conversation_id: conversation!.id,
      },
    ]);

    // TODO: https://swr.vercel.app/examples/optimistic-ui
    await mutate(`/api/conversations/${id}/messages`);

    form.reset({
      message: "",
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="px-4 flex justify-center flex-1 items-center gap-2 h-full"
    >
      <Input
        placeholder="Escribe un mensaje"
        className="h-10 placeholder:text-gray-500"
        disabled={isLoadingDocuments || form.formState.isSubmitting}
        {...form.register("message")}
      />
      <Button
        variant="outline"
        type="submit"
        disabled={isLoadingDocuments || form.formState.isSubmitting}
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
