"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CommandDialogDemo } from "./AppCmd";
import { Provider, atom, useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils'


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

function HomeClientAnon() {
  const [services, setServices] = useAtom(servicesAtom);

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
                          s.name === service.name
                            ? { ...s, key: value }
                            : s
                        )
                      );
                    }}
                  />
                )
            )}
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="font-medium tracking-tight">Blocks</div>
        <div className="h-[1px] flex-1 bg-gray-200" />
        <CommandDialogDemo />
      </div>
      <CanvasContainer />
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

const CanvasContainer = () => {
  return <div className="border rounded-sm p-4 bg-white"></div>;
};

export const HomeClientAnonWrapped = () => {
  return (
    <Provider>
      <HomeClientAnon />
    </Provider>
  );
};
