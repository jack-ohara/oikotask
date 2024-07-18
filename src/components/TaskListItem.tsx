"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColourCircle } from "./ColourCircle";
import { motion } from "framer-motion";
import { TaskListItemProps } from "./TaskList";

export function TaskListItem({
  task,
  subHeader,
  onCompleted,
}: TaskListItemProps) {
  return (
    <motion.li
      className="flex justify-between items-center py-2"
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
      <span className="flex items-center gap-x-4">
        <Checkbox
          onCheckedChange={() => onCompleted()}
          id={`task-${task.id}`}
          className="h-6 w-6 rounded-full"
        />
        <motion.label
          className="flex justify-between gap-x-2 flex-col"
          htmlFor={`task-${task.id}`}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        >
          <p>{task.description}</p>
          {"targetCompletionDate" in task && (
            <p className="text-xs">{subHeader}</p>
          )}
        </motion.label>
      </span>

      <ColourCircle colour={task.assigneeColour} size={22} />
    </motion.li>
  );
}
