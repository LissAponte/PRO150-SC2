import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getChatHistory } from "../services/chatService";

const socket = io("http://localhost:5000", {
    withCredentials: true,
});

export default function StudySpace() {
    const { id: roomId } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const bottomRef = useRef(null);

    useEffect(() => {
        // Load existing chat history
        loadHistory();

        // Join the room
        socket.emit("joinRoom", roomId);

        // Receive messages
        socket.on("chatMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chatMessage");
        };
    }, [roomId]);

    async function loadHistory() {
        const history = await getChatHistory(roomId);
        setMessages(history);
    }

    function sendMessage(e) {
        e.preventDefault();

        if (!input.trim()) return;

        socket.emit("chatMessage", {
            roomId,
            userId: user._id,
            username: user.name,
            message: input,
        });

        setInput("");
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div>
            <h1>Study Group</h1>

            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc" }}>
                {messages.map((m) => (
                    <div key={m._id}>
                        <strong>{m.username}</strong>: {m.message}
                        <div style={{ fontSize: "0.7rem", color: "#aaa" }}>
                            {new Date(m.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={sendMessage}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                />
                <button>Send</button>
            </form>
        </div>
    );
}
