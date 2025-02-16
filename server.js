const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 加载 .env 配置
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体
app.use(morgan('combined')); // 记录 HTTP 请求日志

// 根路径处理，确保访问 http://localhost:5001/ 不会返回 Cannot GET /
app.get('/', (req, res) => {
  res.send('Welcome to the Backend API');
});

// 引入路由文件
const authRoutes = require('./routes/authRoutes');  // 添加 authRoutes
const chatRoutes = require('./routes/chatRoutes');  // 保持 chatRoutes

// 挂载路由
app.use('/api/auth', authRoutes); // 确保 /api/auth 路由挂载正确
app.use('/api/chat', chatRoutes); // 确保 /api/chat 路由挂载正确

// 连接 MongoDB 数据库
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydatabase';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    // 启动服务
    app.listen(port, () => {
      console.log(`Backend server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });





  