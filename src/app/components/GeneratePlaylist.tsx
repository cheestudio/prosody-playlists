"use client";

import { useState } from "react";
import { Button, RadioGroup, Radio, Input, Spinner, Textarea } from "@nextui-org/react";
import { IconWand } from '@tabler/icons-react';

const GeneratePlaylistForm = ({ handleReturnTracks }: { handleReturnTracks: (tracksJson: any) => void }) => {

  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("claude");

  const generatePlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const playlistRequest = formData.get('playlistRequest') as string;
    const trackCount = formData.get('track-count') || "10" as string;
    const response = await fetch(`/api/generate-gpt`, {
      method: 'POST',
      body: JSON.stringify({ playlistRequest, trackCount }),
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
    <form onSubmit={generatePlaylist} className="w-full max-w-2xl mx-auto grid gap-4">
      {/* <RadioGroup
        label="Choose Model"
        orientation="horizontal"
        color="secondary"
        value={selectedModel}
        onValueChange={setSelectedModel}
      >
        <Radio value="claude">Claude</Radio>
        <Radio value="gpt">GPT</Radio>
      </RadioGroup> */}
      {/* <p className="text-sm text-gray-500 italic mb-5">Claude gives more creative responses, GPT is faster.</p> */}
      <Input
        id="track-count"
        name="track-count"
        type="number"
        placeholder="Enter the number of tracks (default is 10)..."
      />
      <Textarea
        id="playlistRequest"
        name="playlistRequest"
        type="text"
        isRequired
        placeholder="Describe the vibe you're going for. For example: 'jazzy hip hop good for a house party, avoid mainstream tracks'."
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