import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar for StudyBug
 * - Shows logo (text + bug icon)
 * - Links to Home / All Spaces / Favorites / Account
 * - Login / Logout actions
 */

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <nav className="topbar">
      <div className="brand">
        <div className="logo">
          {/* Logo option 3: text with small bug icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" fill="#3B8A3B" />
            <circle cx="9.5" cy="10.5" r="1.4" fill="#fff" opacity="0.95" />
            <circle cx="14.5" cy="10.5" r="1.4" fill="#fff" opacity="0.95" />
            <path d="M12 12.5v4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <span style={{ fontWeight: 800, color: "var(--primary)" }}>StudyBug</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div className="nav-links" aria-hidden>
          <Link to="/home">Home</Link>
          <Link to="/spaces">All Spaces</Link>
          <Link to="/favorites">My Favorites</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <span className="muted">Hello, {user.name}</span>
              <Link to="/account" className="nav-links"><span className="pill">Account</span></Link>
              <button onClick={handleLogout} className="btn ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn secondary">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
