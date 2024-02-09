import { OpenAI } from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  // dangerouslyAllowBrowser: true,
});

export async function POST(request: Request) {
  const r = await request.json();
  const { cadence } = r;

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
          "You are a cron translator. You create cron expressions from human input that will be used to schedule tasks. You must take the human input and convert it to its cron expression. If you can't convert it, you must return an error message. Return an error if the cron is more than once a day saying 'Can't schedule more than once per day'.",
      },
      {
        role: "user",
        content: `<|CADENCE|>\n\n\n${cadence}\n\n\n<|ENDCADENCE|>`,
      },
      {
        role: "system",
        content: `Respond in json this type.
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

  console.log(completion.choices[0].message);
  return new Response(completion.choices[0].message.content, { status: 200 });
}
