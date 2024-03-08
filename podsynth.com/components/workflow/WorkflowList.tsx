import { Block, useWorkflow, useWorkflowDispatch } from "@/lib/WorkflowContext";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Copy, CopyCheck, LoaderIcon, Minus, Plus, X } from "lucide-react";
import { rssUtilityBlockFunction } from "@/lib/block-functions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
          dispatch({
            type: "ADD_BLOCK",
            block: {
              name: "Parse RSS feed",
              blockType: "utility",
              status: "complete",
              description:
                "Grabs the most recent &#123;numItems&#125; from an RSS feed &#123;source&#125;.",
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
          });
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
          ) : block.blockType === "ai" ? (
            <CreateSummaryBlockItem block={block} />
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
            if (block.id) {
              dispatch({
                type: "REMOVE_BLOCK",
                id: block.id,
              });
            }
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
    <div className="flex flex-row w-full items-center justify-between px-4 py-6 bg-white  rounded-sm border">
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row justify-between items-start pb-4">
          <div className="flex flex-col gap-1">
            <div className="font-medium tracking-tight">
              {block.name || "Parse RSS feed"}
            </div>
            <div className="text-gray-600 text-sm">
              {block.description ||
                `Grabs the most recent {numItems} from an RSS feed
              {source}.`}
            </div>
          </div>

          <Button size="sm" variant="outline">
            Edit
          </Button>
        </div>

        <div className="flex flex-col gap-3 py-5 rounded-lg bg-gray-100">
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
                  type: "EDIT_BLOCK",
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
                className="focus-visible:ring-0 bg-white"
                disabled={running}
                placeholder={`5`}
              />
              <Button
                variant="outline"
                className="px-3"
                disabled={running || block.args.numItems.value <= 1}
                onClick={() => {
                  dispatch({
                    type: "EDIT_BLOCK",
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
                    type: "EDIT_BLOCK",
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
          <div className="flex flex-col bg-gray-100 rounded-xl px-4 py-5 gap-2">
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

function CreateSummaryBlockItem({ block }: { block: Block }) {
  const dispatch = useWorkflowDispatch();
  const { running } = useWorkflow();
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-row w-full items-center justify-between px-4 py-6 bg-white  rounded-sm border">
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row justify-between items-start pb-4">
          <div className="flex flex-col gap-1">
            <div className="font-medium tracking-tight">{block.name}</div>
            <div className="text-gray-600 text-sm">{block.description}</div>
          </div>

          <Button size="sm" variant="outline">
            Edit
          </Button>
        </div>

        <div className="flex flex-col gap-3 py-5 rounded-lg bg-gray-100">
          <div className="flex flex-col gap-1 px-4">
            <label className="text-xs text-gray-600 font-semibold font-mono">
              instructions
            </label>
            {block.args.messages.map((message: any, index: number) => (
              <div key={index} className="flex flex-row gap-2 justify-between items-center w-full">
                <div className="flex flex-col gap-1 my-2 flex-1">
                  <Select
                    onValueChange={(value) => {
                      dispatch({
                        type: "EDIT_BLOCK",
                        block: {
                          ...block,
                          args: {
                            ...block.args,
                            messages: block.args.messages.map(
                              (m: any, i: number) => {
                                if (i === index) {
                                  return { ...m, role: value };
                                }
                                return m;
                              }
                            ),
                          },
                        },
                      });
                    }}
                    value={message.role}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="system">system</SelectItem>
                        <SelectItem value="assistant">assistant</SelectItem>
                        <SelectItem value="user">user</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={message.content}
                    disabled={running}
                    className="bg-white"
                    onChange={(e) => {
                      dispatch({
                        type: "EDIT_BLOCK",
                        block: {
                          ...block,
                          args: {
                            ...block.args,
                            messages: block.args.messages.map(
                              (m: any, i: number) => {
                                if (i === index) {
                                  return { ...m, content: e.target.value };
                                }
                                return m;
                              }
                            ),
                          },
                        },
                      });
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  className="shrink-0"
                  size="icon"
                  onClick={() => {
                    dispatch({
                      type: "EDIT_BLOCK",
                      block: {
                        ...block,
                        args: {
                          ...block.args,
                          messages: block.args.messages.filter(
                            (_: any, i: number) => i !== index
                          ),
                        },
                      },
                    });
                  }}
                >
                  <X className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              className="hover:bg-gray-200"
              disabled={running}
              onClick={() => {
                dispatch({
                  type: "EDIT_BLOCK",
                  block: {
                    ...block,
                    args: {
                      ...block.args,
                      messages: [
                        ...block.args.messages,
                        { role: "user", content: "" },
                      ],
                    },
                  },
                });
              }}
            >
              Add instruction <Plus className="ml-1 w-4 h-4" />
            </Button>
            {/* <Input
              value={block.args.source.value}
              type={block.args.source.type}
              disabled={running}
              onChange={(e) => {
                dispatch({
                  type: "EDIT_BLOCK",
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
            /> */}
          </div>
          <div className="flex flex-col gap-1 px-4">
            <label className="text-xs text-gray-600 font-semibold font-mono">
              numItems
            </label>
            <div className="flex flex-row items-center gap-1">
              {/* <Input
                value={block.args.numItems.value}
                readOnly
                type={block.args.numItems.type}
                className="focus-visible:ring-0 bg-white"
                disabled={running}
                placeholder={`5`}
              />
              <Button
                variant="outline"
                className="px-3"
                disabled={running || block.args.numItems.value <= 1}
                onClick={() => {
                  dispatch({
                    type: "EDIT_BLOCK",
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
                    type: "EDIT_BLOCK",
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
              </Button> */}
            </div>
          </div>
        </div>
        {block.result && !block.result.error && (
          <div className="flex flex-col bg-gray-100 rounded-xl px-4 py-5 gap-2">
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
