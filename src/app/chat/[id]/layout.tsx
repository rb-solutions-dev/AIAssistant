"use client";

import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import useSWRMutation from "swr/mutation";

// utils
import useSupabase from "@/lib/supabase.client";

const RootLayout = ({
  children,
  create,
  header,
}: Readonly<{
  children: React.ReactNode;
  create: React.ReactNode;
  header: React.ReactNode;
}>) => {
  const { id } = useParams();
  const supabase = useSupabase();
  const { isSignedIn } = useUser();

  const apiKey = isSignedIn ? "/api/conversations" : null;

  const { trigger } = useSWRMutation(apiKey, async () => {
    const { data } = await supabase
      .from("conversations")
      .insert({ assistant_id: id })
      .select("id")
      .single();

    const { data: assistant } = await supabase
      .from("assistants")
      .select("name")
      .eq("id", id)
      .single();

    await supabase.from("messages").insert([
      {
        role: "system",
        content: `Hola, soy ${assistant!.name}. ¿En qué te puedo ayudar?`,
        conversation_id: data!.id,
      },
    ]);

    return data;
  });

  const { data } = useSWR(
    apiKey,
    async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          id,
          title,
          assistants (
            id,
            name,
            description,
            avatar_url
          )
        `
        )
        .match({ assistant_id: id });

      if (error) {
        return [];
      }

      return data ?? [];
    },
    {
      onSuccess: (data) => {
        if (data?.length === 0) {
          trigger();
        }
      },
      fallbackData: [],
    }
  );

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="h-16 fixed top-0 left-0 right-0 px-2 bg-background flex justify-between items-center border-b z-10">
        {header}
      </div>
      <div className="flex-1 h-screen">{children}</div>
      <div className="flex flex-col fixed bottom-20 right-0 border-t min-h-14 max-h-14 bg-background w-full z-10">
        {create}
      </div>
    </div>
  );
};

export default RootLayout;
