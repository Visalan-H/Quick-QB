const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['suggestion', 'complaint'],
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },    userEmail: {
        type: String,
        required: false,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);