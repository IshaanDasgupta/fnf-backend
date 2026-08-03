import { env } from "@/config/env";
import { twilioClient } from "@/config/twilio-client";

export async function sendOTP(phone: string) {
  return twilioClient.verify.v2.services(env.verifySid).verifications.create({
    to: phone,
    channel: "sms",
  });
}

export async function verifyOTP(phone: string, code: string) {
  return twilioClient.verify.v2
    .services(env.verifySid)
    .verificationChecks.create({
      to: phone,
      code,
    });
}
