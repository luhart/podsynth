import { parseRssSource } from "@/utils/utility-blocks";

export type ResultType = { executionTime: number; output: string | null; error: string | null, status: string | null };

export async function rssUtilityBlockFunction(
  source: string,
  numItems: number,
): Promise<ResultType> {
  if (numItems < 1) {
    return {
      error: "Error in Parse RSS Utility: numItems must be greater than 0",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }
  if (numItems > 10) {
    return {
      error: "Error in Parse RSS Utility: numItems 10 or less.",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }
  const start = performance.now();
  const rssResult = await parseRssSource(source, numItems);
  const end = performance.now();
  return {
    error: null,
    output: rssResult,
    status: "complete",
    executionTime: end - start,
  };
}
