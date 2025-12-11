import React, { useEffect, useState } from "react";
import { getAllSpacesService, joinSpaceService } from "../services/spaceService";

export default function StudySpaces() {
  const [spaces, setSpaces] = useState([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

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
    <div>
      <h1 className="page-title">All Study Spaces</h1>

      <div className="study-card mt-2">
        <form onSubmit={(e) => handleJoin(e, null)} className="form">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Invite code" />
          <button className="btn">Join by code</button>
        </form>

        {error && <div className="empty">{error}</div>}
      </div>

      <div className="study-grid mt-2">
        {spaces.map(s => (
          <div key={s._id} className="study-card">
            <div className="card-header">{s.name}</div>
            <p className="muted">{s.subject}</p>
            <p style={{ marginTop: 8 }}>{s.description}</p>
            <div style={{ marginTop: 10 }}>
              <a className="btn" href={`/space/${s._id}`}>Open</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
