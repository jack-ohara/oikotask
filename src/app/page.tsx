import { Page } from "@components";
import { getHousehold } from "@/lib/household/get-household";
import { redirect } from "next/navigation";
import { getUserFromId } from "@/lib/user/get-user";
import { User } from "@/lib/db/user";
import { getTasksForHousehold } from "@/lib/task/get-task";
import { TaskList } from "@/components/TaskList";
import { TasksProvider } from "@/components/tasksContext";

function isUser(user: User | undefined): user is User {
  return !!user;
}

export default async function Home() {
  const household = await getHousehold();

  if (!household) redirect("/household");

  const [tasks, householdUsers] = await Promise.all([
    getTasksForHousehold(household.id),
    (await Promise.all(household.users.map(getUserFromId))).filter(isUser),
  ]);

  return (
    <Page title="Schedule">
      <TasksProvider initialTasks={tasks}>
        <div className="flex flex-col justify-between h-full">
          <h3 className="text-xl">Tasks</h3>
          <TaskList householdUsers={householdUsers} />
        </div>
      </TasksProvider>
    </Page>
  );
}
