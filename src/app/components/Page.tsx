import { PropsWithChildren } from "react";
import { Navigation } from "./Navigation";
import { getServerSession } from "next-auth";

type PageProps = {
  title?: string;
};

export async function Page({ title, children }: PropsWithChildren<PageProps>) {
  const session = await getServerSession();

  return session === null ? (
    <main className="overflow-y-auto px-4">{children}</main>
  ) : (
    <div className="min-h-screen max-h-screen grid gap-3 grid-rows-[60px_1fr_105px]">
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
