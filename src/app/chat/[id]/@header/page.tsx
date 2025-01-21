"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { ChevronLeftIcon, MoreVerticalIcon } from "lucide-react";

// utils
import useSupabase from "@/lib/supabase.client";

// components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { id } = useParams();
  const supabase = useSupabase();
  const { isSignedIn } = useUser();

  const apiKey = isSignedIn ? "/api/conversations" : null;
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
      fallbackData: [],
    }
  );

  const conversation = data[0];
  const assistant = conversation.assistants as unknown as {
    id: string;
    name: string;
    description: string;
    avatar_url: string;
  };

  const { trigger, isMutating } = useSWRMutation(
    `/api/conversations/${conversation.id}/messages`,
    async () => {
      await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversation!.id);
    }
  );

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <button className="relative">
          <Link href="/" className="">
            <ChevronLeftIcon className="w-6 h-6" />
          </Link>
        </button>
        <Image
          src={assistant.avatar_url}
          alt={assistant.name}
          width={24}
          height={24}
          className="rounded-full morena-image"
        />
        <p className="font-bold ml-1">{assistant.name}</p>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon className="w-6 h-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuItem
              onClick={() => {
                trigger();
              }}
              disabled={isMutating}
            >
              Limpiar Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default Header;
