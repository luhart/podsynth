import HomeClientAnon from "@/components/HomeClientAnon";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between border-t bg-gray-50">
      <div className="max-w-3xl w-full border-l border-r min-h-screen flex flex-col items-center justify-between">
        <div className="flex flex-col justify-start max-w-xl w-full p-4 gap-8 pt-12">
          <div className="flex flex-col gap-2">
            <h1 className={`text-xl font-bold w-full`}>
              A playground for language and audio models.
            </h1>
            <div className="text-gray-600">
              This is a place for quickly testing out different mixes of
              language and audio generation models. Everything in this preview
              is ephemeral.
            </div>
          </div>
          <div className="w-full">
            <div className="px-4 py-6 border rounded bg-cross max-w-sm w-full">
              <div className="mb-1 font-medium tracking-tight">
                This is a preview
              </div>
              <div className="text-gray-600 mb-4">
                Join the waitlist for early access
              </div>
              <form className="flex flex-col w-full gap-3">
                <Input
                  placeholder="marvin@minsky.com"
                  type="email"
                  className="bg-white bg-opacity-50"
                />
                <Button variant="default">
                  Sign up
                </Button>
              </form>
            </div>
          </div>

          <HomeClientAnon />
        </div>
      </div>
      <Footer />
    </main>
  );
}
