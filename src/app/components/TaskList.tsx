"use client";

import { Checkbox, List } from "antd";
import { TaskHeadline } from "../lib/db/task";
import { useCallback, useState } from "react";
import { AddTask } from "./AddTask";
import { User } from "../lib/db/user";
import { AnimatePresence, motion } from "framer-motion";
import { completeTask } from "../actions/update-task";

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
        className="gap-3 w-full !py-4"
      >
        <motion.span exit={{ opacity: 0.3 }} transition={{ duration: 0.3 }}>
          {task.description}
        </motion.span>
      </Checkbox>
    </MotionListItem>
  );
}

type TaskListProps = {
  tasks: TaskHeadline[];
  householdUsers: User[];
};

export function TaskList({ tasks, householdUsers }: TaskListProps) {
  const [listOfTasks, setListOfTasks] = useState(
    tasks.filter((t) => !t.isComplete)
  );

  const removeTask = useCallback((taskId: string) => {
    setListOfTasks((curr) => curr.filter((t) => t.id !== taskId));
  }, []);

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
