import { client } from "@/trigger";
import { Database } from "@/types_db_priv";
import { SupabaseManagement } from "@trigger.dev/supabase";

// Use OAuth to authenticate with Supabase Management API
const supabaseManagement = new SupabaseManagement({
  id: "supabase-mgmt-trigger"
});

// Use the types we generated earlier
const db = supabaseManagement.db<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!);

client.defineJob({
  id: "supabase-test-job",
  name: "My Supabase Test Job",
  version: "1.0.0",
  trigger: db.onInserted({
    schema: "auth",
    table: "users",
  }),
  run: async (payload, io, ctx) => {},
});
