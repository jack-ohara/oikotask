import { storePushManagerSubscription } from "@/actions/store-push-manager-subscription";

export async function subscribeToPushNotifications(
  swRegistration: ServiceWorkerRegistration
) {
  let subscription = await swRegistration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await swRegistration.pushManager.subscribe({
      applicationServerKey: urlB64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
      userVisibleOnly: true,
    });
  }

  try {
    await storePushManagerSubscription(JSON.stringify(subscription));
  } catch (e) {
    console.log("failed to post the subscription details:", e);
  }
}

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function requestNotificationPermission() {
  await Notification.requestPermission();
}
