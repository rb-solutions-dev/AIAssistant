
import React, { useEffect, useState } from "react";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {  ChatPromptTemplate,
  MessagesPlaceholder, } from "@langchain/core/prompts";
import type { Document } from "@langchain/core/documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { BaseMessage } from "@langchain/core/messages";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import './output.css'; 


const formatDocumentsAsString = (documents: Document[]) => {
  return documents.map((document) => document.pageContent).join("\n\n");
};





type ChatMessage = {
  role: "human" | "system"; // Role is explicitly "human" or "assistant"
  content: string; // The content of the message
};



const Model = () =>{




    const [quest, setQuest] = useState('');
    const [answer, setAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ role: "human" as "human", content: "" },{ role: "system" as "system", content: String("") }]); // Chat history with proper typing
    const [documentss, setDocumentss] = useState("");
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuest(e.target.value);
    
   
  };


    useEffect(() => {
      const fetchDocument = async () => {
  
        
        try {
          const response = await fetch("/articulosff.txt"); // Path relative to public folder
          const text = await response.text();
          setDocumentss(text);
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      };
  
      fetchDocument();
  

  
   
  
    }, []);





  
  const handleAskQuestion = async () => {

    const OPEN_API_KEY = "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"
  
  
    // Initialize the LLM to use to answer the question.
  const llm = new ChatOpenAI({
    model: "gpt-4o",
  apiKey: OPEN_API_KEY,
  maxTokens:3000
  });
  
  
  
  
  
  
  
  // Or, in web environments:
  // import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
  // const blob = new Blob(); // e.g. from a file input
  // const loader = new WebPDFLoader(blob);
  
  
  
 const convertedDocumentss2 =  documentss.toString();
  
let text = convertedDocumentss2
  


  // Import necessary libraries
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 8500,
  chunkOverlap: 20,
  separators: ["/n"],
});






// Create documents from text input
const docs = await textSplitter.createDocuments([text]);

// Create a vector store from the documents
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


 

  const formattedChatHistory = (chatHistory || [])
      .map(({ role, content }) => `${role}: ${content}`)
      .join("\n");
  
  



  const answer = await ragChain.invoke({input:quest, chat_history: formattedChatHistory},);
  // Provide an empty array or the appropriate `chat_history`


  const updatedChatHistory: ChatMessage[] = [
    ...chatHistory,
    { role: "human" as "human", content: quest }, // Explicitly cast "human"
    { role: "system" as "system", content: String(answer.answer) }, // Explicitly cast "assistant"
  ];

  setChatHistory(updatedChatHistory);
  setAnswer(answer.answer);
  setQuest("");



  };

  return (
    <div>
    <div className="container p-4">

          <h1 className="text-3xl font-bold underline">Personal Assistant</h1>
          <div className="columns-lg bg-gray-100 p-4 pb-16 h-max size-full 	 " >
        {/* Map through chatHistory array */}
        {chatHistory.slice(2).map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role === 'human' ? 'Tu' : 'Asistente'}:</strong> {message.content}
          </div>
          
        ))}
      </div>
      </div>    
      <div>

   
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white w-full shadow-lg columns-lg">
        <div className="columns-lg">

        <label className="block p-4">

    <input value={quest}  onChange={handleQuestionChange} placeholder="Mensaje" className="border-double shadow-md border-4 bg-orange-100 rounded-lg"/>
   
            <button onClick={handleAskQuestion} className="rounded-full p-4"><p className="text-base ...">Enviar</p></button>
         
            <button className=" s2condPurple	">
  Save changes
</button>

  </label>
 
        </div>
        </div>  




      </div>  
      
  );
};

export default Model;