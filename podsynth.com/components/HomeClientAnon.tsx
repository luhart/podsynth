"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderIcon, Plus } from "lucide-react";

const SERVICES = [
  { name: "OpenRouter", key_name: "openrouter" },
  { name: "ElevenLabs", key_name: "elevenlabs" },
  { name: "OpenAI", key_name: "openai" },
  { name: "perplexity", key_name: "perplexity" },
  { name: "neets", key_name: "neets.ai" },
  { name: "PlayHT", key_name: "playht" },
];

type Service = {
  name: string;
  key_name: string;
};

export default function HomeClientAnon() {
  const [loading, setLoading] = useState(false);
  const [openRouter, setOpenRouter] = useState("");
  const [elevenLabs, setElevenLabs] = useState("");
  const [perplexity, setPerplexity] = useState("");
  const [neets, setNeets] = useState("");
  const [playHT, setPlayHT] = useState("");

  const [enabledServices, setEnabledServices] = useState<Service[]>([
    { name: "OpenRouter", key_name: "openrouter" },
    { name: "ElevenLabs", key_name: "elevenlabs" },
  ]);

  if (loading) {
    return <LoaderIcon className="animate-spin" />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* label */}
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold">services</div>
        {/* service toggles */}
        <div className="flex flex-row gap-2 items-center justify-start flex-wrap">
          {SERVICES.map((service: Service) => (
            <div key={service.key_name} className="flex flex-col gap-2">
              {/* badge toggle  */}
              <Button
                size="sm"
                className="rounded-full px-4 py-2"
                onClick={() => {
                  setEnabledServices((prev) => {
                    if (prev.some((s) => s.key_name === service.key_name)) {
                      return prev.filter(
                        (s) => s.key_name !== service.key_name
                      );
                    } else {
                      return [...prev, service];
                    }
                  });
                }}
                variant={
                  enabledServices.some((s) => s.key_name === service.key_name)
                    ? "default"
                    : "secondary"
                }
              >
                {service.name}
              </Button>
            </div>
          ))}
        </div>
        {enabledServices.length > 0 && (
          <div className="flex flex-col gap-6 border rounded-sm px-4 py-6 mt-2 bg-white">
            {enabledServices.map((service: Service) => (
              <ServiceItem
                key={service.key_name}
                label={service.name}
                value={
                  service.key_name === "openrouter"
                    ? openRouter
                    : service.key_name === "elevenlabs"
                    ? elevenLabs
                    : service.key_name === "perplexity"
                    ? perplexity
                    : service.key_name === "neets.ai"
                    ? neets
                    : playHT
                }
                setValue={
                  service.key_name === "openrouter"
                    ? setOpenRouter
                    : service.key_name === "elevenlabs"
                    ? setElevenLabs
                    : service.key_name === "perplexity"
                    ? setPerplexity
                    : service.key_name === "neets.ai"
                    ? setNeets
                    : setPlayHT
                }
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="text-lg font-bold">blocks</div>
        <Button variant={"outline"}>
          Add block <Plus size={14} className="ml-1 text-gray-600" />
        </Button>
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
