import { Block, useWorkflow, useWorkflowDispatch } from "@/lib/WorkflowContext";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  CopyCheck,
  LoaderIcon,
  Minus,
  Plus,
  Trash,
  X,
} from "lucide-react";
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
import { voiceProfiles } from "@/lib/voices";
import { textModels } from "@/lib/models";
import { NewBlockCombobox } from "./NewBlock";

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
              id: blocks.length,
              name: "Parse RSS feed",
              blockType: "rss",
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
      {blocks.map((block: any, index: number) => (
        <React.Fragment key={block.id}>
          <li>
            <BlockContainer block={block}>
              {block.blockType === "rss" ? (
                <RssBlockItem block={block} />
              ) : block.blockType === "ai-text" ? (
                <LLMBlockItem block={block} />
              ) : block.blockType === "ai-audio" ? (
                <AudioBlockItem block={block} />
              ) : (
                <div>Unknown block type</div>
              )}
            </BlockContainer>
          </li>
          {index < blocks.length - 1 && (
            <li className="flex justify-center" key={`separator-${block.id}`}>
              <div className="text-gray-600">↓</div>
            </li>
          )}
        </React.Fragment>
      ))}
      {blocks.length === 0 && (
        <React.Fragment key="no-blocks">
          <li className="text-gray-600 text-center w-full px-4 py-24 rounded-xl border bg-white">
            No blocks. Add a block to get started.
          </li>
          <li><NewBlockCombobox /></li>
        </React.Fragment>
      )}
      {blocks.length > 0 && (
        <li className="w-full flex flex-row gap-3 mt-4" key="wf-actions">
          <NewBlockCombobox />
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
        </li>
      )}
    </ul>
  );
}

