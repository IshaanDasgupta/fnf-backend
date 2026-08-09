import { NextFunction, Response, Request } from "express";

import logger from "@/utils/logger";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
      user: req.user ?? "Unauthenticated",
    });
  });

  next();
}
