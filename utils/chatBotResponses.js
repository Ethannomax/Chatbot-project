// chatBotResponses.js

module.exports = {
  getResponse: (message) => {
    // 简单的规则，例如匹配关键词，生成预定义的回答
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
  },
};
