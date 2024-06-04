import { redirect } from "next/navigation";
import { getAuthToken } from "../auth";
import { User, upsert as upsertUser } from "../db/user";
import { faker } from "@faker-js/faker";

export async function tryAddUser() {
  const token = await getAuthToken();

  if (!token?.sub || !token?.email) {
    console.error("Invalid token for request");
    redirect("/signin");
  }

  const user: User = {
    id: token.sub,
    name: token.email,
    displayName: faker.person.firstName(),
    colour: faker.color.rgb(),
    pushManagerSubscriptionDetail: "",
  };

  await upsertUser(user);

  return user;
}
