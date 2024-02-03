import { fetchJigsawStack } from "../_utils/jigsaw.ts";

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    const url = body.url;

    const requestBody: {
      url: string;
      element_prompts?: string[];
      elements?: { selector: string }[];
    } = {
      url: url,
    };

    if (body?.prompts) {
      requestBody["element_prompts"] = body.prompts;
    } else if (body?.selectors) {
      requestBody["elements"] = body.selectors.map((s: string) => ({
        selector: s,
      }));
    } else {
      throw new Error("Missing prompts or selectors");
    }

    const scrapeResp = await fetchJigsawStack(
      body?.prompts ? "/ai/scrape" : "/scrape",
      requestBody
    );

    const mappedData = scrapeResp.data.map((d: any) => ({
      selector: d.selector,
      results: d.results.map((r: any) => r.text),
    }));

    return new Response(JSON.stringify(mappedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error?.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});