import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; 

export async function POST(req: Request, res: Response) {

  const {code} = await req.json();

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
    },
    body: querystring.stringify({
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    })
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await response.json();
    console.log('initial auth', data);
    return new Response(JSON.stringify(data));
  } catch (error) {
    return new Response(JSON.stringify('error'), { status: 500 });
  }
}