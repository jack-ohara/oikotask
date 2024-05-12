"use client";

import { Input, Modal, Select, SelectProps, Tooltip } from "antd";
import { Button } from "antd";
import { useContext, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { createTask } from "../actions/create-task";
import { User } from "../lib/db/user";
import { TasksContext } from "./tasksContext";
import { ColourCircle } from "./ColourCircle";

type AddTaskProps = {
  householdUsers: User[];
};

type LabelRender = SelectProps["labelRender"];

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
        icon: <ColourCircle colour={user.colour} size={16} />,
      })),
    [householdUsers]
  );

  const [assignTo, setAssignTo] = useState(userOptions![0].value as string);
  const selectedUser = useMemo(
    () => householdUsers.find((u) => u.id === assignTo)!,
    [assignTo]
  );

  const handleAddTask = async () => {
    setTaskIsBeingCreated(true);
    const newTaskId = await createTask({
      description: taskDescription,
      assignedTo: assignTo,
      assigneeColour: selectedUser.colour,
    });

    addNewTask({
      id: newTaskId,
      description: taskDescription,
      assignedTo: assignTo,
      isComplete: false,
      assigneeColour: selectedUser.colour,
    });
    setTaskIsBeingCreated(false);
    setFormIsOpen(false);
    setTaskDescription("");
    setAssignTo(userOptions![0].value as string);
  };

  const labelRender: LabelRender = ({ label }) => {
    return (
      <span className="flex gap-2 items-center">
        <ColourCircle colour={selectedUser.colour} size={22} />
        {label}
      </span>
    );
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
            optionRender={(option) => (
              <span className="flex gap-2 items-center">
                {option.data.icon}
                <span>{option.label}</span>
              </span>
            )}
            labelRender={labelRender}
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
