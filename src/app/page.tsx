"use client"

import { useState, useEffect, Suspense } from "react";

import { Button, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconMusic, IconMusicOff, IconPlaylistAdd } from '@tabler/icons-react';
import GeneratePlaylistForm from "@/app/components/GeneratePlaylist";
import ListTracks from "./components/ListTracks";

// Separate component to handle search params
const AccessTokenHandler = ({ clientID }: { clientID: string }) => {
  const params = useSearchParams();
  const router = useRouter();
  const [hasAccessToken, setHasAccessToken] = useState(true);

  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = localStorage.getItem('spotifyAccessToken');
      setHasAccessToken(!!accessToken);
      const code = params.get('code');
      if (code && !accessToken) {
        setHasAccessToken(false);
        const tokenResponse = await fetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const token = await tokenResponse.json();
        if (token.access_token) {
          localStorage.setItem('spotifyAccessToken', token.access_token);
          localStorage.setItem('spotifyRefreshToken', token.refresh_token);
          localStorage.setItem('spotifyExpiresIn', token.expires_in);
          router.push('/');
        }
      }
    };

    getAccessToken();
  }, [params, router]);

  return (
    <>
      {!hasAccessToken &&
        <Button
          onPress={() => router.push(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:3000&scope=playlist-modify-private`)}
          className="w-full max-w-md mb-10 mx-auto block"
        >
          Authorize Spotify
        </Button>
      }
    </>

  )
};


export default function Home() {

  const [tracksJson, setTracksJson] = useState<string>("[]");
  const [playlistName, setPlaylistName] = useState<string>("");

  const router = useRouter();
  const clientID = process.env.spotify_client;


  /* Refresh Token before Submit */
  const refreshToken = async () => {
    const refreshResponse = await fetch('/api/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: localStorage.getItem('spotifyRefreshToken'), client_id: clientID }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const newTokenData = await refreshResponse.json();
    localStorage.setItem('spotifyAccessToken', newTokenData.access_token);
    console.log(newTokenData.access_token);
    return newTokenData.access_token;
  };

  /* Get Tracks */
  const handleReturnTracks = (tracksJson: string) => {
    setTracksJson(tracksJson);
  }

  /* Submit Playlist to Spotify */

  const submitPlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let accessToken = localStorage.getItem('spotifyAccessToken');
    const expiryTime = localStorage.getItem('spotifyTokenExpiryTime');

    // Check if the token is expired and refresh if necessary
    if (!accessToken || new Date().getTime() > parseInt(expiryTime || '0')) {
      accessToken = await refreshToken();
    }

    const response = await fetch('/api/create', {
      method: 'POST',
      body: JSON.stringify({ tracksJson, token: accessToken, playlistName }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }


  return (
    <Suspense fallback={<div>Loading...</div>}>

      <AccessTokenHandler
        clientID={clientID || ''}
      />

      <main className="flex flex-col items-flex-start justify-between p-5 my-10 w-full max-w-5xl mx-auto">


        <h1 className="text-2xl font-bold mb-10 text-center">What do you want to listen to?</h1>

        <div className="w-full border-2 border-[#ccc] rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-10 ">

            <div>
              <GeneratePlaylistForm
                handleReturnTracks={handleReturnTracks}
              />
            </div>

            <div className="generated-playlists flex">

              <div className="text-center m-auto w-full">
                {JSON.parse(tracksJson).length === 0 ?
                  <div>
                    <IconMusicOff className="mx-auto my-5 block" size={48} />
                    <p className="text-sm italic">No tracks generated yet. Spin up something good.</p>
                  </div>
                  :
                  <div>
                    <IconMusic className="mx-auto my-5 block" size={48} />
                    <h3 className="text-xl font-bold mb-0 text-center text-secondary">Tracklist:</h3>
                    <ListTracks tracksJson={tracksJson} />
                  </div>
                }
              </div>

            </div>
          </div>
          {JSON.parse(tracksJson).length > 0 &&
            <div className="mt-10 mb-10">
              <h3 className="text-xl font-bold mb-5 text-center text-secondary">Nice. Now add to your Spotify...</h3>
              <form onSubmit={submitPlaylist} className="w-full max-w-2xl mx-auto grid gap-5">
                <Input
                  id="playlistName"
                  name="playlistName"
                  type="text"
                  value={playlistName}
                  placeholder="Enter the name of your playlist..."
                  isRequired
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
                <Button
                  color="secondary"
                  type="submit"
                  endContent={<IconPlaylistAdd />}
                >Add Playlist</Button>
              </form>
            </div>
          }
        </div>

      </main>
    </Suspense>
  );
}
