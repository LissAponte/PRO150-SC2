const User = require('../models/User');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error", error.message);
        res.status(500).send({message: 'Error retrieving profile'});
    }
};

exports.updateMe = async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            email: req.body.email   
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error("Update profile error", error.message);
        res.status(500).send({message: 'Error updating profile'});
        }
};

exports.deleteMe = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Delete profile error", error.message);
        res.status(500).send({message: 'Error deleting profile'});
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error("Change password error", error.message);
        res.status(500).send({message: 'Error changing password'});
    }
};