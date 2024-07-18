"use server";

import { redirect } from "next/navigation";
import { getUser } from "../lib/user/get-user";
import { upsert as upsertTask } from "../lib/db/scheduledTask";
import { revalidatePath } from "next/cache";
import {
  SchedulerClient,
  CreateScheduleCommand,
  CreateScheduleGroupCommand,
  GetScheduleGroupCommand,
} from "@aws-sdk/client-scheduler";

type NewScheduledTask = {
  description: string;
  assignedTo: string;
  assigneeColour: string;
  targetCompletionDate: Date;
};

export async function createScheduledTask(scheduleTask: NewScheduledTask) {
  const user = await getUser();

  if (!user) redirect("/signin");
  if (!user.householdId) redirect("/household");

  const result = await upsertTask(
    {
      ...scheduleTask,
      targetCompletionDate: scheduleTask.targetCompletionDate.toISOString(),
      isComplete: false,
    },
    user.householdId
  );

  revalidatePath("/schedule", "layout");

  await scheduleTaskReminder({ ...scheduleTask, id: result }, user.householdId);

  return result;
}

async function scheduleTaskReminder(
  newTask: NewScheduledTask & { id: string },
  householdId: string
) {
  const schedulerClient = new SchedulerClient({});

  const scheduleGroup = await getScheduleGroup(householdId, schedulerClient);

  const result = await schedulerClient.send(
    new CreateScheduleCommand({
      GroupName: scheduleGroup,
      Name: newTask.id,
      FlexibleTimeWindow: { Mode: "OFF" },
      Target: {
        Arn: "arn:aws:lambda:eu-west-1:534699847887:function:oikotask-prod-send-push-notification",
        RoleArn:
          "arn:aws:iam::534699847887:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_092455dcfa",
        RetryPolicy: {
          MaximumEventAgeInSeconds: 24 * 60 * 60, // 24 hours
          MaximumRetryAttempts: 10,
        },
        Input: JSON.stringify({
          userId: newTask.assignedTo,
          notification: {
            title: "Task reminder",
            message: newTask.description,
          },
        }),
      },
      ScheduleExpression:
        `at(${newTask.targetCompletionDate.getUTCFullYear()}-` +
        `${(newTask.targetCompletionDate.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0")}-` +
        `${newTask.targetCompletionDate
          .getUTCDate()
          .toString()
          .padStart(2, "0")}T` +
        `${newTask.targetCompletionDate
          .getUTCHours()
          .toString()
          .padStart(2, "0")}:` +
        `${newTask.targetCompletionDate
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:00)`,
      ActionAfterCompletion: "DELETE",
    })
  );
}

async function getScheduleGroup(
  householdId: string,
  schedulerClient: SchedulerClient
) {
  const groupName = `task-reminders-${householdId}`;

  try {
    await schedulerClient.send(
      new GetScheduleGroupCommand({ Name: groupName })
    );
  } catch (e: any) {
    if ("name" in e && e.name === "ResourceNotFoundException") {
      console.log(
        `schedule group does not exist for household ${householdId}. Creating...`
      );

      await schedulerClient.send(
        new CreateScheduleGroupCommand({
          Name: groupName,
        })
      );
    } else {
      throw e;
    }
  }

  return groupName;
}
