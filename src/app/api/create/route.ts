import OpenAI from "openai";

export async function POST(request: Request): Promise<Response> {
  const { playlistName, tracksJson, token } = await request.json();

  const spotifyAccessToken = token;
  console.log('spotifyAccessToken', spotifyAccessToken);
  if (!spotifyAccessToken) {
    console.error('Spotify access token is not set.');
    return new Response('Spotify access token is not set.', { status: 500 });
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const userResponse = await fetch(`https://api.spotify.com/v1/me `, {
    method: 'GET',
    headers: headers,
  });
  const userData = await userResponse.json();
  const userId = userData?.id;
  console.log('userId', userId);

  // Create a new playlist
  // const userId = process.env.SPOTIFY_USERID;
  const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name: playlistName,
      description: 'Generated playlist',
      public: false
    }),
    headers: headers,
  });

  if (!playlistResponse.ok) {
    console.error('Failed to create playlist',playlistResponse.status);
    return new Response('Failed to create playlist', { status: playlistResponse.status });
  }

  const { id: playlistId } = await playlistResponse.json();

  // Search and collect track URIs
  
  const tracks = JSON.parse(`${tracksJson}`);
  const trackUris = await Promise.all(tracks.map(async (track: any) => {
    console.log(track);
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${track.artist}+${track.song}&type=track&limit=1`, {
      headers: headers
    });
    const searchData = await searchResponse.json();
    console.log(searchData.tracks.items);
    return searchData.tracks.items[0].uri; 
  }));

  // Add tracks to the playlist
  const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      uris: trackUris
    })
  });

  if (!tracksResponse.ok) {
    console.error('Failed to add tracks to playlist');
    return new Response('Failed to add tracks to playlist', { status: tracksResponse.status });
  }

  return new Response(JSON.stringify({ message: 'Playlist created successfully', playlistId }), { status: 200 });
}