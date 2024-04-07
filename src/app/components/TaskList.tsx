"use client";

import { Checkbox, List } from "antd";
import { TaskHeadline } from "../lib/db/task";
import { useCallback, useContext, useEffect, useState } from "react";
import { AddTask } from "./AddTask";
import { User } from "../lib/db/user";
import { AnimatePresence, motion } from "framer-motion";
import { completeTask } from "../actions/update-task";
import { TasksContext } from "./tasksContext";
import { ColourCircle } from "./ColourCircle";

const { Item: ListItem } = List;

const MotionListItem = motion(ListItem);

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
    <MotionListItem
      className="!p-0"
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
      <Checkbox
        onChange={() => handleOnCheckboxChanged()}
        className="gap-3 w-full !py-4 [&>span:not(.ant-checkbox)]:w-full"
      >
        <span className="flex justify-between gap-2">
          <motion.span
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
            className="test1"
          >
            {task.description}
          </motion.span>

          <ColourCircle colour={task.assigneeColour} size={22} />
        </span>
      </Checkbox>
    </MotionListItem>
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
      <List>
        <AnimatePresence>
          {listOfTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              removeTask={removeTask}
              householdId={householdUsers[0].householdId!}
            />
          ))}
        </AnimatePresence>
      </List>
      <AddTask householdUsers={householdUsers} />
    </div>
  );
}
