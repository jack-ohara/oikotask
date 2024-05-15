"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TaskHeadline } from "../lib/db/task";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { User } from "../lib/db/user";
import { completeTask } from "../actions/update-task";
import { TasksContext } from "./tasksContext";
import { ColourCircle } from "./ColourCircle";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";

type TaskListItemProps = {
  task: TaskHeadline;
  removeTask: (taskId: string) => void;
  householdId: string;
};

function TaskListItem({ task, removeTask, householdId }: TaskListItemProps) {
  const handleOnCheckboxChanged = useCallback(() => {
    removeTask(task.id);
    // completeTask(task.id, householdId);
  }, [task.id, householdId, removeTask]);

  return (
    <motion.li
      className="flex justify-between items-center py-2"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <span className="flex items-center gap-x-4">
        <Checkbox
          onCheckedChange={() => handleOnCheckboxChanged()}
          id={`task-${task.id}`}
          className="h-6 w-6 rounded-full"
        />
        <motion.label
          className="flex justify-between gap-2"
          htmlFor={`task-${task.id}`}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        >
          {task.description}
        </motion.label>
      </span>

      <ColourCircle colour={task.assigneeColour} size={22} />
    </motion.li>
  );
}

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
                removeTask={removeTask}
                householdId={householdUsers[0].householdId!}
              />
              <Separator className="last-of-type:hidden" />
            </Fragment>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
