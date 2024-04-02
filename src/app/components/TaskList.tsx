"use client";

import { List } from "antd";
import { TaskHeadline } from "../lib/db/task";

const { Item: ListItem } = List;

type TaskListProps = {
  tasks: TaskHeadline[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <List
      dataSource={tasks}
      renderItem={(task) => <ListItem>{task.description}</ListItem>}
    />
  );
}
