import { NextFunction, Request, Response } from "express";

import {
  FavouriteListingBody,
  GetListingParams,
  GetListingsSchema,
  GetMapListingsSchema,
} from "@/types/request/listing";
import * as ListingService from "@/service/listing";
import logger from "@/utils/logger";

export async function getListings(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = GetListingsSchema.parse(req.query);
    const result = await ListingService.getListings(req.user!.id, query);
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
    const result = await ListingService.getMapListings(req.user!.id, query);
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
    const result = await ListingService.toggleFavouriteListing(
      req.user!.id,
      req.body,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getListing(
  req: Request<GetListingParams, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { listingId } = req.params;

    logger.info("trying to get listing ", listingId);

    const result = await ListingService.getListing(req.user!.id, listingId);

    res.json(result);
  } catch (err) {
    next(err);
  }
}
