import { Page } from "@/components";
import { AddScheduledTask } from "@/components/AddScheduledTask";
import { ScheduleList } from "@/components/ScheduleList";
import { User } from "@/lib/db/user";
import { getHousehold } from "@/lib/household/get-household";
import { getScheduleForHousehold } from "@/lib/task/get-scheduled-task";
import { getUser, getUserFromId } from "@/lib/user/get-user";
import { redirect } from "next/navigation";

function isUser(user: User | undefined): user is User {
  return !!user;
}

export default async function SchedulePage() {
  const household = await getHousehold();
  const user = await getUser();

  console.log({ user });

  if (!household) redirect("/household");

  const [schedule, householdUsers] = await Promise.all([
    getScheduleForHousehold(household.id),
    (await Promise.all(household.users.map(getUserFromId))).filter(isUser),
  ]);

  return (
    <Page title="Schedule">
      <ScheduleList schedule={schedule} householdId={household.id} />
      <AddScheduledTask householdUsers={householdUsers} />
    </Page>
  );
}
