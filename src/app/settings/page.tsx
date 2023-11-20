import { Page } from "../components/Page";
import { SignOutButton } from "../components/SignOutButton";

export default function SettingsPage() {
  return (
    <Page title="Settings">
      <div className="flex flex-col min-h-full justify-end">
        <SignOutButton />
      </div>
    </Page>
  );
}
