import { BhkType, City, OccupancyType } from "@/config/constants";

export interface ListingCardResponse {
  id: string;

  title: string;
  coverImage: string;

  address: {
    locality: string;
    city: City;
  };

  location: {
    latitude: number;
    longitude: number;
  };

  rent: number;

  bhk: BhkType;
  occupancy: OccupancyType;

  availableFrom?: string;
  availableImmediately: boolean;

  tags: string[];

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

export interface MapListingsResponse {
  id: string;

  location: {
    latitude: number;
    longitude: number;
  };

  rent: number;

  title: string;
  coverImage: string;

  address: {
    locality: string;
    city: City;
  };

  bhk: BhkType;
  occupancy: OccupancyType;

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
