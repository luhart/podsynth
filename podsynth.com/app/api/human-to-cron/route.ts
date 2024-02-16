import { OpenAI } from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  // dangerouslyAllowBrowser: true,
});

export interface RequestBody {
  cadence: string;
}

function isParseableJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

type ResponseType =
  | {
      pass: true;
      cron: string;
    }
  | {
      pass: false;
      message: string;
    };

export async function POST(request: Request) {
  const { cadence } = (await request.json()) as RequestBody;

  if (!cadence) {
    return new Response("Missing cadence", { status: 400 });
  }

  // convert human cadence input to cron
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content:
          "You are a cron translator. You create cron expressions from human input that will be used to schedule tasks. You must take the human input and convert it to its cron expression. If you can't convert it, you must return an error message. Return an error if the cron is more than once per day saying 'Can't schedule more than once per day'.",
      },
      {
        role: "user",
        content: `<|CADENCE|>\n\n\n${cadence}\n\n\n<|ENDCADENCE|>`,
      },
      {
        role: "system",
        content: `Respond with no backtick formatting, only in parseable json with type:
  type Response = {
  pass: true;
  cron: string;
  } | {
  pass: false;
  message: string;
  }
        `,
      },
    ],
  });

  const result = completion.choices[0].message?.content?.trim() || "";

  if (!result) throw new Error("No result from OpenAI");

  const response = JSON.parse(result) as ResponseType;

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
