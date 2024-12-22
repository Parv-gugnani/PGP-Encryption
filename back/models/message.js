const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        ref: 'User'
    },
    recipient: {
        type: String,
        required: true,
        ref: 'User'
    },
    encryptedMessage: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);