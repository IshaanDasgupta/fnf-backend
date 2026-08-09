import {
  AmenityType,
  BhkType,
  City,
  FurnishedStatus,
  GenderPreference,
  HouseRuleType,
  ListingSource,
  ListingStatus,
  NeighborhoodType,
  OccupancyType,
  ServiceOption,
} from "@/config/constants";

export type Listing = {
  _id: string;

  listing: {
    title: string;
    images: string[];
    cover_image?: string;
    carpet_area?: number;

    status: ListingStatus;

    city: City;
    locality: string;
    address: string;

    location: {
      latitude: number;
      longitude: number;
    };

    gender_preferance: GenderPreference;

    bhk?: BhkType;
    occupency?: OccupancyType;
    total_occupency?: number;

    furnised_status: FurnishedStatus;

    attached_bathroom: boolean;
    balcony: boolean;
    floor: number;

    wifi?: ServiceOption;
    cook?: ServiceOption;
    maid?: ServiceOption;

    parking?: {
      bike: boolean;
      car: boolean;
    };

    ammenites?: {
      type: AmenityType;
      desc: string;
    }[];

    house_rules: {
      type: HouseRuleType;
      desc: string;
    }[];

    pets_present?: boolean;

    rent: number;
    deposit?: number;
    brokerage?: number;
    setup_cost?: number;

    available_from?: string;
    available_immediately: boolean;

    neighborhood?: {
      type: NeighborhoodType;
      distance: number;
    }[];
  };

  views: number;
  favorites: number;

  external_source?: ListingSource;
  external_listing_url?: string;

  external_lister?: {
    name: string;
    age?: number;
    profile_pic?: string;
    contanct_number?: string;
    life_style: string[];
  };

  lister_id?: string;
};
