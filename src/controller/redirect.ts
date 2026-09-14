import { NextFunction, Request, Response } from "express";

import * as RedirectService from "@/service/redirect";
import { GetListingRedirectParams } from "@/types/request/redirect";

export async function getListingRedirect(
  req: Request<GetListingRedirectParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { listingId } = req.params;

    const redirectUrl = await RedirectService.getListingRedirect(listingId);

    res.redirect(302, redirectUrl);
  } catch (err) {
    next(err);
  }
}
