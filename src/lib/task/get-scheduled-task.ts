import { ScheduledTask, getInHousehold } from "@/lib/db/scheduledTask";
import {
  format,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  parseISO,
  startOfToday,
} from "date-fns";

export type Schedule = Record<string, ScheduledTask[]>;

function isTaskHeadline(th: ScheduledTask | undefined): th is ScheduledTask {
  return !!th;
}

export async function getScheduleForHousehold(householdId: string) {
  const result = await getInHousehold(householdId);

  const scheduledTasks = result.filter(isTaskHeadline);

  const schedule: Schedule = {};

  const binTask = (binName: string, task: ScheduledTask) => {
    if (binName in schedule) {
      schedule[binName].push(task);
    } else {
      schedule[binName] = [task];
    }
  };

  const todayStart = startOfToday();

  for (const task of scheduledTasks) {
    const taskDate = parseISO(task.targetCompletionDate);
    if (isBefore(taskDate, todayStart)) {
      binTask("overdue", task);
    } else if (isToday(taskDate)) {
      binTask("today", task);
    } else if (isTomorrow(taskDate)) {
      binTask("tomorrow", task);
    } else {
      binTask(format(taskDate, "do MMMM"), task);
    }
  }

  return schedule;
}
