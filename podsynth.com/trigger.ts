import { TriggerClient } from "@trigger.dev/sdk";
import { SupabaseManagement } from "@trigger.dev/supabase";

export const client = new TriggerClient({
  id: "podsynth-v1-E7mO",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});


const supabase = new SupabaseManagement({
  id: "supabase-mgmt-trigger"
});