# ==========================================
# 阶段一：依赖安装与代码编译 (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Alpine 镜像缺少构建部分原生 C++ 模块的必要工具，Prisma 需要此依赖
RUN apk add --no-cache libc6-compat

# 先复制依赖清单，利用 Docker 缓存层
COPY package*.json ./
COPY prisma ./prisma/

# 安装全量依赖（包含 devDependencies）
RUN npm ci

# 复制其余源码
COPY . .

# 编译 TS 代码并生成 Prisma 运行时引擎
RUN npm run build
RUN npx prisma generate

# 清理 devDependencies，只留下生产环境需要的依赖
RUN npm prune --production

# ==========================================
# 阶段二：生产运行环境 (Runner)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量为生产模式
ENV NODE_ENV=production

# 处于安全考虑，切勿在生产环境使用 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# 仅从 builder 阶段复制必要资产：生产依赖、编译后的 JS、Prisma 引擎
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# 切换到低权限用户
USER nestjs

EXPOSE 3000

# 启动前先自动执行数据库迁移(可选)，然后运行主入口
CMD sh -c "npx prisma migrate deploy && node dist/main.js"