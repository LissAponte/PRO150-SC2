const mongoose = require('mongoose');

const StudySpaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Study space name is required']
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator is required']
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        rating: {
            type: Number,
            default: 0,
        },
        inviteCode: {
            type: String,
            unique: true,
            required: true,
        },
        tags: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    },
);

module.exports = mongoose.model('StudySpace', StudySpaceSchema);