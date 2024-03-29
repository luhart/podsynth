"use client";
import { useState } from "react";
import { useWorkflow, useWorkflowDispatch } from "../../lib/WorkflowContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WorkFlowHeader() {
  const dispatch = useWorkflowDispatch();
  const { blocks } = useWorkflow();

  const [title, setTitle] = useState("RSS → Audio Summary");

  return (
    <div>
      <div className="text-base font-semibold tracking-tight mb-2 ">Workflow</div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex-grow">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold tracking-tight pr-0"
            placeholder="Workflow"
          />
        </div>

        <div className="h-[1px] flex-1 bg-gray-200" />
        <Button
          variant={"outline"}
          size={"sm"}
          disabled={!blocks || blocks.length === 0}
          onClick={() => {
            setTitle("");
            dispatch({
              type: "RESET_WORKFLOW",
            });
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
