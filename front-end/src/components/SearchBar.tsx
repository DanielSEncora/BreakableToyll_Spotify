import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search by artist, song, whatever..."
        className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
      />
    </div>
  );
};

export default SearchBar;
