import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "podsynth-v1-E7mO",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
