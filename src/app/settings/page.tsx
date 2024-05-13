import { Page } from "@/components/Page";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserSettingsForm } from "@/components/UserSettingsForm";
import { getUser } from "@/lib/user/get-user";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <Page title="Settings">
      <div className="flex flex-col min-h-full justify-between">
        <UserSettingsForm user={user} />
        <ThemeToggle />
        <SignOutButton />
      </div>
    </Page>
  );
}
