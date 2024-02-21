import { Footer } from "@/components/footer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col justify-start max-w-xl w-full p-4 gap-2 pt-12">
        {/* <HeroText /> */}
        <h1 className={`text-lg font-bold w-full`}>
          LLM audio playground
        </h1>
        <div className="text-gray-600">
          Old version is disabled. New version coming soon (in like two days).
        </div>
        {/* <SampleSection /> */}
      </div>
      <Footer />
    </main>
  );
}
