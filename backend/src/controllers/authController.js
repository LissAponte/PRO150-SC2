const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};