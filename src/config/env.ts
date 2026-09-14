import dotenv from "dotenv";
dotenv.config();

export const env = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  verifySid: process.env.TWILIO_VERIFY_SERVICE_SID!,
  jwtSecret: process.env.JWT_SECRET!,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  appDeeplinkScheme: process.env.APP_DEEP_LINK_SCHEME,
  androidPackageName: process.env.ANDROID_PACKAGE_NAME,
};
