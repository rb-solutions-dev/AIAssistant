"use client";

import Link from "next/link";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import {
  OrganizationProfile,
  OrganizationSwitcher,
  Protect,
  useOrganization,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Home, Loader, MessageCircle } from "lucide-react";

// utils
import { cn } from "@/lib/utils";

const MobileNavbar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const { isLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  const isAdmin = isOrgLoaded ? organization?.adminDeleteEnabled : false;
  return (
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
      <Protect role="org:admin">
        <div className="flex flex-col items-center justify-center gap-1 transition-all">
          <OrganizationSwitcher
            hidePersonal
            hideSlug
            appearance={{
              elements: {
                rootBox: {
                  display: "flex",
                  marginRight: "16px",
                  marginLeft: "32px",
                },
                organizationListCreateOrganizationActionButton: {
                  display: "none",
                },
                organizationSwitcherPopoverActionButton__createOrganization: {
                  display: "none",
                },
                organizationSwitcherPopover: {
                  display: "none",
                },
                organizationPreviewAvatarBox: {
                  backgroundColor: "unset",
                },
                organizationSwitcherPopoverActions: {
                  display: true ? "" : "none",
                },
                organizationSwitcherPopoverCard: {
                  boxShadow: "none",
                  borderStyle: "solid",
                  borderColor: "#e2e8f0",
                  borderWidth: "1px",
                  borderRadius: "8px",
                },
              },
            }}
          />
        </div>
      </Protect>
    </div>
  );
};

export default MobileNavbar;
