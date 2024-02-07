import NewPod from "@/components/NewPod";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePodPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start border-t">
      <div className="max-w-2xl w-full border border-t-0 min-h-screen px-2 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-row justify-start sm:mt-24 mt-12">
          <Button size="sm" variant={"outline"}>
            <Link href="/" className="flex flex-row gap-1 items-center">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex flex-col justify-start max-w-sm border w-full gap-4 sm:py-8 sm:px-6 py-5 px-4 rounded-lg mt-4">
          <div className="text-xl font-bold">Create a new pod</div>
          <NewPod />
        </div>
      </div>
    </main>
  );
}
