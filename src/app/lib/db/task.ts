import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const ddbClinet = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(ddbClinet);
const tableName = process.env.DDB_TABLE_NAME!;

type Task = {
  id: string;
  description: string;
  assignedTo: string;
  isComplete: boolean;
};

export type TaskHeadline = Pick<Task, "id" | "description" | "isComplete">;

export async function upsert(
  task: Omit<Task, "id"> | Task,
  householdId: string
) {
  if (!("id" in task)) {
    const newId = randomUUID();
    task = {
      ...task,
      id: newId,
    };
  }

  const putIntoHousehold = new PutCommand({
    TableName: tableName,
    Item: {
      pk: `task/household/${householdId}`,
      sk: task.id,
      id: task.id,
      description: task.description,
      isComplete: task.isComplete,
    },
  });

  const put = new PutCommand({
    TableName: tableName,
    Item: {
      ...task,
      pk: "task/details",
      sk: task.id,
    },
  });

  await Promise.all([client.send(putIntoHousehold), client.send(put)]);

  return task.id;
}

export async function getInHousehold(householdId: string) {
  const get = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `task/household/${householdId}`,
    },
    ConsistentRead: true,
  });

  const result = await client.send(get);

  return result.Items as (TaskHeadline | undefined)[];
}
