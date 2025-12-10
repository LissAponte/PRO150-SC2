import { useEffect, useState } from "react";
import { getMySpaces, createSpace  } from "../services/spaceService";

export default function Home() {
    const [spaces, setSpaces] = useState([]);
    const [form, setForm] = useState({ name: "", subject: "" });

    useEffect(() => {
        load();
    }, []);
    
    async function load() {
        const data = await getMySpaces();
        setSpaces(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await createSpace(form);
        setForm({ name: "", subject: "" });
        load();
    }

    return (
        <div>
            <h1>My Study Spaces</h1>

            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Space Name"
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                <input 
                    placeholder="Subject"
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                <button type="submit">Create Space</button>
            </form>

            <ul>
                {spaces.map(space => (
                    <li key={space.id}>
                      <a href={`/spaces/${space.id}`}>{space.name} - {space.subject}</a>
                      </li>
                ))}
            </ul>
        </div>
    );
}
