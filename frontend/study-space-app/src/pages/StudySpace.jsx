import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function StudySpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);


  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [minRating, setMinRating] = useState("");


  // Fetch study spaces from backend
  async function fetchSpaces() {
    try {
      const res = await api.get("/spaces");
      setSpaces(res.data);
    } catch (err) {
      console.error("Error fetching study spaces:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSpaces();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFavorites(user.favorites || []);
    }
  }, []);


  // Collect all unique tags for filter dropdown
  const allTags = [...new Set(spaces.flatMap((s) => s.tags))];

  // Apply filter logic
  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTag === "" || space.tags.includes(selectedTag);

    const matchesRating =
      minRating === "" || space.rating >= minRating;

    return matchesSearch && matchesTag && matchesRating;
  });

  if (loading) return <p className="mt-20 text-center">Loading study spaces...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Study Spaces</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or description..."
          className="border px-3 py-2 rounded"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Tag Filter */}
        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map((tag, i) => (
            <option key={i} value={tag}>{tag}</option>
          ))}
        </select>

        {/* Rating Filter */}
        <input
          type="number"
          min="0"
          max="5"
          placeholder="Minimum Rating (0–5)"
          className="border px-3 py-2 rounded"
          onChange={(e) => setMinRating(Number(e.target.value))}
        />
      </div>

      {/* Study Space Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {filteredSpaces.map((space) => (
          <div
            key={space._id}
            className="border p-5 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">{space.name}</h2>

            <div className="absolute top-2 right-2 text-xl">
              {favorites.includes(space._id) ? "❤️" : "🤍"}
            </div>


            <p className="mt-2 text-gray-700">
              {space.description}
            </p>

            <p className="mt-2">
              <strong>Rating:</strong> {space.rating} ⭐
            </p>

            {space.tags.length > 0 && (
              <p className="mt-2">
                <strong>Tags:</strong> {space.tags.join(", ")}
              </p>
            )}

            <p className="mt-2 text-sm text-gray-500">
              Created by: {space.createdBy?.username || "Unknown"}
            </p>
            <a
              href={`/spaces/${space._id}`}
              className="mt-3 inline-block bg-blue-500 text-white px-3 py-1 rounded"
            >
              View Details
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
