import { NextFunction, Request, Response } from "express";
import { UpsertBasicBody } from "@/types/request/user";
import * as UserService from "@/service/user";

export async function upsertBasicController(
  req: Request<{}, {}, UpsertBasicBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await UserService.upsertBasic(req.user!.id, req.body);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
