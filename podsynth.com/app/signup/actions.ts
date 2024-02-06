"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/actions";
import { getURL } from "@/utils/helpers";

export async function signup(prevState: any, formData: FormData) {
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
  const confirmPassword = String(formData.get("confirm_password"));

  if (password !== confirmPassword) {
    return { message: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters" };
  }

  console.log(`${getURL()}auth/callback`)

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${getURL()}auth/callback`
    }
  });

  if (error) {
    console.error("Error signing up:", error);
    return {
      message: "Error signing you up. Contact team@platdrop.com for help.",
    };
  } else if (data) {
    redirect(`/signup/confirm?email=${email}`);
  }
}
