const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send encrypted message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
    try {
        const { sender, recipient, encryptedMessage } = req.body;

        // Validate recipient exists
        const recipientExists = await User.findOne({ email: recipient });
        if (!recipientExists) {
            return res.status(404).json({
                message: 'Recipient not found'
            });
        }

        const message = await Message.create({
            sender,
            recipient,
            encryptedMessage
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get messages for a user
// @route   GET /api/messages/:email
// @access  Public
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ recipient: req.params.email })
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages
};