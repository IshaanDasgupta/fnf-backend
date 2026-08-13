import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config/env";
import { AuthenticatedUser } from "@/types/auth";
import logger from "@/utils/logger";

export function jwtMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === "string") {
      logger.warn("Invalid JWT payload");
      return next();
    }

    req.user = decoded as AuthenticatedUser;

    logger.debug(`JWT verified user: ${req.user.id}`);
  } catch {
    logger.warn("Invalid JWT");

    req.user = undefined;
  }

  next();
}
