const express = require('express');
const router = express.Router();
const {
    registerUser,
    getUsers,
    getPublicKey
} = require('../controllers/userController');

router.post('/', registerUser);
router.get('/', getUsers);
router.get('/:email/public-key', getPublicKey);

module.exports = router;
