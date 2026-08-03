import { AuthUser } from "@/types/auth";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}
