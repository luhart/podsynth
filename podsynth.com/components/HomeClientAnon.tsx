"use client";

import { useEffect, useReducer, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CommandDialogDemo } from "./AppCmd";
import { Provider, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Copy, CopyCheck, LoaderIcon, Minus, Plus } from "lucide-react";
import { WorkflowProvider } from "@/lib/WorkflowContext";
import AddBlock from "@/components/workflow/WorkflowHeader";
import WorkflowList from "./workflow/WorkflowList";
import WorkFlowHeader from "@/components/workflow/WorkflowHeader";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

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

const initialWorkflow = {
  name: "RSS to Audio Summary",
  description:
    "This initial example grabs recent items from an RSS feed and creates an audio digest. It uses OpenRouter to create a summary of the items and ElevenLabs to generate the audio.",
  blocks: [
    {
      name: "Parse RSS feed",
      type: "utility",
      args: [
        { label: "source", type: "text" },
        { label: "numItems", type: "number", min: 1, max: 10 },
      ],
      result: {
        executionTime: 324,
        output: "This is the RSS utiltiy block output",
        error: null,
      },
    },
  ],
  // blockResults: []
};

function HomeClientAnon() {
  const [services, setServices] = useAtom(servicesAtom);

  return (
    <div className="flex flex-col max-w-xl w-full p-4 gap-12" id="preview">
      {/* label */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="text-lg font-bold tracking-tight">Preview</div>
          <div className="">
            Connect third party services to start adding to blocks to your
            canvas. Your keys are kept in local storage. All calls to third
            parties happen between your browser and the third party service.
          </div>
          <div className="">
            In the beta you won&apos;t need to enter any keys. We will provide
            these integrations for you. We will also provide a way to publish
            your workflows and share them with others.
          </div>
        </div>
        <div className="px-3 py-4 border bg-white text-sm">
          The following example grabs the five most recent items from an RSS
          feed, creates a readable summary using{" "}
          <code>mixtral-8x7b-instruct</code>, and pipes the output to an
          ElevenLabs tts model.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-semibold tracking-tight">Services</div>
        {/* service toggles */}
        {/* <div className="flex flex-row gap-2 items-center justify-start flex-wrap">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col gap-2">
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
        </div> */}
        <ToggleGroup
          variant="outline"
          className="flex flex-row gap-1 items-center justify-start flex-wrap"
          type="multiple"
          value={
            services.filter((s) => s.enabled).map((s) => s.name) as string[]
          }
          onValueChange={(value) => {
            setServices((prev) =>
              prev.map((s) => ({
                ...s,
                enabled: value.includes(s.name),
              }))
            ); 
          }}
        >
          {services.map((service) => (
            <ToggleGroupItem key={service.name} value={service.name} size="sm">
              {service.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
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

      <div className="flex flex-col gap-3 w-full">
        <WorkflowProvider>
          <WorkFlowHeader />
          <WorkflowList />
        </WorkflowProvider>
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

// type Block = UtilityBlock | ServiceBlock;

// type ActionArg = {
//   [key: string]: string | number | boolean;
// };

// type UtilityBlock = {
//   name: string;
//   description: string;
//   args: ActionArg[];
//   action: (args: ActionArg) => void;
// }

// type ServiceBlock = {
//   name: string;
//   description: string;
//   args: ActionArg[];
//   action: (args: ActionArg) => void;
// }

export const HomeClientAnonWrapped = () => {
  return (
    <Provider>
      <HomeClientAnon />
    </Provider>
  );
};
