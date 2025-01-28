import Image from "next/image";
import { Dot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// utils
import { cn } from "@/lib/utils";
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
    }, 3);

    return () => clearInterval(intervalId);
  }, [message]);

  return (
    <>
      <div
        className="chat-bubble"
        dangerouslySetInnerHTML={{ __html: displayResponse }}
      />{" "}
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

const ChatBubble = ({ message }: Props) => {
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
            src="/be.png"
            alt="logo"
            width={40}
            height={40}
            className="self-start rounded-full"
          />
        )}
        <>
          {isPlaceholder ? (
            <Dot className="h-8 w-8 animate-pulse" />
          ) : (
            <>
              {shouldAnimate ? (
                <AnimatedMessage message={message} />
              ) : (
                <div
                  className={cn(
                    isHuman
                      ? "chat-bubble-human"
                      : "chat-bubble text-left flex-1 px-1"
                  )}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};

export default ChatBubble;
