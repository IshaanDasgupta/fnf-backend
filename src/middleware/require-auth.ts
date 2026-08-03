import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "@/types/auth";

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}
