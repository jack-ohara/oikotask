"use client";

import { PiSignIn } from "react-icons/pi";
import { Button } from "./Button";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <Button
      IconBefore={PiSignIn}
      onClick={() => signIn("cognito", { callbackUrl: "/" })}
    >
      Sign in
    </Button>
  );
}
