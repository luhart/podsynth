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

  const NewBlockButton = () => {
    return (
      <Button
        size="lg"
        variant="outline"
        disabled={running}
        onClick={() => {
          // dispatch({
          //   type: "ADD_BLOCK",
          //   id: Date.now(),
          // });
        }}
      >
        New block <Plus className="ml-1 w-4 h-4" />
      </Button>
    );
  };

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
      <>
        {blocks.length === 0 ? (
          <>
            <div className="text-gray-600 text-center w-full px-4 py-24 rounded-xl border bg-white">
              No blocks. Add a block to get started.
            </div>
            <NewBlockButton />
          </>
        ) : (
          <>
            <div className="w-full flex flex-row gap-3">
              <NewBlockButton />
              <Button
                onClick={async () => {
                  await runWorkflow();
                }}
                size="lg"
                disabled={running}
                className="flex flex-row justify-between flex-1"
              >
                <div className="w-[44px] xs:block hidden" />
                <div className="flex flex-row items-center justify-center gap-2 xs:w-auto w-full">
                  Run{" "}
                  {running && <LoaderIcon className="animate-spin w-4 h-4" />}
                </div>

                <div className="xs:flex item-center gap-1 hidden">
                  <kbd className="pointer-events-none h-5 w-5 select-none flex items-center justify-center gap-1 rounded border border-b-2 bg-black font-mono text font-medium text-secondary opacity-100">
                    ⌘
                  </kbd>
                  <kbd className="pointer-events-none h-5 w-5 select-none flex items-center justify-center gap-1 rounded border border-b-2 bg-black font-mono text font-medium text-secondary opacity-100">
                    ↩
                  </kbd>
                </div>
              </Button>
            </div>
          </>
        )}
      </>
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
    <div className="flex flex-row w-full items-center justify-between px-4 py-6 bg-gray-100 rounded-xl border">
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row justify-between items-start pb-4">
          <div className="flex flex-col gap-1">
            <div className="font-medium tracking-tight">Parse RSS feed [utility]</div>
            <div className="text-gray-600 text-sm">
              Grabs the most recent &#123;numItems&#125; from an RSS feed
              &#123;source&#125;.
            </div>
          </div>

          <Button size="sm" variant="outline">
            Edit
          </Button>
        </div>

        <div className="flex flex-col gap-3 py-5 border rounded-lg bg-gray-50">
          <div className="flex flex-col gap-1 px-4">
            <label className="text-xs text-gray-600 font-semibold font-mono">
              source
            </label>
            <Input
              value={block.args.source.value}
              type={block.args.source.type}
              disabled={running}
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
          <div className="flex flex-col gap-1 px-4">
            <label className="text-xs text-gray-600 font-semibold font-mono">
              numItems
            </label>
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
                <Minus className="w-4 h-4 text-gray-700" />
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
                <Plus className="w-4 h-4 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
        {block.result && !block.result.error && (
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
        {block.result && block.result.error && (
          <div className="flex flex-col border border-red-200 bg-red-50 rounded-xl px-4 py-5 gap-2">
            <div className="flex flex-row gap-1 items-center">
              <div className="text-xs text-red-600 overflow-hidden max-h-[4.5rem]">
                <code className="line-clamp-3">{block.result.error}</code>
              </div>
            </div>
          </div>
        )}
      </div>
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
