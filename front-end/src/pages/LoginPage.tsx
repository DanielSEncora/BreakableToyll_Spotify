import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-lg  ">
        <h1 className="text-2xl font-bold mb-4 text-black">Login to Spotify</h1>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
