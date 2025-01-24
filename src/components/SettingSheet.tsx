import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
  MoonIcon,
  PaletteIcon,
  PhoneIcon,
  Settings,
  SunIcon,
  SunMoonIcon,
  TrashIcon,
  User2Icon,
} from "lucide-react";

// hooks
import { useToast } from "@/hooks/use-toast";

// lib
import { cn } from "@/lib/utils";

// components
import Privacy from "./Privacy";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import InstallPWA from "./InstallPWA";
import useSupabase from "@/lib/supabase.client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

enum View {
  Cuenta = "Cuenta",
  Tema = "Tema",
  Privacidad = "Privacidad",
  Contacto = "Contacto",
}

const items = [
  {
    view: View.Cuenta,
    icon: <User2Icon className="w-6 h-6" />,
    label: "Cuenta",
  },
  {
    view: View.Tema,
    icon: <PaletteIcon className="w-6 h-6" />,
    label: "Tema",
  },
  {
    view: View.Privacidad,
    icon: <LockIcon className="w-6 h-6" />,
    label: "Privacidad",
  },
  {
    view: View.Contacto,
    icon: <MessageCircleIcon className="w-6 h-6" />,
    label: "Contacto",
  },
];

const SettingSheet = () => {
  const [view, setView] = useState<View | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();
  const { setTheme, theme: currentTheme } = useTheme();

  const { toast } = useToast();
  const supabase = useSupabase();

  const renderView = (view: View) => {
    switch (view) {
      case View.Cuenta:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">User ID</Label>

              <Input defaultValue={user?.id} readOnly />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                defaultValue={user?.emailAddresses[0].emailAddress}
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Miembro desde</Label>

              <span className="text-accent-foreground">
                {user?.createdAt?.toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      case View.Tema:
        return (
          <div className="flex flex-col gap-2">
            {[
              { label: "Claro", value: "light", icon: <SunIcon /> },
              { label: "Oscuro", value: "dark", icon: <MoonIcon /> },
              { label: "Sistema", value: "system", icon: <SunMoonIcon /> },
            ].map((theme) => (
              <div
                key={theme.value}
                className={cn(
                  `flex items-center gap-2 h-16 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer bg-accent relative dark:hover:bg-gray-800`,
                  theme.value === currentTheme
                    ? "bg-accent border-2 border-accent-foreground"
                    : "bg-accent"
                )}
              >
                <button
                  className="absolute inset-0"
                  onClick={() => setTheme(theme.value)}
                />
                <div className="flex items-center gap-2">
                  {theme.icon}
                  {theme.label}
                </div>
              </div>
            ))}
          </div>
        );
      case View.Privacidad:
        return <Privacy />;
      case View.Contacto:
        return (
          <div className="flex flex-col gap-2 text-accent-foreground">
            <p>
              Si tienes alguna pregunta o comentario, por favor contáctanos a
              través de nuestro correo electrónico:
            </p>
            <p className="flex items-center gap-2">
              <MailIcon className="w-4 h-4" />
              <a href="mailto:contacto@chatbot.com" className="text-blue-500">
                contacto@chatbot.com
              </a>
            </p>
            <p>
              También puedes contactarnos a través de nuestro número de
              WhatsApp:
            </p>
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              <a href="https://wa.me/573178654321" className="text-blue-500">
                +57 317 865 4321
              </a>
            </p>
          </div>
        );
    }
  };

  const handleDeleteHistory = async () => {
    setIsDeleting(true);
    try {
      await supabase.from("conversations").delete().eq("user_id", user?.id);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al borrar historial",
        variant: "destructive",
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedItem = items.find((item) => item.view === view);
  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          setView(null);
        }
      }}
    >
      <SheetTrigger>
        <Settings className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent className="w-full overflow-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-accent-foreground justify-center">
            {selectedItem?.icon}
            {selectedItem?.label ?? "Configuración"}
          </SheetTitle>
        </SheetHeader>

        {view === null ? (
          <div className="mt-2 flex flex-col gap-2">
            <>
              {items.map((item) => (
                <div
                  key={item.view}
                  className="flex items-center gap-2 h-16 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer bg-accent relative"
                >
                  <button
                    className="absolute inset-0"
                    onClick={() => setView(item.view)}
                  />
                  <div className="flex items-center gap-3">
                    <div className="text-accent-foreground">{item.icon}</div>
                    <div className="text-accent-foreground">{item.label}</div>
                  </div>

                  <div className="ml-auto">
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="p-2 bg-red-500"
                onClick={handleDeleteHistory}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <TrashIcon className="w-4 h-4" />
                )}
                Borrar Historial
              </Button>
            </>
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView(null)}
                className="absolute top-0 left-0"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </div>
            {renderView(view)}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SettingSheet;
