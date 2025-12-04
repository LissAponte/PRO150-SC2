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
      
        <a href="/">
        <button className="home-btn">Home</button>
        </a>
        <a href="/spaces">
        <button className="study-spaces-btn">Study Spaces</button>
        </a>
        <a href="/login">
        <button className="login-btn">Login</button>
        </a>
        <a href="/register">
        <button className="register-btn">Register</button>
        </a>
        <a href="/favorites" className="mr-4">
        <button className="favorites-btn">My Favorites</button>
        </a>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<StudySpaces />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/spaces/:id" element={<StudySpaceDetails />} />
        <Route path="/favorites" element={<MyFavorites />} />
      </Routes>

    </div>
  );
}
