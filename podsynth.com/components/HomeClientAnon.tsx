"use client";

import { useEffect, useReducer, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CommandDialogDemo } from "./AppCmd";
import { Provider, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Copy, CopyCheck, LoaderIcon, Minus, Plus } from "lucide-react";
import { WorkflowProvider } from "@/lib/WorkflowContext";
import AddBlock from "@/lib/AddBlock";
import WorkflowList from "./workflow/WorkflowList";

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
    <div className="flex flex-col max-w-xl w-full p-4 gap-12 " id="preview">
      {/* label */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold tracking-tight">Preview</div>
          <div className="text-gray-600 text-sm">
            Connect third party services to start adding to blocks to your
            canvas. Your keys are kept in local storage. All calls to third
            parties happen between your browser and the third party service.
          </div>
          <div className="text-gray-600 text-sm">
            In the beta you won&apos;t need to enter any keys. We will provide
            these integrations for you. We will also provide a way to publish
            your workflows and share them with others.
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

      <div className="flex flex-col gap-3 w-full">
        <WorkflowProvider>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="font-medium tracking-tight">Workflow</div>
            {/* <div className="h-[1px] flex-1 bg-gray-200" /> */}
            {/* <CommandDialogDemo /> */}
          </div>
          <AddBlock />
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
