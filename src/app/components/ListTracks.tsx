const ListTracks = ({ tracksJson }: { tracksJson: string }) => {

  const parseTracks = (tracksJson: string) => {
    try {
      return JSON.parse(tracksJson);
    } catch (error) {
      console.error("Failed to parse tracks JSON:", error);
      return [];
    }
  };

  const tracks = parseTracks(tracksJson);

  return (
    <ol className="text-left list-decimal m-5 text-sm border-2 border-black/50 rounded-lg p-2 list-inside">
      {tracks.map((track: { id: string; artist: string; song: string }) => (
        <li className="even:bg-[#ccc]/30 p-2 rounded-lg" key={track.id}>{`${track.artist} - ${track.song}`}</li>
      ))}
    </ol>
  )
}

export default ListTracks;

