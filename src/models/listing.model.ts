import { InferSchemaType, Schema, model } from "mongoose";

import {
  AMENITY_TYPES,
  BHK_TYPES,
  CITIES,
  FURNISHED_STATUSES,
  GENDER_PREFERENCES,
  HOUSE_RULE_TYPES,
  LISTING_SOURCES,
  LISTING_STATUSES,
  NEIGHBORHOOD_TYPES,
  OCCUPANCY_TYPES,
  SERVICE_OPTIONS,
} from "@/config/constants";

type Location = {
  type: "Point";
  coordinates: [number, number];
};

const locationSchema = new Schema<Location>(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (value: number[]) => value.length === 2,
        message: "Coordinates must contain exactly [longitude, latitude]",
      },
    },
  },
  {
    _id: false,
  },
);

const parkingSchema = new Schema(
  {
    bike: {
      type: Boolean,
      default: false,
    },

    car: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const amenitySchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: AMENITY_TYPES,
    },

    desc: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const houseRuleSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: HOUSE_RULE_TYPES,
    },

    desc: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const neighborhoodSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: NEIGHBORHOOD_TYPES,
    },

    distance: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const listingDataSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    cover_image: {
      type: String,
    },

    carpet_area: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      required: true,
      enum: LISTING_STATUSES,
      default: "active",
    },

    city: {
      type: String,
      required: true,
      enum: CITIES,
    },

    locality: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: locationSchema,
      required: true,
    },

    gender_preference: {
      type: String,
      required: true,
      enum: GENDER_PREFERENCES,
    },

    bhk: {
      type: String,
      required: true,
      enum: BHK_TYPES,
    },

    occupancy: {
      type: String,
      enum: OCCUPANCY_TYPES,
      required: true,
    },

    total_occupancy: {
      type: Number,
      min: 1,
    },

    furnished_status: {
      type: String,
      required: true,
      enum: FURNISHED_STATUSES,
    },

    attached_bathroom: {
      type: Boolean,
      default: false,
    },

    balcony: {
      type: Boolean,
      default: false,
    },

    floor: {
      type: Number,
      min: 0,
    },

    wifi: {
      type: String,
      enum: SERVICE_OPTIONS,
    },

    cook: {
      type: String,
      enum: SERVICE_OPTIONS,
    },

    maid: {
      type: String,
      enum: SERVICE_OPTIONS,
    },

    parking: {
      type: parkingSchema,
    },

    amenities: {
      type: [amenitySchema],
      default: [],
    },

    house_rules: {
      type: [houseRuleSchema],
      default: [],
    },

    pets_present: {
      type: Boolean,
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
    },

    deposit: {
      type: Number,
      min: 0,
    },

    brokerage: {
      type: Number,
      min: 0,
    },

    setup_cost: {
      type: Number,
      min: 0,
    },

    available_from: {
      type: Date,
    },

    available_immediately: {
      type: Boolean,
      required: true,
      default: false,
    },

    neighborhood: {
      type: [neighborhoodSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const externalListerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    profile_pic: {
      type: String,
    },

    contact_number: {
      type: String,
    },

    life_style: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const externalListingSchema = new Schema(
  {
    source: {
      type: String,
      enum: LISTING_SOURCES,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    lister: {
      type: externalListerSchema,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export const listingSchema = new Schema(
  {
    data: {
      type: listingDataSchema,
      required: true,
    },

    views: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    favorites: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    external_listing: {
      type: externalListingSchema,
    },

    lister_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

listingSchema.index({
  "data.location": "2dsphere",
});

export type Listing = InferSchemaType<typeof listingSchema>;

export const ListingModel = model<Listing>("Listing", listingSchema);
