import { Page } from "@/components";
import { AddScheduledTask } from "@/components/AddScheduledTask";
import { User } from "@/lib/db/user";
import { getHousehold } from "@/lib/household/get-household";
import { getUserFromId } from "@/lib/user/get-user";
import { redirect } from "next/navigation";

function isUser(user: User | undefined): user is User {
  return !!user;
}

export default async function SchedulePage() {
  const household = await getHousehold();

  if (!household) redirect("/household");

  const householdUsers = (
    await Promise.all(household.users.map(getUserFromId))
  ).filter(isUser);

  return (
    <Page title="Schedule">
      <AddScheduledTask householdUsers={householdUsers} />
    </Page>
  );
}
