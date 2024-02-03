// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const { url } = await req.json();

  // validate url
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  try {
    const response = await fetch(url);
    const xml = await response.text();
    const feed = await parseFeed(xml);

    // console.log(feed);
    const filteredEntries = feed.entries.filter(
      (entry) => entry.title && entry.title.value
    );

    // @ts-ignore: we just filtered out the empty titles
    const titles = filteredEntries.map((entry) => entry.title.value);
    return new Response(JSON.stringify({ titles }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error parsing rss" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  // return new Response(JSON.stringify({}), {
  //   headers: { "Content-Type": "application/json" },
  // });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-rss' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
