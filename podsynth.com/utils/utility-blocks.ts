import { Item } from "./rss";

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
