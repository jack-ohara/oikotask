"use client";

import { AddScheduledTaskForm } from "@/components/AddScheduledTaskForm";
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
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

type AddTaskProps = {
  householdUsers: User[];
};

export function AddScheduledTask({ householdUsers }: AddTaskProps) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <Drawer open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
      <DrawerTrigger>
        <span className="rounded-full absolute bottom-[125px] right-6 bg-primary-green p-3">
          <AiOutlinePlus className="" />
        </span>
      </DrawerTrigger>
      <DrawerContent className="pb-10 h-[calc(100vh-60px)]">
        <DrawerHeader>
          <DrawerTitle>Add Task</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 pb-0 grow">
          <AddScheduledTaskForm
            householdUsers={householdUsers}
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
