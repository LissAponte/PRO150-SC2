import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyFavorites() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const res = await api.get(`/users/${user._id}/favorites`);
        setSpaces(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1 className="page-title">My Favorite Study Spaces</h1>

      {spaces.length === 0 && (
        <p className="empty">You have no favorites yet.</p>
      )}

      <div className="study-grid mt-2">
        {spaces.map((space) => (
          <div key={space._id} className="study-card">
            <div className="card-header">{space.name}</div>
            <p className="muted">{space.location}</p>

            <div style={{ marginTop: 10 }}>
              <a href={`/space/${space._id}`} className="btn">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
