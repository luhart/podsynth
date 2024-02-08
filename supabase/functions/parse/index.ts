// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { parseFeed } from "https://deno.land/x/rss@1.0.0/mod.ts";
import { corsHeaders } from "../_utils/cors.ts";

type FeedItem = {
  title: string | undefined;
  description: string | undefined;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      headers: { "Content-Type": "application/json" },
      status: 405,
    });
  }

  const { url, preview } = await req.json();

  // check url is present
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  let items: FeedItem[] = [];

  try {
    const response = await fetch(url);
    const xml = await response.text();
    const feed = await parseFeed(xml);

    const filteredEntries = feed.entries.filter(
      (entry) =>
        entry.description &&
        entry.description.value &&
        entry.title &&
        entry.title.value
    );

    items = filteredEntries.map((entry) => ({
      // @ts-ignore: we just filtered out the empty titles
      title: entry.title.value,
      // @ts-ignore: we just filtered out the empty titles
      description: entry.description.value,
    }));

    // if preview is true, return the first 3 items
    if (preview) {
      items = items.slice(0, 3);
    }
    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error parsing rss", error);
    return new Response(JSON.stringify({ error: "error parsing rss" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-preview' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
