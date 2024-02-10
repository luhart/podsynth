"use client"

import { createClient } from "./supabase/client";

export async function createPod(sourceUrl: string, title: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const userId = user.id;

  const { data, error } = await supabase.from("pods").insert([
    {
      sourceUrl,
      title,
      userId,
    },
  ]);

}