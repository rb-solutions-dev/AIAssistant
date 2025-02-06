"use client";
import Image from "next/image";
import { Protect, OrganizationSwitcher } from "@clerk/nextjs";
import { BookText, ImageIcon, PlusSquareIcon } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import InstallPWA from "@/components/InstallPWA";
import LastMessage from "@/components/LastMessage";
import SettingSheet from "@/components/SettingSheet";
import AssistantCarrousel from "@/components/AssistantCarrousel";
import { useTheme } from "next-themes";
const HomePage = () => {

const { theme } =useTheme();

const logoImage = theme === 'dark'? '/icons/ios/80_dark.png' : '/icons/ios/120.png'
   

  return (
    <>
      <div className="px-4 py-4 border ">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-extrabold">Bienvenido!</h1>
          <div className="flex items-center gap-2">
            <Protect role="org:admin">
              <OrganizationSwitcher
                hidePersonal
                appearance={{
                  elements: {
                    organizationSwitcherPopoverActionButton__createOrganization:
                      {
                        display: "none",
                      },
                    organizationSwitcherPopover: {
                      display: "none",
                    },
                    organizationPreviewAvatarBox: {
                      backgroundColor: "unset",
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
            </Protect>
            <InstallPWA />

            <SettingSheet />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <Image
            
            src={logoImage} // Conditional image based on dark mode
            alt="LexIA"
            className="rounded-full "
            width={120}
            height={120}
          />
        </div>
        <div className="mt-4">
          <LastMessage />
        </div>

        <div className="mt-8">
          <AssistantCarrousel />
        </div>

        <div className="mt-8 mb-20 drop-shadow-xl ">
          <div className="bg-accent rounded-xl p-4 border border-border shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Herramientas opcionales</h2>

              <Button variant="link" className="text-sm text-primary">
                Ver Todas
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
              {[
                {
                  name: "Nuevo Chat",
                  description: "Crea un nuevo chat personalizado",
                  icon: PlusSquareIcon,
                },
                {
                  name: "Creacion de Imagen",
                  description: "Crea una imagen personalizada",
                  icon: ImageIcon,
                },
                {
                  name: "Lector de documentos",
                  description: "Usa tu propio documento",
                  icon: BookText,
                },
              ].map((tool) => {
                return (
                  <div
                    key={tool.name}
                    className="rounded-xl p-4 border border-border shadow-sm bg-card"
                  >
                    <div className="flex justify-center items-center bg-accent rounded-2xl p-4 w-16 h-16">
                      <tool.icon className="w-12 h-12" />
                    </div>

                    <div className="mt-4">
                      <h2 className="text-md font-semibold">{tool.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
