"use client";

import { useState } from "react";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import { IconWand } from '@tabler/icons-react';

const GeneratePlaylistForm = ({handleReturnTracks}: {handleReturnTracks: (tracksJson: any) => void}) => {

  const [loading, setLoading] = useState(false);

  const generatePlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const playlistRequest = formData.get('playlistRequest') as string;
    console.log(playlistRequest);
    const response = await fetch('/api/generate-claude', {
      method: 'POST',
      body: JSON.stringify({ playlistRequest }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    console.log(JSON.stringify(data));
    setLoading(false);
    handleReturnTracks(data);
  }

  return (
    <form onSubmit={generatePlaylist} className="w-full max-w-2xl mx-auto grid gap-5">
      <Textarea
        id="playlistRequest"
        name="playlistRequest"
        type="text"
        isRequired
        placeholder="Enter the type of playlist you want to generate..."
      />
      <Button
        color="primary"
        isLoading={loading}
        type="submit"
        endContent={<IconWand />}
      >
        {loading ? "Making beautiful music together..." : "Generate"}
      </Button>

    </form>
  )
}

export default GeneratePlaylistForm;