import { useState } from "react";
import SearchBar from "../components/SearchBar";
import TopArtists from "../components/TopArtists";
import { Link } from "react-router-dom";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
}

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
}

interface PaginatedResult<T> {
  href: string;
  items: T[]; // Array of the specific type (Artist, Track, or Album)
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
      setSearchResults(null); // Clear results on error
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
      <h1>Search Results</h1>
      {searchResults && (
        <div>
          {/* Artists */}
          <h2>Artists</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {searchResults.artists?.items.map((artist) => (
              <div key={artist.id} style={{ textAlign: "center" }}>
                <Link to={`/artist/${artist.id}`}></Link>
                <img
                  onClick={() =>
                    (window.location.href = `/artist/${artist.id}`)
                  }
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
                <p>
                  <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                </p>
              </div>
            ))}
          </div>

          {/* Tracks */}
          <h2>Tracks</h2>
          <table
            style={{
              width: "100%",
              textAlign: "center",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Track Name</th>
                <th>Album</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.tracks?.items.map((track) => (
                <tr key={track.id}>
                  <td>{track.name}</td>
                  <td>{track.album.name}</td>
                  <td>{formatDuration(track.duration_ms)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Albums */}
          <h2>Albums</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {searchResults.albums?.items.map((album) => (
              <div key={album.id} style={{ textAlign: "center" }}>
                <img
                  onClick={() => (window.location.href = `/albums/${album.id}`)}
                  src={album.images[0]?.url}
                  alt={album.name}
                  style={{ width: "100px", height: "100px" }}
                />
                <p>
                  <Link to={`/albums/${album.id}`}>{album.name}</Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchResults && <p>No results found. Start by searching above!</p>}
    </div>
  );
};

export default HomePage;
