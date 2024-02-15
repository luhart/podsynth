// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { TablesInsert } from "../_utils/types_db.ts";

const ELEVEN_LABS_KEY = Deno.env.get("ELEVEN_LABS_KEY");  

type Payload = {
  type: 'INSERT'
  table: string
  schema: string
  record: TablesInsert<"audio">
  old_record: null
}

Deno.serve(async (req) => {
  const payload: Payload = await req.json()
  
  const { id, history_item_id: historyItemId }  = payload.record

  // get file from eleven labs

  // upload it to supabase storage

  // update audio record with file url

  return new Response(
    JSON.stringify({}),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/audio-insert-handler' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
