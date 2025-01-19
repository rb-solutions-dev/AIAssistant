"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { UserButton, useUser } from "@clerk/nextjs";

// utils
import useSupabase from "@/lib/supabase.client";

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
          <h1 className="text-2xl font-extrabold">Buenos días, Juan</h1>
          <UserButton />
        </div>

        <div className="mt-4">
          <div className="rounded-xl border-gray-100 shadow-xl border-2 min-h-44 px-4 py-2 bg-white">
            <h2 className="text-lg font-semibold">Asistentes</h2>
            <div className="flex flex-col gap-2 divide-y-2 divide-gray-100 mt-5">
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
                      <p className="text-gray-500 text-sm">
                        {assistant.description.slice(0, 100)}...
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">Ayer</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 border-t min-h-24 bg-white w-full z-10"></div>
    </>
  );
};

export default HomePage;
