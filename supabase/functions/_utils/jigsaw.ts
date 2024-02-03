const JIGSAWSTACK_URL = "https://api.jigsawstack.com/v1";
const apiKey = Deno.env.get("JIGSAWSTACK_KEY");

export const fetchJigsawStack = async (path: string, body: any) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey!,
  };

  const res = await fetch(`${JIGSAWSTACK_URL}${path}`, {
    headers,
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorObj = await res.json();
    throw new Error(errorObj?.message || "Something went wrong");
  }

  return res.json();
};