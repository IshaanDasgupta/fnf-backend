import { QUICK_FILTERS } from "@/config/quick-filters";
import { DUMMY_LISTINGS } from "@/data/dummy_listings";
import { Listing } from "@/types/listing";
import {
  GetListingsQuery,
  GetMapListingsQuery,
  GetMapListingsSchema,
} from "@/types/request/listing";
import {
  GetListingsResponse,
  GetMapListingsResponse,
  ListingCardResponse,
  MapListingsResponse,
} from "@/types/response/listing";

export async function getListings({
  cursor,
  limit,
  quickFilters,
}: GetListingsQuery): Promise<GetListingsResponse> {
  const selectedFilters = QUICK_FILTERS.filter((filter) =>
    quickFilters.includes(filter.id),
  );

  const filteredListings = DUMMY_LISTINGS.filter((listing) =>
    selectedFilters.every((filter) => filter.filter(listing)),
  );

  let startIndex = 0;

  if (cursor) {
    const index = filteredListings.findIndex(
      (listing) => listing._id === cursor,
    );

    if (index >= 0) {
      startIndex = index + 1;
    }
  }

  const page = filteredListings.slice(startIndex, startIndex + limit);

  const data: ListingCardResponse[] = page.map((listing) => ({
    id: listing._id,

    title: listing.listing.title,

    coverImage: listing.listing.cover_image ?? listing.listing.images?.[0],

    address: {
      locality: listing.listing.locality,
      city: listing.listing.city,
    },

    location: {
      latitude: listing.listing.location.latitude,
      longitude: listing.listing.location.longitude,
    },

    rent: listing.listing.rent,

    bhk: listing.listing.bhk ?? "N/A",

    occupancy: listing.listing.occupency,

    availableFrom: listing.listing.available_from
      ? new Date(listing.listing.available_from).toISOString()
      : undefined,

    availableImmediately: listing.listing.available_immediately,

    tags: [
      listing.listing.furnised_status,
      `${listing.listing.floor}F`,
      ...(listing.listing.pets_present ? ["Pets"] : []),
      ...(listing.listing.wifi ? ["WiFi"] : []),
      ...(listing.listing.parking?.car ? ["Car Parking"] : []),
    ].slice(0, 4),

    favorite: Math.random() > 0.7,
  }));

  return {
    data,

    pagination: {
      nextCursor: data.length === limit ? data[data.length - 1].id : null,

      hasNext: startIndex + limit < filteredListings.length,
    },
  };
}

export async function getMapListings({
  north,
  south,
  east,
  west,
  limit,
  quickFilters,
}: GetMapListingsQuery): Promise<GetMapListingsResponse> {
  const selectedFilters = QUICK_FILTERS.filter((filter) =>
    quickFilters.includes(filter.id),
  );

  const viewportListings = DUMMY_LISTINGS.filter((listing) =>
    isInsideViewport(listing, {
      north,
      south,
      east,
      west,
    }),
  );

  const filteredListings = viewportListings.filter((listing) =>
    selectedFilters.every((filter) => filter.filter(listing)),
  );

  const page = filteredListings.slice(0, limit);

  const data: MapListingsResponse[] = page.map((listing) => ({
    id: listing._id,

    location: {
      latitude: listing.listing.location.latitude,
      longitude: listing.listing.location.longitude,
    },

    rent: listing.listing.rent,

    title: listing.listing.title,

    coverImage: listing.listing.cover_image ?? listing.listing.images?.[0],

    address: {
      locality: listing.listing.locality,
      city: listing.listing.city,
    },

    bhk: listing.listing.bhk ?? "N/A",

    occupancy: listing.listing.occupency,

    favorite: Math.random() > 0.7,
  }));

  return {
    data,
    hasMore: filteredListings.length > limit,
  };
}

function isInsideViewport(
  listing: Listing,
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  },
): boolean {
  const { latitude, longitude } = listing.listing.location;

  return (
    latitude >= bounds.south &&
    latitude <= bounds.north &&
    longitude >= bounds.west &&
    longitude <= bounds.east
  );
}

export const favouriteListing = async (
  userId: string,
  listingId: string,
  value: boolean,
) => {
  //TODO: Implementation
  return {
    success: true,
    message: `Set favourite to ${value} for ${listingId} for user ${userId}`,
  };
};
