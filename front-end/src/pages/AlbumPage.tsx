import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

interface Artist {
  name: string;
  id: string;
  genres: string[];
  image: Image[];
}

interface Track {
  name: string;
  id: string;
  duration_ms: number;
  track_number: number;
}

interface Album {
  id: string;
  name: string;
  images: Image[];
  tracks: {
    items: Track[];
  };
}

interface Image {
  url: string;
}

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the artist ID from the URL
  const [artist, setArtist] = useState<Artist | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const getAlbum = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/Sparktify/albums/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok)
          throw new Error(`Error fetching album: ${response.statusText}`);
        const data: Album = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album data:", error);
      }
    };

    if (id) {
      getAlbum();
    }
  }, [id]);

  // Function to convert milliseconds to minutes:seconds format
  const formatDuration = (durationMs: number) => {
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Limit to the top x tracks
  //const topTracks = tracks.slice(0, 5);
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "5px" }}>{album?.name}</h1>
      <div>
        <img
          src={album?.images[0].url}
          alt={album?.name}
          style={{ width: "300px", height: "300px" }}
        />
      </div>
      <h2 style={{ textAlign: "center", marginTop: "5px" }}>Album Songs</h2>
      <table
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: "5px",
          border: "solid",
          borderBottomColor: "white",
        }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Song Name</th>
            <th>Song Length</th>
          </tr>
        </thead>
        <tbody>
          {album?.tracks?.items?.length ? (
            album.tracks.items.map((track, index) => (
              <tr key={track.id}>
                <td>{index + 1}</td>
                <td>{track.name}</td>
                <td>{formatDuration(track.duration_ms)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No tracks available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlbumPage;
