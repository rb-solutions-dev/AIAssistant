"use client";
import { ImageIcon, PlusSquareIcon } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import InstallPWA from "@/components/InstallPWA";
import LastMessage from "@/components/LastMessage";
import SettingSheet from "@/components/SettingSheet";
import AssistantCarrousel from "@/components/AssistantCarrousel";

const HomePage = () => {
  return (
    <>
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold">Bienvenido!</h1>

          <div className="flex items-center gap-2">
            <InstallPWA />

            <SettingSheet />
          </div>
        </div>

        <div className="mt-4">
          <LastMessage />
        </div>

        <div className="mt-8">
          <AssistantCarrousel />
        </div>

        <div className="mt-8 mb-20">
          <div className="bg-accent rounded-xl p-4 border border-border shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Herramientas</h2>

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
