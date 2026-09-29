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
    "property.city": city,
    status: "active",
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
        key: "property.location",
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
    coverImage:
      listing.cover_image || listing.images?.[0] || DEFAULT_LISTING_IMAGE,
    address: {
      locality: listing.property.locality,
      city: listing.property.city,
    },
    rent: listing.pricing.rent,
    bhk: listing.property.bhk,
    rentalScope: {
      type: listing.rental_scope.type,
      capacity: listing.rental_scope.capacity,
      totalOccupancy: listing.rental_scope.total_occupancy,
    },
    furnishedStatus: listing.property.furnished_status,
    genderPreference: listing.preferences?.gender ?? undefined,
    availableFrom: listing.availability?.available_from
      ? new Date(listing.availability.available_from).toISOString()
      : undefined,
    availableImmediately:
      listing.availability?.available_immediately ?? false,
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
  const { limit, sortBy, sortOrder, city } = input;

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

  query["property.city"] = city;

  const pipeline = buildSearchPipeline(input, query);

  const listings = await ListingModel.aggregate(pipeline);

  const hasNext = listings.length > limit;

  const page = hasNext ? listings.slice(0, limit) : listings;

  const data: ListingCardResponse[] = page.map((listing) => ({
    id: listing._id.toString(),
    coverImage:
      listing.cover_image || listing.images?.[0] || DEFAULT_LISTING_IMAGE,
    address: {
      locality: listing.property.locality,
      city: listing.property.city,
    },
    rent: listing.pricing.rent,
    bhk: listing.property.bhk,
    rentalScope: {
      type: listing.rental_scope.type,
      capacity: listing.rental_scope.capacity,
      totalOccupancy: listing.rental_scope.total_occupancy,
    },
    furnishedStatus: listing.property.furnished_status,
    genderPreference: listing.preferences?.gender ?? undefined,
    availableFrom: listing.availability?.available_from
      ? new Date(listing.availability.available_from).toISOString()
      : undefined,

    availableImmediately:
      listing.availability?.available_immediately ?? false,
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
  const { north, south, east, west, limit } = input;

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

  query["property.location"] = {
    $geoWithin: {
      $box: [
        [west, south],
        [east, north],
      ],
    },
  };

  const listings = await ListingModel.find(query)
    .sort({ views: -1, _id: 1 })
    .limit(limit)
    .lean();

  const data: MapListingsResponse[] = listings.map((listing) => ({
    id: listing._id.toString(),
    location: {
      latitude: listing.property.location.coordinates[1],
      longitude: listing.property.location.coordinates[0],
    },
    rent: listing.pricing.rent,
    coverImage:
      listing.cover_image || listing.images?.[0] || DEFAULT_LISTING_IMAGE,
    address: {
      locality: listing.property.locality,
      city: listing.property.city,
    },
    bhk: listing.property.bhk,
    rentalScope: {
      type: listing.rental_scope.type,
      capacity: listing.rental_scope.capacity,
      totalOccupancy: listing.rental_scope.total_occupancy,
    },
    furnishedStatus: listing.property.furnished_status,
    genderPreference: listing.preferences?.gender ?? undefined,
    favorite: favoriteSet.has(listing._id.toString()),
  }));

  return {
    success: true,
    data,
  };
}
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

  const {
    property,
    rental_scope,
    pricing,
    availability,
    preferences,
    services,
    add_ons,
    amenities,
    house_rules,
    nearby_places,
    images,
    cover_image,
    status,
    views,
    favorites,
    lister_id,
    external_listing,
  } = listing as any;

  return {
    success: true,

    data: {
      id: listing._id.toString(),

      images: images?.length ? images : [DEFAULT_LISTING_IMAGE],
      coverImage: cover_image || images?.[0] || DEFAULT_LISTING_IMAGE,

      carpetArea: property?.carpet_area ?? undefined,
      attachedWashroom: property?.attached_washroom ?? undefined,

      status,

      address: {
        locality: property.locality,
        city: property.city,
        address: property.address,
      },

      location: {
        latitude: property.location.coordinates[1],
        longitude: property.location.coordinates[0],
      },

      genderPreference: preferences?.gender ?? undefined,

      bhk: property.bhk,
      rentalScope: {
        type: rental_scope.type,
        capacity: rental_scope.capacity,
        totalOccupancy: rental_scope.total_occupancy,
      },

      furnishedStatus: property.furnished_status,

      floor: property?.floor ?? undefined,

      services: (services ?? []).map((service: any) => ({
        type: service.type,
        desc: service.desc ?? undefined,
        price: service.price ?? undefined,
        included: service.included ?? false,
      })),
      addOns: (add_ons ?? []).map((addon: any) => ({
        type: addon.type,
        desc: addon.desc ?? undefined,
      })),
      amenities: (amenities ?? []).map((amenity: any) => ({
        type: amenity.type,
        desc: amenity.desc ?? undefined,
      })),
      houseRules: (house_rules ?? []).map((rule: any) => ({
        type: rule.type,
        desc: rule.desc ?? undefined,
      })),

      rent: pricing.rent,
      deposit: pricing?.deposit ?? undefined,
      brokerage: pricing?.brokerage ?? undefined,
      setupCost: pricing?.setup_cost ?? undefined,
      moveInCharges: pricing?.move_in_charges ?? undefined,

      availableFrom: availability?.available_from
        ? new Date(availability.available_from).toISOString()
        : undefined,
      availableImmediately: availability?.available_immediately ?? false,

      nearbyPlaces: (nearby_places ?? []).map((place: any) => ({
        type: place.type,
        name: place.name,
        distance: place.distance,
      })),

      views,
      favorites,

      favorite,

      listerId: lister_id ?? undefined,

      externalListing: external_listing
        ? {
            source: external_listing.source,
            url: external_listing.url,
            author: external_listing.author,
          }
        : undefined,
    },
  };
}
