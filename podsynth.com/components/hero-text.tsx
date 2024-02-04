'use client';

import { useState, useEffect } from "react";

const activities = [
  "brushing your teeth",
  "doing the dishes",
  "folding laundry",
  "making breakfast",
  "driving to work",
  "taking a shower",
  "walking the dog",
  "doing your makeup",
  "making dinner",
  "working out",
  "waiting in line",
  "sitting in traffic",
];

const topics = [
  "business",
  "technology",
  "science",
  "agriculture",
  "history",
  "true crime",
  "comedy",
  "news",
  "sports",
  "health",
  "education",
  "music",
  "entertainment",
];

export default function HeroText() {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prevIndex) =>
        prevIndex === activities.length - 1 ? 0 : prevIndex + 1
      );
      setCurrentTopicIndex((prevIndex) =>
        prevIndex === topics.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className={`sm:text-3xl text-2xl font-bold flex-1 w-full transition-all duration-500 sm:leading-10 leading-8`}>
      Catch up with{" "}
      <span className="text-gray-500">{topics[currentTopicIndex]}</span>
      <br /> 
      while{" "}
      <span className="text-gray-500">{activities[currentActivityIndex]}</span>
    </h1>
  );
}