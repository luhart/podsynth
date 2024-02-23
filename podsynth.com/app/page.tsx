import HomeClientAnon from "@/components/HomeClientAnon";
import { Footer } from "@/components/footer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between border-t bg-gray-50">
      <div className="max-w-3xl w-full border-l border-r min-h-screen flex flex-col items-center justify-between">
        <div className="flex flex-col justify-start max-w-xl w-full p-4 gap-8 pt-12">
          <div className="flex flex-col gap-2">
            <h1 className={`text-xl font-bold w-full`}>A playground for language and audio models</h1>
            <div className="text-gray-600">
              This is a place for quickly testing out different mixes of language and audio generation models. It may also turn into a place for people to share and discuss their creations. For now, it&apos;s just a place to play around with some models.
            </div>
          </div>
          <div>Below is a preview. Sign up for the waitlist to be first in line</div>
          <div className="w-full border-t" />
          <HomeClientAnon />
        </div>
      </div>
      <Footer />
    </main>
  );
}
