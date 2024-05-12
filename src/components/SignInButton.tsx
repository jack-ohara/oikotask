"use client";

import { PiSignIn } from "react-icons/pi";
import { Button } from "antd";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <Button
      type="primary"
      icon={<PiSignIn />}
      className="!flex !items-center"
      onClick={() => signIn("cognito", { callbackUrl: "/" })}
    >
      Sign in
    </Button>
  );
}
