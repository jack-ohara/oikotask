import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { Navigation } from "./Navigation";

type PageProps = {
  isProtected?: boolean;
  title?: string;
};

export async function Page({
  isProtected = true,
  title,
  children,
}: PropsWithChildren<PageProps>) {
  const session = await getServerSession(authOptions);

  if (isProtected && !session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen max-h-screen grid gap-3 grid-rows-[60px_1fr_70px]">
      {title && (
        <header className="text-center text-3xl grid items-center font-bold">
          <h1>{title}</h1>
        </header>
      )}
      <main className="overflow-y-auto px-4">{children}</main>
      <footer className="py-4 backdrop-blur-md bg-slate-600/20">
        <Navigation />
      </footer>
    </div>
  );
}
