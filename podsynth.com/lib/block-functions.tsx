import { Item } from "@/utils/rss";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export type ResultType = {
  executionTime: number;
  output: string | null;
  error: string | null;
  status: string | null;
};

export async function rssUtilityBlockFunction(
  source: string,
  numItems: number
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
  // check if the source is a valid URL
  try {
    const start = performance.now();
    const rssResult = await parseRssSource(source, numItems);
    const end = performance.now();

    if (!rssResult || rssResult.length === 0) {
      return {
        error: "Error parsing the source. Please check the URL and try again.",
        output: null,
        status: "error",
        executionTime: 0,
      };
    }

    return {
      error: null,
      output: rssResult,
      status: "complete",
      executionTime: end - start,
    };
  } catch (e) {
    return {
      error: "Error parsing the source. Please check the URL and try again.",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }
}

const MAX_CHARS_PARSED = 3500;
export async function parseRssSource(sourceUrl: string, numItems: number) {
  const res = await fetch("api/rss-fetch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source: sourceUrl, numItems: numItems }),
  });

  const data: Item[] = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Error fetching RSS feed");
  }

  const parsedData = data.reduce<string>((accumulator, currentItem) => {
    const currentItemTitle = currentItem.title || "";
    const potentialLength =
      accumulator.length +
      currentItemTitle.length +
      currentItem.description.length +
      1; // add one for line break
    if (potentialLength > MAX_CHARS_PARSED) return accumulator; // don't include current item if it would push us over the limit

    return accumulator + `${currentItem.title}: ${currentItem.description}\n`;
  }, "");

  return parsedData;
}

export async function createSummary(
  messages: ChatCompletionMessageParam[],
  model: string,
  OPENROUTER_API_KEY: string | undefined,
  blockId: number,
  updateBlockResult: (id: number, result: ResultType) => void
): Promise<ResultType> {
  if (!OPENROUTER_API_KEY) {
    return {
      error: "Error in Create Summary: No OpenRouter API Key",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
    defaultHeaders: {},
    dangerouslyAllowBrowser: true,
  });

  const start = performance.now();
  let result = "";

  const stream = await openai.chat.completions.create({
    model: model,
    messages: messages,
    stream: true,
  });
  for await (const part of stream) {
    result += part.choices[0]?.delta?.content || "";
    updateBlockResult(blockId, {
      output: result,
      status: "running",
      error: null,
      executionTime: performance.now() - start,
    });
  }
  const end = performance.now();

  if (!result) {
    return {
      error: "Error in Create Summary: No result returned",
      output: null,
      status: "error",
      executionTime: end - start,
    };
  }

  return {
    error: null,
    output: result,
    status: "complete",
    executionTime: end - start,
  };
  // if result starts with '\n' remove it
  // replace all instances of '\n\n' with ' <break time="1.0s" /> '
  // return result.replace(/^\n/, "").replace(/\n\n/g, ' <break time="1.0s" /> ');
}

const ELEVEN_LABS_URL = "https://api.elevenlabs.io/v1/text-to-speech/";

export async function createAudio(
  text: string,
  voiceId: string,
  ELEVENLABS_API_KEY: string | undefined,
  blockId: number,
  updateBlockResult: (id: number, result: ResultType) => void
): Promise<ResultType> {
  if (!ELEVENLABS_API_KEY) {
    return {
      error: "Error creating audio: Missing ElevenLabs API Key",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }

  if (!text) {
    return {
      error: "Error creating audio: No text input provided",
      output: null,
      status: "error",
      executionTime: 0,
    };
  }

  const headers = {
    "Content-Type": "application/json",
    "xi-api-key": ELEVENLABS_API_KEY,
  };

  const body = {
    model_id: "eleven_multilingual_v2",
    text: text,
    voice_settings: {
      similarity_boost: 0.75,
      stability: 0.5,
    },
  };

  const start = performance.now();
  const response = await fetch(`${ELEVEN_LABS_URL}${voiceId}`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error creating audio: ${response.statusText}`);
  }

  const blob = await response.blob();
  const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });

  const end = performance.now();

  const audioUrl = URL.createObjectURL(file);
  if (!audioUrl) {
    return {
      error: "Error in Create Audio: No audio returned",
      output: null,
      status: "error",
      executionTime: end - start,
    };
  }

  return {
    error: null,
    output: audioUrl,
    status: "complete",
    executionTime: end - start,
  };
}
