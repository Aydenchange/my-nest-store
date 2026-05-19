import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const winstonLoggerOptions = {
  transports: [
    // 1. 控制台输出（开发环境看）
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // 2. 错误日志独立文件存储，按天滚动
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ), // 生产环境用 JSON
    }),
    // 3. 全量业务日志存储
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
