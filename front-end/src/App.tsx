import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ArtistPage from "./pages/ArtistPage";
import AlbumPage from "./pages/AlbumPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="bg-slate-900 min-h-screen text-white">
        <ConditionalNavbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          {/* Redirect default route to /homepage */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

// Component to conditionally render the navbar
const ConditionalNavbar = () => {
  const location = useLocation();

  // Hide the navbar on the /login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="absolute top-4 right-4">
      <Link
        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200"
        to="/homepage"
      >
        Home
      </Link>
    </nav>
  );
};

export default App;
