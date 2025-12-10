const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        req.session.userId = user._id; // login automatically
        res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        req.session.userId = user._id;

        res.json({ message: "Logged in", user: { id: user._id, email: user.email } });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
};