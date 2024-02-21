import { Footer } from "@/components/footer";
import { Samples } from "@/components/samples";
import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";
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

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col justify-start max-w-xl w-full p-4 gap-2 pt-12">
        {/* <HeroText /> */}
        <h1 className={`text-lg font-bold w-full`}>
          LLM audio playground
        </h1>
        <div className="text-gray-600">
          Old version is disabled. New thing coming soon (in like two days).
        </div>
        <SampleSection />
      </div>
      <Footer />
    </main>
  );
}
