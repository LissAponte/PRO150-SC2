const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const studySpaceRoutes = require('./routes/studySpaceRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/spaces', studySpaceRoutes);
app.use('/api/users', userRoutes);

module.exports = app;