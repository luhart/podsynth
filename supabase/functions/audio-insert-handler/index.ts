// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { supabaseAdminClient } from "../_utils/supabase.ts";
import { TablesInsert } from "../_utils/types_db.ts";

const ELEVEN_LABS_KEY = Deno.env.get("ELEVEN_LABS_KEY");

type Payload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: TablesInsert<"audio">;
  old_record: null;
};

Deno.serve(async (req) => {
  const payload: Payload = await req.json();

  const { pod_id: podId, id, history_item_id: historyItemId } = payload.record;

  if (!ELEVEN_LABS_KEY) {
    return new Response(
      JSON.stringify({ error: "elevan labs key is missing" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!historyItemId) {
    return new Response(
      JSON.stringify({ error: "history item id is missing" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "pod id is missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // get file from eleven labs
  const url = `https://api.elevenlabs.io/v1/history/${historyItemId}/audio`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "xi-api-key": ELEVEN_LABS_KEY!,
    },
  });

  const audioData = await res.arrayBuffer();
  const { data, error } = await supabaseAdminClient.storage
    .from("audio")
    .upload(`${podId}/${id}`, audioData, {
      contentType: "audio/mpeg",
    });

  if (error) {
    console.error("Error uploading audio", error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    console.log("Audio uploaded", data);
    // update audio record with file url
    const { error: audioUpdateError } = await supabaseAdminClient
      .from("audio")
      .update({ url: data.path })
      .eq("id", id);

    if (audioUpdateError) {
      console.error("Error updating audio record with URL", audioUpdateError);
      return new Response(JSON.stringify({ error: audioUpdateError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({data}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }); 
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/audio-insert-handler' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
