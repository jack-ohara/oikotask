import { redirect } from "next/navigation";
import { getUser } from "../user/get-user";
import { upsert as upsertHousehold } from "../db/household";
import { upsert as upsertUser } from "../db/user";

export async function createHousehold(householdName: string) {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  if (user.householdId) {
    console.error(
      "Cannot create household for user as they are already in a household"
    );

    return;
  }

  const newHouseholdId = await upsertHousehold({
    name: householdName,
    users: [user.id],
  });

  await upsertUser({ ...user, householdId: newHouseholdId });

  return { householdId: newHouseholdId };
}
