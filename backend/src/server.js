require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");

const StudySpace = require("./models/StudySpace");
const ChatMessage = require("./models/ChatMessage");

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
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* ---------------------------------------------------------
     JOIN ROOM (with membership validation)
     frontend must emit: socket.emit("joinRoom", { roomId, user: user._id })
  ----------------------------------------------------------- */
  socket.on("joinRoom", async ({ roomId, user }) => {
    try {
      const space = await StudySpace.findById(roomId);

      if (!space) {
        return socket.emit("error", "StudySpace not found");
      }

      const isMember = space.members.some(
        (m) => m.toString() === user.toString()
      );

      if (!isMember) {
        return socket.emit("error", "You are not a member of this StudySpace");
      }

      socket.join(roomId);
      console.log(`User ${user} joined room: ${roomId}`);
    } catch (err) {
      console.error("joinRoom error:", err);
      socket.emit("error", "Server error joining room");
    }
  });

  /* ---------------------------------------------------------
     SEND CHAT MESSAGE (with membership validation)
     frontend must emit:
     socket.emit("chatMessage", {
        roomId,
        user: user._id,
        username: user.name,
        message
     })
  ----------------------------------------------------------- */
  socket.on("chatMessage", async (data) => {
    try {
      const { roomId, user, username, message } = data;

      const space = await StudySpace.findById(roomId);

      if (!space) {
        return socket.emit("error", "StudySpace not found");
      }

      const isMember = space.members.some(
        (m) => m.toString() === user.toString()
      );

      if (!isMember) {
        return socket.emit("error", "You are not a member of this StudySpace");
      }

      const saved = await ChatMessage.create({
        roomId,
        user,
        username,
        message,
      });

      io.to(roomId).emit("chatMessage", saved);
    } catch (err) {
      console.error("chatMessage error:", err);
      socket.emit("error", "Error sending chat");
    }
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
