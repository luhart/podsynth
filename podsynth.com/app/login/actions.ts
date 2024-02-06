"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/actions";

export async function login(prevState: {message: string}, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = String(formData.get("email"));
  function isValidEmail(email: string) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  if (!isValidEmail(email)) {
    return { message: "Please enter a valid email" };
  }
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: 'Invalid email or password' };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
