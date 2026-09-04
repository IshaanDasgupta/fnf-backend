import { googleClient } from "@/config/google-auth-client";
import { UserModel } from "@/models/user.model";
import { verifyRefreshToken } from "@/service/jwt";
import * as TwilioService from "@/service/twilio";
import { generateAuthResponse } from "@/utils/auth";

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

  return generateAuthResponse(user);
}

export async function googleLogin(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google token");

  const googleId = payload.sub;
  if (!googleId) throw new Error("Google account ID not found");

  const email = payload.email;
  if (!email) throw new Error("Google account email not found");
  if (!payload.email_verified) throw new Error("Google email is not verified");

  let user = await UserModel.findOne({
    google_id: googleId,
  });

  if (!user) {
    user = await UserModel.create({
      google_id: googleId,
      email,
      name: payload.name,
    });
  }

  return generateAuthResponse(user);
}

export async function refresh(refreshToken: string) {
  const { id: userId } = verifyRefreshToken(refreshToken);

  const user = await UserModel.findOne({
    _id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return generateAuthResponse(user);
}
