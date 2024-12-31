import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopArtists: React.FC = () => {
  const [userTopArtists, setUserTopArtists] = useState<Artist[] | undefined>(
    undefined
  );

  interface Artist {
    name: string;
    id: string;
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
    <div>
      <h1>My Top Artists</h1>
      {userTopArtists ? (
        userTopArtists.map((artistResult) => (
          <h2 key={artistResult.id}>
            <Link to={`/artist/${artistResult.id}`}>{artistResult.name}</Link>
          </h2>
        ))
      ) : (
        <h1>LOADING...</h1>
      )}
    </div>
  );
};

export default TopArtists;
