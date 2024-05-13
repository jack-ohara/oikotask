"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TaskHeadline } from "../lib/db/task";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { User } from "../lib/db/user";
import { completeTask } from "../actions/update-task";
import { TasksContext } from "./tasksContext";
import { ColourCircle } from "./ColourCircle";
import { Separator } from "@/components/ui/separator";

type TaskListItemProps = {
  task: TaskHeadline;
  removeTask: (taskId: string) => void;
  householdId: string;
};

function TaskListItem({ task, removeTask, householdId }: TaskListItemProps) {
  const handleOnCheckboxChanged = useCallback(() => {
    removeTask(task.id);
    completeTask(task.id, householdId);
  }, []);

  return (
    <li className="flex justify-between items-center py-2">
      <span className="flex items-center gap-x-4">
        <Checkbox
          onChange={() => handleOnCheckboxChanged()}
          className=""
          id={`task-${task.id}`}
        />
        <label
          className="flex justify-between gap-2"
          htmlFor={`task-${task.id}`}
        >
          {task.description}
        </label>
      </span>

      <ColourCircle colour={task.assigneeColour} size={22} />
    </li>
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
      </ul>
    </div>
  );
}
