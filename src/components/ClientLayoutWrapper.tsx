"use client";

import NextAuthProvider from "@/components/NextAuthProvider";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
} from "@/lib/pushManager";
import { PropsWithChildren, useEffect } from "react";

export function ClientLayoutWrapper({ children }: PropsWithChildren) {
  useEffect(() => {
    async function setupServiceWorker() {
      const registration = await navigator.serviceWorker.register(
        "service-worker.js"
      );
      await subscribeToPushNotifications(registration);
      await requestNotificationPermission();
    }

    setupServiceWorker();
  }, []);

  return <NextAuthProvider>{children}</NextAuthProvider>;
}
