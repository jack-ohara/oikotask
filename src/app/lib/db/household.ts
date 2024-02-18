import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { createHash, randomUUID } from "crypto";

const ddbClinet = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(ddbClinet);
const tableName = process.env.DDB_TABLE_NAME!;

type Household = {
  id: string;
  name: string;
  joinCode?: string;
  users: string[];
};

export async function get(id: string): Promise<Household | undefined> {
  const get = new GetCommand({
    TableName: tableName,
    Key: { pk: `household/${id}`, sk: "details" },
    ConsistentRead: true,
  });

  const result = await client.send(get);

  return result.Item as Household | undefined;
}

export async function upsert(
  household: Omit<Household, "id"> | Household
): Promise<string> {
  if (!("id" in household)) {
    const newId = randomUUID();
    household = {
      ...household,
      id: newId,
      joinCode: createJoinCode(newId),
    };
  }

  const put = new PutCommand({
    TableName: tableName,
    Item: {
      ...household,
      pk: `household/${household.id}`,
      sk: "details",
      gsi1: `household/joinCode-${household.joinCode}`,
    },
  });

  const putIntoListOfAll = new PutCommand({
    TableName: tableName,
    Item: {
      pk: "houehold/list",
      sk: household.id,
    },
  });

  await Promise.all([client.send(put), client.send(putIntoListOfAll)]);

  return household.id;
}

function createJoinCode(householdId: string) {
  return createHash("sha512").update(householdId).digest("hex");
}
