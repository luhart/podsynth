import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { AudioLines, Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Pods() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: podsData, error: podsError } = await supabase
    .from("pods")
    .select(
      "id, title, source, created_by, timezone, cron_raw_input, status, audio(*), pod_runs(pod_id, summary)"
    )
    .eq("created_by", user.id);

  console.log(podsData);

  return (
    <div className="max-w-2xl w-full border-l border-r min-h-screen flex flex-col items-center justify-between">
      <div className="flex flex-col justify-start max-w-xl w-full px-4 gap-6 pt-12">
        <div className="flex flex-row gap-4 items-center justify-start">
          <div className="text-xl font-bold">Pods</div>
          <Button variant="outline" asChild>
            <Link href="/create" className="flex flex-row gap-1 items-center">
              Create new
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        {podsData && podsData.length > 0 ? (
          <div className="w-full rounded-lg border flex flex-col divide-y bg-white">
            {podsData.map((pod, index) => (
              <div key={index} className="px-4 py-2 flex justify-between">
                <div className="font-bold">{pod.title}</div>
                <div
                  className={
                    pod.status === "active" ? "text-ac" : "text-red-500"
                  }
                >
                  {pod.status === "active" ? pod.cron_raw_input : "Inactive"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full rounded-lg border-dashed border bg-white">
            <div className="flex flex-col items-center justify-center p-12">
              <AudioLines size={24} />
              <div className="font-medium tracking-tight mt-2">Nothing here yet!</div>
              <div className="text-gray-600 tracking-tight mb-6">Create a pod to start listening.</div>
              <Button variant="secondary" asChild>
                <Link
                  href="/create"
                  className="flex flex-row gap-1 items-center"
                >
                  Create pod 
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
