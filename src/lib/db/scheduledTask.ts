import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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
