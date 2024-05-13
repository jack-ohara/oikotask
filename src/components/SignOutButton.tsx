"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { PiSignOut } from "react-icons/pi";

export function SignOutButton() {
  return (
    <Button
      className="flex items-center gap-x-2 justify-center"
      onClick={() => signOut()}
    >
      <PiSignOut />
      Sign out
    </Button>
  );
}
