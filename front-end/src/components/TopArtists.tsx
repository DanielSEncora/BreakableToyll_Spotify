import { useEffect, useState } from "react";

const TopArtists: React.FC = () => {
  const [userTopArtists, setUserTopArtists] = useState<Artist[] | undefined>(
    undefined
  );

  interface Artist {
    name: string;
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
      {userTopArtists ? (
        userTopArtists.map((artistResult) => {
          return <h1 key={artistResult.name}>{artistResult.name}</h1>;
        })
      ) : (
        <h1>LOADING...</h1>
      )}
    </div>
  );
};
export default TopArtists;
