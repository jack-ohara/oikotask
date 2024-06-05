"use client";

import { AddTodoForm } from "@/components/AddTodoForm";
import { TasksContext } from "@/components/tasksContext";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { User } from "@/lib/db/user";
import { useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

type AddTaskProps = {
  householdUsers: User[];
};

export function AddTask({ householdUsers }: AddTaskProps) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const { addTask } = useContext(TasksContext);

  return (
    <Drawer open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
      <DrawerTrigger>
        <span className="rounded-full absolute bottom-[125px] right-6 bg-primary-green p-3">
          <AiOutlinePlus className="" />
        </span>
      </DrawerTrigger>
      <DrawerContent className="pb-10 h-[calc(100vh-60px)]">
        <DrawerHeader>
          <DrawerTitle>Add ToDo</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 pb-0 grow">
          <AddTodoForm
            householdUsers={householdUsers}
            onNewTaskSubmitted={(newTask) => {
              addTask(newTask);
              setDrawerIsOpen(false);
            }}
            className="h-full justify-between"
          />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="destructive" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
