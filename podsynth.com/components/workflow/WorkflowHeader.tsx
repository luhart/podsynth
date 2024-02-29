import { useWorkflowDispatch } from "../../lib/WorkflowContext";
import { Button } from "@/components/ui/button";

export default function WorkFlowHeader() {
  const dispatch = useWorkflowDispatch();

  return (
    <>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="font-semibold tracking-tight">Workflow</div>
        <div className="h-[1px] flex-1 bg-gray-200" />
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            dispatch({
              type: "RESET_WORKFLOW",
            });
          }}
        >
          Reset
        </Button>
        {/* <CommandDialogDemo /> */}
      </div>
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
