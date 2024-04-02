import { redirect } from "next/navigation";
import { getAuthToken } from "../auth";
import { get as getUserFromDb } from "../db/user";

export async function getUser() {
  const token = await getAuthToken();

  if (!token?.sub) {
    redirect("/signin");
  }

  return await getUserFromDb(token.sub);
}

export async function getUserFromId(userId: string) {
  return await getUserFromDb(userId);
}
