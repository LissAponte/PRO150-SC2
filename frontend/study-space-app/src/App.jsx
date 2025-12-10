import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudySpaces from "./pages/StudySpace";
import StudySpaceDetails from "./pages/StudySpaceDetails";
import MyFavorites from "./pages/MyFavorites";


export default function App() {
  return (
    <div>

      {/* Temporary Navigation */}
      <nav className="flex gap-4 p-4 bg-gray-100">
        <a href="/">Home</a>
        <a href="/spaces">Study Spaces</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
        <a href="/favorites" className="mr-4">Favorites</a>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/spaces" element={<RequireAuth><StudySpaces /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/spaces/:id" element={<RequireAuth><StudySpaceDetails /></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><MyFavorites /></RequireAuth>} />
      </Routes>

    </div>
  );
}
