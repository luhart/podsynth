import BackButton from "@/components/BackButton";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const feeds = [
  { title: "Techmeme", source: "https://www.techmeme.com/feed.xml" },
  { title: "TechCrunch", source: "https://techcrunch.com/feed/" },
  // { title: "Morning Brew", source: "https://www.morningbrew.com/feed.xml" }, // bad feed
  { title: "Billboard", source: "https://www.billboard.com/feed/" },
  { title: "Gizmodo", source: "https://gizmodo.com/rss" },
  { title: "The Verge", source: "https://www.theverge.com/rss/frontpage" },
  { title: "Boing Boing", source: "https://boingboing.net/feed" },
  { title: "NASA News", source: "https://www.nasa.gov/news-release/feed/" },
  { title: "Ag Daily", source: "https://www.agdaily.com/feed/" },
  {
    title: "Fortune Feeds",
    source: "https://fortune.com/feed/fortune-feeds/?id=3230629",
  },
  { title: "Financial Times", source: "https://www.ft.com/rss/home" },
  { title: "The Economist", source: "https://www.economist.com/latest/rss" },
  { title: "The Guardian", source: "https://www.theguardian.com/uk/rss" },
  { title: "BBC News", source: "http://feeds.bbci.co.uk/news/rss.xml" },
  {
    title: "The New York Times",
    source: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  },
  { title: "memeorandum", source: "http://www.memeorandum.com/feed.xml" },
  { title: "mediagazer", source: "http://mediagazer.com/feed.xml" },
  { title: "WeSmirch", source: "https://www.wesmirch.com/feed.xml" },
];

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start border-t bg-gray-50">
      <div className="max-w-2xl w-full border-l border-r border-t-0 min-h-screen px-4 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-row justify-between sm:mt-24 mt-12">
          <BackButton />
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant={"outline"}>
                Caveats
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <div className="text-gray-700 text-sm divide-y">
                <p className="mb-2">
                  We currently only ingest article titles and descriptions.
                  Meaning articles like{" "}
                  <a
                    href="https://www.buzzfeed.com/kristenharris1/gross-tv-show-bts-facts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium text-blue-500"
                  >
                    this
                  </a>{" "}
                  will give you bad outputs.
                </p>
                <p className="py-2">
                  Cadence scheduling is done by LLM converting your input to cron - it might not be perfect. We only support one pod generation per day.
                </p>
                <p className="py-2">Things may break.</p>
                <p className="py-2">
                  I just started working on this. If you run into any issues or
                  have ideas, please do{" "}
                  <a href="mailto:luke@podsynth.com" className="underline font-medium text-blue-500">
                    email
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://twitter.com/lukejhartman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium text-blue-500"
                  >
                    DM
                  </a>{" "}
                  me.
                </p>
                <p className="pt-2">social features on the way</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col justify-start bg-white max-w-sm border w-full gap-4 sm:py-8 sm:px-6 py-5 px-4 rounded-lg mt-4">
          {children}
        </div>
        <div className="max-w-sm py-8 ">
          <div className="font-bold">Try a popular feed</div>
          <div className="mt-2 flex flex-row justify-start w-full gap-2 flex-wrap">
            {feeds.map((feed) => (
              <Button key={feed.source} variant="secondary" size="sm" asChild>
                <Link href={`/create/${encodeURIComponent(feed.source)}`}>
                  {feed.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
