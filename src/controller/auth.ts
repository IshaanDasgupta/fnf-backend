import { Request, Response, NextFunction } from "express";
import * as AuthService from "@/service/auth";
import { RefreshBody, SendOTPBody, VerifyOTPBody } from "@/types/request/auth";

export async function sendOTP(
  req: Request<{}, {}, SendOTPBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { phone } = req.body;
    await AuthService.sendOTP(phone);
    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOTP(
  req: Request<{}, {}, VerifyOTPBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { phone, otp } = req.body;
    const result = await AuthService.verifyOTP(phone, otp);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request<{}, {}, RefreshBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await AuthService.refresh(req.body.refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
