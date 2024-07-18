"use server";

import { revalidatePath } from "next/cache";
import { complete as dbCompleteTask } from "../lib/db/task";
import { complete as dbCompleteScheduledTask } from "../lib/db/scheduledTask";

export async function completeTask(taskId: string, householdId: string) {
  await dbCompleteTask(taskId, householdId);

  revalidatePath("/", "layout");
}

export async function completeScheduledTask(
  taskId: string,
  householdId: string
) {
  await dbCompleteScheduledTask(taskId, householdId);

  revalidatePath("/schedule", "layout");
}
