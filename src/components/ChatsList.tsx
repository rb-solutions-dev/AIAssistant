import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";

// lib
import useSupabase from "@/lib/supabase.client";

interface Chat {
  id: number;
  assistants: {
    id: number;
    name: string;
    avatar_url: string;
  };
  messages: {
    id: number;
    role: string;
    content: string;
    created_at: string;
  }[];
}

const ChatsList = () => {
  const supabase = useSupabase();
  const { isSignedIn } = useUser();

  const { data } = useSWR(
    isSignedIn ? "/api/chats" : null,
    async () => {
      const { data } = await supabase
        .from("conversations")
        .select(
          `
          id,
          assistants(
            id,
            name,
            avatar_url
          ),
          messages(
            id,
            content,
            role,
            created_at
          )
        `
        )
        .order("created_at", { referencedTable: "messages", ascending: false })
        .limit(1, { referencedTable: "messages" });

      if (!data) return [];
      return data;
    },
    {
      fallbackData: [],
    }
  );

  const userHaveChats = data.filter((chat) => chat.messages.length > 0);

  if (userHaveChats.length === 0) {
    return null;
  }

  return (
    <div className="bg-accent rounded-xl p-4 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tus Chats</h2>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {data.map((chat) => {
          const chatData = chat as unknown as Chat;

          if (chatData.messages.length === 0 || !chatData.assistants)
            return null;
          return (
            <div
              key={chatData.id}
              className="flex flex-row gap-2 items-center relative"
            >
              <Link
                href={`/chat/${chatData.assistants.id}?back_url=/chats`}
                className="absolute inset-0"
              />
              <Image
                src={chatData.assistants.avatar_url}
                alt={chatData.assistants.name}
                width={64}
                height={64}
                className="rounded-full morena-image w-16 h-16"
              />
              <div className="flex flex-col flex-1">
                <p className="text-sm font-medium">
                  {chatData.assistants.name}
                </p>
                <div
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html:
                      chatData.messages[0].content.length > 70
                        ? chatData.messages[0].content.slice(0, 70) + "..."
                        : chatData.messages[0].content,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {format(
                  new Date(chatData.messages[0].created_at),
                  "dd/MM/yyyy"
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatsList;
