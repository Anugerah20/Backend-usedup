const express = require('express');
const router = express.Router();

const { getRoomChat, getChat, sendChatMessage, createRoomChat } = require('../controllers/chat.controller');

router.post('/getRoom', getRoomChat);
router.post('/getMessages', getChat);
router.post('/sendMessage', sendChatMessage)
router.post('/createRoom', createRoomChat)

module.exports = router;