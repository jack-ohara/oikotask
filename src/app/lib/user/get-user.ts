import { redirect } from "next/navigation";
import { getAuthToken } from "../auth";
import { User, get as getUserFromDb } from "../db/user";
import { tryAddUser } from "./try-add";

export async function getUser(): Promise<User> {
  const token = await getAuthToken();

  if (!token?.sub) {
    console.warn("Could not get auth token. Redirecting to login page");
    redirect("/signin");
  }

  const user = await getUserFromDb(token.sub);

  return user ?? tryAddUser();
}

export async function getUserFromId(userId: string) {
  return await getUserFromDb(userId);
}
