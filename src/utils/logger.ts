import pino from "pino";

export const instance = pino({
  level: process.env.LOG_LEVEL ?? "debug",

  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export const logger = {
  info: (...args: Parameters<typeof instance.info>) => instance.info(...args),

  success(message: string, data?: unknown) {
    instance.info({
      type: "SUCCESS",
      message,
      data,
    });
  },

  warn(message: string, data?: unknown) {
    instance.warn({
      type: "WARNING",
      message,
      data,
    });
  },

  error(message: string, error?: unknown) {
    instance.error({
      type: "ERROR",
      message,
      error,
    });
  },

  debug(message: string, data?: unknown) {
    instance.debug({
      type: "DEBUG",
      message,
      data,
    });
  },

  trace(message: string, data?: unknown) {
    instance.trace({
      type: "TRACE",
      message,
      data,
    });
  },
};

export default logger;
