import { redirect } from "next/navigation";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { createHousehold } from "../lib/household/create-household";
import { getHousehold } from "../lib/household/get-household";

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
          <p>It looks like you're not part of a household yet...</p>

          <div>
            <h2>Create a new household</h2>

            <form action={create}>
              <input
                autoFocus
                required
                type="text"
                id="new-household-name"
                name="new-houshold-name"
                placeholder="New household name"
              />
              <Button type="submit">Create</Button>
            </form>
          </div>
        </>
      )}
    </Page>
  );
}
