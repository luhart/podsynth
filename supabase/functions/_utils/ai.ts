import OpenAI from "https://deno.land/x/openai@v4.26.0/mod.ts";


const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
  },
  // dangerouslyAllowBrowser: true,
})

// [INST][/INST]
// Instruct model fine-tuned by Mistral. If you send raw prompts, you should use [INST] and [/INST] tokens. Otherwise, with chat messages, the prompt will be formatted automatically for you.

export async function createSummary(text: string) {
  console.log("createSummary", text);
  const completion = await openai.chat.completions.create({
    model: "mistralai/mixtral-8x7b-instruct",
    messages: [
      {
        role: "system",
        content: "You are a writter for the news. You create readable scripts that will be read by Greg live on his technology segment."
      },
      { role: "user", content: text }
      
    ],
  })
  console.log("full completion", completion);
  console.log("completion.choices[0].message", completion.choices[0].message);
  return completion.choices[0].message.content
}
