"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

// utils
import useSupabase from "@/lib/supabase.client";

// components
import ChatBubble from "@/components/ChatBubble";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div className="min-h-[137px]" id="last-message" ref={elementRef} />;
};

const ChatPage = () => {
  const { id } = useParams();
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

  const { data } = useSWR(
    conversation ? `/api/conversations/${conversation.id}/messages` : null,
    async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation!.id);

      if (error) {
        return [];
      }

      return data;
    },
    {
      fallbackData: [],
    }
  );

  const messages = data.sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );

  return (
    <div className="flex flex-col gap-2 px-4 mt-3">
      <div className="sm:min-h-0 min-h-[10px]" />
      {messages.map((message) => {
        if (message.content === "") return null;

        const isLastMessage = message.id === data[data.length - 1].id;

        return (
          <ChatBubble
            key={message.id}
            message={message}
            isLastMessage={isLastMessage}
          />
        );
      })}
      {messages.length > 2 && <AlwaysScrollToBottom />}
    </div>
  );
};

export default ChatPage;
