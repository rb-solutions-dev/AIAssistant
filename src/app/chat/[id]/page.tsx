"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";

// utils
import { cn } from "@/lib/utils";
import useSupabase from "@/lib/supabase.client";

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

  return (
    <div className="flex flex-col gap-2 px-4 mt-3">
      {data.map(({ role, content, id }) => {
        if (content === "") return null;

        const isHuman = role === "human";
        return (
          <div
            key={id}
            className={cn(
              `relative px-5 py-3 w-4/5 shadow-md max-w-fit rounded-xl`,
              isHuman ? "bg-green-200 self-end" : "bg-white self-start"
            )}
          >
            {/* Chat content */}
            <p className={isHuman ? "text-black text-right" : "text-black"}>
              {content}
            </p>
            <p className="text-xs text-gray-500 text-right pt-1">12:56</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatPage;
