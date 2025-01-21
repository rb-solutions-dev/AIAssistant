import useSWR from "swr";
import { useUser } from "@clerk/nextjs";

// components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// lib
import useSupabase from "@/lib/supabase.client";
import Image from "next/image";
import Link from "next/link";

const AssistantCarrousel = () => {
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
        <h2 className="text-xl font-semibold">Asistentes</h2>

        <Link href="/chats" className="text-sm text-primary">
          Ver Todos
        </Link>
      </div>
      <Carousel className="mt-8">
        <CarouselContent>
          {assistants?.map((assistant) => {
            return (
              <CarouselItem
                key={assistant.id}
                className="basis-1/2 items-center justify-center flex flex-col gap-2 relative"
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
                  className="rounded-full dark:bg-red-800 bg-red-500 p-1"
                />
                <p className="text-sm font-medium">{assistant.name}</p>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default AssistantCarrousel;
