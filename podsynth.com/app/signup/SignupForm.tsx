"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Loader } from "lucide-react";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      Sign up
      {pending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signup, initialState);

  return (
    <>
      <form action={formAction} className="flex flex-col gap-4 border sm:px-6 sm:py-8 px-4 py-6 rounded-xl bg-card max-w-sm w-full">
        <div className="mb-4">
          <h1 className="text-lg font-semibold tracking-tight mb-1">
            Create a podsynth account
          </h1>
          <p className="text-gray-600 text-sm">
            Nice to meet you. Quick! Sign up before I figure out the billing for
            this thing..
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
        <label htmlFor="confirm_password" className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm font-medium block">
            Confirm password
          </span>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="••••••••"
            required
          />
        </label>
        <div className="flex flex-col gap-2 mt-2">
          <SubmitButton /> 
        </div>
        {state?.message && (
          <div className="flex flex-row gap-2 items-center justify-center w-full border border-red-400 rounded p-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-red-500 text-sm">{state.message}</p>
          </div>
        )}
      </form>
      <div className="mt-4">
        <Button variant={"link"} asChild>
          <Link href="/login">Have an account? Log in.</Link>
        </Button>
      </div>
    </>
  );
}
