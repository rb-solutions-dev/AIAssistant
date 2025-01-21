"use client";

// components
import ChatsList from "@/components/ChatsList";
import AssistentsList from "@/components/AssistentsList";

const ChatsPage = () => {
  return (
    <div className="px-4 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Chats</h1>
      </div>

      <div className="mt-4">
        <ChatsList />
      </div>

      <div className="mt-8">
        <AssistentsList />
      </div>
    </div>
  );
};

export default ChatsPage;
