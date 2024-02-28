"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CommandDialogDemo } from "./AppCmd";
import { Provider, atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Copy, CopyCheck, LoaderIcon, Minus, Plus } from "lucide-react";
import { parseRssSource } from "@/utils/utility-blocks";

const servicesAtom = atomWithStorage("services", [
  {
    name: "OpenRouter",
    key: "",
    enabled: true,
  },
  {
    name: "ElevenLabs",
    key: "",
    enabled: true,
  },
  {
    name: "OpenAI",
    key: "",
    enabled: false,
  },
  {
    name: "perplexity",
    key: "",
    enabled: false,
  },
  {
    name: "neets",
    key: "",
    enabled: false,
  },
  {
    name: "PlayHT",
    key: "",
    enabled: false,
  },
]);

// type BlockType = "utility" | "service" | "input" | "output";
// type Block = {
//   input: boolean;
//   output: boolean;
//   service: string;
//   type: string;
// }
// const blocksAtom = atomWithStorage("blocks", []);

function HomeClientAnon() {
  const [services, setServices] = useAtom(servicesAtom);
  const [running, setRunning] = useState(false);

  const [rssFeedUrl, setRssFeedUrl] = useState("https://techmeme.com/feed.xml");
  const [rssNumItems, setRssNumItems] = useState(5);
  const [rssResult, setRssResult] = useState<string | null>(null);
  const [rssResultTime, setRssResultTime] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const runWorkflow = async () => {
    setRssResult(null);
    if (rssNumItems < 1) {
      setError("Error in Parse RSS Utility: numItems must be greater than 0");
      return;
    }
    if (rssNumItems > 10) {
      setError("Error in Parse RSS Utility: numItems 10 or less.");
      return;
    }
    const rssResult = await parseRssSource(rssFeedUrl, rssNumItems);
    setRssResult(rssResult);
  };

  useEffect(() => {
    const callRunWorkFlow = async () => {
      setRunning(true);
      setError(null);
      setRssResult(null);
      if (rssNumItems < 1) {
        setError("Error in Parse RSS Utility: numItems must be greater than 0");
        setRunning(false);
        return;
      }
      if (rssNumItems > 10) {
        setError("Error in Parse RSS Utility: numItems 10 or less.");
        setRunning(false);
        return;
      }
      try {
        const start = performance.now();
        const rssResult = await parseRssSource(rssFeedUrl, rssNumItems);
        const end = performance.now();
        setRssResult(rssResult);
        setRssResultTime(end - start);
      } catch (error) {
        setError("Failed to parse RSS feed.");
      }
      setRunning(false);
    };

    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        callRunWorkFlow();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [rssFeedUrl, rssNumItems]);

  return (
    <div className="flex flex-col max-w-xl w-full p-4 gap-12 " id="preview">
      {/* label */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold tracking-tight">Preview</div>
          <div className="text-gray-600 text-sm">
            Connect third party services to start adding to blocks to your
            canvas. Your keys are kept in local storage. All calls to third
            parties happen between your browser and the third party service.
          </div>
        </div>
        <div className="text-gray-600 text-sm px-3 py-4 border bg-white">
          The following example grabs the five most recent items from an RSS
          feed, creates a readable summary using{" "}
          <code>mixtral-8x7b-instruct</code>, and pipes the output to an
          ElevenLabs tts model.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-medium tracking-tight" id="">
          Services
        </div>
        {/* service toggles */}
        <div className="flex flex-row gap-2 items-center justify-start flex-wrap">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col gap-2">
              {/* badge toggle  */}
              <Button
                size="sm"
                className="rounded-full px-4 py-2"
                onClick={() => {
                  setServices((prev) =>
                    prev.map((s) =>
                      s.name === service.name
                        ? { ...s, enabled: !s.enabled }
                        : s
                    )
                  );
                }}
                variant={service.enabled ? "default" : "secondary"}
              >
                {service.name}
              </Button>
            </div>
          ))}
        </div>
        {services.some((s) => s.enabled) && (
          <div className="flex flex-col gap-6 border rounded-sm px-4 py-6 mt-2 bg-white">
            {services.map(
              (service) =>
                service.enabled && (
                  <ServiceItem
                    key={service.name}
                    label={service.name}
                    value={service.key}
                    setValue={(value) => {
                      setServices((prev) =>
                        prev.map((s) =>
                          s.name === service.name ? { ...s, key: value } : s
                        )
                      );
                    }}
                  />
                )
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="font-medium tracking-tight">Blocks</div>
          <div className="h-[1px] flex-1 bg-gray-200" />
          <CommandDialogDemo />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-3 border px-4 py-6 bg-white rounded-sm">
            <div className="flex flex-row justify-between items-start">
              <div>
                <div className="font-medium">Parse RSS feed (utility)</div>
                <div className="text-gray-600 text-sm">
                  Grabs the most recent &#123;numItems&#125; from an RSS feed
                  &#123;source&#125;.
                </div>
              </div>

              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </div>

            <div className="flex flex-col border bg-gray-50 rounded-xl px-4 py-5 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">
                  source
                </label>
                <Input
                  value={rssFeedUrl}
                  onChange={(e) => setRssFeedUrl(e.target.value)}
                  disabled={running}
                  className="bg-white"
                  placeholder={`Enter an RSS URL`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">
                  numItems
                </label>
                <div className="flex flex-row items-center gap-1">
                  <Input
                    value={rssNumItems}
                    readOnly
                    type="number"
                    className="bg-white"
                    disabled={running}
                    placeholder={`5`}
                  />
                  <Button
                    variant="outline"
                    className="px-3"
                    disabled={running || rssNumItems <= 1}
                    onClick={() => setRssNumItems((prev) => prev - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="px-3"
                    disabled={running || rssNumItems >= 10}
                    onClick={() => setRssNumItems((prev) => prev + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {rssResult && (
              <div className="flex flex-col border bg-gray-50 rounded-xl px-4 py-5 gap-2">
                <div className="text-sm text-gray-600 font-medium">
                  Finished in {rssResultTime}ms.
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-xs text-gray-600 overflow-hidden max-h-[4.5rem]">
                    <code className="line-clamp-3">{rssResult}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(rssResult || "");
                      setCopied(true);
                    }}
                  >
                    {copied ? (
                      <CopyCheck className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={async () => {
              setRunning(true);
              await runWorkflow();
              setRunning(false);
            }}
            size="lg"
            disabled={running}
            className="flex flex-row justify-between"
          >
            <div className="w-[44px]"/>
            <div className="flex flex-row items-center gap-2">
              Run{" "}
              {running && <LoaderIcon className="animate-spin w-4 h-4" />}
            </div>

            <div className="flex item-center gap-1">
              <kbd className="pointer-events-none h-5 w-5 select-none flex items-center justify-center gap-1 rounded border border-b-2 bg-gray-800 font-mono text font-medium text-secondary opacity-100">
                ⌘
              </kbd>
              <kbd className="pointer-events-none h-5 w-5 select-none flex items-center justify-center gap-1 rounded border border-b-2 bg-gray-800 font-mono text font-medium text-secondary opacity-100">
                ↩
              </kbd>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

type ServiceItemProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
};

const ServiceItem = ({ label, value, setValue }: ServiceItemProps) => {
  // save text value to state
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${label} API key`}
      />
    </div>
  );
};

export const HomeClientAnonWrapped = () => {
  return (
    <Provider>
      <HomeClientAnon />
    </Provider>
  );
};
