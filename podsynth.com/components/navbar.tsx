import s from "./Navbar.module.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const handleSignOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signOut();

    if (error) {
      return redirect(
        `/?error=${encodeURI(
          "Hmm... Something went wrong."
        )}&error_description=${encodeURI("You could not be signed out.")}`
      );
    }

    return redirect("/signin");
  };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full p-4 text-primary flex flex-row justify-center">
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="flex justify-between items-center max-w-xl w-full px-4 py-3 rounded-lg">
        <Link href="/" className="text-sm font-medium">
          Podsynth
        </Link>
        {user ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/account">Account</Link>
            </Button>
            <form action={handleSignOut}>
              <Button size="sm">Sign out</Button>
            </form>
          </>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
