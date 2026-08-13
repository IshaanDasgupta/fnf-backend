import { Router } from "express";

import * as ListingController from "@/controller/listing";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/require-auth";
import {
  FavouriteListingSchema,
  GetListingsSchema,
  GetMapListingsSchema,
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
  "/map",
  requireAuth,
  validate({
    query: GetMapListingsSchema,
  }),
  ListingController.getMapListings,
);

router.put(
  "/fav",
  requireAuth,
  validate({
    body: FavouriteListingSchema,
  }),
  ListingController.favouriteListing,
);

export default router;
