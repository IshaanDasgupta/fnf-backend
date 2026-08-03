import twilio from "twilio";
import { env } from "./env";

export const twilioClient = twilio(env.accountSid, env.authToken);
