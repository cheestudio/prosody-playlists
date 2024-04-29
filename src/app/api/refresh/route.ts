import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function POST(req: Request, res: Response) {

  const { refreshToken, clientId } = await req.json();

  const authOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: client_id,
      client_secret: client_secret
    })
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await response.json();
    return new Response(JSON.stringify(data));
  } catch (error) {
    return new Response(JSON.stringify('error'), { status: 500 });
  }
}