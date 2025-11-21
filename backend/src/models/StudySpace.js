const mongoose = require('mongoose');

const StudySpaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Study space name is required']
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
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
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