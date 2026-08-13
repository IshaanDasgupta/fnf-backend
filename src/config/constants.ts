export const ACCESS_TOKEN_EXPIRY = 60 * 15;
export const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30;
export const LISTING_SEARCH_RADIUS_METERS = 200_000;
export const DEFAULT_LISTING_IMAGE =
  "https://your-domain.com/images/default-listing.jpg";

export const LISTING_STATUSES = [
  "active",
  "rented",
  "draft",
  "expired",
] as const;

export const CITIES = ["mumbai", "pune", "bangalore", "hyderabad"] as const;

export const GENDER_PREFERENCES = ["male", "female"] as const;

export const BHK_TYPES = ["1RK", "1BHK", "2BHK", "3BHK"] as const;

export const OCCUPANCY_TYPES = ["single", "double", "triple"] as const;

export const FURNISHED_STATUSES = [
  "unfurnished",
  "semi-furnished",
  "fully-furnished",
] as const;

export const SERVICE_OPTIONS = ["included", "split"] as const;

export const AMENITY_TYPES = [
  "Kitchen",
  "AC",
  "Maid",
  "Washroom",
  "Water",
  "Parking",
  "Utility",
] as const;

export const HOUSE_RULE_TYPES = ["Smoking", "Food", "Pets"] as const;

export const NEIGHBORHOOD_TYPES = ["Railway Station", "Metro"] as const;

export const LISTING_SOURCES = ["app", "facebook", "reddit"] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];
export type City = (typeof CITIES)[number];
export type GenderPreference = (typeof GENDER_PREFERENCES)[number];
export type BhkType = (typeof BHK_TYPES)[number];
export type OccupancyType = (typeof OCCUPANCY_TYPES)[number];
export type FurnishedStatus = (typeof FURNISHED_STATUSES)[number];
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
export type AmenityType = (typeof AMENITY_TYPES)[number];
export type HouseRuleType = (typeof HOUSE_RULE_TYPES)[number];
export type NeighborhoodType = (typeof NEIGHBORHOOD_TYPES)[number];
export type ListingSource = (typeof LISTING_SOURCES)[number];
