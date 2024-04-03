import { SignInButton } from "../components/SignInButton";

export default function SignIn() {
  return (
    <main className="overflow-y-auto px-4">
      <div className="flex flex-col items-center justify-center pt-40">
        <div className="py-12 flex items-center">
          <h1 className="text-6xl">Oikotask</h1>
        </div>
        <div>
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
