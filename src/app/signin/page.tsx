"use client";

import { signIn } from "next-auth/react";
import { PiSignIn } from "react-icons/pi";
import { Button } from "@/app/components/Button";

export default function SignIn() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center pt-40">
        <div className="py-12 flex items-center">
          <h1 className="text-6xl">Oikotask</h1>
        </div>
        <div>
          <Button
            IconBefore={PiSignIn}
            onClick={() => signIn("cognito", { callbackUrl: "/" })}
          >
            Sign in
          </Button>
        </div>
      </div>
    </main>
  );
}
