"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  // destination should be previous page
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <Button
      size="sm"
      variant={"outline"}
      className="flex flex-row gap-1 items-center"
      onClick={goBack}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
}
