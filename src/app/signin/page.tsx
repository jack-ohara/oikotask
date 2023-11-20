"use client";

import { signIn } from "next-auth/react";
import { PiSignIn } from "react-icons/pi";
import { Button } from "@/app/components/Button";

export default function SignIn() {
  return (
    <main>
      <div className="grow grid grid-rows-[1fr_auto_1fr] justify-items-center">
        <div className="py-12 flex items-center">
          <h1 className="text-6xl">Oikotask</h1>
        </div>
        <Button
          IconBefore={PiSignIn}
          onClick={() => signIn("cognito", { callbackUrl: "/" })}
        >
          Sign in
        </Button>
      </div>
    </main>
  );
}
