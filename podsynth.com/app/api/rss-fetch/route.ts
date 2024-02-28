import { parseRssFeed } from '../../../utils/rss';

export interface RequestBody {
  source: string;
  numItems: number;
}

export async function POST(request: Request) {
  const { source, numItems } = (await request.json()) as RequestBody;
  if (!source) {
    return new Response("Missing source", {
      status: 400,
    });
  }
  if (!numItems) {
    return new Response("Missing numItems", {
      status: 400,
    });
  }

  try {
    const data = await parseRssFeed(source, numItems);
    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
      }, 
    });
  } catch (error) {
    return new Response("Error getting rss", {
      status: 500,
    });
  }
}
