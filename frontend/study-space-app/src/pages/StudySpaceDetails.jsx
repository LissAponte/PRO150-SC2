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
                    const newChat = await api.post(`/chats`, { spaceId: id });
                    setMessages(newChat.data.messages || []);
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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!space) return <div className="empty">Loading...</div>;

    const isOwner =
        user && String(user._id) === String(space.owner?._id || space.owner);

    return (
        <div>
            <header className="study-card" style={{ marginBottom: "1rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                    <h1 className="page-title">{space.name}</h1>
                    <p className="muted" style={{ marginTop: 6 }}>{space.subject}</p>
                    <p style={{ marginTop: 6 }}>{space.description}</p>
                </div>

                <div style={{ display:"flex", gap: 8 }}>
                    {user && (
                        <button
                            onClick={handleToggleFavorite}
                            className="btn"
                            style={{ background: isFavorite ? "var(--primary)" : "transparent", color: isFavorite ? "#fff" : "var(--primary)", border: isFavorite ? "none" : "1px solid rgba(59,138,59,0.12)" }}
                        >
                            {isFavorite ? "★ Favorited" : "☆ Favorite"}
                        </button>
                    )}

                    {isOwner && (
                        <>
                            <button onClick={() => navigate(`/space/${id}`)} className="btn ghost">Edit</button>
                            <button onClick={handleDeleteSpace} className="btn" style={{ background: "var(--danger)" }}>Delete</button>
                        </>
                    )}
                </div>
            </header>

            <section style={{ display:"grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="responsive-grid">
                <div className="study-card">
                    <div className="card-header">Chat</div>

                    <div style={{ marginTop: 10, height: 340, overflowY: "auto", border: "1px solid var(--card-border)", borderRadius: 8, padding: 10 }}>
                        {messages.map((m, i) => (
                            <div key={m._id || i} style={{ marginBottom: 12 }}>
                                <div style={{ fontWeight:700 }}>{m.username}</div>
                                <div style={{ marginTop:4 }}>{m.message}</div>
                                <div className="muted" style={{ fontSize: 12, marginTop:6 }}>
                                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={sendMessage} className="form" style={{ marginTop: 10 }}>
                        <input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type a message" />
                        <button className="btn">Send</button>
                    </form>
                </div>

                <div className="study-card">
                    <div className="card-header">Reviews</div>

                    <form onSubmit={handleSubmitReview} className="form" style={{ marginTop: 10 }}>
                        <label className="muted">Rating (1-5)</label>
                        <input type="number" min="1" max="5" value={newRating} onChange={(e) => setNewRating(e.target.value)} style={{ width: 100 }} />
                        <label className="muted">Comment</label>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />

                        <button className="btn secondary">Submit Review</button>
                    </form>

                    <div style={{ marginTop: 12 }}>
                        {reviews.length === 0 && <p className="muted">No reviews yet</p>}

                        {reviews.map((r) => (
                            <div key={r._id} className="study-card" style={{ marginTop: 8 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                    <div style={{ fontWeight:700 }}>{r.user?.name}</div>
                                    <div>{r.rating}</div>
                                </div>
                                <p style={{ marginTop:8 }}>{r.comment}</p>

                                {user && String(user._id) === String(r.user?._id) && (
                                    <button onClick={() => handleDeleteReview(r._id)} className="btn ghost" style={{ marginTop: 8 }}>Delete</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                @media (max-width: 900px) {
                    .responsive-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
