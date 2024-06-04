"use server";

import { upsert as upsertUser } from "@/lib/db/user";
import { getUser } from "@/lib/user/get-user";

export async function storePushManagerSubscription(
  subscriptionDetails: string
) {
  const user = await getUser();

  await upsertUser({
    ...user,
    pushManagerSubscriptionDetail: subscriptionDetails,
  });
}
