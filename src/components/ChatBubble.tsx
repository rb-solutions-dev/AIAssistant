import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// utils
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/date";
import { Role } from "@/app/chat/[id]/@create/page";

type Message = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

interface Props {
  message: Message;
  isLastMessage: boolean;
}

const AnimatedMessage = ({ message }: { message: Message }) => {
  const [completedTyping, setCompletedTyping] = useState(false);
  const [displayResponse, setDisplayResponse] = useState(message.content);

  const lastMessageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setCompletedTyping(false);
    setDisplayResponse(""); // Start with an empty string

    let i = 0;
    const stringResponse = message.content;
    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));
      i++;

      lastMessageRef.current?.scrollIntoView({ behavior: "auto" });

      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
      }
    }, 5);

    return () => clearInterval(intervalId);
  }, [message]);

  return (
    <>
      {displayResponse}{" "}
      {!completedTyping && (
        <svg
          viewBox="8 4 8 16"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor"
        >
          <rect x="10" y="6" width="4" height="12" fill="#fff" />
        </svg>
      )}
      {!completedTyping && (
        <span ref={lastMessageRef} id="last-message" className="min-h-[10px]" />
      )}
    </>
  );
};

const ChatBubble = ({ message, isLastMessage }: Props) => {
  const isHuman = message.role === "human";
  const isPlaceholder = message.content === "ANSWER_PLACEHOLDER";

  const messageCreatedLast10Seconds =
    new Date(message.created_at).getTime() > Date.now() - 10000;
  const shouldAnimate =
    messageCreatedLast10Seconds && message.role === Role.System;

  return (
    <>
      <div
        className={cn(isHuman ? "flex-row-reverse" : "flex-row", "flex gap-2")}
      >
        {isHuman ? null : (
          <Image
            src="/icons/ios/40.png"
            alt="logo"
            width={40}
            height={40}
            className="self-start rounded-full"
          />
        )}
        <div
          className={cn(
            `relative px-5 py-3 w-4/5 shadow-md max-w-fit rounded-xl`,
            isHuman
              ? "bg-green-200 dark:bg-green-800 self-end"
              : "bg-white dark:bg-gray-700  self-start",
            isPlaceholder ? "bg-gray-200 animate-pulse" : "",
            isLastMessage && "mb-6"
          )}
        >
          <p
            className={cn(
              isHuman ? "text-black dark:text-white text-right" : "text-black",
              "dark:text-white"
            )}
          >
            {isPlaceholder ? (
              "..."
            ) : (
              <>
                {shouldAnimate ? (
                  <AnimatedMessage message={message} />
                ) : (
                  message.content
                )}
              </>
            )}
          </p>
          <p className="text-xs text-foreground text-right pt-1">
            {formatTimestamp(message.created_at)}
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBubble;
