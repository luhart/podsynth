// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { parseFeed } from "https://deno.land/x/rss@1.0.0/mod.ts";
import { createSummary } from "../_utils/ai.ts";


Deno.serve(async (req) => {
  const { url } = await req.json();

  // validate url
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  let titles: string[] = [];
  try {
    const response = await fetch(url);
    const xml = await response.text();
    const feed = await parseFeed(xml);

    // console.log(feed);
    const filteredEntries = feed.entries.filter(
      (entry) => entry.title && entry.title.value
    );

    // @ts-ignore: we just filtered out the empty titles
    titles = filteredEntries.map((entry) => entry.title.value);
  } catch (error) {
    console.log("Error parsing rss", error);
    return new Response(JSON.stringify({ error: "error parsing rss" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  if (titles.length === 0) {
    return new Response(JSON.stringify({ error: "No titles found" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  let summary: string | null = null;

  try {
    const inputText = titles.join("\n");
    const PROMT_INST = `Create a news reading from the following:\n\n${inputText}`;
    summary = await createSummary(PROMT_INST);
  } catch (error) {
    console.log("Error creating summary", error);
    return new Response(JSON.stringify({ error: "Error creating summary" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  // const summary = await createSummary("test")

  return new Response(JSON.stringify({ summary }), {
    headers: { "Content-Type": "application/json" },
  });

});