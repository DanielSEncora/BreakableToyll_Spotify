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
  id: string;
  name: string;
  album: Album;
  duration_ms: number;
}

interface Album {
  id: string;
  name: string;
  images: Image[];
  tracks: {
    items: Track[];
  };
  artists: Artist[];
  release_date: string;
}

interface Image {
  url: string;
}

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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

  return (
    <div className="p-6">
      {album ? (
        <>
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <Link to={`/artist/${album.artists[0].id}`} className="block">
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white"
                />
              </Link>
              <div className="text-center">
                <h1 className="text-4xl font-bold">{album.name}</h1>
                <Link to={`/artist/${album.artists[0].id}`} className="block">
                  <p className="text-lg font-semibold mt-2">
                    Artist: {album.artists[0]?.name || "Unknown Artist"}
                  </p>
                </Link>
                <p className="text-lg font-semibold mt-2">
                  Year: {album.release_date || "Unknown Artist"}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Album Songs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {album?.tracks?.items.map((track) => (
              <div className="bg-gradient-to-r from-green-400 via-red-600 to-purple-800 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 p-4">
                <p className="text-lg font-semibold mb-2 truncate">
                  {track.name}
                </p>
                <p className="text-sm text-gray-700">
                  {formatDuration(track.duration_ms)}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h1 className="text-white text-center">Loading album data...</h1>
      )}
    </div>
  );
};

export default AlbumPage;
