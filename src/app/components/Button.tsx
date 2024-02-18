"use client";

import { ComponentProps } from "react";
import { IconType } from "react-icons";

type ButtonProps = ComponentProps<"button"> & {
  IconBefore?: IconType;
};
export function Button({ IconBefore, children, ...baseProps }: ButtonProps) {
  return (
    <button
      className="px-8 py-3 rounded-lg bg-primary-green hover:bg-secondary-green focus-within:bg-secondary-green flex flex-row gap-x-2 items-center justify-center"
      {...baseProps}
    >
      {IconBefore && <IconBefore />} {children}
    </button>
  );
}
