"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser } from "../app/actions";

// Shadcn components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PushNotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Bell className="w-4 h-4" />
            Administrar notificaciones push
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificaciones Push</DialogTitle>
            <DialogDescription>
              Administra tus preferencias de notificaciones push.
            </DialogDescription>
          </DialogHeader>

          {!isSupported ? (
            <Alert variant="destructive">
              <AlertTitle>No soportado</AlertTitle>
              <AlertDescription>
                Las notificaciones push no son compatibles con este navegador.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {subscription ? (
                <>
                  <Alert>
                    <AlertTitle>Subscribed</AlertTitle>
                    <AlertDescription>
                      Estás suscrito a las notificaciones push.
                    </AlertDescription>
                  </Alert>
                  <Button variant="destructive" onClick={unsubscribeFromPush}>
                    Desuscribirse
                  </Button>
                </>
              ) : (
                <>
                  <Alert variant="destructive">
                    <AlertTitle>Not Subscribed</AlertTitle>
                    <AlertDescription>
                      No estás suscrito a las notificaciones push.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={subscribeToPush}>Suscribirse</Button>
                </>
              )}
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PushNotificationManager;
