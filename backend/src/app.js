const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/authRoutes');
const studySpaceRoutes = require('./routes/studySpaceRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require("./routes/chatRoutes");



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],  
    credentials: true,
  })
);app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
  })
);

app.use('/api/auth', authRoutes);
app.use("/api/chats", chatRoutes);
app.use('/api/spaces', studySpaceRoutes);
app.use('/api/users', userRoutes);
app.use("/api/reviews", reviewRoutes);


module.exports = app;