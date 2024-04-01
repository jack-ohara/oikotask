"use client";

import { signOut } from "next-auth/react";
import { Button } from "antd";
import { PiSignOut } from "react-icons/pi";

export function SignOutButton() {
  return (
    <Button
      icon={<PiSignOut />}
      type="primary"
      className="!flex !items-center justify-center"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
}
