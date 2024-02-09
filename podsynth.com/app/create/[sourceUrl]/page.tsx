
import Parser from "rss-parser";
import { load } from "cheerio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateSteps from "./CreateSteps";
import { Item } from "./types";

const parser = new Parser();


async function parseRssFeed(url: string) {
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
      <>
        <div className="text-xl font-bold">Failed to parse source</div>
        <div className="text-gray-600">
          We couldn&apos;t parse the source. Please check the URL and try again.
        </div>
        <div className="text-gray-600">
          If you need help finding a feed, try googling the name of the site and
          &apos;RSS feed&apos;. If you still can&apos;t find it, try using 
          this{" "}<a href="https://rss.app/new-rss-feed" className="underline">RSS generator</a>.
        </div>
        <Button variant="default" size="lg" asChild>
          <Link href="/create">Go back</Link>
        </Button>
      </>
    );
  }

  return (
    <CreateSteps sourceUrl={decodedSourceUrl} previewItems={data} />
  );
}


