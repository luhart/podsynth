import HeroText from "@/components/hero-text";
import { Samples } from "@/components/samples";
import { Button } from "@/components/ui/button";
import { AudioLines, Play } from "lucide-react";

const samples = [
  {
    name: "This week in agriculture",
    url: "/ag.mp3",
  },
  {
    name: "Technology Today",
    url: "/tech.mp3",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="flex flex-col justify-start max-w-xl min-w-0 w-full p-4 gap-4 pt-12">
        <HeroText />
        <div className="text-gray-500 max-w-sm">
          Podsynth generates mini audio segments or &ldquo;pods&rdquo; for any
          topics you would like to track.
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
