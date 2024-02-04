import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";


export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-start sm:pt-36 pt-8 min-h-screen w-full">
      <form className="flex flex-col gap-4 border sm:px-6 sm:py-8 px-4 py-6 rounded-xl bg-card max-w-md w-full">
        <div className="mb-4">
          <h1 className="text-lg font-semibold tracking-tight mb-1">
            Log in to your podsynth
          </h1>
          <p className="text-gray-600 text-sm">
            Great to have you back!
          </p>
        </div>

        <label htmlFor="email" className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm font-medium block">Email</span>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            required
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm font-medium block">
            Password
          </span>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </label>
        <div className="flex flex-col gap-2 mt-2">
          <Button formAction={login}>Log in</Button>
          <Button formAction={signup} variant={"outline"}>
            Sign up instead
          </Button>
        </div>
      </form>
    </div>
  );
}
