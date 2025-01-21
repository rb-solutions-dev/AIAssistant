"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Hammer, Home, Loader, MessageCircle } from "lucide-react";

// utils
import { cn } from "@/lib/utils";

const MobileNavbar = () => {
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
          },
          {
            name: "Chats",
            href: "/chats",
            icon: MessageCircle,
          },
          {
            name: "Herramientas",
            href: "/tools",
            icon: Hammer,
          },
        ].map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all",
              "text-muted-foreground hover:text-foreground",
              pathname === href && "text-foreground font-semibold"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{name}</span>
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center gap-1 transition-all">
          {isLoaded ? (
            <UserButton />
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
