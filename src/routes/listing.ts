import { Router } from "express";

import * as ListingController from "@/controller/listing";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/require-auth";
import {
  FavouriteListingSchema,
  GetListingSchema,
  GetListingsSchema,
  GetLocalitiesSchema,
  GetMapListingsSchema,
  SearchListingsSchema,
} from "@/types/request/listing";

const router = Router();

router.get(
  "/",
  requireAuth,
  validate({
    query: GetListingsSchema,
  }),
  ListingController.getListings,
);

router.get(
  "/search",
  requireAuth,
  validate({
    query: SearchListingsSchema,
  }),
  ListingController.searchListings,
);

router.get(
  "/map",
  requireAuth,
  validate({
    query: GetMapListingsSchema,
  }),
  ListingController.getMapListings,
);

router.get(
  "/localities",
  requireAuth,
  validate({
    query: GetLocalitiesSchema,
  }),
  ListingController.getLocalities,
);

router.put(
  "/fav",
  requireAuth,
  validate({
    body: FavouriteListingSchema,
  }),
  ListingController.favouriteListing,
);

router.get(
  "/:listingId",
  requireAuth,
  validate({
    params: GetListingSchema,
  }),
  ListingController.getListing,
);

export default router;
