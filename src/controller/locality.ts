import { NextFunction, Request, Response } from "express";

import * as LoclityService from "@/service/locality";
import { GetLocalitiesSchema } from "@/types/request/locality";

export async function getLocalities(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = GetLocalitiesSchema.parse(req.query);
    const result = await LoclityService.getLocalities(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
