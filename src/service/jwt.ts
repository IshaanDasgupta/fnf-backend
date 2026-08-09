import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "@/config/constants";
import { env } from "@/config/env";
import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    env.jwtSecret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    },
  );
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as {
    userId: string;
    type: string;
  };
}

export function getRefereshTokenExpiry() {
  return Date.now() + REFRESH_TOKEN_EXPIRY * 1000;
}
