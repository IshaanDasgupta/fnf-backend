import {
  AddOnType,
  AmenityType,
  BhkType,
  City,
  FurnishedStatus,
  GenderPreference,
  HouseRuleType,
  NeighborhoodType,
  OccupancyType,
} from "@/config/constants";

export interface ListingCardResponse {
  id: string;

  coverImage: string;

  address: {
    locality: string;
    city: City;
  };

  rent: number;

  bhk: BhkType;
  occupancy: OccupancyType;

  totalOccupancy?: number;

  furnishedStatus: FurnishedStatus;

  genderPreference: GenderPreference;

  availableFrom?: string;
  availableImmediately: boolean;

  favorite: boolean;
}

export interface GetListingsResponse {
  success: boolean;
  data: ListingCardResponse[];
  pagination: {
    nextCursor: string | null;
    hasNext: boolean;
  };
}

export interface GetSearchListingsResponse {
  success: boolean;
  data: ListingCardResponse[];
  pagination: {
    nextCursor: string | null;
    hasNext: boolean;
  };
}

export interface MapListingsResponse {
  id: string;

  location: {
    latitude: number;
    longitude: number;
  };

  rent: number;

  coverImage: string;

  address: {
    locality: string;
    city: City;
  };

  bhk: BhkType;
  occupancy: OccupancyType;
  totalOccupancy?: number;
  furnishedStatus: FurnishedStatus;

  genderPreference: GenderPreference;

  favorite: boolean;
}

export interface GetMapListingsResponse {
  success: boolean;
  data: MapListingsResponse[];
}

export interface ToggleFavouriteListingResponse {
  success: boolean;
  data: {
    favorite: boolean;
  };
}

export interface ListingResponse {
  id: string;

  title: string;

  images: string[];
  coverImage: string;

  carpetArea?: number;

  status: string;

  address: {
    locality: string;
    city: City;
    address: string;
  };

  location: {
    latitude: number;
    longitude: number;
  };

  genderPreference: GenderPreference;

  bhk: BhkType;
  occupancy: OccupancyType;
  totalOccupancy?: number;

  furnishedStatus: FurnishedStatus;

  floor?: number;

  addOns: {
    type: AddOnType;
    desc?: string;
  }[];

  amenities: {
    type: AmenityType;
    desc?: string;
  }[];

  houseRules: {
    type: HouseRuleType;
    desc?: string;
  }[];

  rent: number;
  deposit?: number;
  brokerage?: number;
  setupCost?: number;

  availableFrom?: string;
  availableImmediately: boolean;

  neighborhood: {
    type: NeighborhoodType;
    distance: number;
  }[];

  views: number;
  favorites: number;

  favorite: boolean;

  lister?: {
    name: string;
    age?: number;
    profilePic?: string;
    contactNumber?: string;
    lifestyle: string[];
  };

  externalListing?: {
    source: string;
    url: string;
  };
}

export interface GetListingResponse {
  success: boolean;
  data: ListingResponse;
}
