import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(ddbClient);
const table = process.env.DDB_TABLE_NAME!;

const detailsSortKey = "details";

export type User = {
  id: string;
  householdId?: string | undefined;
  name: string;
  displayName: string;
};

export async function get(id: string): Promise<User | undefined> {
  const get = new GetCommand({
    TableName: table,
    Key: { pk: `user/${id}`, sk: detailsSortKey },
    ConsistentRead: true,
  });

  const result = await client.send(get);

  return result.Item as User | undefined;
}

export async function upsert(user: User): Promise<string> {
  const put = new PutCommand({
    TableName: table,
    Item: {
      ...user,
      pk: `user/${user.id}`,
      sk: detailsSortKey,
    },
  });

  await client.send(put);

  return user.id;
}
