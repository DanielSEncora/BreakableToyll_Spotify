import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopArtists: React.FC = () => {
  const [userTopArtists, setUserTopArtists] = useState<Artist[] | undefined>(
    undefined
  );

  interface Artist {
    name: string;
    id: string;
    images: Images[];
    genres: string[];
  }

  interface Images {
    url: string;
  }

  useEffect(() => {
    fetch("http://localhost:9090/Sparktify/me/top/artists")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserTopArtists(data);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 shadow-lg">
        My Top Artists
      </h1>
      {userTopArtists ? (
        <div className="grid grid-cols-4 gap-6">
          {userTopArtists?.slice(0, 8).map((artistResult) => (
            <div
              key={artistResult.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Link to={`/artist/${artistResult.id}`}>
                <img
                  src={artistResult.images[0].url}
                  alt={artistResult.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  <Link to={`/artist/${artistResult.id}`}>
                    {artistResult.name}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500">
                  {artistResult.genres[0].length > 0
                    ? artistResult.genres[0]
                    : "No Genre Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-center">LOADING...</div>
      )}
    </div>
  );
};

export default TopArtists;
