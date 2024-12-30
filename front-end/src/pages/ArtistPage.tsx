import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Artist {
  name: string;
  id: string;
  genres: string[];
}

interface Track {
  name: string;
  id: string;
  duration_ms: string;
  album: Album;
}

interface Album {
  images: Image[];
}

interface Image {
  url: string;
}

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the artist ID from the URL
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const getArtist = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/Sparktify/artists/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };
    const getTracks = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/Sparktify/artists/${id}/top-tracks`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Tracks data:", data); // Debugging

        if (Array.isArray(data.tracks)) {
          setTracks(data.tracks); // Extract the 'tracks' array
        } else {
          console.error("Tracks data does not contain an array:", data);
          setTracks([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching tracks data:", error);
        setTracks([]); // Fallback to an empty array in case of an error
      }
    };

    if (id) {
      getArtist();
      getTracks();
    }
  }, [id]);

  // Function to convert milliseconds to minutes:seconds format
  const formatDuration = (durationMs: string) => {
    const seconds = Math.floor(parseInt(durationMs) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Limit to the top x tracks
  const topTracks = tracks.slice(0, 5);

  return (
    <div>
      {artist ? (
        <>
          <h1
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            {artist.name}
          </h1>
          <p>
            Genres:{" "}
            {artist.genres.length > 0 ? (
              artist.genres.map((genre, index) => (
                <span key={index}>
                  {genre}
                  {index < artist.genres.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              <span>No genres available</span>
            )}
          </p>
          <h1>Popular songs</h1>
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
                <th>Image</th>
                <th>Song Name</th>
                <th>Song Length</th>
              </tr>
            </thead>
            <tbody>
              {topTracks.length > 0 ? (
                topTracks.map((track, index) => (
                  <tr key={track.id}>
                    <td>{index + 1}</td>
                    <td>
                      {track.album &&
                      track.album.images &&
                      track.album.images[0] ? (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          style={{ width: "50px", height: "50px" }}
                        />
                      ) : (
                        <span>No Image</span> // Fallback if image is missing
                      )}
                    </td>
                    <td>{track.name}</td>
                    <td>{formatDuration(track.duration_ms)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No tracks available.</td>
                </tr>
              )}
            </tbody>
          </table>
          <h1>Discography</h1>
          <h1>Related Artists</h1>
        </>
      ) : (
        <h1>Loading artist data...</h1>
      )}
    </div>
  );
};

export default ArtistPage;
