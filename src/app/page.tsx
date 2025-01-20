"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";

// utils
import useSupabase from "@/lib/supabase.client";

// components
import SettingSheet from "@/components/SettingSheet";

const HomePage = () => {
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
    <>
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold">Bienvenido!</h1>

          <div>
            <SettingSheet />
          </div>
        </div>

        <div className="mt-4">
          <div className="rounded-xl border-accent shadow-xl border-2 min-h-44 px-4 py-2 bg-background">
            <h2 className="text-lg font-semibold">Asistentes</h2>
            <div className="flex flex-col gap-2 divide-y-2 divide-background mt-5">
              {assistants?.map((assistant) => {
                return (
                  <div
                    key={assistant.id}
                    className="flex flex-row gap-3 items-center relative"
                  >
                    <Link
                      href={`/chat/${assistant.id}`}
                      className="absolute inset-0"
                    />
                    <Image
                      src={assistant.avatar_url}
                      alt={assistant.name}
                      width={64}
                      height={64}
                      className="rounded-full min-w-16"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {assistant.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {assistant.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
