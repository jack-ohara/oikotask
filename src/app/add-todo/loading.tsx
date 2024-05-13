import { Page } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

export default function () {
  return (
    <Page title="Add ToDo">
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />

        <div className="flex gap-x-3 justify-end">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </Page>
  );
}
