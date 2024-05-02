import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request): Promise<Response> {

  const claudeKey = process.env.CLAUDE_API_KEY;
  if (!claudeKey) {
    console.error('OpenAI API key is not set.');
    return new Response('OpenAI API key is not set.', { status: 500 });
  }
  const claude = new Anthropic({
    apiKey: claudeKey,
  }); 

  const {playlistRequest, trackCount} = await request.json();

  console.log(playlistRequest);

  const response = await claude.messages.create({
    model: "claude-3-opus-20240229",
    system: `You are a musical playlist generator. You will generate a playlist of ${trackCount} based on the user's input and requests, paying close attention to their mood, intentions, activity and genre preferences. Do not include any descriptions or comments, ONLY a list of artists and song title. Return the list as an array of objects: [{"artist": "artist", "song": "song"},{"artist": "artist", "song": "song"}]`,
    messages: [
      {
        "role": "user",
        "content": playlistRequest
      }
    ],
    temperature: 1,
    max_tokens: 3000,
  });
  const choiceText = response.content || "No response";
  console.log(choiceText[0].text);
  return new Response(JSON.stringify(choiceText[0].text)); 
}

