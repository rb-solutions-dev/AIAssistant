"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ChatListener = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/chat/")) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [pathname]);

  return <></>;
};

export default ChatListener;
