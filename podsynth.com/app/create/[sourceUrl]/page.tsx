
import Parser from "rss-parser";
import { load } from "cheerio";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const parser = new Parser();


interface Item {
  title: string | undefined;
  description: string;
  pubDate: string | undefined;
}

export async function parseRssFeed(url: string) {
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch (error) {
    console.error(`Error fetching RSS feed: ${error}`);
    return [];
  }

  
  console.log("FIRST ITEM", feed.items[0].contentSnippet)

  const sortedItems = feed.items 
    .filter((item) => !!item.pubDate || !!item.title || !!item.description)
    // @ts-ignore
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 7); // grab latest 7 items

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

export default async function Page({
  params,
}: {
  params: { sourceUrl: string };
}) {
  const { sourceUrl } = params;

  // decode sourceUrl
  let decodedSourceUrl = decodeURIComponent(sourceUrl);
  
  // if decodedSourceUrl is missing https://, add it
  if (!decodedSourceUrl.match(/^https?:\/\//)) {
    decodedSourceUrl = `https://${decodedSourceUrl}`;
  }

  const data = await parseRssFeed(decodedSourceUrl);
  console.log(data);

  if (data.length < 1) {
    return (
      <div className="flex flex-col justify-start max-w-sm border w-full gap-4 sm:py-8 sm:px-6 py-5 px-4 rounded-lg mt-4">
        <div className="text-xl font-bold">Failed to parse source</div>
        <Button variant="default" size="lg" asChild>
          <Link href="/create">Go back</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="text-xl font-bold">I think it parses! Do me a favor and double check this sample.</div>
      {data.slice(0,3).map((item, index) => (
        <div key={index} className="border px-2 py-2.5 rounded-sm bg-gray-100">
          <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">{item.title}</div>
          <div className="text-xs mt-1 text-gray-500">{item.description}</div>
        </div>
      ))}
      <Button variant="default" size="lg" asChild>
        <Link href="/create">Looks good!</Link>
      </Button>
    </>
  );
}


