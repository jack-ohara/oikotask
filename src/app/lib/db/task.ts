import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import KSUID from "ksuid";

const ddbClinet = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(ddbClinet);
const tableName = process.env.DDB_TABLE_NAME!;

export type Task = {
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
    const newId = await KSUID.random();
    task = {
      ...task,
      id: newId.string,
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
    ScanIndexForward: false,
  });

  const result = await client.send(get);

  return result.Items as (TaskHeadline | undefined)[];
}

export async function complete(taskId: string, householdId: string) {
  const updateInHousehold = new UpdateCommand({
    TableName: tableName,
    Key: {
      pk: `task/household/${householdId}`,
      sk: taskId,
    },
    AttributeUpdates: {
      isComplete: { Value: true },
    },
  });

  const update = new UpdateCommand({
    TableName: tableName,
    Key: {
      pk: "task/details",
      sk: taskId,
    },
    AttributeUpdates: {
      isComplete: { Value: true },
    },
  });

  await Promise.all([client.send(updateInHousehold), client.send(update)]);
}
