import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "@/config/constants";
import { env } from "@/config/env";
import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    {
      id: userId,
      type: "refresh",
    },
    env.jwtSecret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    },
  );
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, env.jwtSecret) as {
    id: string;
    type: string;
  };

  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return payload;
}

export function getRefreshTokenExpiry() {
  return Date.now() + REFRESH_TOKEN_EXPIRY * 1000;
}
