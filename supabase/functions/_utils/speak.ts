const ELEVEN_LABS_URL = "https://api.elevenlabs.io/v1/text-to-speech/";
const VOICE_ID = "29vD33N1CtxCmqQRPOHJ";
const ELEVEN_LABS_KEY = Deno.env.get("ELEVEN_LABS_KEY");

export const createSpeach = async (text: string) => {
  if (!ELEVEN_LABS_KEY) {
    throw new Error("elevan labs key is missing");
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
  return {
    historyItemId: res.headers.get("history-item-id"),
    requestId: res.headers.get("request-id"),
  };
};