// routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// 聊天路由，游客也可以访问
router.post('/chat', chatController.chatWithAI);

module.exports = router;
