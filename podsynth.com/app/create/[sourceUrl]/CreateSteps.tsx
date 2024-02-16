"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Item } from "./types";
import { Loader } from "lucide-react";
import { isValidCron } from "@/utils/helpers";
import { createPod } from "@/utils/create-pod";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

interface CreateStepsProps {
  sourceUrl: string;
  previewItems: Item[];
}

type Step = "check" | "schedule"

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function CreateSteps({
  sourceUrl,
  previewItems,
}: CreateStepsProps) {
  const [step, setStep] = useState<Step>("check");
  const [cadenceInput, setCadenceInput] = useState<string>("");
  const [creatingPod, setCreatingPod] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const router = useRouter()
  

  const podName =
    sourceUrl
      .split("/")[2]
      .split(".")
      .slice(0, -1)
      .join("")
      .replace("www", "") || "";

  async function onSchedule() {
    setCreatingPod(true);
    setErrorMsg("");
    const response = await fetch("/api/human-to-cron", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cadence: cadenceInput,
      }),
    });

    const dataText = await response.text();

    try {
      const data = JSON.parse(dataText);
      if (data.pass === true) {
        // createPod(sourceUrl, cadenceCron);
        const cron = data.cron;
        const cronIsValid = isValidCron(cron);
        if (!cronIsValid) {
          setErrorMsg("Invalid cadence input. Please try again.");
          setCreatingPod(false);
          return;
        }
        const res = await createPod({ cadenceInput: cadenceInput, sourceUrl: sourceUrl, cron: cron, timeZone: timeZone, title: podName });
        // redirect to /
        revalidatePath("/");
        router.push("/");
        setCreatingPod(false);
      } else {
        setErrorMsg(data.error);
        setErrorMsg(data.message);
        setCreatingPod(false);
      }
    } catch (error) {
      console.error("Error creating pod", error);
      setErrorMsg(`Error creating pod: ${error}`);
      setCreatingPod(false);
    }
    setCreatingPod(false);
  }

  if (step === "check") {
    return (
      <>
        <div>
          <div className="text-sm font-medium mb-1 text-gray-500">
            {podName}
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
        <div>
          <div className="text-sm font-medium mb-1 text-gray-500">
            {podName}
          </div>
          <div className="text-xl font-bold">Schedule and create pod</div>
        </div>

        <form className="flex flex-col gap-4">
          <label htmlFor="cadence" className="flex flex-col gap-1">
            <span className="text-gray-600 text-sm font-medium block">
              Cadence<span className="text-gray-600 align-top">*</span>{" "}
              <span className="text-xs">(1 per day limit)</span>
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
          {errorMsg && (
            <div className="flex flex-row gap-2 items-center justify-center w-full border border-red-400 rounded p-2">
              <div className="text-red-500 text-sm">{errorMsg}</div>
            </div>
          )}
          <Button
            variant="default"
            size="lg"
            type="submit"
            disabled={creatingPod || cadenceInput === ""}
            onClick={onSchedule}
          >
            Schedule and create
            {creatingPod && <Loader className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
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
