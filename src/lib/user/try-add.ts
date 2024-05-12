import { redirect } from "next/navigation";
import { getAuthToken } from "../auth";
import { upsert as upsertUser } from "../db/user";
import { faker } from "@faker-js/faker";

export async function tryAddUser() {
  const token = await getAuthToken();

  if (!token?.sub || !token?.email) {
    console.error("Invalid token for request");
    redirect("/signin");
  }

  const user = {
    id: token.sub,
    name: token.email,
    displayName: faker.person.firstName(),
    colour: faker.color.rgb(),
  };

  await upsertUser(user);

  return user;
}
