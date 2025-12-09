import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudySpaces from "./pages/StudySpace";
import StudySpaceDetails from "./pages/StudySpaceDetails";
import MyFavorites from "./pages/MyFavorites";
import Profile from "./pages/Profile";


export default function App() {
  return (
    <div>

      {/* Temporary Navigation */}
      <nav className="flex gap-4 p-4 bg-gray-100">
      
        <a href="/">
        <button className="home-btn">Home</button>
        </a>
        <a href="/spaces">
        <button className="study-spaces-btn">Study Spaces</button>
        </a>
        <a href="/login">
        </a>
        <a href="/favorites" className="mr-4">
        <button className="favorites-btn">My Favorites</button>
        </a>
        <a href="/profile">
        <button className="profile-btn">Profile</button>
        </a>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<StudySpaces />} />
        <Route path="/spaces/:id" element={<StudySpaceDetails />} />
        <Route path="/favorites" element={<MyFavorites />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </div>
  );
}
