"use client";

import { Button } from "./ui/button";
import { Play, Square } from "lucide-react";
import { useState } from "react";
import useSound from "use-sound";

type Sample = {
  name: string;
  url: string;
};

interface SamplesProps {
  samples: string[];
}

export function Samples({ samples }: { samples: Sample[] }) {
  return (
    <div className="flex flex-row gap-2 justify-start items-center flex-wrap">
      {samples.map((sample, index) => (
        <SampleItem sample={sample} key={index} />
      ))}
    </div>
  );
}

function SampleItem({ sample }: { sample: Sample }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { stop }] = useSound(sample.url, {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  });

  return (
    <Button variant={"outline"} onClick={() => {
      if (!isPlaying) {
        play();
      } else {
        stop();
        setIsPlaying(false);
      }
    }}>
      {isPlaying ? (
        <Square className="h-4 w-4 mr-2" strokeWidth={0} fill="rgb(156 163 175)" />
      ) : (
        <Play className="w-4 h-4 mr-2" strokeWidth={0} fill="rgb(156 163 175)"/>
      )}
      {sample.name}
    </Button>
  );
}
