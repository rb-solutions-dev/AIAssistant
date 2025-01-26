import Image from "next/image";

// utils
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/date";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

type Message = {
  id: string;
  role: string;
  content: string;
  created_at: string;
  shouldAnimate?: boolean;
};

interface Props {
  message: Message;
  conversationId: string;
  isLastMessage: boolean;
}

const AnimatedMessage = ({
  message,
  conversationId,
}: {
  message: Message;
  conversationId: string;
}) => {
  const [completedTyping, setCompletedTyping] = useState(false);
  const [displayResponse, setDisplayResponse] = useState(message.content);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setCompletedTyping(false);

    let i = 0;
    const stringResponse = message.content;

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));

      i++;

      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);

        mutate(
          `/api/conversations/${conversationId}/messages`,
          (currentData: Message[] = []) => {
            return currentData.map((msg) => {
              if (msg.id === message.id) {
                return {
                  ...msg,
                  shouldAnimate: false,
                };
              }
              return message;
            });
          },
          false
        );
      }
    }, 20);

    return () => clearInterval(intervalId);
  }, [message, conversationId, mutate]);

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
    </>
  );
};

const ChatBubble = ({ message, isLastMessage, conversationId }: Props) => {
  const isHuman = message.role === "human";
  const isPlaceholder = message.content === "ANSWER_PLACEHOLDER";

  const shouldAnimate = message.shouldAnimate;

  return (
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
                <AnimatedMessage
                  message={message}
                  conversationId={conversationId}
                />
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
  );
};

export default ChatBubble;
