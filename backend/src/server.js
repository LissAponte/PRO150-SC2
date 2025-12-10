require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");

// Enable CORS for frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5000;

// -------------------------------
// CONNECT TO DATABASE FIRST
// -------------------------------
connectDB();

// -------------------------------
// CREATE SERVER + SOCKET.IO
// -------------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Receive chat message
  socket.on("chatMessage", async (data) => {
    const ChatMessage = require("./models/ChatMessage");

    const saved = await ChatMessage.create({
      roomId: data.roomId,
      user: data.userId,
      username: data.username,
      message: data.message,
    });

    io.to(data.roomId).emit("chatMessage", saved);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// -------------------------------
// START SERVER
// -------------------------------
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
