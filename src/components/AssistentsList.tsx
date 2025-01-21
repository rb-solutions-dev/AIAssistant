import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";

// lib
import useSupabase from "@/lib/supabase.client";

// components
import { Button } from "./ui/button";

interface Assistant {
  id: number;
  created_at: string;
  name: string;
  prompt: string;
  avatar_url: string;
  description: string;
}

const AssistentsList = () => {
  const supabase = useSupabase();
  const { isSignedIn } = useUser();

  const { data: assistants } = useSWR(
    isSignedIn ? "/api/assistants" : null,
    async () => {
      const { data } = await supabase.from("assistants").select();

      return data;
    },
    {
      fallbackData: [],
    }
  );

  return (
    <div className="bg-accent rounded-xl p-4 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tus Asistentes</h2>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {assistants?.map((assistant) => {
          const assistantData = assistant as unknown as Assistant;
          return (
            <div
              key={assistantData.id}
              className="flex flex-row gap-2 items-center relative"
            >
              <Link
                href={`/chat/${assistantData.id}`}
                className="absolute inset-0"
              />
              <Image
                src={assistantData.avatar_url}
                alt={assistantData.name}
                width={64}
                height={64}
                className="rounded-full dark:bg-red-800 bg-red-500 p-1 w-16 h-16"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{assistantData.name}</p>
                <p className="text-sm text-muted-foreground">
                  {assistantData.description.slice(0, 70)}
                  {assistantData.description.length > 70 && "..."}
                </p>
              </div>

              <Button variant="link" size="icon">
                <Link href={`/chat/${assistantData.id}`}>
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssistentsList;
