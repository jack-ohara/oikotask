"use client";

import { Button } from "@/components/ui/button";
import { ColourPicker } from "@/components/ColourPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/db/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiOutlineSave } from "react-icons/ai";
import { z } from "zod";

const formSchema = z.object({
  displayName: z.string().min(1).max(35),
  colour: z.string(),
});

type UserSettingsFormProps = {
  user: User;
};

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user.displayName,
      colour: user.colour,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center space-y-0">
              <FormLabel className="min-w-28">Display name</FormLabel>
              <FormControl>
                <Input placeholder="Display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colour"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center space-y-0">
              <FormLabel>Colour</FormLabel>
              <FormControl>
                <ColourPicker inputProps={field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          //   disabled={!isSaveable}
          //   loading={isUpdatingUser}
          type="submit"
          className="self-stretch flex items-center justify-center gap-x-2"
        >
          <AiOutlineSave />
          Save
        </Button>
      </form>
    </Form>
  );
}
