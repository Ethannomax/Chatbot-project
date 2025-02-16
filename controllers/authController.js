require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');  // 与微信小程序交互
const User = require('../models/User');

// 存储验证码的临时内存，实际生产环境可以使用 Redis 或数据库
let verificationCodes = {};  

// 微信小程序登录功能
exports.loginWithWechat = async (req, res) => {
  const { code } = req.body;  // 微信小程序提供的code

  if (!code) {
    return res.status(400).json({ message: 'code不能为空' });
  }

  try {
    // 使用微信小程序的 API 获取 openid 和 session_key
    const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WECHAT_APP_ID}&secret=${process.env.WECHAT_APP_SECRET}&js_code=${code}&grant_type=authorization_code`);
    const { openid, session_key } = response.data;

    if (!openid) {
      return res.status(400).json({ message: '微信登录失败' });
    }

    // 查找或创建用户
    let user = await User.findOne({ openid });
    if (!user) {
      user = new User({ openid });
      await user.save();
    }

    // 生成 JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: '登录成功', token, user: { _id: user._id, username: user.username } });
  } catch (error) {
    console.error('微信登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 游客注册（不需要登录） 
exports.guestRegister = async (req, res) => {
  const { username, email, password, verificationCode } = req.body;

  // 检查验证码
  if (verificationCodes[email] !== verificationCode) {
    return res.status(400).json({ message: '验证码不正确' });
  }

  // 删除验证码防止重复使用
  delete verificationCodes[email];

  try {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '用户已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: '用户创建成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 游客聊天（不需要登录）
exports.guestChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: '请提供消息内容' });
  }

  // 调用本地聊天算法处理消息
  const response = getLocalChatResponse(message);

  res.status(200).json({ reply: response });
};

// 本地聊天算法（简单规则）
function getLocalChatResponse(message) {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('你好')) {
    return '你好！很高兴为您服务！';
  } else if (lowerCaseMessage.includes('帮助')) {
    return '我能为您提供以下帮助：1. 问我任何问题；2. 获取相关资源。';
  } else if (lowerCaseMessage.includes('天气')) {
    return '天气晴，气温适宜，适合外出！';
  } else {
    return '抱歉，我不理解您的问题。您可以问我其他问题！';
  }
}





