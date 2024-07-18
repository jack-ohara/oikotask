"use client";

import { TaskHeadline } from "../lib/db/task";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { User } from "../lib/db/user";
import { completeTask } from "../actions/update-task";
import { TasksContext } from "./tasksContext";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { ScheduledTask } from "@/lib/db/scheduledTask";
import { TaskListItem } from "./TaskListItem";

const MotionSeparator = motion(Separator);

export type TaskListItemProps = {
  task: TaskHeadline | ScheduledTask;
  subHeader?: string;
  onCompleted: () => void;
};

type TaskListProps = {
  householdUsers: User[];
};

export function TaskList({ householdUsers }: TaskListProps) {
  const { tasks } = useContext(TasksContext);
  const [listOfTasks, setListOfTasks] = useState(
    tasks.filter((t) => !t.isComplete)
  );

  const removeTask = useCallback((taskId: string) => {
    setListOfTasks((curr) => curr.filter((t) => t.id !== taskId));
  }, []);

  useEffect(() => {
    setListOfTasks(tasks.filter((t) => !t.isComplete));
  }, [tasks]);

  return (
    <div className="grow overflow-y-auto">
      <ul className="flex flex-col gap-y-1">
        <AnimatePresence>
          {listOfTasks.map((task) => (
            <Fragment key={task.id}>
              <TaskListItem
                task={task}
                onCompleted={() => {
                  removeTask(task.id);
                  completeTask(task.id, householdUsers[0].householdId!);
                }}
              />
              <MotionSeparator
                className="last-of-type:hidden"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  height: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />
            </Fragment>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
