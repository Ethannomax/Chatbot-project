const chatBotResponses = require('../utils/chatBotResponses');  // 引入本地聊天算法

exports.chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: '请提供消息内容' });
  }

  try {
    // 调用本地聊天算法获取回复
    const response = chatBotResponses.getResponse(message);

    res.status(200).json({ reply: response });
  } catch (error) {
    console.error('聊天错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
