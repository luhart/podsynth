import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateSteps from "./CreateSteps";
import { parseRssFeed } from "@/utils/rss";

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
          this{" "}<a href="https://rss.app/new-rss-feed" className="underline text-blue-500 font-medium">RSS generator</a>.
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


