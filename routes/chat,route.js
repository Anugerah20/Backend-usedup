const express = require('express');
const router = express.Router();

const { getRoomChat, getChat, sendChatMessage, createRoomChat, getNotifUnread, deleteOneMessage } = require('../controllers/chat.controller');

router.post('/getRoom', getRoomChat);
router.post('/getMessages', getChat);
router.post('/sendMessage', sendChatMessage);
router.post('/createRoom', createRoomChat);
router.post('/getNotif', getNotifUnread);
router.delete('/deleteMessage/:id', deleteOneMessage);

module.exports = router;