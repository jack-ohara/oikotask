import { getUserFromId } from "@/lib/user/get-user";
import * as webPush from "web-push";
import { SSM } from "@aws-sdk/client-ssm";

// Test endpoint for sending notifications

export async function POST(request: Request) {
  const body = await request.json();

  const ssmClient = new SSM({});

  const getPrivateKeyParamResult = await ssmClient.getParameter({
    Name: process.env.VAPID_PRIVATE_KEY_PARAM_NAME,
    WithDecryption: true,
  });

  if (!getPrivateKeyParamResult.Parameter?.Value) {
    console.error(
      "Private key not found in parameter store. Result:",
      getPrivateKeyParamResult
    );

    return Response.json(
      { error: "Unable to retrieve VAPID private key" },
      { status: 500 }
    );
  }

  webPush.setVapidDetails(
    "https://d2omkrhunnhu2q.cloudfront.net",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    getPrivateKeyParamResult.Parameter.Value
  );

  const user = await getUserFromId(body.userId);

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
