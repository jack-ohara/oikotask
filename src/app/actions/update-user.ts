"use server";

import { revalidatePath } from "next/cache";
import { User, upsert } from "../lib/db/user";

export async function updateUser(originalUser: User, formData: FormData) {
  const newFields = {
    displayName: formData.get("displayName") as string,
    colour: formData.get("colour") as string,
  };

  await upsert({ ...originalUser, ...newFields });

  revalidatePath("/settings", "layout");
}
