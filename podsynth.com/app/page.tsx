import HeroText from "@/components/hero-text";
import { Samples } from "@/components/samples";
import { Button } from "@/components/ui/button";
import { AudioLines, Play } from "lucide-react";

const samples = [
  // {
  //   name: "This week in agriculture",
  //   url: "/ag.mp3",
  // },
  {
    name: "Technology Today",
    url: "/tech.mp3",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="flex flex-col justify-start max-w-xl min-w-0 w-full p-4 gap-4 pt-12">
        {/* <HeroText /> */}
        <h1
          className={`sm:text-2xl text-2xl font-bold flex-1 w-full transition-all duration-500 sm:leading-10 leading-8`}
        >
          Turn any feed into a recurring audio digest.
        </h1>
        <div className="text-gray-600">
          Podsynth generates audio summaries straight from your favorite RSS feeds. I think we&apos;re gonna call these &apos;pods&apos;.
        </div>
        <div className="text-gray-600">
          Creating a pod is easy - enter a url, a cadence, press a button, and voila! Now you, too, can listen to summaries of techmeme while brushing your teeth.
        </div>
        <div className="text-gray-600">
          Sign up to experience pure LLM bliss.
        </div>
        <div>
          <Button variant="default" size="lg">
            Sign up
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-start max-w-xl min-w-0 w-full p-4 gap-4 pt-12">
        <div className="flex flex-row gap-2 items-center">
          <AudioLines size={24} />
          <div className="text-xl font-bold">Samples</div>
        </div>

        <Samples samples={samples} />
      </div>
    </main>
  );
}
