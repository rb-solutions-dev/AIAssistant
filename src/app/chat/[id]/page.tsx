"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";

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
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-2 px-4 mt-3 pt-16 overflow-y-auto max-h-[calc(100vh-136px)]">
      {data
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map(({ role, content, id, created_at }) => {
          if (content === "") return null;

          const isHuman = role === "human";
          const isLastMessage = id === data[data.length - 1].id;
          return (
            <Fragment key={id}>
              <div
                className={cn(
                  `relative px-5 py-3 w-4/5 shadow-md max-w-fit rounded-xl`,
                  isHuman
                    ? "bg-green-200 dark:bg-green-800 self-end"
                    : "bg-white dark:bg-gray-700  self-start",
                  content === "Thinking..." ? "bg-gray-200 animate-pulse" : "",
                  content === "ANSWER_PLACEHOLDER"
                    ? "bg-gray-200 animate-pulse"
                    : "",
                  isLastMessage && "mb-6"
                )}
              >
                <p
                  className={cn(
                    isHuman
                      ? "text-black dark:text-white text-right"
                      : "text-black",
                    "dark:text-white"
                  )}
                >
                  {content === "ANSWER_PLACEHOLDER" ? "..." : content}
                </p>
                <p className="text-xs text-foreground text-right pt-1">
                  {formatTimestamp(created_at)}
                </p>
              </div>
            </Fragment>
          );
        })}

      <div ref={lastMessageRef} className="h-4" />
    </div>
  );
};

export default ChatPage;
