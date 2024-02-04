import HeroText from "@/components/hero-text";
import { Button } from "@/components/ui/button";
import { AudioLines, Play } from "lucide-react";

const samples = ["Today in Technology", "This Week in Agriculture"];

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

        <div className="flex flex-row gap-4 justify-start items-center">
          {samples.map((sample, index) => (
            <Button variant={"outline"} key={index}>
              <Play className="w-3 h-3 text-gray-600 mr-2 "/>
              {sample}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
