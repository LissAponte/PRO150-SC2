import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">StudySpace</Link>
        {user && <Link to="/home" className="text-sm">Home</Link>}
        {user && <Link to="/spaces" className="text-sm">All Spaces</Link>}
        {user && <Link to="/favorites" className="text-sm">My Favorites</Link>}
      </div>

      <div className="flex items-center gap-4">
        {!user && <Link to="/login" className="text-sm">Login</Link>}
        {!user && <Link to="/register" className="text-sm">Register</Link>}

        {user && (
          <>
            <span className="text-sm">Hello, {user.name}</span>
            <Link to="/account" className="text-sm">Account</Link>
            <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-2 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}