import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
} from "react";
import {
  ResultType,
  createAudio,
  createSummary,
  rssUtilityBlockFunction,
} from "./block-functions";
import { useAtom } from "jotai";
import { servicesAtom } from "../components/HomeClientAnon";

export type Block = {
  id: number;
  name: string;
  blockType: "rss" | "ai-text" | "ai-audio";
  description: string | null;
  blockAction: BlockAction;
  result: ResultType | null;
  args: any;
};

type BlockAction =
  | { rssParse: { fn: typeof rssUtilityBlockFunction } }
  | { createSummary: { fn: typeof createSummary } }
  | { createAudio: { fn: typeof createAudio } }
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
  runBlock: (block: Block) => Promise<void>;
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

  const updateBlockResult = (id: number, result: ResultType) => {
    dispatch({
      type: "UPDATE_BLOCK_RESULT",
      id: id,
      result: result,
    });
  };

  async function runWorkflow() {
    setRunning(true);
    const resultsCopy: string[] = [];
    for (let block of blocks) {
      if (block.blockAction) {
        let result;

        dispatch({
          type: "UPDATE_BLOCK_RESULT",
          id: block.id,
          result: {
            executionTime: 0,
            output: null,
            error: null,
            status: "running",
          },
        });

        if ("rssParse" in block.blockAction) {
          result = await block.blockAction.rssParse.fn(
            block.args.source.value,
            block.args.numItems.value
          );
          resultsCopy.push(result.output || "");
        } else if ("createSummary" in block.blockAction) {
          // use result from previous block wherever {previousBlockResult} is found
          const messages = block.args.messages.map((m: any) => {
            if (m.content.includes("{previousBlockResult}")) {
              if (block.id === undefined)
                throw new Error("Block ID is undefined");
              return {
                role: m.role,
                content: m.content.replace(
                  "{previousBlockResult}",
                  resultsCopy[block.id - 1]
                ),
              };
            }
            return m;
          });

          result = await block.blockAction.createSummary.fn(
            messages,
            block.args.model,
            services.find((s) => s.name === "OpenRouter")?.key,
            block.id,
            updateBlockResult
          );
          resultsCopy.push(result.output || "");
        } else if ("createAudio" in block.blockAction) {
          const textWithPreviousBlockResult = block.args.text.replace(
            "{previousBlockResult}",
            resultsCopy[block.id - 1]
          );
          result = await block.blockAction.createAudio.fn(
            textWithPreviousBlockResult,
            block.args.voiceId,
            services.find((s) => s.name === "ElevenLabs")?.key,
            block.id,
            updateBlockResult
          );
        }
        else {
          throw new Error("Unknown block action");
        }
        if (result) {
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
    }
    setRunning(false);
  }

  async function runBlock(block: Block) {
    if (block.blockAction) {
      let result;

      dispatch({
        type: "UPDATE_BLOCK_RESULT",
        id: block.id,
        result: {
          executionTime: 0,
          output: null,
          error: null,
          status: "running",
        },
      });

      if ("rssParse" in block.blockAction) {
        result = await block.blockAction.rssParse.fn(
          block.args.source.value,
          block.args.numItems.value
        );
      } else if ("createSummary" in block.blockAction) {
        // use result from previous block wherever {previousBlockResult} is found
        const messages = block.args.messages.map((m: any) => {
          if (m.content.includes("{previousBlockResult}")) {
            if (block.id === undefined)
              throw new Error("Block ID is undefined");
            return {
              role: m.role,
              content: m.content.replace(
                "{previousBlockResult}",
                blocks[block.id - 1] ? blocks[block.id - 1].result?.output : ""
              ),
            };
          }
          return m;
        });

        result = await block.blockAction.createSummary.fn(
          messages,
          block.args.model,
          services.find((s) => s.name === "OpenRouter")?.key,
          block.id,
          updateBlockResult
        );
      } else if ("createAudio" in block.blockAction) {
        const textWithPreviousBlockResult = block.args.text.replace(
          "{previousBlockResult}",
          blocks[block.id - 1]
        );
        result = await block.blockAction.createAudio.fn(
          textWithPreviousBlockResult,
          block.args.voiceId,
          services.find((s) => s.name === "ElevenLabs")?.key,
          block.id,
          updateBlockResult
        );
      } 
      else {
        throw new Error("Unknown block action");
      }
      if (result) {
        dispatch({
          type: "UPDATE_BLOCK_RESULT",
          id: block.id,
          result: result,
        });
      }
    }
  }

  return (
    <WorkflowContext.Provider value={{ blocks, running, runWorkflow, runBlock }}>
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

const initialBlocks: Block[] = [
  {
    id: 0,
    name: "Use RSS Feed",
    blockType: "rss",
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
    name: "Invoke LLM (OpenRouter)",
    blockType: "ai-text",
    description:
      "Call language model {model} with {messages}. Use template `{previousBlockResult}` to insert the output of the previous block.",
    args: {
      messages: [
        {
          role: "system",
          content:
            "You are a writer for the news. You create readable scripts for a news program. These scripts will be read aloud by one person. Do not include anything that won't be read aloud. Skip items that aren't newsworthy. Add a sign-off at the end of the script.",
        },
        {
          role: "user",
          content:
            "Create a script for me from the following: {previousBlockResult}",
        }, // how should I pipe in the text from the previous block?
      ],
      model: "mistralai/mixtral-8x7b-instruct",
      OPENROUTER_API_KEY: "",
    },
    blockAction: { createSummary: { fn: createSummary } },
    // blockAction: null,
    result: null,
  },
  {
    id: 2,
    name: "Create Audio (ElevenLabs)",
    blockType: "ai-audio",
    description:
      "Generates an audio file from {text} using {model}. Use {previousBlockResult} to insert the output of the previous block.",
    args: {
      text: "Good morning, here are the top stories from Techmeme. {previousBlockResult}",
      voiceId: "EXAVITQu4vr4xnSDxMaL", // sarah
      ELEVENLABS_API_KEY: "",
    },
    blockAction: { createAudio: { fn: createAudio } },
    result: null,
  },
];
