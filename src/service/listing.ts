import {
  DEFAULT_LISTING_IMAGE,
  LISTING_SEARCH_RADIUS_METERS,
  SEARCH_SORT_CONFIG,
} from "@/config/constants";
import { QUICK_FILTERS } from "@/config/quick-filters";
import { ListingModel } from "@/models/listing.model";
import { UserModel } from "@/models/user.model";

import {
  FavouriteListingBody,
  GetListingsQuery,
  GetLocalitiesQuery,
  GetMapListingsQuery,
  SearchListingsParams,
} from "@/types/request/listing";
import {
  GetListingResponse,
  GetListingsResponse,
  GetMapListingsResponse,
  ListingCardResponse,
  MapListingsResponse,
  GetSearchListingsResponse,
  ToggleFavouriteListingResponse,
  GetLocalitiesResponse,
} from "@/types/response/listing";
import {
  buildSearchPipeline,
  buildSearchQuery,
  decodeListingCursor,
  encodeListingCursor,
  encodeSearchListingCursor,
} from "@/utils/listings";
import logger from "@/utils/logger";
import mongoose, { Types } from "mongoose";

export async function getListings(
  userId: string,
  input: GetListingsQuery,
): Promise<GetListingsResponse> {
  const { city, latitude, longitude, cursor, limit, quickFilters } = input;

  const user = await UserModel.findById(userId)
    .select("favorite_listings")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  const favoriteSet = new Set(
    user.favorite_listings.map((id) => id.toString()),
  );

  const query: Record<string, unknown> = {
    "data.city": city,
    "data.status": "active",
  };

  const selectedFilters = QUICK_FILTERS.filter((filter) =>
    quickFilters.includes(filter.id),
  );

  for (const filter of selectedFilters) {
    if (filter.query) {
      Object.assign(query, filter.query);
    }
  }

  const decodedCursor = cursor ? decodeListingCursor(cursor) : undefined;

  const listings = await ListingModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        key: "data.location",
        distanceField: "distance",
        maxDistance: LISTING_SEARCH_RADIUS_METERS,
        spherical: true,
        query,
      },
    },

    // $geoNear already sorts by distance ASC.
    // _id is the deterministic tie-breaker.
    {
      $sort: {
        distance: 1,
        _id: 1,
      },
    },

    // Continue after the cursor.
    ...(decodedCursor
      ? [
          {
            $match: {
              $or: [
                {
                  distance: {
                    $gt: decodedCursor.distance,
                  },
                },
                {
                  distance: decodedCursor.distance,
                  _id: {
                    $gt: new Types.ObjectId(decodedCursor.id),
                  },
                },
              ],
            },
          },
        ]
      : []),

    {
      $limit: limit + 1,
    },
  ]);

  const hasNext = listings.length > limit;

  const page = hasNext ? listings.slice(0, limit) : listings;

  const data: ListingCardResponse[] = page.map((listing) => ({
    id: listing._id.toString(),
    title: listing.data.title,
    coverImage:
      listing.data.cover_image ||
      listing.data.images?.[0] ||
      DEFAULT_LISTING_IMAGE,
    address: {
      locality: listing.data.locality,
      city: listing.data.city,
    },
    location: {
      latitude: listing.data.location.coordinates[1],
      longitude: listing.data.location.coordinates[0],
    },
    rent: listing.data.rent,
    bhk: listing.data.bhk,
    occupancy: listing.data.occupancy,
    availableFrom: listing.data.available_from
      ? new Date(listing.data.available_from).toISOString()
      : undefined,
    availableImmediately: listing.data.available_immediately,
    tags: [
      listing.data.furnished_status,
      listing.data.floor !== undefined ? `${listing.data.floor}F` : undefined,
      ...(listing.data.pets_present ? ["Pets"] : []),
      ...(listing.data.wifi ? ["WiFi"] : []),
    ]
      .filter((tag): tag is string => tag !== undefined)
      .slice(0, 4),
    favorite: favoriteSet.has(listing._id.toString()),
  }));

  const lastListing = page.at(-1);

  const nextCursor =
    hasNext && lastListing
      ? encodeListingCursor({
          distance: lastListing.distance,
          id: lastListing._id.toString(),
        })
      : null;

  return {
    success: true,
    data,
    pagination: {
      nextCursor,
      hasNext,
    },
  };
}

