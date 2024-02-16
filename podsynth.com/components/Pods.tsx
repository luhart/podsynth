import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { AudioLines, Cog, Plus, Settings, Settings2 } from "lucide-react";
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
      "id, title, source, created_by, timezone, cron_raw_input, status, audio(id, pod_id, url, created_at), pod_runs(pod_id, summary, created_at)"
    )
    .eq("created_by", user.id)
    .order("created_at", { referencedTable: "audio", ascending: false });

  if (podsData && podsData.length > 0) {
    console.log(podsData[0]);
  }

  // {
  //   id: '3b91d46b-5fc6-4888-a94f-cdc6157e8676',
  //   title: 'techmeme',
  //   source: 'https://www.techmeme.com/feed.xml',
  //   created_by: '3aa14a2d-0eb9-448d-9560-e163e272388e',
  //   timezone: 'America/Los_Angeles',
  //   cron_raw_input: 'Every morning at 9am',
  //   status: 'active',
  //   audio: [
  //     {
  //       id: '45060442-dff4-4fea-a80a-d6f26a098cac',
  //       url: '3b91d46b-5fc6-4888-a94f-cdc6157e8676/45060442-dff4-4fea-a80a-d6f26a098cac',
  //       pod_id: '3b91d46b-5fc6-4888-a94f-cdc6157e8676',
  //     },
  //     {
  //       id: '4082c77e-93a6-4fb1-8014-980b8c8a76ac',
  //       url: '3b91d46b-5fc6-4888-a94f-cdc6157e8676/4082c77e-93a6-4fb1-8014-980b8c8a76ac',
  //       pod_id: '3b91d46b-5fc6-4888-a94f-cdc6157e8676',
  //       created_at: '2024-02-16T05:35:40.197978+00:00',
  //       request_id: 'GJqdn21juLRTBDLBZv7w',
  //       history_item_id: 'QdDN4bdQIcH7kCIr8LMq'
  //     }
  //   ],
  //   pod_runs: [
  //     {
  //       pod_id: '3b91d46b-5fc6-4888-a94f-cdc6157e8676',
  //       summary: `In this segment, we have several news updates related to technology and cybersecurity...`
  //     }
  //   ]

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
          <div className="w-full flex flex-col divide-y">
            {podsData.map((pod, index) => (
              <div
                key={index}
                className="flex flex-col w-full border rounded-sm divide-y bg-white"
              >
                <div className="flex justify-between w-full items-center py-3 px-4">
                  <div>
                    <div className="font-medium">{pod.title}</div>
                    <div
                      className={
                        pod.status === "active"
                          ? "text-gray-600 text-sm"
                          : "text-red-500"
                      }
                    >
                      {pod.status === "active"
                        ? pod.cron_raw_input
                        : "Inactive"}
                    </div>
                  </div>
                  <Button variant="secondary">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 items-center px-4 py-3">
                  <div className="text-gray-600">Latest episode</div>
                  {pod.audio && pod.audio.length > 0 && pod.audio[0] && pod.audio[0].url && (
                    <audio controls className="w-full">
                      <source
                        src={getAudioUrl(pod.audio[0].url)}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full rounded-lg border-dashed border bg-white">
            <div className="flex flex-col items-center justify-center p-12">
              <AudioLines size={24} />
              <div className="font-medium tracking-tight mt-2">
                Nothing here yet!
              </div>
              <div className="text-gray-600 tracking-tight mb-4">
                Create a pod to start listening.
              </div>
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

const getAudioUrl = (url: string) => {
  return `https://qodxfnilxbeujlpacnti.supabase.co/storage/v1/object/public/audio/${url}`;
};
