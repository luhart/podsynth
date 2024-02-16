import OpenAI from "openai";
import { parseRssFeed } from "./rss";

const MAX_CHARS_PARSED = 3500;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
  },
  // dangerouslyAllowBrowser: true,
})

const ELEVEN_LABS_URL = "https://api.elevenlabs.io/v1/text-to-speech/";

// const VOICE_ID = "29vD33N1CtxCmqQRPOHJ"; // Drew
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah
const ELEVEN_LABS_KEY = process.env.ELEVEN_LABS_KEY;

// takes in rss feed url and returns a string which will be used to create a summary
export async function parseSource(sourceUrl: string) {
  const numItems = 10;
  const data = await parseRssFeed(sourceUrl, numItems);

  const parsedData = data.reduce<string>((accumulator, currentItem) => {
    const currentItemTitle = currentItem.title || "";
    const potentialLength = accumulator.length + currentItemTitle.length + currentItem.description.length + 1; // add one for line break
    if (potentialLength > MAX_CHARS_PARSED) return accumulator; // don't include current item if it would push us over the limit

    return accumulator + `${currentItem.title}: ${currentItem.description}\n`;
  }, "");

  return parsedData;
}

// [INST][/INST]
// Instruct model fine-tuned by Mistral. If you send raw prompts, you should use [INST] and [/INST] tokens. Otherwise, with chat messages, the prompt will be formatted automatically for you.
export async function createSummary(text: string) {
  const completion = await openai.chat.completions.create({
    model: "mistralai/mixtral-8x7b-instruct",
    messages: [
      {
        role: "system",
        content: "You are a writter for the news. You create readable scripts for a news programs called 'pods'. These pods are radio segments that will be read aloud by Sarah on her radio segment. Do not include emojis or special characters. Skip items that aren't newsworthy. Add a signoff for Sarah at the end of the script."
      },
      { role: "user", content: "Create a script for me from the following: " + text}
    ],
  })
  const result = completion.choices[0].message.content;
  if (!result) {
    throw new Error("Error creating summary");
  }
  
  // if result starts with '\n' remove it
  // replace all instances of '\n\n' with ' <break time="1.0s" /> '
  return result.replace(/^\n/, "").replace(/\n\n/g, ' <break time="1.0s" /> ');
}


export const createAudio = async (text: string | null) => {
  if (!ELEVEN_LABS_KEY) {
    throw new Error("elevan labs key is missing");
  } 

  if (!text) {
    throw new Error("text is missing");
  }

  const headers = {
    'Content-Type': 'application/json',
    'xi-api-key': ELEVEN_LABS_KEY,
  };
  const data = {
    model_id: 'eleven_multilingual_v2',
    text: text,
    voice_settings: {
      similarity_boost: 0.75,
      stability: 0.5
    }
  };

  const res = await fetch(`${ELEVEN_LABS_URL}${VOICE_ID}`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error generating audio");
  }

  // Headers {
  //   "access-control-allow-headers": "*",
  //   "access-control-allow-methods": "POST, OPTIONS, DELETE, GET, PUT",
  //   "access-control-allow-origin": "*",
  //   "access-control-expose-headers": "request-id, history-item-id, tts-latency-ms",
  //   "access-control-max-age": "600",
  //   "alt-svc": 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
  //   "content-length": "24241",
  //   "content-type": "audio/mpeg",
  //   date: "Sun, 04 Feb 2024 01:50:48 GMT",
  //   "history-item-id": "NsBYdXptBNxQRzzjWSNa",
  //   "request-id": "gIRsJ7vx9RrwAOUgmcai",
  //   server: "uvicorn",
  //   "tts-latency-ms": "1148",
  //   via: "1.1 google"
  // }

  // return history-item-id, request-id, and date

  
  // const audioData = await res.arrayBuffer();
  // const audioBlob = new Blob([audioData], { type: "audio/mpeg" });

  return {
    historyItemId: res.headers.get("history-item-id"),
    requestId: res.headers.get("request-id"),
  };
};