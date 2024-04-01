import { AddTask, Page } from "@components";

export default async function Home() {
  return (
    <Page title="Schedule">
      <div className="flex flex-col justify-between h-full">
        <h3 className="text-xl">Tasks</h3>
        <AddTask />
      </div>
    </Page>
  );
}
