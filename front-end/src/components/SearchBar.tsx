import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void; // Function to call when input changes
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value); // Call the parent function with the input value
  };

  return (
    <div className="center searchBar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search by artist, song, whatever..."
      />
    </div>
  );
};

export default SearchBar;
