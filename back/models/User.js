const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    publicKey: {
        type: String,
        required: [true, 'Please add a public key']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);