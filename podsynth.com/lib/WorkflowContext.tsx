import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
} from "react";
import { ResultType, rssUtilityBlockFunction } from "./block-functions";

export type Block = {
  id: number;
  name: string;
  blockType: "utility" | "service";
  description: string | null;
  status: string;
  fn: typeof rssUtilityBlockFunction | null;
  result: ResultType | null;
  args: {
    source: { type: "text"; value: string };
    numItems: { type: "number"; value: number; min?: number; max?: number };
  };
};

type Action =
  // | {
  //     type: "ADD_BLOCK";
  //     id: number;
  //     name: string;
  //     blockType: "utility" | "service";
  //     description: string;
  //     status: string;
  //   }
  | {
      type: "EDIT_UTILITY_BLOCK";
      block: Block;
    }
  | { type: "UPDATE_BLOCK_RESULT"; id: number; result: ResultType}
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

  async function runWorkflow() {
    setRunning(true);
    for (let block of blocks) {
      if (block.fn) {
        const result = await block.fn(
          block.args.source.value,
          block.args.numItems.value
        );
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
    <WorkflowContext.Provider value={{blocks, running, runWorkflow}}>
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
    // case "ADD_BLOCK": {
    //   return [
    //     ...blocks,
    //     {
    //       id: action.id,
    //       name: action.name,
    //       blockType: action.blockType,
    //       description: action.description || null,
    //       status: action.status,
    //       fn: action.name === "Parse RSS feed" ? RssUtilityBlockFunction : null,
    //       result: null,
    //     },
    //   ];
    // }
    case "EDIT_UTILITY_BLOCK": {
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
    name: "Parse RSS feed",
    blockType: "utility",
    status: "complete",
    description:
      "Grabs the most recent &#123;numItems&#125; from an RSS feed &#123;source&#125;.",
    fn: rssUtilityBlockFunction,
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
    // result: "This is the RSS utiltiy block output",
  },
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
