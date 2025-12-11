import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMySpacesService, createSpaceService } from "../services/spaceService";

export default function Home() {
    const { user, refreshUser } = useAuth();
    const [spaces, setSpaces] = useState([]);
    const [form, setForm] = useState({ name: "", subject: "", description: "", tags: []});
    const [error, setError] = useState("");

    useEffect(() => { load(); }, []);

    async function load() {
        try {
            const response = await getMySpacesService();
            setSpaces(response.data);
        } catch (err) {
            console.error("Failed to load spaces", err);
        }
    }

    const handleCreateSpace = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await createSpaceService(form);
            setForm({ name: "", subject: "", description: "", tags: [] });
            await refreshUser();
            load();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create space");
        }
    };

    return (
        <div>
            <h1 className="page-title">Home</h1>
            <p className="muted" style={{ marginTop: 8 }}>Welcome, {user?.name}</p>

            <section className="study-card mt-2">
                <h2 className="card-header">Create a Study Space</h2>

                {error && <div className="empty">{error}</div>}

                <form onSubmit={handleCreateSpace} className="form">
                    <input required placeholder="Space name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input required placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                    <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <input placeholder="Tags (comma separated)" value={form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(tag => tag.trim()) })} />
                    <button className="btn">Create</button>
                </form>
            </section>

            <section style={{ marginTop: 20 }}>
                <h2 className="card-header">Your Spaces</h2>

                <div className="study-grid">
                    {spaces.map(s => (
                        <div key={s._id} className="study-card">
                            <div className="card-header">{s.name}</div>
                            <p className="muted">{s.subject}</p>
                            <p style={{ marginTop: 8 }}>{s.description}</p>
                            <p className="muted" style={{ marginTop: 8 }}>Tags: {s.tags.join(', ') || "No tags"}</p>
                            <p className="muted" style={{ marginTop: 6 }}>Code: {s.inviteCode || "No code"}</p>

                            <div style={{ marginTop: 10 }}>
                              <a className="btn" href={`/space/${s._id}`}>Open</a>
                            </div>
                        </div>
                    ))}
                    {spaces.length === 0 && <p className="empty">You have not created or joined any spaces yet.</p>}
                </div>
            </section>
        </div>
    );
}
