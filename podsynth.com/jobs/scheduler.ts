import { client } from "@/trigger";
import { Database } from "@/types_db_priv";
import { SupabaseManagement } from "@trigger.dev/supabase";

// Use OAuth to authenticate with Supabase Management API
const supabaseManagement = new SupabaseManagement({
  id: "supabase-mgmt-trigger",
});

// Use the types we generated earlier
const db = supabaseManagement.db<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!
);
const dynamicSchedule = client.defineDynamicSchedule({
  id: "dynamicinterval",
});

client.defineJob({
  id: "scheduler",
  name: "Pods Scheduler",
  version: "0.0.1",
  trigger: dynamicSchedule,
  run: async (payload, io, ctx) => {
    // if (ctx.source && ctx.source.id) {
    //   await io.logger.info("The userId is ", ctx.source.id);
    // }
  },
});
