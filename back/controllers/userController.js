const User = require('../models/User');
const openpgp = require('openpgp');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, publicKey } = req.body;

        // Validate public key format
        try {
            await openpgp.readKey({ armoredKey: publicKey });
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid public key format'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            publicKey
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email');
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user's public key
// @route   GET /api/users/:email/public-key
// @access  Public
const getPublicKey = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json({ publicKey: user.publicKey });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    getUsers,
    getPublicKey
};
