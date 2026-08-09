import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthenticatedUser extends JwtPayload {
  userId: string;
  phone?: string;
}

export interface AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: AuthenticatedUser;
}

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}