export async function searchListings(
  userId: string,
  input: SearchListingsParams,
): Promise<GetSearchListingsResponse> {
  const { limit, sortBy, sortOrder } = input;

  const user = await UserModel.findById(userId)
    .select("favorite_listings")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  const favoriteSet = new Set(
    user.favorite_listings.map((id) => id.toString()),
  );

  const query = buildSearchQuery(input);

  const pipeline = buildSearchPipeline(input, query);

  const listings = await ListingModel.aggregate(pipeline);

  const hasNext = listings.length > limit;

  const page = hasNext ? listings.slice(0, limit) : listings;

  const data: ListingCardResponse[] = page.map((listing) => ({
    id: listing._id.toString(),

    title: listing.data.title,

    coverImage:
      listing.data.cover_image ||
      listing.data.images?.[0] ||
      DEFAULT_LISTING_IMAGE,

    address: {
      locality: listing.data.locality,
      city: listing.data.city,
    },

    location: {
      latitude: listing.data.location.coordinates[1],
      longitude: listing.data.location.coordinates[0],
    },

    rent: listing.data.rent,

    bhk: listing.data.bhk,

    occupancy: listing.data.occupancy,

    availableFrom: listing.data.available_from
      ? new Date(listing.data.available_from).toISOString()
      : undefined,

    availableImmediately: listing.data.available_immediately,

    tags: [
      listing.data.furnished_status,
      listing.data.floor !== undefined ? `${listing.data.floor}F` : undefined,
    ]
      .filter((tag): tag is string => tag !== undefined)
      .slice(0, 4),

    favorite: favoriteSet.has(listing._id.toString()),
  }));

  const lastListing = page.at(-1);

  const sortConfig = SEARCH_SORT_CONFIG[sortBy];
  const nextCursor =
    hasNext && lastListing
      ? encodeSearchListingCursor({
          id: lastListing._id.toString(),
          value: sortConfig.getValue(lastListing),
          sortBy,
          sortOrder,
        })
      : null;

  return {
    success: true,
    data,
    pagination: {
      nextCursor,
      hasNext,
    },
  };
}

export async function getMapListings(
  userId: string,
  input: GetMapListingsQuery,
): Promise<GetMapListingsResponse> {
  const { north, south, east, west, limit, quickFilters } = input;

  const user = await UserModel.findById(userId)
    .select("favorite_listings")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  const favoriteSet = new Set(
    user.favorite_listings.map((id) => id.toString()),
  );

  const query: Record<string, unknown> = {
    "data.status": "active",
    "data.location": {
      $geoWithin: {
        $box: [
          [west, south],
          [east, north],
        ],
      },
    },
  };

  const selectedFilters = QUICK_FILTERS.filter((filter) =>
    quickFilters.includes(filter.id),
  );

  for (const filter of selectedFilters) {
    if (filter.query) {
      Object.assign(query, filter.query);
    }
  }

  const listings = await ListingModel.find(query)
    .sort({ views: -1, _id: 1 })
    .limit(limit)
    .lean();

  const data: MapListingsResponse[] = listings.map((listing) => ({
    id: listing._id.toString(),
    location: {
      latitude: listing.data.location.coordinates[1],
      longitude: listing.data.location.coordinates[0],
    },
    rent: listing.data.rent,
    title: listing.data.title,
    coverImage:
      listing.data.cover_image ||
      listing.data.images?.[0] ||
      DEFAULT_LISTING_IMAGE,
    address: {
      locality: listing.data.locality,
      city: listing.data.city,
    },
    bhk: listing.data.bhk,
    occupancy: listing.data.occupancy,
    favorite: favoriteSet.has(listing._id.toString()),
  }));

  return {
    success: true,
    data,
  };
}

