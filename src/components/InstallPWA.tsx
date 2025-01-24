"use client";

import { DownloadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

interface Props {
  trigger?: React.ReactNode;
}
const InstallPWA = ({
  trigger = (
    <Button variant="ghost" className="p-2">
      <DownloadIcon className="w-6 h-6" />
    </Button>
  ),
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: BeforeInstallPromptEvent) => {
      setSupportsPWA(true);
      setPromptInstall(event);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
  }, []);

  const handleInstall = async () => {
    if (promptInstall) {
      await promptInstall.prompt();
      setOpen(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
  };

  if (!supportsPWA) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Instalar aplicación</AlertDialogTitle>
          <AlertDialogDescription>
            Instala esta aplicación en tu dispositivo para una mejor
            experiencia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleDismiss}>
            Seguir usando en el navegador
          </Button>
          <Button onClick={handleInstall}>Instalar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InstallPWA;
