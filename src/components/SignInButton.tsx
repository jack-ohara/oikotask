"use client";

import { PiSignIn } from "react-icons/pi";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <Button
      className="flex items-center gap-x-2"
      onClick={() => signIn("cognito", { callbackUrl: "/" })}
    >
      <PiSignIn />
      Sign in
    </Button>
  );
}
