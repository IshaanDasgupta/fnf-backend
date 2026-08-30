import {
  LISTING_SEARCH_RADIUS_METERS,
  SEARCH_SORT_CONFIG,
} from "@/config/constants";
import {
  ListingCursor,
  ListingCursorSchema,
  SearchListingCursor,
  SearchListingCursorSchema,
  SearchListingsParams,
} from "@/types/request/listing";
import mongoose from "mongoose";
import { Types } from "mongoose";

export function encodeListingCursor(cursor: ListingCursor): string {
  const json = JSON.stringify(cursor);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeListingCursor(cursor: string): ListingCursor {
  let decoded: string;

  try {
    decoded = Buffer.from(cursor, "base64url").toString("utf8");
  } catch {
    throw new Error("Invalid cursor encoding");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new Error("Invalid cursor format");
  }

  return ListingCursorSchema.parse(parsed);
}

export function encodeSearchListingCursor(cursor: SearchListingCursor): string {
  const json = JSON.stringify(cursor);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeSearchListingCursor(cursor: string): SearchListingCursor {
  let decoded: string;

  try {
    decoded = Buffer.from(cursor, "base64url").toString("utf8");
  } catch {
    throw new Error("Invalid cursor encoding");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new Error("Invalid cursor format");
  }

  return SearchListingCursorSchema.parse(parsed);
}

export function buildSearchQuery(input: SearchListingsParams) {
  const {
    city,
    locality,
    bhk,
    occupancy,
    furnishedStatus,
    rentMin,
    rentMax,
    floorMin,
    floorMax,
    totalOccupancyMin,
    totalOccupancyMax,
    availableImmediately,
    availableAfter,
    addOns,
    amenities,
    houseRules,
  } = input;

  const query: Record<string, unknown> = {
    "data.city": city,
    "data.status": "active",
  };

  if (locality) {
    query["data.locality"] = {
      $regex: `^${locality}$`,
      $options: "i",
    };
  }

  const inFilters = {
    "data.bhk": bhk,
    "data.occupancy": occupancy,
    "data.furnished_status": furnishedStatus,
  };

  for (const [field, values] of Object.entries(inFilters)) {
    if (values.length > 0) {
      query[field] = { $in: values };
    }
  }

  const rangeFilters = {
    "data.rent": [rentMin, rentMax],
    "data.floor": [floorMin, floorMax],
    "data.total_occupancy": [totalOccupancyMin, totalOccupancyMax],
  };

  for (const [field, [min, max]] of Object.entries(rangeFilters)) {
    if (min !== undefined || max !== undefined) {
      query[field] = {
        ...(min !== undefined && { $gte: min }),
        ...(max !== undefined && { $lte: max }),
      };
    }
  }

  if (availableImmediately !== undefined) {
    query["data.available_immediately"] = availableImmediately;
  }

  if (availableAfter !== undefined) {
    query["data.available_from"] = { $gte: availableAfter };
  }

  const allFilters = {
    "data.add_ons.type": addOns,
    "data.amenities.type": amenities,
    "data.house_rules.type": houseRules,
  };

  for (const [field, values] of Object.entries(allFilters)) {
    if (values.length > 0) {
      query[field] = { $all: values };
    }
  }

  return query;
}

export function buildSearchPipeline(
  input: SearchListingsParams,
  query: Record<string, unknown>,
): mongoose.PipelineStage[] {
  const {
    latitude,
    longitude,
    totalInitCostMin,
    totalInitCostMax,
    cursor,
    limit,
    sortBy,
    sortOrder,
  } = input;

  const pipeline: mongoose.PipelineStage[] = [
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
  ];

  if (totalInitCostMin !== undefined || totalInitCostMax !== undefined) {
    const totalInitCostExpression = {
      $add: [
        "$data.rent",
        { $ifNull: ["$data.deposit", 0] },
        { $ifNull: ["$data.brokerage", 0] },
        { $ifNull: ["$data.setup_cost", 0] },
      ],
    };

    const conditions: object[] = [];

    if (totalInitCostMin !== undefined) {
      conditions.push({
        $gte: [totalInitCostExpression, totalInitCostMin],
      });
    }

    if (totalInitCostMax !== undefined) {
      conditions.push({
        $lte: [totalInitCostExpression, totalInitCostMax],
      });
    }

    pipeline.push({
      $match: {
        $expr: {
          $and: conditions,
        },
      },
    });
  }

  if (sortBy === "creation_date") {
    pipeline.push({
      $addFields: {
        sortValue: { $toLong: "$createdAt" },
      },
    });
  }

  const sortConfig = SEARCH_SORT_CONFIG[sortBy];
  const decodedCursor = cursor ? decodeSearchListingCursor(cursor) : undefined;

  if (decodedCursor) {
    if (
      decodedCursor.sortBy !== sortBy ||
      decodedCursor.sortOrder !== sortOrder
    ) {
      throw new Error("Cursor does not match requested sorting");
    }

    const operator = sortOrder === "asc" ? "$gt" : "$lt";

    pipeline.push({
      $match: {
        $or: [
          {
            [sortConfig.field]: {
              [operator]: decodedCursor.value,
            },
          },
          {
            [sortConfig.field]: decodedCursor.value,
            _id: {
              [operator]: new Types.ObjectId(decodedCursor.id),
            },
          },
        ],
      },
    });
  }

  pipeline.push({
    $sort: {
      [sortConfig.field]: sortOrder === "asc" ? 1 : -1,
      _id: sortOrder === "asc" ? 1 : -1,
    },
  });

  pipeline.push({
    $limit: limit + 1,
  });

  return pipeline;
}
