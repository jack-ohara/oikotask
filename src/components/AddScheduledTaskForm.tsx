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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createScheduledTask } from "@/actions/create-scheduled-task";

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
    // completionDate: z
    //   .date()
    //   .min(new Date(), "Cannot set a completion date that's in the past"),
  });

  const form = useForm<z.infer<typeof addTodoFormSchema>>({
    resolver: zodResolver(addTodoFormSchema),
    defaultValues: {
      description: "",
      assignTo: householdUsers[0].id,
    },
  });

  async function onSubmit(values: z.infer<typeof addTodoFormSchema>) {
    console.log({ values });
    setTaskIsBeingCreated(true);

    const selectedUser = householdUsers.find((u) => u.id === values.assignTo)!;

    const d = new Date();
    d.setMinutes(d.getMinutes() + 2);

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
