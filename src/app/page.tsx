import { Page } from "@components";
import { getHousehold } from "@/lib/household/get-household";
import { redirect } from "next/navigation";
import { getUserFromId } from "@/lib/user/get-user";
import { User } from "@/lib/db/user";
import { getTasksForHousehold } from "@/lib/task/get-task";
import { TaskList } from "@/components/TaskList";
import { TasksProvider } from "@/components/tasksContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";

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
    <Page title="ToDo list">
      <TasksProvider initialTasks={tasks}>
        <div className="flex flex-col justify-between h-full">
          <h3 className="text-xl">Tasks</h3>
          <TaskList householdUsers={householdUsers} />

          <div className="absolute bottom-[125px] right-6">
            <TooltipProvider delayDuration={0}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href="/add-todo" prefetch>
                    <Button size="icon" className="rounded-full">
                      <AiOutlinePlus />
                    </Button>
                  </Link>
                </TooltipTrigger>

                <TooltipContent>Add a new task</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </TasksProvider>
    </Page>
  );
}
