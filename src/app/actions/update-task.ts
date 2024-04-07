"use server";

import { Task, TaskHeadline, complete } from "../lib/db/task";

export async function completeTask(taskId: string, householdId: string) {
  await complete(taskId, householdId);
}
