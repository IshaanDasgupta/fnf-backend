import {
  ADD_ON_TYPES,
  AMENITY_TYPES,
  BHK_TYPES,
  CITIES,
  FURNISHED_STATUSES,
  GENDER_PREFERENCES,
  HOUSE_RULE_TYPES,
  RENTAL_SCOPE_TYPES,
  SERVICES_TYPES,
} from "@/config/constants";
import { QUICK_FILTER_IDS } from "@/config/quick-filters";
import { Types } from "mongoose";
import { z } from "zod";

const CitySchema = z.enum(CITIES);
const BHKTypeSchema = z.enum(BHK_TYPES);
const RentalScopeTypeSchema = z.enum(RENTAL_SCOPE_TYPES);
const FurnishedStatusSchema = z.enum(FURNISHED_STATUSES);
const AddOnTypeSchema = z.enum(ADD_ON_TYPES);
const AmenityTypeSchema = z.enum(AMENITY_TYPES);
const HouseRuleTypeSchema = z.enum(HOUSE_RULE_TYPES);
const ServiceTypeSchema = z.enum(SERVICES_TYPES);
const QuickFilterIdSchema = z.enum(QUICK_FILTER_IDS);

export const ListingCursorSchema = z.object({
  distance: z.number().finite().nonnegative(),
  id: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid listing ID",
  }),
});

export const SearchListingCursorSchema = z.object({
  id: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid listing ID",
  }),

  value: z.number().finite(),

  sortBy: z.enum(["distance", "rent", "creation_date", "favorites", "views"]),

  sortOrder: z.enum(["asc", "desc"]),
});

export const FilterSchema = z.object({
  locality: z.string().trim().min(1).optional(),

  bhk: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(BHKTypeSchema)),

  rentalType: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(RentalScopeTypeSchema)),

  furnishedStatus: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(FurnishedStatusSchema)),

  rentMin: z.coerce.number().finite().nonnegative().optional(),
  rentMax: z.coerce.number().finite().nonnegative().optional(),

  totalInitCostMin: z.coerce.number().finite().nonnegative().optional(),
  totalInitCostMax: z.coerce.number().finite().nonnegative().optional(),

  floorMin: z.coerce.number().finite().nonnegative().optional(),
  floorMax: z.coerce.number().finite().nonnegative().optional(),

  capacity: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",").map((item) => {
        const normalized = item.trim().toLowerCase();

        if (
          normalized === "3plus" ||
          normalized === "3+" ||
          normalized === "3 plus" ||
          normalized === "3"
        ) {
          return "3plus";
        }

        return normalized;
      });
    })
    .pipe(z.array(z.enum(["1", "2", "3plus"]))),

  totalOccupancyMin: z.coerce.number().int().positive().optional(),
  totalOccupancyMax: z.coerce.number().int().positive().optional(),

  attachedWashroom: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  gender: z.enum(GENDER_PREFERENCES).optional(),

  availableImmediately: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  availableAfter: z.coerce.date().optional(),

  addOns: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(AddOnTypeSchema)),

  amenities: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(AmenityTypeSchema)),

  houseRules: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(HouseRuleTypeSchema)),

  services: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      return value.split(",");
    })
    .pipe(z.array(ServiceTypeSchema)),
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

  ...FilterSchema.shape,
});

export const GetListingSchema = z.object({
  listingId: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid listing ID",
  }),
});

export const SearchListingsSchema = z.object({
  city: CitySchema,
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),

  ...FilterSchema.shape,

  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),

  sortBy: z.enum(["distance", "rent", "creation_date", "favorites", "views"]),
  sortOrder: z.enum(["asc", "desc"]),
});

export type ListingCursor = z.infer<typeof ListingCursorSchema>;
export type SearchListingCursor = z.infer<typeof SearchListingCursorSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type GetListingsQuery = z.infer<typeof GetListingsSchema>;
export type GetMapListingsQuery = z.infer<typeof GetMapListingsSchema>;
export type FavouriteListingBody = z.infer<typeof FavouriteListingSchema>;
export type GetListingParams = z.infer<typeof GetListingSchema>;
export type SearchListingsParams = z.infer<typeof SearchListingsSchema>;
