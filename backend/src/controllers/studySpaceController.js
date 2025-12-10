const StudySpace = require('../models/StudySpace');
const crypto = require('crypto');


function generateInviteCode() {
    return crypto.randomBytes(4).toString('hex');
}

exports.createStudySpace = async (req, res) => {
    try {
        const { name, description, tags, subject } = req.body;

        const space = await StudySpace.create({
            name,
            subject,
            description,
            tags,
            createdBy: req.session.userId,
            members: [req.session.userId],
            inviteCode: generateInviteCode(),
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

exports.getMyStudySpaces = async (req, res) => {
    try {
        const spaces = await StudySpace.find({ members: req.session.userId });
        res.status(200).json(spaces);
    } catch (error) {
        console.error('Error fetching user study spaces:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.joinSpace = async (req, res) => {
  try {
    const { code } = req.body;

    const space = await StudySpace.findOne({ inviteCode: code });
    if (!space) return res.status(404).json({ message: "Invalid invite code" });

    if (space.members.includes(req.session.userId)) {
      return res.status(400).json({ message: "Already a member" });
    }

    space.members.push(req.session.userId);
    await space.save();

    res.json({ message: "Joined space", space });
  } catch (err) {
    res.status(500).json({ message: err.message });
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