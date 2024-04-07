"use server";

import { redirect } from "next/navigation";
import { getUser } from "../lib/user/get-user";
import { upsert as upsertTask } from "../lib/db/task";
import { revalidatePath } from "next/cache";

type NewTask = {
  description: string;
  assignedTo: string;
  assigneeColour: string;
};

export async function createTask(task: NewTask) {
  const user = await getUser();

  if (!user) redirect("/signin");
  if (!user.householdId) redirect("/household");

  const result = await upsertTask(
    { ...task, isComplete: false },
    user.householdId
  );

  revalidatePath("/", "layout");

  return result;
}
