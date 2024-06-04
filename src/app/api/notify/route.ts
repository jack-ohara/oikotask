import { getUserFromId } from "@/lib/user/get-user";
import * as webPush from "web-push";

export async function POST() {
  webPush.setVapidDetails(
    "https://localhost:3000/household",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const userId = "90c0fd8b-4089-47d9-813a-ee7d043c7fae";
  const user = await getUserFromId(userId);

  if (!user) {
    return Response.json({ error: "Could not find user" }, { status: 404 });
  }

  const subscription = JSON.parse(user.pushManagerSubscriptionDetail);

  try {
    await webPush.sendNotification(
      subscription,
      JSON.stringify({ title: "Test title", message: "Hello world!" })
    );

    return Response.json({ message: "Sending notification" }, { status: 201 });
  } catch (e) {
    console.log("error sending notification:", e);

    return Response.json({ error: e }, { status: 500 });
  }
}
