import { NextFunction, Request, Response } from "express";

import {
  FavouriteListingBody,
  GetListingsSchema,
  GetMapListingsSchema,
} from "@/types/request/listing";
import * as ListingService from "@/service/listing";

export async function getListings(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = GetListingsSchema.parse(req.query);
    const result = await ListingService.getListings(query);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMapListings(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = GetMapListingsSchema.parse(req.query);

    const result = await ListingService.getMapListings(query);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function favouriteListing(
  req: Request<{}, {}, FavouriteListingBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await ListingService.favouriteListing(
      req.user!.userId,
      req.body.listing_id,
      req.body.value,
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}
