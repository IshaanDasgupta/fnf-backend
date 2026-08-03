import { Router } from "express";
import * as AuthController from "@/controller/auth";
import {
  RefreshSchema,
  SendOTPSchema,
  VerifyOTPSchema,
} from "@/types/request/auth";
import { validate } from "@/middleware/validate";

const router = Router();

router.post(
  "/send-otp",
  validate({
    body: SendOTPSchema,
  }),
  AuthController.sendOTP,
);

router.post(
  "/verify-otp",
  validate({
    body: VerifyOTPSchema,
  }),
  AuthController.verifyOTP,
);

router.post(
  "/refresh",
  validate({
    body: RefreshSchema,
  }),
  AuthController.refresh,
);

export default router;
