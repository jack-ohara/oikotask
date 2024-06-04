import { NotificationRequester } from "@/components/NotificationRequester";
import { Page } from "@/components/Page";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserSettingsForm } from "@/components/UserSettingsForm";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/user/get-user";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <Page title="Settings">
      <div className="flex flex-col min-h-full justify-between">
        <div className="flex flex-col gap-y-4">
          <UserSettingsForm user={user} />
          <Separator />
          <ThemeToggle />
          <NotificationRequester />
        </div>
        <SignOutButton />
      </div>
    </Page>
  );
}
