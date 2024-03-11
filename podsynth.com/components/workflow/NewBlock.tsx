"use client";

import * as React from "react";

import { useMediaQuery } from "@/lib/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createAudio, rssUtilityBlockFunction } from "@/lib/block-functions";
import { useWorkflow, useWorkflowDispatch } from "@/lib/WorkflowContext";
import { Plus } from "lucide-react";

type NewBlockOptions = {
  value: string;
  label: string;
  template: any;
};

const blockOptions: NewBlockOptions[] = [
  {
    value: "rss",
    label: "Use RSS",
    template: {
      name: "Use RSS Feed",
      blockType: "rss",
      description:
        "Grabs the most recent {numItems} from an RSS feed {source}.",
      blockAction: { rssParse: { fn: rssUtilityBlockFunction } },
      result: null,
      args: {
        source: {
          type: "text",
          value: "https://www.techmeme.com/feed.xml",
        },
        numItems: {
          type: "number",
          value: 5,
          min: 1,
          max: 10,
        },
      },
    },
  },
  {
    value: "ai-text",
    label: "Invoke LLM (OpenRouter)",
    template: {
      name: "Invoke LLM (OpenRouter)",
      blockType: "ai-text",
      description:
        "Call language model {model} with {messages}. Use template `{previousBlockResult}` to insert the output of the previous block.",
      args: {
        messages: [
          {
            role: "system",
            content: "",
          },
          {
            role: "user",
            content: "{previousBlockResult}",
          },
        ],
        model: "mistralai/mixtral-8x7b-instruct",
        OPENROUTER_API_KEY: "",
      },
    },
  },
  {
    value: "ai-audio",
    label: "Create Audio (ElevenLabs)",
    template: {
      name: "Create Audio (ElevenLabs)",
      blockType: "ai-audio",
      description:
        "Generates an audio file from {text} using {model}. Use {previousBlockResult} to insert the output of the previous block.",
      args: {
        text: "",
        voiceId: "EXAVITQu4vr4xnSDxMaL", // sarah
        ELEVENLABS_API_KEY: "",
      },
      blockAction: { createAudio: { fn: createAudio } },
      result: null,
    },
  },
];

export function NewBlockCombobox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="lg" variant="outline">
            Add block <Plus className="ml-1 w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0" align="start">
          <NewBlockList setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" variant="outline">
          Add block <Plus className="ml-1 w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <NewBlockList setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NewBlockList({ setOpen }: { setOpen: (open: boolean) => void }) {
  const dispatch = useWorkflowDispatch();
  const { running } = useWorkflow();

  return (
    <Command>
      <CommandInput placeholder="Filter blocks..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {blockOptions.map((option) => (
            <CommandItem
              disabled={running}
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                dispatch({
                  type: "ADD_BLOCK",
                  block: option.template,
                });
                setOpen(false);
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
