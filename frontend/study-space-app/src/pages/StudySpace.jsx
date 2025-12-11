// src/pages/StudySpaces.jsx
import React, { useEffect, useState } from "react";
import { getAllSpacesService, joinSpaceService } from "../services/spaceService";

export default function StudySpaces() {
  const [spaces, setSpaces] = useState([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await getAllSpacesService();
      setSpaces(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleJoin(e, codeToUse) {
    e.preventDefault();
    setError("");
    try {
      await joinSpaceService(codeToUse || code);
      await load();
      setCode("");
      alert("Joined space");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join");
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold">All Study Spaces</h1>

      <div className="mt-4 mb-6">
        <form onSubmit={(e) => handleJoin(e, null)} className="flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Invite code" className="border p-2 rounded" />
          <button className="bg-green-600 text-white px-3 py-2 rounded">Join by code</button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {spaces.map(s => (
          <div key={s._id} className="p-4 border rounded">
            <h3 className="font-bold">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.subject}</p>
            <p className="mt-2">{s.description}</p>
            <div className="mt-3 flex gap-2">
              <a href={`/space/${s._id}`} className="text-blue-600">Open</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
