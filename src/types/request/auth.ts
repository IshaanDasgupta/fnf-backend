import { z } from "zod";

export const SendOTPSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must be in E.164 format (e.g. +919876543210)",
    ),
});

export const VerifyOTPSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export const GoogleLoginSchema = z.object({
  idToken: z.string(),
});

export const RefreshSchema = z.object({
  refreshToken: z.string(),
});

export type SendOTPBody = z.infer<typeof SendOTPSchema>;
export type VerifyOTPBody = z.infer<typeof VerifyOTPSchema>;
export type GoogleLoginBody = z.infer<typeof GoogleLoginSchema>;
export type RefreshBody = z.infer<typeof RefreshSchema>;
