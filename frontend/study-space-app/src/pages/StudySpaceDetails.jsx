import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { getChatHistory } from "../services/chatService";
import { postReview, getReviews, deleteReview } from "../services/reviewService";
import api from "../api/axios";

export default function StudySpaceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const socketRef = useSocket();

    const [space, setSpace] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState("");
    const [newComment, setNewComment] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const bottomRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));

    // ---------------------- LOAD DATA ----------------------
    useEffect(() => {
        async function load() {
            try {
                const resSpace = await api.get(`/spaces/${id}`);
                setSpace(resSpace.data);
            } catch (err) {
                console.error("Failed to fetch space:", err);
            }

            try {
                const resReviews = await getReviews(id);
                setReviews(resReviews.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            }

            try {
                const history = await getChatHistory(id);
                setMessages(history.data || history);
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log("No chat exists — creating one now…");
                    const newChat = await api.post(`/chats`, { spaceId: id });
                    setMessages(newChat.data.messages || []);
                } else {
                    console.error("Failed to fetch chat history:", error);
                }
            }
            if (user) {
                const favRes = await api.get(`/users/${user._id}/favorites`);
                const userFavs = favRes.data.map((fav) => fav._id);
                setIsFavorite(userFavs.includes(id));
            }

        }

        load();
    }, [id]);


    async function handleToggleFavorite() {
        try {
            const res = await api.post(`/users/${user._id}/favorites/${id}`);
            setIsFavorite(res.data.favorites.includes(id));
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    }

    async function handleDeleteSpace() {
        if (!confirm("Are you sure you want to delete this study space?")) return;
        try {
            await api.delete(`/spaces/${id}`);
            navigate("/home");
        } catch (err) {
            console.error("Failed to delete space:", err);
        }
    }

    // ---------------------- SOCKET SETUP ----------------------
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.emit("joinRoom", id);

        socket.on("chatMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("chatMessage");
        };
    }, [id, socketRef]);

    // ---------------------- SEND MESSAGE ----------------------
    function sendMessage(e) {
        e.preventDefault();
        if (!messageText.trim()) return;

        const socket = socketRef.current;
        if (!socket) return;

        const outbound = {
            roomId: id,
            user: user._id,
            username: user.name,
            message: messageText,
        };

        socket.emit("chatMessage", outbound);

        setMessageText("");
    }

    // ---------------------- SUBMIT REVIEW ----------------------
    async function handleSubmitReview(e) {
        e.preventDefault();
        try {
            const res = await postReview({
                studySpaceId: id,
                rating: Number(newRating),
                comment: newComment,
            });

            setReviews((prev) => [...prev, res.data]);

            const updatedSpace = await api.get(`/spaces/${id}`);
            setSpace(updatedSpace.data);

            setNewRating("");
            setNewComment("");
        } catch (err) {
            console.error("Failed to post review:", err);
        }
    }

    // ---------------------- DELETE REVIEW ----------------------
    async function handleDeleteReview(reviewId) {
        try {
            await deleteReview(reviewId);
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));

            const updatedSpace = await api.get(`/spaces/${id}`);
            setSpace(updatedSpace.data);
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    }

    // ---------------------- DELETE SPACE ----------------------
    async function handleDeleteSpace() {
        if (!confirm("Are you sure you want to delete this study space?")) return;
        try {
            await api.delete(`/spaces/${id}`);
            navigate("/home");
        } catch (err) {
            console.error("Failed to delete space:", err);
        }
    }

    // Auto-scroll chat
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!space) return <div>Loading...</div>;

    const isOwner =
        user && String(user._id) === String(space.owner?._id || space.owner);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">{space.name}</h1>
                    <p className="text-sm text-gray-600">{space.subject}</p>
                    <p className="mt-2">{space.description}</p>
                </div>

                <div className="flex gap-2">

                    {/* FAVORITE BUTTON (visible for any logged-in user) */}
                    {user && (
                        <button
                            onClick={handleToggleFavorite}
                            className={`px-3 py-1 rounded ${isFavorite ? "bg-purple-700 text-white" : "bg-purple-400 text-white"}`}
                        >
                            {isFavorite ? "★ Favorited" : "☆ Favorite"}
                        </button>
                    )}

                    {/* OWNER ONLY BUTTONS */}
                    {isOwner && (
                        <>
                            <button
                                onClick={() => navigate(`/space/${id}`)}
                                className="bg-yellow-500 px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDeleteSpace}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </header>

            <section className="mt-6 grid md:grid-cols-2 gap-6">
                {/* Chat */}
                <div>
                    <h2 className="font-semibold">Chat</h2>
                    <div className="mt-2 border rounded h-80 overflow-y-auto p-3">
                        {messages.map((m, i) => (
                            <div key={m._id || i} className="mb-2">
                                <div className="text-sm font-bold">
                                    {m.username}
                                </div>
                                <div>{m.message}</div>
                                <div className="text-xs text-gray-500">
                                    {m.createdAt
                                        ? new Date(m.createdAt).toLocaleString()
                                        : ""}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={sendMessage} className="mt-2 flex gap-2">
                        <input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message"
                            className="flex-1 border p-2 rounded"
                        />
                        <button className="bg-blue-600 text-white px-3 py-1 rounded">
                            Send
                        </button>
                    </form>
                </div>

                {/* Reviews */}
                <div>
                    <h2 className="font-semibold">Reviews</h2>

                    <form onSubmit={handleSubmitReview} className="mt-3 border p-3 rounded">
                        <label className="block mb-1">Rating (1-5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={newRating}
                            onChange={(e) => setNewRating(e.target.value)}
                            className="border p-1 rounded w-20"
                        />

                        <label className="block mt-2 mb-1">Comment</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                        <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
                            Submit Review
                        </button>
                    </form>

                    <div className="mt-4 space-y-3">
                        {reviews.length === 0 && (
                            <p className="text-gray-600">No reviews yet</p>
                        )}

                        {reviews.map((r) => (
                            <div key={r._id} className="border p-2 rounded">
                                <div className="flex justify-between">
                                    <div className="font-bold">
                                        {r.user?.name}
                                    </div>
                                    <div>{r.rating}</div>
                                </div>
                                <p className="mt-1">{r.comment}</p>

                                {user &&
                                    String(user._id) ===
                                    String(r.user?._id) && (
                                        <button
                                            onClick={() =>
                                                handleDeleteReview(r._id)
                                            }
                                            className="text-red-500 text-sm mt-1"
                                        >
                                            Delete
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
