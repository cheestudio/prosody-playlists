import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";


// Separate component to handle search params
const AccessTokenHandler = ({ clientID, tokenExists, setTokenExists }: { clientID: string, tokenExists: boolean, setTokenExists: (value: boolean) => void }) => {
  const params = useSearchParams();
  const router = useRouter();
  const [hasAccessToken, setHasAccessToken] = useState(true);

  useEffect(() => {
    const getAccessToken = async () => {
      console.log('getAccessToken');
      const accessToken = localStorage.getItem('spotifyAccessToken');
      console.log('accessToken', accessToken);
      setHasAccessToken(!!accessToken);
      const code = params.get('code');
      if (code && !accessToken) {
        console.log('has code but no accessToken');
        setHasAccessToken(false);
        const tokenResponse = await fetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const token = await tokenResponse.json();
        console.log('token', token);
        if (token.access_token) {
          console.log('setting accessToken');
          localStorage.setItem('spotifyAccessToken', token.access_token);
          localStorage.setItem('spotifyRefreshToken', token.refresh_token);
          localStorage.setItem('spotifyExpiresIn', token.expires_in);
          setTokenExists(true);
          setHasAccessToken(true);
        }
      }
    };

    getAccessToken();
  }, [params, router]);

  return (
    <>
      {!hasAccessToken &&
        <div className="pt-5 px-10">
          <h3 className="text-center mb-3">First things first...</h3>
          <Button
            onPress={() => router.push(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=playlist-modify-private`)}
            className="w-full max-w-md mb-10 mx-auto block"
          >
            Connect Your Spotify
          </Button>
        </div>
      }
    </>

  )
};

export default AccessTokenHandler;


