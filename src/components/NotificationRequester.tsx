"use client";

import { Button } from "@/components/ui/button";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
} from "@/lib/pushManager";
import { useState } from "react";

export function NotificationRequester() {
  const [status, setStatus] = useState(Notification.permission);

  const handler = async () => {
    const registration = await navigator.serviceWorker.register(
      "service-worker.js"
    );
    await subscribeToPushNotifications(registration);
    setStatus(await requestNotificationPermission());
  };

  return (
    <div className="flex justify-between">
      <Button onClick={handler}>Request permission</Button>
      {status}
    </div>
  );
}
