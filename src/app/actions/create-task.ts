"use server";

import { redirect } from "next/navigation";
import { getUser } from "../lib/user/get-user";
import { upsert as upsertTask } from "../lib/db/task";

type NewTask = {
  description: string;
  assignedTo: string;
};

export async function createTask(task: NewTask) {
  const user = await getUser();

  if (!user) redirect("/signin");
  if (!user.householdId) redirect("/household");

  return await upsertTask({ ...task, isComplete: false }, user.householdId);
}
