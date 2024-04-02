import { redirect } from "next/navigation";
import { Page } from "../components/Page";
import { createHousehold } from "../lib/household/create-household";
import { getHousehold } from "../lib/household/get-household";
import { Button, Input } from "antd";

// TODO: Add support for inviting users
// TODO: Add support for leaving your household

export default async function HouseholdPage() {
  const household = await getHousehold();

  async function create(formData: FormData) {
    "use server";

    const householdName = formData.get("new-houshold-name");
    await createHousehold(householdName!.toString());

    redirect("/household");
  }

  return (
    <Page title="Household">
      {household ? (
        <h2 className="text-2xl">{household.name}</h2>
      ) : (
        <>
          <p className="pb-4">
            It looks like you&apos;re not part of a household yet...
          </p>

          <div className="flex flex-col gap-4">
            <h2>Create a new household</h2>

            <form action={create} className="flex flex-col gap-4">
              <Input
                autoFocus
                required
                id="new-household-name"
                name="new-houshold-name"
                placeholder="New household name"
                size="large"
              />
              <Button htmlType="submit" type="primary">
                Create
              </Button>
            </form>
          </div>
        </>
      )}
    </Page>
  );
}
