# 使用官方的 Node.js 镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到容器中并安装依赖
COPY package*.json ./

# 安装依赖
RUN npm install

# 将后端代码复制到容器中
COPY . .

# 设置环境变量（如果有的话，使用 .env 文件）
COPY .env ./

# 暴露后端服务使用的端口（假设你的后端服务在 5001 端口）
EXPOSE 5001

# 容器启动时运行后端服务
CMD ["node", "server.js"]


