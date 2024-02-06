import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
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
      <LoginForm />
    </div>
  );
}
