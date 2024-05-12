import { redirect } from "next/navigation";
import { get as getHouseholdFromDb } from "../db/household";
import { getUser } from "../user/get-user";

export async function getHousehold() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  if (!user?.householdId) {
    return undefined;
  }

  return await getHouseholdFromDb(user.householdId);
}
