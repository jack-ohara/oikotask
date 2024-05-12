"use client";

import { PropsWithChildren, createContext, useCallback, useState } from "react";
import { Task, TaskHeadline } from "../lib/db/task";

type TasksContextState = {
  tasks: TaskHeadline[];
  addTask: (task: Task) => void;
};

const initialState = {
  tasks: [],
  addTask: (task: Task) => {},
};

export const TasksContext = createContext<TasksContextState>(initialState);

type TasksProviderProps = {
  initialTasks: TaskHeadline[];
};

export function TasksProvider({
  initialTasks,
  children,
}: PropsWithChildren<TasksProviderProps>) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = useCallback((newTask: Task) => {
    setTasks((curr) => [newTask, ...curr]);
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask }}>
      {children}
    </TasksContext.Provider>
  );
}
