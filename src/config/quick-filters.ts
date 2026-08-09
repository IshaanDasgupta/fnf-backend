import { Listing } from "@/types/listing";
import { z } from "zod";

export type QuickFilter = {
  id: string;
  label: string;
  filter: (listing: Listing) => boolean;
};

export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: "all",
    label: "All",
    filter: () => true,
  },
  {
    id: "near",
    label: "Near me",
    filter: () => true,
  },
  {
    id: "furnished",
    label: "Furnished",
    filter: (listing) =>
      listing.listing.furnised_status === "fully-furnished" ||
      listing.listing.furnised_status === "semi-furnished",
  },
  {
    id: "under-15k",
    label: "Under ₹15K",
    filter: (listing) => listing.listing.rent < 15_000,
  },
  {
    id: "available-now",
    label: "Available Now",
    filter: (listing) => listing.listing.available_immediately,
  },
  {
    id: "single-occupancy",
    label: "Single Occupancy",
    filter: (listing) => listing.listing.occupency === "single",
  },
  {
    id: "attached-bathroom",
    label: "Attached Bathroom",
    filter: (listing) => listing.listing.attached_bathroom,
  },
  {
    id: "parking",
    label: "Parking",
    filter: (listing) =>
      listing.listing.parking?.bike === true ||
      listing.listing.parking?.car === true,
  },
  {
    id: "wifi",
    label: "Wi-Fi Included",
    filter: (listing) => listing.listing.wifi === "included",
  },
  {
    id: "pet-friendly",
    label: "Pet Friendly",
    filter: (listing) => listing.listing.pets_present === true,
  },
  {
    id: "1bhk",
    label: "1 BHK",
    filter: (listing) => listing.listing.bhk === "1BHK",
  },
  {
    id: "2bhk",
    label: "2 BHK",
    filter: (listing) => listing.listing.bhk === "2BHK",
  },
];

export const QUICK_FILTER_IDS = QUICK_FILTERS.map((filter) => filter.id) as [
  string,
  ...string[],
];
