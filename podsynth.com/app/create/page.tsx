import NewPod from "@/components/NewPod";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePodPage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-start border-t">
      <div className="max-w-2xl w-full border-l border-r border-t-0 min-h-screen px-2 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-row justify-between sm:mt-24 mt-12">
          <Button size="sm" variant={"outline"}>
            <Link href="/" className="flex flex-row gap-1 items-center">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
          <Popover>
            <PopoverTrigger>
              <Button size="sm" variant={"outline"}>
                Caveats
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <div className="text-gray-600 text-sm flex flex-col gap-2">
                <p>
                  <strong>Caveat 1:</strong> Things may break.
                </p>
                <p>
                  <strong>Caveat 2:</strong> We currently only ingest article
                  titles and descriptions. Meaning articles like{" "}
                  <a
                    href="https://www.buzzfeed.com/kristenharris1/gross-tv-show-bts-facts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    this
                  </a>{" "}
                  will likely give you garbage or funny outputs.
                </p>
                <p>
                  <strong>Caveat 3:</strong> I just started working on this. If
                  you run into any issues or have ideas, please do{" "}
                  <a href="mailto:luke@podsynth.com" className="underline">
                    email
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://twitter.com/lukejhartman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    DM
                  </a>{" "}
                  me.
                </p>
                <p>Also, social features on the way</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col justify-start max-w-sm border w-full gap-4 sm:py-8 sm:px-6 py-5 px-4 rounded-lg mt-4">
          <div className="text-xl font-bold">Create a new pod</div>
          <NewPod />
        </div>
      </div>
      <Footer />
    </main>
  );
}
