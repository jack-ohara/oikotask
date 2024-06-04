"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [notificationPermission, setNotifcationPermission] = React.useState("");

  React.useEffect(() => {
    async function x() {
      const res = await Notification.requestPermission();

      setNotifcationPermission(res);
    }

    x();
  }, []);

  return (
    <div className="flex justify-between items-center">
      <Label>Theme</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <span className="flex justify-between items-center w-full gap-x-2">
              <span className="capitalize">{theme}</span>
              <span className="flex">
                <Sun className="h-[1.2rem] w-[1.2rem] block dark:hidden" />
                <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
                <span className="sr-only">Toggle theme</span>
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div>{notificationPermission}</div>
    </div>
  );
}
