import { getAuthToken } from "../auth";
import { redirect } from "next/navigation";
import { get as getUser } from "../db/user";
import { get as getHouseholdFromDb } from "../db/household";

export async function getHousehold() {
  const token = await getAuthToken();

  if (!token?.sub) {
    redirect("/signin");
  }

  const user = await getUser(token.sub);

  if (!user?.householdId) {
    return undefined;
  }

  return await getHouseholdFromDb(user.householdId);
}
