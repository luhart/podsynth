import { useState } from "react";
import { useWorkflow, useWorkflowDispatch } from "./WorkflowContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddBlock() {
  const [text, setText] = useState("");
  const dispatch = useWorkflowDispatch();
  const { blocks } = useWorkflow();

  return (
    <>
      {/* <Input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      /> */}
      {/* <Button
        onClick={() => {
          setText("");
          dispatch({
            type: "ADD_BLOCK",
            id: nextId++,
            text: text,
          });
        }}
      >
        Add
      </Button> */}
    </>
  );
}

let nextId = 3;
