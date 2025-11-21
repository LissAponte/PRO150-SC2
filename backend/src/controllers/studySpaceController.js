const StudySpace = require('../models/StudySpace');

exports.createStudySpace = async (req, res) => {
    try {
        const { name, description, tags } = req.body;

        const space = await StudySpace.create({
            name,
            description,
            tags,
            createdBy: req.user._id
        });
        res.status(201).json({
            message: 'Study space created successfully',
            space,
        });
    } catch (error) {
        console.error('Error creating study space:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllStudySpaces = async (req, res) => {
    try {
        const spaces = await StudySpace.find().populate('createdBy', 'username email');
        res.status(200).json(spaces);
    } catch (error) {
        console.error('Error fetching study spaces:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudySpace = async (req, res) => {
    try {
        const space = await StudySpace.findById(req.params.id)

        if (!space) {
            return res.status(404).json({ message: 'Study space not found' });
        }

        res.status(200).json(space);
    } catch (error) {
        console.error('Error fetching study space:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStudySpace = async (req, res) => {
    try {
        const space = await StudySpace.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!space) {
            return res.status(404).json({ message: 'Study space not found' });
        }

        res.status(200).json({
            message: 'Study space updated successfully',
            space,
        });
    } catch (error) {
        console.error('Error updating study space:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteStudySpace = async (req, res) => {
    try {
        const space = await StudySpace.findByIdAndDelete(req.params.id);

        if (!space) {
            return res.status(404).json({ message: 'Study space not found' });
        }

        res.status(200).json({ message: 'Study space deleted successfully' });
    } catch (error) {
        console.error('Error deleting study space:', error);
        res.status(500).json({ message: 'Server error' });
    }
};