"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Item } from "./types";

interface CreateStepsProps {
  sourceUrl: string;
  previewItems: Item[];
}

type Step = "check" | "schedule" | "confirm";

export default function CreateSteps({
  sourceUrl,
  previewItems,
}: CreateStepsProps) {
  const [step, setStep] = useState<Step>("check");
  const [cadenceInput, setCadenceInput] = useState<string>("");
  const [cadenceCron, setCadenceCron] = useState<string>("");

  async function onSchedule() {
    const response = await fetch("/api/human-to-cron", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cadence: cadenceInput,
      }),
    });

    const data = await response.text();
    console.log(data);
    setCadenceCron(data);
  }

  if (step === "check") {
    return (
      <>
        <div>
          <div className="text-sm font-medium mb-1 text-gray-500">
            {sourceUrl}
          </div>
          <div className="text-xl font-bold">
            I think it parses! Do me a favor and double check this sample:
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {previewItems.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="border px-2 py-2.5 rounded-sm bg-gray-100"
            >
              <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
                {item.title}
              </div>
              <div className="text-xs mt-1 text-gray-500">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <Button variant="default" size="lg" onClick={() => setStep("schedule")}>
          Looks good!
        </Button>
      </>
    );
  }

  if (step === "schedule") {
    return (
      <>
        <div className="text-xl font-bold">Schedule your pod</div>
        <div className="flex flex-col gap-4">
          <label htmlFor="cadence" className="flex flex-col gap-1">
            <span className="text-gray-600 text-sm font-medium block">
              Cadence
            </span>
            <Input
              id="cadence"
              name="cadence"
              type="text"
              placeholder="Weekdays at 9am"
              value={cadenceInput}
              onChange={(e) => {
                e.preventDefault();
                setCadenceInput(e.target.value);
              }}
              required
            />
          </label>
          {cadenceCron && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-600 text-sm font-medium block">
                Cron
              </span>
              <code className="bg-gray-100 p-2 rounded-md">{cadenceCron}</code>
            </div>
          )}
          <Button
            variant="default"
            size="lg"
            onClick={() => onSchedule()}
          >
            Next
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-xl font-bold">
        I think it parses! Do me a favor and double check this sample:
      </div>
      {previewItems.slice(0, 3).map((item, index) => (
        <div key={index} className="border px-2 py-2.5 rounded-sm bg-gray-100">
          <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
            {item.title}
          </div>
          <div className="text-xs mt-1 text-gray-500">{item.description}</div>
        </div>
      ))}
      <Button variant="default" size="lg" asChild>
        <Link href="/create">Looks good!</Link>
      </Button>
    </>
  );
}
