import {
  AddOnType,
  AmenityType,
  BhkType,
  City,
  FurnishedStatus,
  GenderPreference,
  HouseRuleType,
  ListingStatus,
  NeighborhoodType,
  RentalScopeType,
  ServiceType,
} from "@/config/constants";

export interface RentalScopeResponse {
  type: RentalScopeType;
  capacity: number;
  totalOccupancy: number;
}

export interface ListingCardResponse {
  id: string;

  coverImage: string;

  address: {
    locality: string;
    city: City;
  };

  rent: number;

  bhk: BhkType;
  rentalScope: RentalScopeResponse;

  furnishedStatus: FurnishedStatus;

  genderPreference?: GenderPreference;

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
  rentalScope: RentalScopeResponse;
  furnishedStatus: FurnishedStatus;

  genderPreference?: GenderPreference;

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

  images: string[];
  coverImage: string;

  carpetArea?: number;

  attachedWashroom?: boolean;

  status: ListingStatus;

  address: {
    locality: string;
    city: City;
    address: string;
  };

  location: {
    latitude: number;
    longitude: number;
  };

  genderPreference?: GenderPreference;

  bhk: BhkType;
  rentalScope: RentalScopeResponse;

  furnishedStatus: FurnishedStatus;

  floor?: number;

  services: {
    type: ServiceType;
    desc?: string;
    price?: number;
    included: boolean;
  }[];

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
  moveInCharges?: number;

  availableFrom?: string;
  availableImmediately: boolean;

  nearbyPlaces: {
    type: NeighborhoodType;
    name: string;
    distance: number;
  }[];

  views: number;
  favorites: number;

  favorite: boolean;

  listerId?: string;

  externalListing?: {
    source: string;
    url: string;
    author: string;
  };
}

export interface GetListingResponse {
  success: boolean;
  data: ListingResponse;
}
