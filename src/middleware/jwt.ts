import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config/env";
import { AuthenticatedRequest } from "@/types/auth";

export function jwtMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthenticatedRequest["user"];
  } catch {
    req.user = undefined;
  }

  next();
}
