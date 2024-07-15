"use client";

import { User } from "@/lib/db/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColourCircle } from "@/components/ColourCircle";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { createScheduledTask } from "@/actions/create-scheduled-task";
import { Calendar } from "@/components/ui/calendar";
import { addDays, addMinutes, format, isToday } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarIcon } from "lucide-react";

type AddTodoFormProps = {
  householdUsers: User[];
  onNewTaskSubmitted?: () => void;
  className?: string;
};

export function AddScheduledTaskForm({
  householdUsers,
  onNewTaskSubmitted,
  className,
}: AddTodoFormProps) {
  const [taskIsBeingCreated, setTaskIsBeingCreated] = useState(false);

  const addTodoFormSchema = z.object({
    description: z.string().min(1),
    assignTo: z
      .string()
      .refine(
        (val) =>
          householdUsers.some((u) => u.id.toLowerCase() === val.toLowerCase()),
        "The assigned user must be a valid member of your household"
      ),
    completionDate: z.date(),
    completionTime: z.string(),
    // .min(new Date(), "Cannot set a completion date that's in the past"),
  });

  const form = useForm<z.infer<typeof addTodoFormSchema>>({
    resolver: zodResolver(addTodoFormSchema),
    defaultValues: {
      description: "",
      assignTo: householdUsers[0].id,
      completionDate: addDays(new Date(), 1),
      completionTime: format(new Date(), "kk:mm"),
    },
  });

  async function onSubmit(values: z.infer<typeof addTodoFormSchema>) {
    console.log({ values });
    setTaskIsBeingCreated(true);

    const selectedUser = householdUsers.find((u) => u.id === values.assignTo)!;

    const d = new Date(values.completionDate);
    const [hours, minutes] = values.completionTime.split(":");
    d.setHours(Number(hours), Number(minutes), 0);

    console.log({ d });

    const newScheduleTask = {
      description: values.description,
      assignedTo: values.assignTo,
      assigneeColour: selectedUser.colour,
      targetCompletionDate: d,
    };

    const newTaskId = await createScheduledTask(newScheduleTask);

    if (onNewTaskSubmitted) {
      onNewTaskSubmitted();
    }
    setTaskIsBeingCreated(false);
  }

  const [watchCompletionDate, watchCompletionTime] = form.watch([
    "completionDate",
    "completionTime",
  ]);

  const displayCompletionData = useMemo(
    () => `${format(watchCompletionDate, "PPP")} ${watchCompletionTime}`,
    [watchCompletionDate, watchCompletionTime]
  );

  const minCompletionTime = useMemo(
    () =>
      isToday(watchCompletionDate)
        ? format(addMinutes(new Date(), 1), "kk:mm")
        : undefined,
    [watchCompletionDate]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-y-4", className)}
      >
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignTo"
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user to assign" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {householdUsers.map((u) => (
                      <SelectItem value={u.id} key={u.id}>
                        <span className="flex gap-2 items-center">
                          <ColourCircle colour={u.colour} size={16} />
                          <span>{u.displayName}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormLabel>Completion date</FormLabel>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="scheduled-date">
              <AccordionTrigger>
                <CalendarIcon /> {displayCompletionData}
              </AccordionTrigger>

              <AccordionContent className="flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="completionDate"
                  render={({ field }) => (
                    <FormItem>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromDate={new Date()}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="completionTime"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        className="max-w-min"
                        type="time"
                        onChange={field.onChange}
                        value={field.value}
                        min={minCompletionTime}
                      />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex justify-center">
          <Button type="submit" loading={taskIsBeingCreated} className="grow">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
