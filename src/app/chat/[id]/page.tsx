"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

// utils
import { cn } from "@/lib/utils";
import useSupabase from "@/lib/supabase.client";
import { formatTimestamp } from "@/lib/date";

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
        behavior: "smooth",
        block: "end",
      });
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-2 px-4 mt-3">
      <div className="min-h-16" />
      {data.map(({ role, content, id, created_at }) => {
        if (content === "") return null;

        const isHuman = role === "human";
        return (
          <div
            key={id}
            className={cn(
              `relative px-5 py-3 w-4/5 shadow-md max-w-fit rounded-xl`,
              isHuman ? "bg-green-200 self-end" : "bg-white self-start",
              content === "Thinking..." ? "bg-gray-200 animate-pulse" : "",
              content === "ANSWER_PLACEHOLDER"
                ? "bg-gray-200 animate-pulse"
                : ""
            )}
          >
            {/* Chat content */}
            <p className={isHuman ? "text-black text-right" : "text-black"}>
              {content === "ANSWER_PLACEHOLDER" ? "..." : content}
            </p>
            <p className="text-xs text-gray-500 text-right pt-1">
              {formatTimestamp(created_at)}
            </p>
          </div>
        );
      })}
      <div className="min-h-28 sm:min-h-48" ref={lastMessageRef} />
    </div>
  );
};

export default ChatPage;
