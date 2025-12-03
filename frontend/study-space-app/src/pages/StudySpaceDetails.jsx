import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";

const user = JSON.parse(localStorage.getItem("user")); // logged-in user info


export default function StudySpaceDetails() {
    const { id } = useParams(); // get study space ID from URL
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");



    async function handleFavorite() {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return alert("Please log in first!");

            const res = await api.post(`/users/${user._id}/favorites`, {
                studySpaceId: space._id,
            });

            // Toggle UI
            setIsFavorite(!isFavorite);

            // Update local user data
            localStorage.setItem("user", JSON.stringify(res.data));

        } catch (err) {
            console.error("Error updating favorites:", err);
        }
    }



    async function fetchSpace() {
        try {
            const res = await api.get(`/spaces/${id}`);
            setSpace(res.data);
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.favorites && user.favorites.includes(res.data._id)) {
                setIsFavorite(true);
            }

        } catch (err) {
            console.error("Error loading study space:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitReview() {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return alert("Please log in to leave a review!");

            const res = await api.post("/reviews", {
                studySpaceId: space._id,
                rating: newRating,
                comment: newComment,
            });

            // Add the new review to the list immediately
            setReviews([...reviews, res.data]);

            // Reset form
            setNewRating(5);
            setNewComment("");
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    async function handleDeleteReview(id) {
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
        }
    }



    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch space details
                const resSpace = await api.get(`/spaces/${id}`);
                setSpace(resSpace.data);

                // Fetch reviews
                const resReviews = await api.get(`/reviews/${id}`);
                setReviews(resReviews.data);
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [id]);

    if (loading) return <p className="mt-20 text-center">Loading...</p>;
    if (!space) return <p className="mt-20 text-center">Study space not found.</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-4">{space.name}</h1>

            <p className="text-yellow-600 font-semibold">
                ⭐ Average Rating: {space.averageRating || "No ratings yet"}
            </p>

            <button
                onClick={handleFavorite}
                className="text-red-500 text-2xl"
            >
                {isFavorite ? "❤️" : "🤍"}
            </button>


            <p className="text-yellow-600 font-semibold">
                Average Rating: {space.averageRating || "No ratings yet"}
            </p>
            <p className="text-gray-700 mb-2">Tags: {space.tags.join(", ")}</p>

            {space.description && (
                <p className="mt-4 text-gray-800">{space.description}</p>
            )}

            <h2 className="text-2xl font-semibold mt-6 mb-2">Leave a Review</h2>

            <div className="border p-4 rounded mb-4">
                <label className="block mb-2 font-medium">Rating (1–5)</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    className="border rounded p-1 w-16"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                />

                <label className="block mt-3 mb-2 font-medium">Comment</label>
                <textarea
                    className="border rounded p-2 w-full"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <button
                    onClick={handleSubmitReview}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Submit Review
                </button>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-2">Reviews</h2>

            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this study space!</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (

                        <div key={review._id} className="border p-4 rounded">
                            <div className="flex justify-between">
                                <p className="font-bold">{review.user?.name || "Anonymous"}</p>
                                <p>⭐ {review.rating}/5</p>
                            </div>
                            <p className="mt-2">{review.comment}</p>

                            {user && review.user?._id === user._id && (
                                <button
                                    className="text-red-500 text-sm mt-2"
                                    onClick={() => handleDeleteReview(review._id)}
                                >
                                    Delete
                                </button>
                            )}

                        </div>

                    ))}
                </div>
            )}



            <button
                className="mt-6 bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => window.history.back()}
            >
                Back
            </button>
        </div>
    );
}
