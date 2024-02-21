import Pods from "@/components/Pods";
import { Footer } from "@/components/footer";
import { Samples } from "@/components/samples";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { AudioLines } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const samples = [
  
  {
    name: "Technology (techmeme rss)",
    url: "/techmeme-sample.mp3",
  },
  {
    name: "Technology (multi-source)",
    url: "/tech.mp3",
  },
  {
    name: "Agriculture (agdaily)",
    url: "/ag-daily.mp3",
  },
];

const SampleSection = () => {
  return (
    <div className="flex flex-col justify-start max-w-xl min-w-0 w-full gap-4 pt-12">
      <div className="flex flex-row gap-2 items-center">
        <AudioLines size={24} />
        <div className="text-xl font-bold">Samples</div>
      </div>
      <Samples samples={samples} />
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="flex flex-col justify-start max-w-xl min-w-0 w-full gap-4 pt-12">
      <div className="flex flex-row gap-2 items-center">
        <div className="text-xl font-bold">How it works</div>
      </div>
      <div className="text-gray-600">
        <div>
          1. Create a pod by entering a feed url and a cadence.
        </div>
        <div>
          2. We will generate a recurring audio digest from the feed.
        </div>
        <div>
          3. Listen to the latest episode and share with friends.
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex flex-col justify-start max-w-xl w-full p-4 gap-4 pt-12">
          {/* <HeroText /> */}
          <h1 className={`text-2xl font-bold w-full`}>
            Turn any feed into a recurring audio digest.
          </h1>
          <div className="text-gray-600">
            Podsynth generates recurring audio summaries straight from your favorite RSS
            feeds. Creating a pod is easy - enter a url, a cadence, press a button, and
            voila!
          </div>
          {/* <div className="text-gray-600">
        Sign up to experience pure bliss of latent space.
      </div> */}
          <div className="mt-2">
            <Button variant="default" size="lg" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        <SampleSection />
        {/* <HowItWorks /> */}
        </div>
        <Footer /> 
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between border-t bg-gray-50">
      <Pods />
      <Footer /> 
    </main>
  );
}
