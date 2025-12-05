const { Schema, model } = require('mongoose');

const OtpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

const Otp = model('Otp', OtpSchema);

module.exports = Otp;
