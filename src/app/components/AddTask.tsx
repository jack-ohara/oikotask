"use client";

import { Input, Modal, Select, SelectProps, Tooltip } from "antd";
import { Button } from "antd";
import { useContext, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { createTask } from "../actions/create-task";
import { User } from "../lib/db/user";
import { TasksContext } from "./tasksContext";

type AddTaskProps = {
  householdUsers: User[];
};

export function AddTask({ householdUsers }: AddTaskProps) {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [taskIsBeingCreated, setTaskIsBeingCreated] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const { addTask: addNewTask } = useContext(TasksContext);

  const userOptions = useMemo(
    (): SelectProps["options"] =>
      householdUsers.map((user) => ({
        label: user.displayName,
        value: user.id,
      })),
    [householdUsers]
  );

  const [assignTo, setAssignTo] = useState(userOptions![0].value as string);

  const handleAddTask = async () => {
    setTaskIsBeingCreated(true);
    const newTaskId = await createTask({
      description: taskDescription,
      assignedTo: assignTo,
    });

    addNewTask({
      id: newTaskId,
      description: taskDescription,
      assignedTo: assignTo,
      isComplete: false,
    });
    setTaskIsBeingCreated(false);
    setFormIsOpen(false);
    setTaskDescription("");
    setAssignTo(userOptions![0].value as string);
  };

  return (
    <div className="flex justify-end pb-4 absolute bottom-[110px] right-6">
      <Modal
        open={formIsOpen}
        onCancel={() => setFormIsOpen(false)}
        afterClose={() => setFormIsOpen(false)}
        onOk={() => handleAddTask()}
        okButtonProps={{ loading: taskIsBeingCreated }}
        cancelButtonProps={{ disabled: taskIsBeingCreated }}
        centered
        title="Add a new task"
        okText="Create"
      >
        <form className="flex flex-col gap-4">
          <Input
            autoFocus
            type="text"
            placeholder="Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <Select
            options={userOptions}
            value={assignTo}
            onChange={(e) => setAssignTo(e)}
          />
        </form>
      </Modal>
      <Tooltip title="Add a new task">
        <Button
          type="primary"
          size="large"
          shape="circle"
          className="!pt-[10px]"
          icon={<AiOutlinePlus />}
          onClick={() => setFormIsOpen(true)}
        />
      </Tooltip>
    </div>
  );
}
