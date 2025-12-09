import { useEffect, useState } from "react";
import { api } from "../api/api";


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
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h3 className="text-3xl font-bold mb-6">Ⓜⓨ Ⓕⓐⓥⓞⓡⓘⓣⓔ Ⓢⓣⓤⓓⓨ Ⓢⓟⓐⓒⓔⓢ</h3>

      {spaces.length === 0 && (
        <p>Ⓨⓞⓤ ⓗⓐⓥⓔ ⓝⓞ ⓕⓐⓥⓞⓡⓘⓣⓔ ⓢⓣⓤⓓⓨ ⓢⓟⓐⓒⓔⓢ ⓨⓔⓣ.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spaces.map((space) => (
          <div key={space._id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{space.name}</h2>
            <p className="text-gray-700">{space.location}</p>

            <a
              href={`/spaces/${space._id}`}
              className="mt-3 inline-block bg-blue-500 text-white px-3 py-1 rounded"
            >
             Ⓥⓘⓔⓦ Ⓓⓔⓣⓐⓘⓛⓢ
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
