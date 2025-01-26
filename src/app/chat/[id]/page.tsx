"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

// utils
import useSupabase from "@/lib/supabase.client";

// components
import ChatBubble from "@/components/ChatBubble";

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
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }, [data]);

  return (
    <div
      className="flex flex-col gap-2 px-4 mt-3 pt-16 overflow-y-auto max-h-[calc(100vh-136px)]"
      id="chat-wraper"
    >
      {data
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((message) => {
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

      <div ref={lastMessageRef} className="h-4" id="last-message" />
    </div>
  );
};

export default ChatPage;
