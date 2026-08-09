import {
  generateAccessToken,
  generateRefreshToken,
  getRefereshTokenExpiry,
  verifyRefreshToken,
} from "@/service/jwt";
import * as TwilioService from "@/service/twilio";

export async function sendOTP(phone: string) {
  await TwilioService.sendOTP(phone);
}

export async function verifyOTP(phone: string, otp: string) {
  const verification = await TwilioService.verifyOTP(phone, otp);

  if (verification.status !== "approved") {
    throw new Error("Invalid OTP");
  }

  // TODO:
  // Fetch or create user from database

  const user = {
    id: phone,
    phone,
    name: "ishaan",
    email: "dasgupta.ishan@gmail.com",
    basicOnboardingCompleted: true,
  };

  return {
    user,
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    refreshExpiresAt: getRefereshTokenExpiry(),
  };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const user = {
    id: payload.userId,
    phone: "9665572638",
    name: "ishaan",
    email: "dasgupta.ishan@gmail.com",
    basicOnboardingCompleted: true,
  };

  return {
    user,
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    refreshExpiresAt: getRefereshTokenExpiry(),
  };
}
