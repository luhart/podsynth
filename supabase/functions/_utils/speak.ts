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
    const errorObj = await res.json();
    console.error("Error response from ElevenLabs", errorObj);
    throw new Error(errorObj?.message || "Error generating audio");
  }

  return res.json();
};