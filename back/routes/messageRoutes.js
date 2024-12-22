const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages
} = require('../controllers/messageController');

router.post('/', sendMessage);
router.get('/:email', getMessages);

module.exports = router;