export const getLocalities = async (
  input: GetLocalitiesQuery,
): Promise<GetLocalitiesResponse> => {
  const localities = await ListingModel.distinct("data.locality", {
    "data.city": input.city,
    "data.status": "active",
    "data.locality": { $exists: true, $ne: "" },
  });

  localities.sort((a, b) => a.localeCompare(b));

  return {
    success: true,
    data: localities,
  };
};

export const toggleFavouriteListing = async (
  userId: string,
  input: FavouriteListingBody,
): Promise<ToggleFavouriteListingResponse> => {
  const { listingId, value } = input;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const listing = await ListingModel.findById(listingId).session(session);
    if (!listing) throw new Error("Listing not found");

    const user = await UserModel.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    const result = await UserModel.updateOne(
      {
        _id: userId,
        favorite_listings: value ? { $ne: listingId } : listingId,
      },
      value
        ? {
            $addToSet: {
              favorite_listings: listingId,
            },
          }
        : {
            $pull: {
              favorite_listings: listingId,
            },
          },
      { session },
    );

    if (result.modifiedCount === 1) {
      await ListingModel.updateOne(
        { _id: listingId },
        {
          $inc: {
            favorites: value ? 1 : -1,
          },
        },
        { session },
      );
    }

    await session.commitTransaction();
    return {
      success: true,
      data: {
        favorite: value,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
export async function getListing(
  userId: string,
  listingId: string,
): Promise<GetListingResponse> {
  logger.info("in service listing id is ", listingId);
  const [listing, user] = await Promise.all([
    ListingModel.findById(listingId).lean(),
    UserModel.findById(userId).select("favorite_listings").lean(),
  ]);

  if (!listing) {
    throw new Error("Listing not found");
  }

  logger.info(listing);

  if (!user) {
    throw new Error("User not found");
  }

  const favorite = user.favorite_listings.some(
    (id) => id.toString() === listing._id.toString(),
  );

  const { data, external_listing } = listing;

  return {
    success: true,

    data: {
      id: listing._id.toString(),

      title: data.title,

      images: data.images.length ? data.images : [DEFAULT_LISTING_IMAGE],
      coverImage:
        listing.data.cover_image ||
        listing.data.images?.[0] ||
        DEFAULT_LISTING_IMAGE,

      carpetArea: data.carpet_area ?? undefined,

      status: data.status,

      address: {
        locality: data.locality,
        city: data.city,
        address: data.address,
      },

      location: {
        latitude: data.location.coordinates[1],
        longitude: data.location.coordinates[0],
      },

      genderPreference: data.gender_preference,

      bhk: data.bhk,
      occupancy: data.occupancy,
      totalOccupancy: data.total_occupancy ?? undefined,

      furnishedStatus: data.furnished_status,

      floor: data.floor ?? undefined,

      addOns: data.add_ons.map((addon) => ({
        type: addon.type,
        desc: addon.desc ?? undefined,
      })),
      amenities: data.amenities.map((amenities) => ({
        type: amenities.type,
        desc: amenities.desc ?? undefined,
      })),
      houseRules: data.house_rules.map((houseRules) => ({
        type: houseRules.type,
        desc: houseRules.desc ?? undefined,
      })),

      rent: data.rent,
      deposit: data.deposit ?? undefined,
      brokerage: data.brokerage ?? undefined,
      setupCost: data.setup_cost ?? undefined,

      availableFrom: data.available_from?.toISOString(),
      availableImmediately: data.available_immediately,

      neighborhood: data.neighborhood,

      views: listing.views,
      favorites: listing.favorites,

      favorite,

      lister: external_listing?.lister
        ? {
            name: external_listing.lister.name,
            age: external_listing.lister.age ?? undefined,
            profilePic: external_listing.lister.profile_pic ?? undefined,
            contactNumber: external_listing.lister.contact_number ?? undefined,
            lifestyle: external_listing.lister.life_style ?? [],
          }
        : undefined,

      externalListing: external_listing
        ? {
            source: external_listing.source,
            url: external_listing.url,
          }
        : undefined,
    },
  };
}
