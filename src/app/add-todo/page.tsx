import { Page } from "@/components";
import { AddTodoForm } from "@/components/AddTodoForm";
import { User } from "@/lib/db/user";
import { getHousehold } from "@/lib/household/get-household";
import { getUserFromId } from "@/lib/user/get-user";
import { redirect } from "next/navigation";

function isUser(user: User | undefined): user is User {
  return !!user;
}

export default async function () {
  const household = await getHousehold();

  if (!household) redirect("/household");

  const householdUsers = (
    await Promise.all(household.users.map(getUserFromId))
  ).filter(isUser);

  return (
    <Page title="Add ToDo">
      <div className="mt-2">
        <AddTodoForm householdUsers={householdUsers} />
      </div>
    </Page>
  );
}
