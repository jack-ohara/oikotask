"use client";

import { Input, Modal, Tooltip } from "antd";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

// TODO: Push the task to the api - server action?

export function AddTask() {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");

  useEffect(() => {
    console.log({ taskDescription });
  }, [taskDescription]);

  return (
    <div className="flex justify-end">
      <Modal
        open={formIsOpen}
        onCancel={() => setFormIsOpen(false)}
        afterClose={() => setFormIsOpen(false)}
        centered
        title="Add a new task"
        okText="Create"
      >
        <Input
          autoFocus
          type="text"
          placeholder="Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
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
