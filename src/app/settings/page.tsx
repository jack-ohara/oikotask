import { Page } from "../components/Page";
import { SignOutButton } from "../components/SignOutButton";
import { UserSettings } from "../components/UserSettings";
import { getUser } from "../lib/user/get-user";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <Page title="Settings">
      <div className="flex flex-col min-h-full justify-between">
        <UserSettings user={user} />
        <SignOutButton />
      </div>
    </Page>
  );
}
