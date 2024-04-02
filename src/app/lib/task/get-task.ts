import { TaskHeadline, getInHousehold } from "../db/task";

function isTaskHeadline(th: TaskHeadline | undefined): th is TaskHeadline {
  return !!th;
}

export async function getTasksForHousehold(householdId: string) {
  const result = await getInHousehold(householdId);

  return result.filter(isTaskHeadline);
}
