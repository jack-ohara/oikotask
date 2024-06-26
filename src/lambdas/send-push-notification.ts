import * as webPush from "web-push";
import { SSM } from "@aws-sdk/client-ssm";
import { get as getUserFromDb } from "../lib/db/user";

type ScheduleEvent = {
  userId: string;
  notification: {
    title: string;
    message: string;
  };
};

export async function handler({ userId, notification }: ScheduleEvent) {
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

  const user = await getUserFromDb(userId);

  if (!user) {
    throw Error(`Could not find user '${userId}' in db`);
  }

  const subscription = JSON.parse(user.pushManagerSubscriptionDetail);

  const actualNotification = {
    title: notification.title ?? "Test title",
    message: notification.message ?? "Hello world!",
  };

  try {
    await webPush.sendNotification(
      subscription,
      JSON.stringify(actualNotification)
    );

    console.log("Sending notification");
  } catch (e) {
    console.error("error sending notification:", e);

    throw e;
  }
}
