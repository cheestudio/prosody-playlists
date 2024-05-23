import OpenAI from "openai";

export const config = {
  maxDuration: 30,
};

export async function POST(request: Request): Promise<Response> {
  const openaiApiKey = process.env.OPENAI_KEY;
  if (!openaiApiKey) {
    console.error('OpenAI API key is not set.');
    return new Response('OpenAI API key is not set.', { status: 500 });
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    console.error('Invalid JSON in request body:', error);
    return new Response('Invalid JSON in request body.', { status: 400 });
  }

  const { playlistRequest, trackCount } = requestBody;
  if (!playlistRequest || !trackCount) {
    console.error('Missing required fields: playlistRequest or trackCount.');
    return new Response('Missing required fields: playlistRequest or trackCount.', { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a musical playlist generator. You will generate a playlist of ${trackCount} based on the user's input and requests, paying close attention to their mood, intentions, activity and genre preferences. When possible, avoid mainstream artists and mainstream tracks. Do not include any descriptions or comments, ONLY a list of artists and song title. Return the list as an array of objects: [{"artist": "artist", "song": "song"},{"artist": "artist", "song": "song"}]`
        },
        {
          role: "user",
          content: playlistRequest
        }
      ],
      temperature: 0.95,
      max_tokens: 3000,
    });

    const choiceText = response.choices[0]?.message?.content || "No response";
    return new Response(JSON.stringify(choiceText), { status: 200 });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return new Response('Error generating playlist.', { status: 500 });
  }
}