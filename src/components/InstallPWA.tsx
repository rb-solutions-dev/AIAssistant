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

const DISMISS_KEY = "pwa_install_dismissed";

const InstallPWA: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === "true") return; // Don't show if previously dismissed

    const handler = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
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

  const handleNeverShowAgain = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setOpen(false);
  };

  if (!supportsPWA) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="p-2">
          <DownloadIcon className="w-6 h-6" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Instalar aplicación</AlertDialogTitle>
          <AlertDialogDescription>
            Instala esta aplicación en tu dispositivo para una mejor
            experiencia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleNeverShowAgain}>
            No volver a mostrar
          </Button>
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
