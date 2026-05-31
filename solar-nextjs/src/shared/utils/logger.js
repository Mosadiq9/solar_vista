import pino from 'pino';

// Define the logger configuration
const isDev = process.env.NODE_ENV !== 'production';

// In development, use pino-pretty for human-readable logs.
// In production, log strict JSON format.
const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

export default logger;
