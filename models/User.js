// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,  // 用户名可以为空（游客用户）
  },
  email: {
    type: String,
    required: false,  // 电子邮件可选
    unique: true,
  },
  password: {
    type: String,
    required: false,  // 密码字段是可选的，取决于是否为游客登录
  },
  openid: {
    type: String,
    required: true,
    unique: true,  // openid 需要唯一
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
