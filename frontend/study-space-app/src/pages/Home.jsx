import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMySpacesService, createSpaceService } from "../services/spaceService";

export default function Home() {
    const { user, refreshUser } = useAuth();
    const [spaces, setSpaces] = useState([]);
    const [form, setForm] = useState({ name: "", subject: "", description: "", tags: []});
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

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
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold">Home</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>

            <section className="mt-6 p-4 border rounded">
                <h2 className="font-semibold mb-2">Create a Study Space</h2>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <form onSubmit={handleCreateSpace} className="flex flex-col gap-3">
                    <input required placeholder="Space name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
                    <input required placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="border p-2 rounded" />
                    <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 rounded" />
                    <input placeholder="Tags (comma separated)" value={form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(tag => tag.trim()) })} className="border p-2 rounded" />
                    <button className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
                </form>
            </section>

            <section className="mt-6">
                <h2 className="font-semibold mb-2">Your Spaces</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {spaces.map(s => (
                        <div key={s._id} className="p-4 border rounded">
                            <h3 className="font-bold">{s.name}</h3>
                            <p className="text-sm text-gray-600">{s.subject}</p>
                            <p className="mt-2">{s.description}</p>
                            <p className="mt-2 text-sm text-gray-500">Tags: {s.tags.join(', ') || "No tags"}</p>
                            <p className="mt-2 text-xs text-gray-500">Code: {s.inviteCode || "No code"}</p>
                            <div className="mt-3 flex gap-2">
                                <a className="text-blue-600" href={`/space/${s._id}`}>Open</a>
                            </div>
                        </div>
                    ))}
                    {spaces.length === 0 && <p className="text-gray-600">You have not created or joined any spaces yet.</p>}
                </div>
            </section>
        </div>
    );
}
