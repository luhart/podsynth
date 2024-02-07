import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Pods() {
  return (
    <div className="max-w-2xl w-full border border-t-0 min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-start max-w-xl w-full sm:px-4 px-8 gap-4 pt-12">
        <div className="flex flex-row gap-2 items-center justify-start">
          <div className="text-xl font-bold">Pods</div>
          <Button variant="secondary" asChild>
            <Link href="/create" className="flex flex-row gap-1 items-center">
              Create new
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
