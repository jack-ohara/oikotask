import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";
import KSUID from "ksuid";

const ddbClinet = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(ddbClinet);
const tableName = process.env.DDB_TABLE_NAME!;

export type ScheduledTask = {
  id: string;
  description: string;
  assignedTo: string;
  isComplete: boolean;
  assigneeColour: string;
  targetCompletionDate: string; // ISO-8601 format
};

export async function upsert(
  scheduledTask: Omit<ScheduledTask, "id"> | ScheduledTask,
  householdId: string
) {
  if (!("id" in scheduledTask)) {
    scheduledTask = {
      ...scheduledTask,
      id: KSUID.fromParts(
        new Date(scheduledTask.targetCompletionDate).getTime(),
        randomBytes(16)
      ).string,
    };
  }

  const putIntoHousehold = new PutCommand({
    TableName: tableName,
    Item: {
      pk: `household/${householdId}/scheduledTask`,
      sk: scheduledTask.id,
      id: scheduledTask.id,
      description: scheduledTask.description,
      isComplete: scheduledTask.isComplete,
      assigneeColour: scheduledTask.assigneeColour,
      targetCompletionDate: scheduledTask.targetCompletionDate,
    },
  });

  await client.send(putIntoHousehold);

  return scheduledTask.id;
}

export async function get(taskId: string, householdId: string) {
  const get = new GetCommand({
    TableName: tableName,
    Key: { pk: `household/${householdId}/scheduledTask`, sk: taskId },
    ConsistentRead: true,
  });

  const result = await client.send(get);

  return result.Item as ScheduledTask | undefined;
}

export async function getInHousehold(householdId: string) {
  const get = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `household/${householdId}/scheduledTask`,
    },
    ConsistentRead: true,
  });

  const result = await client.send(get);

  return result.Items as (ScheduledTask | undefined)[];
}

export async function complete(taskId: string, householdId: string) {
  const task = await get(taskId, householdId);

  if (!task) {
    throw new Error(
      `Could not mark task with id ${taskId} in household with id ${householdId} as it was not found in the database`
    );
  }

  const updateTaskCommand = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: tableName,
          Item: {
            ...task,
            pk: `household/${householdId}/scheduledTask/completed`,
            isComplete: true,
          },
        },
      },
      {
        Delete: {
          TableName: tableName,
          Key: { pk: `household/${householdId}/scheduledTask`, sk: taskId },
        },
      },
    ],
  });

  await client.send(updateTaskCommand);
}
