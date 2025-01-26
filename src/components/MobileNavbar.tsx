"use client";

import Link from "next/link";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Hammer, Home, Loader, MessageCircle } from "lucide-react";

// utils
import { cn } from "@/lib/utils";

const MobileNavbar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const { isLoaded } = useUser();

  return (
    <div className="fixed bottom-0 right-0 border-t bg-background w-full z-10 max-h-20 min-h-20">
      <div className="flex justify-around py-3">
        {[
          {
            name: "Inicio",
            href: "/",
            icon: Home,
            active: pathname === "/",
          },
          {
            name: "Chats",
            href: "/chats",
            icon: MessageCircle,
            active: pathname.includes("/chat"),
          },
          // {
          //   name: "Herramientas",
          //   href: "/tools",
          //   icon: Hammer,
          //   active: pathname.includes("/tools"),
          // },
        ].map(({ name, href, icon: Icon, active }) => (
          <Link
            key={name}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all",
              "text-muted-foreground hover:text-foreground",
              active && "text-foreground font-semibold"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{name}</span>
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center gap-1 transition-all">
          {isLoaded ? (
            <UserButton
              key={theme}
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
              }}
            />
          ) : (
            <Loader className="w-6 h-6 animate-spin" />
          )}
          <span className="text-xs">Perfil</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
