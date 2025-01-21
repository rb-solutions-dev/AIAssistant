import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";

// lib
import { cn } from "@/lib/utils";
import useSupabase from "@/lib/supabase.client";

// components
import { buttonVariants } from "./ui/button";

interface Assistant {
  id: number;
  name: string;
  avatar_url: string;
}

interface Conversation {
  id: number;
  assistants: Assistant;
}

interface LastMessage {
  id: number;
  content: string;
  created_at: string;
  conversations: Conversation;
}

const LastMessage = () => {
  const supabase = useSupabase();
  const { isSignedIn } = useUser();

  const { data, isLoading } = useSWR(
    isSignedIn ? "/api/last-message" : null,
    async () => {
      const { data } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          conversations(
            id,
            assistants(
              id,
              name,
              avatar_url
            )
          )
        `
        )
        .eq("role", "human") // Using `eq` instead of `match` for better clarity
        .order("created_at", { ascending: false })
        .limit(1)
        .single(); // Fetch a single result directly

      return data || null;
    },
    {
      fallbackData: null,
    }
  );

  if (isLoading || !data) return null;

  const message = data as unknown as LastMessage;
  return (
    <div className="bg-accent rounded-xl p-4 border border-border shadow-sm">
      <div className="flex flex-row items-center justify-between gap-4">
        <Image
          src={message.conversations.assistants.avatar_url}
          alt={message.conversations.assistants.name}
          width={64}
          height={64}
          className="rounded-full min-w-16 dark:bg-red-800 bg-red-500 p-1"
        />

        <p className="text-primary text-lg flex-1">
          {message.content.length > 120
            ? `${message.content.slice(0, 120).trim()}...`
            : message.content}
        </p>
      </div>

      <Link
        href={`/chat/${message.conversations.assistants.id}`}
        className={cn(buttonVariants({ variant: "outline" }), "w-full mt-4")}
      >
        Seguir conversación
      </Link>
    </div>
  );
};

export default LastMessage;
