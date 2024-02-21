import { client } from "@/trigger";
import { Database } from "@/types_db_priv";
import { createAudio, createSummary, parseSource } from "@/utils/trigger-helpers";
import { SupabaseManagement, Supabase } from "@trigger.dev/supabase";

// Use OAuth to authenticate with Supabase Management API
const supabaseManagement = new SupabaseManagement({
  id: "supabase-mgmt-trigger",
});

const supabase = new Supabase({
  id: "supabase",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
});

// Use the types we generated earlier
const db = supabaseManagement.db<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!
);

client.defineJob({
  id: "pod-runs-insert",
  name: "Pod Runs Insert Job",
  version: "0.0.1",
  enabled: false,
  integrations: {
    supabase,
  },
  trigger: db.onInserted({
    schema: "public",
    table: "pod_runs",
  }),
  run: async (payload, io, ctx) => {
    // parse the source into a string of things to summarize
    const parsedSource = await io.runTask(
      "Parse pod source",
      async () => {
        return await parseSource(payload.record.source);
      },
      { name: "Parse pod source task" }
    );

    await io.logger.info("Parsed source", { parsedSource });

    // update pod_runs entry with parsed source, set status to "summarizing"
    await io.supabase.runTask(
      "Update pod run with parsed source",
      async (client) => {
        await client
          .from("pod_runs")
          .update({
            parsed_source: parsedSource,
            status: "Summarizing",
          })
          .eq("id", payload.record.id);
      }
    );

    const summary = await io.runTask(
      "Summarize pod source",
      async () => {
        return await createSummary(parsedSource);
      },
      { name: "Summarize pod source task" } 
    );

    await io.logger.info("Summary", { summary });

    // update pod_runs entry with summary, set status to "Gene"
    await io.supabase.runTask(
      "Update pod run with summary",
      async (client) => {
        await client
          .from("pod_runs")
          .update({
            summary: summary,
            status: "Generating audio",
          })
          .eq("id", payload.record.id);
      }
    );

    // create audio from summary
    const audioToInsert = await io.runTask(
      "create audio from summary",
      async () => {
        return await createAudio(summary); 
      },
      { name: "Create audio from summary task" }
    );

    await io.logger.info("Audio", { audioToInsert });

    await io.supabase.runTask(
      "Insert audio row",
      async (client) => {
        await client
          .from("audio")
          .insert({
            pod_id: payload.record.pod_id,
            history_item_id: audioToInsert.historyItemId,
            request_id: audioToInsert.requestId,
          })
          .eq("id", payload.record.id);
        
        await client
          .from("pod_runs")
          .update({
            status: "Complete",
          })
          .eq("id", payload.record.id);
      }
    );
  },
});
