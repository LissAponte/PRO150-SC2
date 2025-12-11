import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudySpaces from "./pages/StudySpace";
import StudySpaceDetails from "./pages/StudySpaceDetails";
import Account from "./pages/Account";
import MyFavorites from "./pages/MyFavorites";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<div className="max-w-4xl mx-auto">Welcome to StudySpace. <a href="/home" className="text-blue-600">Go to home</a></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/spaces" element={<RequireAuth><StudySpaces /></RequireAuth>} />
          <Route path="/favorites" element={<RequireAuth><MyFavorites /></RequireAuth>} />
          <Route path="/space/:id" element={<RequireAuth><StudySpaceDetails /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        </Routes>
      </main>
    </>
  );
}
