import { Page } from "./components/Page";
import { tryAddUser } from "./lib/user/try-add";

export default async function Home() {
  await tryAddUser();

  return <Page title="Schedule" />;
}
