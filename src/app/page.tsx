"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

// utils
import { cn } from "@/lib/utils";
import useSupabase from "@/lib/supabase.client";

const HomePage = () => {
  const supabase = useSupabase();
  const pathname = usePathname();
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
          <h1 className="text-2xl font-extrabold">Bienvenido</h1>
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
      <div className="fixed bottom-0 right-0 border-t bg-white w-full z-10">
        <div className="flex justify-around py-3">
          {[
            {
              name: "Inicio",
              href: "/",
              icon: Home,
            },
          ].map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all",
                "text-gray-500 hover:text-black",
                pathname === href && "text-black font-semibold"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{name}</span>
            </Link>
          ))}
          <div className="flex flex-col items-center justify-center gap-1 transition-all">
            <UserButton />
            <span className="text-xs">Perfil</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
