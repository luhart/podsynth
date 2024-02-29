import { Item } from "@/utils/rss";

export type ResultType = {
  executionTime: number;
  output: string | null;
  error: string | null;
  status: string | null;
};

export async function rssUtilityBlockFunction(
  source: string,
  numItems: number
): Promise<ResultType> {
  if (numItems < 1) {
    return {
      error: "Error in Parse RSS Utility: numItems must be greater than 0",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }
  if (numItems > 10) {
    return {
      error: "Error in Parse RSS Utility: numItems 10 or less.",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }
  // check if the source is a valid URL
  try {
    const start = performance.now();
    const rssResult = await parseRssSource(source, numItems);
    const end = performance.now();
    return {
      error: null,
      output: rssResult,
      status: "complete",
      executionTime: end - start,
    };
  } catch (e) {
    return {
      error: "Error parsing the source. Please check the URL and try again.",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }
}

const MAX_CHARS_PARSED = 3500;
// takes in rss feed url and returns a string which will be used to create a summary
export async function parseRssSource(sourceUrl: string, numItems: number) {
  const res = await fetch("api/rss-fetch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source: sourceUrl, numItems: numItems }),
  });

  const data: Item[] = await res.json();

  if (!data) {
    throw new Error("Error fetching RSS feed");
  }

  const parsedData = data.reduce<string>((accumulator, currentItem) => {
    const currentItemTitle = currentItem.title || "";
    const potentialLength =
      accumulator.length +
      currentItemTitle.length +
      currentItem.description.length +
      1; // add one for line break
    if (potentialLength > MAX_CHARS_PARSED) return accumulator; // don't include current item if it would push us over the limit

    return accumulator + `${currentItem.title}: ${currentItem.description}\n`;
  }, "");

  return parsedData;
}
