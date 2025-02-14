import Link from "next/link";
import Image from "next/image";
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

const SkeletonAssistant = () => (
  <CarouselItem className="basis-1/3 items-center justify-center flex flex-col gap-2 text-center">
    <div className="w-16 h-16 rounded-full dark:bg-gray-700 bg-gray-300 animate-pulse"></div>
    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
  </CarouselItem>
);

const AssistantCarrousel = () => {
  const supabase = useSupabase();
  const { isSignedIn } = useUser();

  const { data: assistants, isLoading } = useSWR(
    isSignedIn ? "/api/assistants" : null,
    async () => {
      const { data } = await supabase.from("assistants").select();

      return data || [];
    },
    {
      fallbackData: [],
    }
  );

  return (
    <div className="bg-accent rounded-xl p-4 border border-border drop-shadow-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Asistentes</h2>
        <Link href="/chats" className="text-sm text-primary">
          Ver Todos
        </Link>
      </div>
      <Carousel className="mt-8">
        <CarouselContent>
          {isLoading ? (
            <>
              <SkeletonAssistant />
              <SkeletonAssistant />
              <SkeletonAssistant />
            </>
          ) : null}
          {assistants.map((assistant) => {
            return (
              <CarouselItem
                key={assistant.id}
                className="basis-1/2 items-center justify-center flex flex-col gap-2 relative text-center"
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
                  className="rounded-full morena-image"
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
