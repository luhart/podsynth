import Pods from "@/components/Pods";
import { Footer } from "@/components/footer";
import { Samples } from "@/components/samples";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { AudioLines } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

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
            Podsynth generates audio summaries straight from your favorite RSS
            feeds. I think we&apos;ll call these &apos;pods&apos;.
          </div>
          <div className="text-gray-600">
            Creating a pod is easy - enter a url, a cadence, press a button, and
            voila! Now you, too, can listen to summaries of techmeme while
            brushing your teeth.
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
