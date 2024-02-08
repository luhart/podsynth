import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <>
      <div className="text-xl font-bold">Parsing source..</div>
      <div className="flex flex-col items-center justify-start w-full gap-3">
        <LoadingItem />
        <LoadingItem />
        <LoadingItem />
      </div>
    </>
  );
}

const LoadingItem = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-2 border rounded-md px-2 py-3">
      <Skeleton className="h-4 w-8/12" />
      <Skeleton className="h-4 w-10/12" />
    </div>
  );
}