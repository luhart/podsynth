import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
} from "react";
import {
  ResultType,
  createSummary,
  rssUtilityBlockFunction,
} from "./block-functions";
import { useAtom } from "jotai";
import { servicesAtom } from "../components/HomeClientAnon";

export type Block = {
  id?: number;
  name: string;
  blockType: "utility" | "ai";
  description: string | null;
  status: string;
  blockAction: BlockAction;
  result: ResultType | null;
  args: any;
};

type BlockAction =
  | { rssParse: { fn: typeof rssUtilityBlockFunction } }
  | { createSummary: { fn: typeof createSummary } }
  | null;

type Action =
  | {
      type: "ADD_BLOCK";
      block: Block;
    }
  | {
      type: "EDIT_BLOCK";
      block: Block;
    }
  | { type: "UPDATE_BLOCK_RESULT"; id: number; result: ResultType }
  | { type: "REMOVE_BLOCK"; id: number }
  | { type: "RESET_WORKFLOW" };

// Define the context type

type WorkflowContextType = {
  blocks: Block[];
  running: boolean;
  runWorkflow: () => Promise<void>;
};

const WorkflowContext = createContext<WorkflowContextType | null>(null);
const WorkflowDispatchContext = createContext<React.Dispatch<Action> | null>(
  null
);

interface WorkflowProviderProps {
  children: ReactNode;
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
  const [blocks, dispatch] = useReducer(workflowReducer, initialBlocks);
  const [running, setRunning] = useState(false);
  
  const [services] = useAtom(servicesAtom);

  async function runWorkflow() {
    setRunning(true);
    for (let block of blocks) {
      if (block.blockAction) {
        let result;
        if ("rssParse" in block.blockAction) {
          console.log("running rssParse");
          result = await block.blockAction.rssParse.fn(
            block.args.source.value,
            block.args.numItems.value
          );
        } else if ("createSummary" in block.blockAction) {
          result = await block.blockAction.createSummary.fn(
            [
              {
                role: "system",
                content:
                  "You are a writer for the news. You create readable scripts for a news program. These scripts will be read aloud by one person. Do not include emojis or special characters. Skip items that aren't newsworthy. Add a sign-off at the end of the script.",
              },
              {
                role: "user",
                content:
                  "Create a script for me from the following: " +
                  block.args.text.value,
              },
            ],
            "mistralai/mixtral-8x7b-instruct",
            services.find((s) => s.name === "OpenRouter")?.key
          );
        } else {
          throw new Error("Unknown block action");
        }
        if (block.id === undefined) throw new Error("Block ID is undefined");
        dispatch({
          type: "UPDATE_BLOCK_RESULT",
          id: block.id,
          result: result,
        });
        if (result.error) {
          break;
        }
      }
    }
    setRunning(false);
  }

  return (
    <WorkflowContext.Provider value={{ blocks, running, runWorkflow }}>
      <WorkflowDispatchContext.Provider value={dispatch}>
        {children}
      </WorkflowDispatchContext.Provider>
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === null)
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  return context;
}

export function useWorkflowDispatch() {
  const context = useContext(WorkflowDispatchContext);
  if (context === null)
    throw new Error(
      "useWorkflowDispatch must be used within a WorkflowProvider"
    );
  return context;
}

function assertNever(x: never): never {
  throw new Error("Unexpected action in workflowReducer: " + x);
}

function workflowReducer(blocks: Block[], action: Action): Block[] {
  switch (action.type) {
    case "ADD_BLOCK": {
      return [
        ...blocks,
        {
          ...action.block,
          id: blocks.length,
        },
      ];
    }
    case "EDIT_BLOCK": {
      return blocks.map((block) => {
        if (block.id === action.block.id) {
          return action.block;
        }
        return block;
      });
    }
    case "REMOVE_BLOCK": {
      return blocks.filter((block) => block.id !== action.id);
    }
    case "UPDATE_BLOCK_RESULT": {
      return blocks.map((block) => {
        if (block.id === action.id) {
          return {
            ...block,
            result: action.result,
          };
        }
        return block;
      });
    }
    case "RESET_WORKFLOW": {
      return [];
    }
    default: {
      // This helps TypeScript understand that the `default` case should not be reachable
      // if all `Action` types are handled. It also provides a safer runtime check.
      return assertNever(action);
    }
  }
}

export const newDummyBlock: Block = {
  name: "Parse RSS feed",
  blockType: "utility",
  status: "complete",
  description: "Grabs the most recent {numItems} from an RSS feed {source}.",
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
};

const initialBlocks: Block[] = [
  {
    id: 0,
    name: "Parse RSS feed",
    blockType: "utility",
    status: "complete",
    description: "Grabs the most recent {numItems} from an RSS feed {source}.",
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
  {
    id: 1,
    name: "Create Summary (OpenRouter)",
    blockType: "ai",
    status: "complete",
    description: "Summarizes {text} based on {instructions} using {model}. Use {previousBlockResult} with left & right braces to use the output of the previous block.",
    args: {
      messages: [
        {
          role: "system",
          content:
            "You are a writer for the news. You create readable scripts for a news program. These scripts will be read aloud by one person. Do not include emojis or special characters. Skip items that aren't newsworthy. Add a sign-off at the end of the script.",
        },
        {
          role: "user",
          content: "Create a script for me from the following: {previousBlockResult}",
        }, // how should I pipe in the text from the previous block?
      ],
      model: "mistralai/mixtral-8x7b-instruct",
      OPENROUTER_API_KEY: "",
    },
    // blockAction: { createSummary: { fn: createSummary } },
    blockAction: null,
    result: null,
  },
  // {
  //   id: 1,
  //   name: "Create Summary (OpenRouter)",
  //   blockType: "service",
  //   status: "complete",
  //   description: "Summarizes {text} based on {instructions} using model",
  //   args: ,
  // }
];

const initialWorkflowMetadata = {
  name: "RSS to Audio Summary",
  description:
    "This initial example grabs recent items from an RSS feed and creates an audio digest. It uses OpenRouter to create a summary of the items and ElevenLabs to generate the audio.",
};

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
  finalResult: "",
};
