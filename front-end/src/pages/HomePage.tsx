import SearchBar from "../components/SearchBar";
import TopArtists from "../components/TopArtists";

const HomePage = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Perform search logic here (e.g., filter data, call API, etc.)
  };
  return (
    <div>
      <h1>Welcome to the home page!</h1>
      <SearchBar onSearch={handleSearch} />
      <TopArtists />
    </div>
  );
};

export default HomePage;
