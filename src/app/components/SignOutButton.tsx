"use client";

import { signOut } from "next-auth/react";
import { Button } from "./Button";
import { PiSignOut } from "react-icons/pi";

export function SignOutButton() {
  return (
    <Button IconBefore={PiSignOut} onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
