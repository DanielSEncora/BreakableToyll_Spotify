const Login: React.FC = () => {
  const getSpotifyUserLogin = () => {
    console.log("Hi");
    fetch("http://localhost:9090/Sparktify/login")
      .then((response) => response.text())
      .then((response) => {
        window.location.replace(response);
      });
  };

  return (
    <>
      <button onClick={getSpotifyUserLogin}> Login </button>
    </>
  );
};

export default Login;
