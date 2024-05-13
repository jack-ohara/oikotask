"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { ChangeEvent, ComponentProps } from "react";

type ColourPickerProps = {
  inputProps: ComponentProps<typeof Input>;
  className?: string;
};

export function ColourPicker({ className, inputProps }: ColourPickerProps) {
  const background = inputProps.value! as string;

  const solids = [
    "#e7299f",
    "#6111e5",
    "#824100",
    "#d65239",
    "#7eb6fb",
    "#1f960e",
    "#3380bc",
    "#73dd2a",
    "#fde402",
    "#8cc849",
    "#daff16",
    "#1361a9",
    "#537471",
    "#109891",
    "#383789",
    "#e13a1d",
    "#b07810",
    "#d562e5",
    "#13165c",
    "#406855",
    "#163620",
    "#8208f7",
    "#61832e",
    "#bb6610",
    "#b9bac2",
    "#e98460",
    "#e63b75",
    "#646726",
    "#2a680e",
    "#8958e9",
    "#dc6972",
    "#8cfcbc",
    "#4949bb",
    "#14ab26",
    "#748f6a",
    "#4369cc",
    "#12dab4",
    "#70fd12",
    "#a277a4",
    "#d5a70c",
    "#1f65d1",
    "#259bf5",
    "#9aec83",
    "#b63f66",
    "#8a8089",
    "#6304c5",
    "#c9e1b7",
    "#143903",
    "#20f52f",
    "#30e6bd",
    "#537394",
    "#a1b9dc",
    "#8730b9",
    "#b57953",
    "#89f26d",
    "#319270",
    "#5c5d90",
    "#326e2b",
    "#8e4b5d",
    "#a0aec7",
    "#bd1d81",
    "#ffc15c",
    "#254834",
    "#6178cc",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-32 justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center justify-between gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-wrap gap-1 mt-0">
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
              onClick={() =>
                inputProps.onChange!({
                  target: { value: s },
                } as ChangeEvent<HTMLInputElement>)
              }
            />
          ))}
        </div>

        <Input className="col-span-2" {...inputProps} />
      </PopoverContent>
    </Popover>
  );
}
