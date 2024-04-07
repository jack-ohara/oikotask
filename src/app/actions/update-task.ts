"use server";

import { revalidatePath } from "next/cache";
import { complete } from "../lib/db/task";

export async function completeTask(taskId: string, householdId: string) {
  await complete(taskId, householdId);

  revalidatePath("/", "layout");
}
