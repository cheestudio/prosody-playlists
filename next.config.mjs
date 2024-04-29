/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    spotify_client: process.env.SPOTIFY_CLIENT_ID,
  },
};

export default nextConfig;
