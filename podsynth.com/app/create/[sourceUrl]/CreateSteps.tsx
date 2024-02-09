"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Item } from "./types";
import { Loader } from "lucide-react";

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
  const [checkingCadence, setCheckingCadence] = useState<boolean>(false);
  const [cadenceError, setCadenceError] = useState<string>("");

  async function onSchedule() {
    setCheckingCadence(true);
    const response = await fetch("/api/human-to-cron", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cadence: cadenceInput,
      }),
    });

    // const dataText = await response.text();
    // console.log(dataText);
    const dataText = await response.text();

    try {
      const data = JSON.parse(dataText);
      if (data.pass === true) {
        setCadenceCron(data.cron);
        setCheckingCadence(false);
        // setStep("confirm");
      } else {
        setCadenceError(data.error);
        setCadenceError(data.message);
        setCheckingCadence(false);
      }
    } catch (error) {
      console.error("Error parsing JSON", error);
      setCadenceError("Error with cadence input. Please try again.");
      setCheckingCadence(false);
    }
    setCheckingCadence(false);
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
              <div className="text-sm font-medium overflow-hidden line-clamp-1">
                {item.title}
              </div>
              <div className="text-xs mt-1 text-gray-500 line-clamp-3 overflow-hidden">
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
        <form className="flex flex-col gap-4">
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
          {/* {cadenceCron && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-600 text-sm font-medium block">
                Cron
              </span>
              <code className="bg-gray-100 p-2 rounded-md">{cadenceCron}</code>
            </div>
          )} */}
          {cadenceError && (
            <div className="flex flex-row gap-2 items-center justify-center w-full border border-red-400 rounded p-2">
              <div className="text-red-500 text-sm">{cadenceError}</div>
            </div>
          )}
          <Button
            variant="default"
            size="lg"
            type="submit"
            disabled={checkingCadence || (cadenceInput === "")}
            onClick={onSchedule}
          >
            Schedule pod
            {checkingCadence && (
              <Loader className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </>
    );
  }

  if (step === "confirm") {
    return (
      <>
        <div className="text-xl font-bold">Confirm your pod</div>
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium text-gray-600">
            {sourceUrl}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {cadenceCron}
          </div>
        </div>
        <Button variant="default" size="lg" asChild>
          <Link href="/create">Looks good!</Link>
        </Button>
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
