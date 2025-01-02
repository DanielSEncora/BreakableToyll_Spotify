import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

interface Artist {
  name: string;
  id: string;
  genres: string[];
  images: Image[];
}

interface Track {
  name: string;
  id: string;
  duration_ms: string;
  album: Album;
}

interface Album {
  id: string;
  name: string;
  images: Image[];
}

interface Image {
  url: string;
}

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artistAlbums, setArtistAlbums] = useState<Album[]>([]);

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

    const getArtistAlbums = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/Sparktify/artists/${id}/albums`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (Array.isArray(data.items)) {
          setArtistAlbums(data.items);
        } else {
          console.error("Albums data does not contain 'items' array:", data);
          setArtistAlbums([]);
        }
      } catch (error) {
        console.error("Error fetching albums data:", error);
        setArtistAlbums([]);
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
        console.log("Tracks data:", data);

        if (Array.isArray(data.tracks)) {
          setTracks(data.tracks);
        } else {
          console.error("Tracks data does not contain an array:", data);
          setTracks([]);
        }
      } catch (error) {
        console.error("Error fetching tracks data:", error);
        setTracks([]);
      }
    };

    if (id) {
      getArtist();
      getTracks();
      getArtistAlbums();
    }
  }, [id]);

  // Function to convert milliseconds to minutes:seconds format
  const formatDuration = (durationMs: string) => {
    const seconds = Math.floor(parseInt(durationMs) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="p-6">
      {artist ? (
        <>
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white"
              />
              <div className="text-center">
                <h1 className="text-4xl font-bold">{artist.name}</h1>
                <p className="text-xl font-semibold mt-2">Genres:</p>
                <p className="text-sm text-gray-200">
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
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Popular songs
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {tracks?.slice(0, 6).map((track) => (
              <Link to={`/albums/${track.album.id}`} className="block">
                <div
                  key={track.id}
                  className="bg-gradient-to-r from-green-400 via-red-600 to-purple-800 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden p-4"
                >
                  <div className="mb-4">
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.album.name}
                      className="w-24 h-24 rounded-lg object-cover mx-auto"
                    />
                  </div>
                  <p className="text-lg font-semibold mb-2">{track.name}</p>
                  <p className="text-sm text-gray-200 mb-2">
                    {track.album.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatDuration(track.duration_ms)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Albums
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {artistAlbums.slice(0, 6).map((album) => (
              <div
                key={album.id}
                className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden text-center p-4"
              >
                <Link to={`/albums/${album.id}`} className="block">
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="w-32 h-32 object-cover mx-auto mb-4 rounded-lg border-4 border-white"
                  />
                </Link>
                <p className="text-lg font-semibold mb-2">{album.name}</p>
                <p className="text-sm text-gray-200">{artist.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h1>Loading artist data...</h1>
      )}
    </div>
  );
};

export default ArtistPage;
