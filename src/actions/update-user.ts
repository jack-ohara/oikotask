"use server";

import { revalidatePath } from "next/cache";
import { User, upsert } from "../lib/db/user";

export async function updateUser(
  originalUser: User,
  newData: Pick<User, "displayName" | "colour">
) {
  await upsert({ ...originalUser, ...newData });

  revalidatePath("/settings", "layout");
}
