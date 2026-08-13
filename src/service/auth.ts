import { UserModel } from "@/models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
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

  let user = await UserModel.findOne({
    phone_number: phone,
  });

  if (!user) {
    user = await UserModel.create({
      phone_number: phone,
    });
  }

  const basicOnboardingCompleted = !!user.name && !!user.age && !!user.gender;

  const userAuthData = {
    id: user._id.toString(),
    phone: user.phone_number,
    name: user.name,
    age: user.age,
    gender: user.gender,
    basicOnboardingCompleted,
  };

  return {
    user: userAuthData,
    accessToken: generateAccessToken(userAuthData.id),
    refreshToken: generateRefreshToken(userAuthData.id),
    refreshExpiresAt: getRefreshTokenExpiry(),
  };
}

export async function refresh(refreshToken: string) {
  const { id: userId } = verifyRefreshToken(refreshToken);

  let user = await UserModel.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const basicOnboardingCompleted = !!user.name && !!user.age && !!user.gender;

  const userAuthData = {
    id: user._id.toString(),
    phone: user.phone_number,
    name: user.name,
    age: user.age,
    gender: user.gender,
    basicOnboardingCompleted,
  };

  return {
    user: userAuthData,
    accessToken: generateAccessToken(userAuthData.id),
    refreshToken: generateRefreshToken(userAuthData.id),
    refreshExpiresAt: getRefreshTokenExpiry(),
  };
}
