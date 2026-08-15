import { CITIES } from "@/config/constants";
import { QUICK_FILTER_IDS } from "@/config/quick-filters";
import { Types } from "mongoose";
import { z } from "zod";

const QuickFilterIdSchema = z.enum(QUICK_FILTER_IDS);

export const ListingCursorSchema = z.object({
  distance: z.number().finite().nonnegative(),
  id: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid listing ID",
  }),
});

export const GetListingsSchema = z.object({
  city: z.enum(CITIES),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),

  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),

  quickFilters: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(QuickFilterIdSchema)),
});

export const FavouriteListingSchema = z.object({
  listingId: z.string(),
  value: z.boolean(),
});

export const GetMapListingsSchema = z.object({
  north: z.coerce.number().min(-90).max(90),
  south: z.coerce.number().min(-90).max(90),
  east: z.coerce.number().min(-180).max(180),
  west: z.coerce.number().min(-180).max(180),

  limit: z.coerce.number().int().min(1).max(500).default(200),

  quickFilters: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(QuickFilterIdSchema)),
});

export const GetListingSchema = z.object({
  listingId: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid listing ID",
  }),
});

export type ListingCursor = z.infer<typeof ListingCursorSchema>;
export type GetListingsQuery = z.infer<typeof GetListingsSchema>;
export type GetMapListingsQuery = z.infer<typeof GetMapListingsSchema>;
export type FavouriteListingBody = z.infer<typeof FavouriteListingSchema>;
export type GetListingParams = z.infer<typeof GetListingSchema>;
