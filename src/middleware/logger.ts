import { NextFunction, Response } from "express";

import logger from "@/utils/logger";
import { AuthenticatedRequest } from "@/types/auth";

export function requestLoggerMiddleware(
  req: AuthenticatedRequest,
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
