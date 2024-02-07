import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-start sm:pt-36 pt-8 min-h-screen w-full">
      <SignupForm />
    </div>
  );
}
