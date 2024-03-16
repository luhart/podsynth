import { HomeClientAnonWrapped } from "@/components/HomeClientAnon";
import WaitlistForm from "@/components/WaitlistForm";
import { Footer } from "@/components/footer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center border-t bg-gray-50">
      <div className="max-w-3xl w-full border-l border-r flex flex-col items-center py-12">
        <div className="flex flex-col justify-start max-w-xl w-full p-4 gap-12 ">
          <div className="flex flex-col gap-2">
            <h1 className={`text-xl font-bold w-full`}>
              A simple canvas for language and audio models.
            </h1>
            <div className="text-gray-600">
              This is a place for quickly testing out different mixes of
              language and audio generation models. Everything is currently
              stored locally in your browser.
            </div>
          </div>
          <WaitlistForm />
        </div>
      </div>
      <div className="max-w-3xl w-full border-l border-r flex flex-col items-center pb-24">
        <div className="h-[1px] w-full bg-gray-200 mb-12" />
        <HomeClientAnonWrapped />
      </div>
      <Footer />
    </main>
  );
}
