import { Block, useWorkflow, useWorkflowDispatch } from "@/lib/WorkflowContext";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Copy, CopyCheck, LoaderIcon, Minus, Plus } from "lucide-react";

export default function WorkflowList() {
  const { blocks, running, runWorkflow } = useWorkflow();
  const dispatch = useWorkflowDispatch();

  useEffect(() => {
    const callRunWorkFlow = async () => {
      await runWorkflow();
    };

    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        callRunWorkFlow();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [runWorkflow]);

  return (
    <ul className="flex flex-col gap-3">
      {blocks.map((block: any) => (
        <li key={block.id}>
          {block.blockType === "utility" ? (
            <RssBlockItem block={block} />
          ) : (
            <BlockItem block={block} />
          )}
        </li>
      ))}
      {blocks.length === 0 ? (
        <div className="text-gray-600 text-center w-full px-4 py-24 rounded-xl border bg-white">
          No blocks. Add a block to get started.
        </div>
      ) : (
        <>
          <Button
            onClick={async () => {
              await runWorkflow();
            }}
            size="lg"
            disabled={running}
            className="flex flex-row justify-between"
          >
            <div className="w-[44px]" />
            <div className="flex flex-row items-center gap-2">
              Run {running && <LoaderIcon className="animate-spin w-4 h-4" />}
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
          <Button
            variant={"outline"}
            onClick={() => {
              dispatch({
                type: "RESET_WORKFLOW",
              });
            }}
          >
            Reset workflow
          </Button>
        </>
      )}
    </ul>
  );
}

function BlockItem({ block }: { block: Block }) {
  const dispatch = useWorkflowDispatch();

  return (
    <div className="flex flex-col gap-4 border px-4 py-6 bg-white rounded-sm">
      <div className="flex flex-row justify-between items-start">
        <div>
          <div className="font-medium">{block.name}</div>
          <div className="text-gray-600 text-sm mt-1">
            {block.description || "No description"}
          </div>
        </div>

        <Button size="sm" variant="outline">
          Edit
        </Button>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => {
            dispatch({
              type: "REMOVE_BLOCK",
              id: block.id,
            });
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

function RssBlockItem({ block }: { block: Block }) {
  const dispatch = useWorkflowDispatch();
  const { running } = useWorkflow();
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-4 border px-4 py-6 bg-white rounded-sm">
      <div className="flex flex-row justify-between items-start">
        <div>
          <div className="font-medium">Parse RSS feed [utility]</div>
          <div className="text-gray-600 text-sm mt-1">
            Grabs the most recent &#123;numItems&#125; from an RSS feed
            &#123;source&#125;.
          </div>
        </div>

        <Button size="sm" variant="outline">
          Edit
        </Button>
      </div>

      <div className="flex flex-col border bg-gray-50 rounded-xl px-4 py-5 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 font-medium">source</label>
          <Input
            value={block.args.source.value}
            type={block.args.source.type}
            disabled={block.status === "running"}
            onChange={(e) => {
              dispatch({
                type: "EDIT_UTILITY_BLOCK",
                block: {
                  ...block,
                  args: {
                    ...block.args,
                    source: {
                      ...block.args.source,
                      value: e.target.value,
                    },
                  },
                },
              });
            }}
            className="bg-white"
            placeholder={`Enter an RSS URL`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 font-medium">numItems</label>
          <div className="flex flex-row items-center gap-1">
            <Input
              value={block.args.numItems.value}
              readOnly
              type={block.args.numItems.type}
              className="bg-white"
              disabled={running}
              placeholder={`5`}
            />
            <Button
              variant="outline"
              className="px-3"
              disabled={running || block.args.numItems.value <= 1}
              onClick={() => {
                dispatch({
                  type: "EDIT_UTILITY_BLOCK",
                  block: {
                    ...block,
                    args: {
                      ...block.args,
                      numItems: {
                        ...block.args.numItems,
                        value: block.args.numItems.value - 1,
                      },
                    },
                  },
                });
              }}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="px-3"
              disabled={running || block.args.numItems.value >= 10}
              onClick={() => {
                dispatch({
                  type: "EDIT_UTILITY_BLOCK",
                  block: {
                    ...block,
                    args: {
                      ...block.args,
                      numItems: {
                        ...block.args.numItems,
                        value: block.args.numItems.value + 1,
                      },
                    },
                  },
                });
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {block.result && (
        <div className="flex flex-col border bg-gray-50 rounded-xl px-4 py-5 gap-2">
          <div className="text-sm text-gray-600 font-medium">
            Finished in {block.result.executionTime}ms.
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="text-xs text-gray-600 overflow-hidden max-h-[4.5rem]">
              <code className="line-clamp-3">{block.result.output}</code>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                navigator.clipboard.writeText(
                  block.result ? block.result.output || "" : ""
                );
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
  );
}

/*
        onChange={(e) => {
          dispatch({
            type: "EDIT_UTILITY_BLOCK",
            block: {
              ...block,
              done: e.target.checked,
            },
          });
        }}
*/
