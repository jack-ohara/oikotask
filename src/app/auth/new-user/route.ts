import { tryAddUser } from "@/app/lib/user/try-add";
import { redirect } from "next/navigation";

export async function GET() {
  console.log("New user...");

  await tryAddUser();

  redirect("/");
}
