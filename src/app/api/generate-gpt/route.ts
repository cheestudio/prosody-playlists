import OpenAI from "openai";

export async function POST(request: Request): Promise<Response> {

  const openaiApiKey = process.env.OPENAI_KEY;
  if (!openaiApiKey) {
    console.error('OpenAI API key is not set.');
    return new Response('OpenAI API key is not set.', { status: 500 });
  }
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  });

  const {playlistRequest, trackCount} = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        "role": "system",
        "content": `You are a musical playlist generator. You will generate a playlist of ${trackCount} based on the user's input and requests, paying close attention to their mood, intentions, activity and genre preferences. Do not include any descriptions or comments, ONLY a list of artists and song title. Return the list as an array of objects: [{"artist": "artist", "song": "song"},{"artist": "artist", "song": "song"}]`
      },
      {
        "role": "user",
        "content": playlistRequest
      }
    ],
    temperature: 0.95,
    max_tokens: 1000,
  });
  const choiceText = response.choices[0].message.content || "No response";
  return new Response(JSON.stringify(choiceText)); 
}

