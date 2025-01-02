import { useState } from "react";
import SearchBar from "../components/SearchBar";
import TopArtists from "../components/TopArtists";
import { Link } from "react-router-dom";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
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
  images: { url: string }[];
  tracks: {
    items: Track[];
  };
  artists: Artist[];
}

interface PaginatedResult<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

interface SearchResult {
  artists: PaginatedResult<Artist>;
  tracks: PaginatedResult<Track>;
  albums: PaginatedResult<Album>;
}

const HomePage = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9090/Sparktify/search/${query}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching search results: ${response.statusText}`
        );
      }

      const data: SearchResult = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults(null);
    }
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div>
      <div>
        <SearchBar onSearch={handleSearch} />
      </div>
      <TopArtists />
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 shadow-lg">
        Search Results
      </h1>

      {searchResults && (
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Artists
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {searchResults.artists?.items.slice(0, 6).map((artist) => (
              <div
                key={artist.id}
                className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden text-center p-4"
              >
                <Link to={`/artist/${artist.id}`} className="block">
                  <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white"
                  />
                </Link>
                <p className="text-lg font-semibold mb-2">{artist.name}</p>
                <p className="text-sm text-gray-200">{artist.genres[0]}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Tracks
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {searchResults.tracks?.items.slice(0, 6).map((track) => (
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
            {searchResults.albums?.items.slice(0, 6).map((album) => (
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
                <p className="text-sm text-gray-200">{album.artists[0].name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchResults && (
        <p className="text-white text-center">
          No results found. Start by searching above!
        </p>
      )}
    </div>
  );
};

export default HomePage;
