const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');  // 引入控制器

const router = express.Router();

// 微信小程序登录路由
router.post('/login/wechat', authController.loginWithWechat);

// 游客聊天路由
router.post('/guest/chat', authController.guestChat);

module.exports = router;


