import Parser from "rss-parser";
import { load } from "cheerio";

const parser = new Parser();

export interface Item {
  title: string | undefined;
  description: string;
  pubDate: string | undefined;
}

export async function parseRssFeed(url: string, numItems: number = 7): Promise<Item[]> {
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch (error) {
    console.error(`Error fetching RSS feed: ${error}`);
    return [];
  }

  const sortedItems = feed.items 
    .filter((item) => !!item.pubDate || !!item.title || !!item.description)
    // @ts-ignore
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, numItems); // grab latest numItems items

  const cleanedItems: Item[] = sortedItems.map((item) => {
    let title = item.title || "";
    let content = item.contentSnippet || item.content || "";
    let pubDate = item.pubDate || "";
    return {
      title: clean(title),
      description: clean(content),
      pubDate: clean(pubDate),
    };
  });
  
  return cleanedItems;
}

function clean(html: string): string {
  const $ = load(html);
  // You can customize this according to your needs
  $("script, style").remove();
  return $("body").text().trim();
}