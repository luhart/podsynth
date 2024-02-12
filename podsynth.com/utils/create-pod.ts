"use client";

import { createClient } from "./supabase/client";
import { TablesInsert } from "../types_db";

interface CreatePodArgs {
  sourceUrl: string;
  title: string;
  cron: string;
  cadenceInput: string;
  timeZone: string;
}

type PodType = TablesInsert<"pods">;

export async function createPod({ sourceUrl, title, cron, cadenceInput, timeZone }: CreatePodArgs) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const userId = user.id;

  // check cron will not run more than once a day

  const newPod: PodType = {
    source: sourceUrl,
    cron: cron,
    cron_raw_input: cadenceInput,
    title: title,
    created_by: userId,
    query: "",
    status: "active",
    timezone: timeZone,
  };

  const { error: newPodError } = await supabase
    .from("pods")
    .insert([newPod])
    .throwOnError()
    
  if (newPodError) {
    console.error(newPodError);
    throw new Error(`Failed to create pod: ${newPodError.message}`);
  }
}
