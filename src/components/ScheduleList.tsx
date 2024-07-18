"use client";

import { completeScheduledTask } from "@/actions/update-task";
import { TaskListItem } from "./TaskListItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Schedule } from "@/lib/task/get-scheduled-task";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type ScheduleListProps = {
  schedule: Schedule;
  householdId: string;
};

export function ScheduleList({ schedule, householdId }: ScheduleListProps) {
  const [scheduleState, setScheduleState] = useState(schedule);

  return (
    <div>
      <AnimatePresence>
        {Object.entries(scheduleState).map(([title, tasks]) => (
          <motion.div
            key={title}
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
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h3 className="text-xl capitalize">{title}</h3>
                </AccordionTrigger>

                <AccordionContent>
                  <ul>
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <TaskListItem
                          key={task.id}
                          task={task}
                          subHeader={format(
                            parseISO(task.targetCompletionDate),
                            title === "overdue" ? "do MMMM kk:mm a" : "p"
                          )}
                          onCompleted={() => {
                            setScheduleState(() => {
                              const data: Schedule = JSON.parse(
                                JSON.stringify(scheduleState)
                              );

                              const taskArray = data[title];
                              const newArray = taskArray.filter(
                                (t) => t.id !== task.id
                              );

                              if (newArray.length === 0) {
                                delete data[title];
                              } else {
                                data[title] = newArray;
                              }

                              return data;
                            });

                            completeScheduledTask(task.id, householdId);
                          }}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
