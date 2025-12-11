const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
    try {
        const user = await User.create(req.body);

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered",
            user: { id: user._id, email: user.email, name: user.name },
            token
        });

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

        const token = generateToken(user._id);

        res.json({
            message: "Logged in",
            user: { id: user._id, email: user.email, name: user.name },
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logoutUser = (req, res) => {
    res.json({ message: "Logged out" }); // No session to clear
};