function RssBlockItem({ block }: { block: Block }) {
  const dispatch = useWorkflowDispatch();
  const { running } = useWorkflow();
  const [copied, setCopied] = useState(false);

  const [expandResult, setExpandResult] = useState(false);

  return (
    <div className="flex flex-col w-full gap-2">
      <BlockHeader block={block} />
      <BlockInputWrapper>
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
      </BlockInputWrapper>
      {block.result && !block.result.error && (
        <div className="flex flex-col bg-gray-100 rounded-lg border px-4 py-5 gap-2">
          {block.result.status === "running" ? (
            <div className="text-sm text-gray-600 font-medium flex flex-row gap-1 items-center">
              Running <LoaderIcon className="animate-spin w-4 h-4" />
            </div>
          ) : (
            <div className="text-sm text-gray-600 font-medium">
              Finished in {block.result.executionTime}ms.
            </div>
          )}

          {block.result.output && (
            <div className="flex flex-row gap-1 items-start">
              <div
                className={`text-xs text-gray-600 ${
                  !expandResult ? "line-clamp-3" : ""
                }`}
              >
                <code>{block.result.output}</code>
              </div>
              <div className="flex flex-row gap-1 items-center h-[46px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 px-1 py-1.5 w-auto"
                  onClick={() => setExpandResult(!expandResult)}
                >
                  {expandResult ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 px-1 py-1.5 w-auto"
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
  );
}

function LLMBlockItem({ block }: { block: Block }) {
  const dispatch = useWorkflowDispatch();
  const { running } = useWorkflow();
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col w-full gap-2">
      <BlockHeader block={block} />
      <BlockInputWrapper>
        <div className="flex flex-col gap-1 px-4">
          <label className="text-xs text-gray-600 font-semibold font-mono">
            messages
          </label>
          {block.args.messages.map((message: any, index: number) => (
            <div
              key={index}
              className="flex flex-row gap-2 justify-between items-center w-full"
            >
              <div className="flex flex-col gap-1 mb-2 flex-1">
                <Select
                  disabled={running}
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
                  <SelectTrigger className="w-full bg-white" disabled={running}>
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
                disabled={running}
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
            Add message <Plus className="ml-1 w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-1 px-4">
          <label className="text-xs text-gray-600 font-semibold font-mono">
            model
          </label>
          <Select
            onValueChange={(value) => {
              dispatch({
                type: "EDIT_BLOCK",
                block: {
                  ...block,
                  args: {
                    ...block.args,
                    model: value,
                  },
                },
              });
            }}
            value={block.args.model}
          >
            <SelectTrigger className="w-full bg-white" disabled={running}>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Model</SelectLabel>
                {textModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </BlockInputWrapper>
      {block.result && !block.result.error && (
        <div className="flex flex-col bg-gray-100 rounded-lg border px-4 py-5 gap-2">
          {block.result.status === "running" ? (
            <div className="text-sm text-gray-600 font-medium flex flex-row gap-1 items-center">
              Running <LoaderIcon className="animate-spin w-4 h-4" />{" "}
              {block.result.executionTime}ms
            </div>
          ) : (
            <div className="text-sm text-gray-600 font-medium">
              Finished in {block.result.executionTime}ms.
            </div>
          )}
          <div className="flex flex-row gap-1 items-center">
            <div className="text-xs text-gray-600">
              <code className="">{block.result.output}</code>
            </div>
            {block.result.output && (
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
            )}
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
  );
}

function AudioBlockItem({ block }: { block: Block }) {
  const dispatch = useWorkflowDispatch();
  const { running } = useWorkflow();
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col w-full gap-2">
      <BlockHeader block={block} />
      <BlockInputWrapper>
        <div className="flex flex-col gap-1 px-4">
          <label className="text-xs text-gray-600 font-semibold font-mono">
            text
          </label>
          <Textarea
            value={block.args.text}
            disabled={running}
            className="bg-white"
            onChange={(e) => {
              dispatch({
                type: "EDIT_BLOCK",
                block: {
                  ...block,
                  args: {
                    ...block.args,
                    text: e.target.value,
                  },
                },
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-1 px-4">
          <div className="flex flex-row justify-between items-end">
            <label className="text-xs text-gray-600 font-semibold font-mono">
              voice
            </label>
            {/* play sample button */}
            <Button
              variant="link"
              size="sm"
              className="p-0 m-0 h-auto pr-2"
              onClick={() => {
                const selectedVoice = voiceProfiles.find(
                  (voice) => voice.id === block.args.voiceId
                );
                if (selectedVoice && selectedVoice.previewUrl) {
                  const audio = new Audio(selectedVoice.previewUrl);
                  audio.play();
                }
              }}
            >
              preview
            </Button>
          </div>

          <Select
            onValueChange={(value) => {
              dispatch({
                type: "EDIT_BLOCK",
                block: {
                  ...block,
                  args: {
                    ...block.args,
                    voiceId: value,
                  },
                },
              });
            }}
            value={block.args.voiceId}
            disabled={running}
          >
            <SelectTrigger className="w-full bg-white" disabled={running}>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Voice</SelectLabel>
                {voiceProfiles.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </BlockInputWrapper>
      {block.result && !block.result.error && (
        <div className="flex flex-col bg-gray-100 rounded-xl px-4 py-5 gap-2">
          {block.result.status === "running" ? (
            <div className="text-sm text-gray-600 font-medium flex flex-row gap-1 items-center">
              Running <LoaderIcon className="animate-spin w-4 h-4" />{" "}
            </div>
          ) : (
            <div className="text-sm text-gray-600 font-medium">
              Finished in {block.result.executionTime}ms.
            </div>
          )}
          {block.result.output && (
            <div className="p-2 bg-gray-200 bg-cross text-gray-800 rounded-full">
              <audio controls className="w-full ">
                <source src={block.result.output} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
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
  );
}

function BlockContainer({
  children,
  block,
}: {
  children: React.ReactNode;
  block: Block;
}) {
  const { runBlock } = useWorkflow();
  const dispatch = useWorkflowDispatch();
  const [showButtons, setShowButtons] = useState(false);

  return (
    <div
      className="relative flex flex-col w-full items-center justify-between px-4 py-6 bg-white rounded-lg border"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {children}
      <div
        className={`absolute bottom-0 -right-3 transform -translate-x-1/4 translate-y-1/2 flex gap-1 bg-white rounded-lg border py-1 px-1 transition-all duration-150 ${showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
      >
        <Button
          variant={"ghost"}
          size="sm"
          className="py-1 px-2 h-auto font-mono text-xs rounded-lg text-gray-600"
          onClick={() => {
            dispatch({
              type: "REMOVE_BLOCK",
              id: block.id,
            });
          }}
        >
          <Trash className="w-3 h-3" />
        </Button>
        <Button
          variant={"ghost"}
          size="sm"
          className="py-1 px-2 h-auto text-xs font-medium rounded-lg text-gray-600"
          onClick={() => {
            runBlock(block);
          }}
        >
          Run <ArrowRight className="ml-1 w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function BlockHeader({ block }: { block: Block }) {
  return (
    <div className="flex flex-row justify-between items-start pb-4">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-1 items-center">
          <div className="font-medium font-mono text-gray-600">{block.id}</div>
          <div className="w-3 h-[1px] bg-gray-200" />
          <div className="font-medium tracking-tight">{block.name}</div>
        </div>
        <div className="text-gray-600 text-sm">{block.description}</div>
      </div>

      {/* <Button size="sm" variant="ghost" disabled={disabled}>
        Edit
      </Button> */}
    </div>
  );
}

function BlockInputWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-5 rounded-lg bg-gray-100 border">
      {children}
    </div>
  );
}
