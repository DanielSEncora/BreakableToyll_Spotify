const Login: React.FC = () => {
  const getSpotifyUserLogin = () => {
    fetch("http://localhost:9090/Sparktify/login")
      .then((response) => response.text())
      .then((response) => {
        window.location.replace(response);
      });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 "
          onClick={getSpotifyUserLogin}
        >
          {" "}
          Login{" "}
        </button>
      </div>
    </>
  );
};

export default Login;
