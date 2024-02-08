"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

export default function NewPod() {
  const [source, setSource] = useState<string>("");
  // const [cadence, setCadence] = useState<string>("");

  return (
    <div className="flex flex-col justify-start w-full gap-4">
      <label htmlFor="source" className="flex flex-col gap-1">
        <span className="text-gray-600 text-sm font-medium block">
          Feed source (RSS only for now)
        </span>
        <Input
          id="source"
          name="source"
          type="url"
          value={source}
          onChange={(e) => {
            e.preventDefault();
            setSource(e.target.value);
          }}
          placeholder="https://www.techmeme.com/feed.xml"
          required
        />
      </label>
      {/* <label htmlFor="cadence" className="flex flex-col gap-1">
        <span className="text-gray-600 text-sm font-medium block">Cadence</span>
        <Input
          id="cadence"
          name="cadence"
          type="text"
          placeholder="Weekdays at 9am"
          value={cadence}
          onChange={(e) => {
            e.preventDefault()
            setCadence(e.target.value)
          }}
          required
        />
      </label> */}
      {/* <label htmlFor="public" className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm font-medium block">Public</span>
          <Input
            id="public"
            name="public"
            type="checkbox"
            required
          />
        </label> */}

      <Button variant="default" className="mt-2" asChild>
        <Link href={`/create/${encodeURIComponent(source)}`}>Parse RSS</Link>
      </Button>
    </div>
  );
}
