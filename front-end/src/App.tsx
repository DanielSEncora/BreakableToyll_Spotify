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

const App = () => {
  return (
    <Router>
      <div>
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
    <nav>
      <Link to="/homepage">Home</Link>
    </nav>
  );
};

export default App;
