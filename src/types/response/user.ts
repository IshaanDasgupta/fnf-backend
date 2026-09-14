import {
  BhkType,
  City,
  FurnishedStatus,
  GenderPreference,
  OccupancyType,
} from "@/config/constants";

export interface UpsertBasicResponse {
  id: string;
  phone: string;
  name: string;
  email: string;
  age: number;
  gender: GenderPreference;
}

export interface ProfileListingResponse {
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
}

export interface ProfileResponse {
  id: string;
  phone: string;
  name: string;
  email: string;
  age: number;
  gender: GenderPreference;
  favorite_listings: ProfileListingResponse[];
}

export interface GetProfileResponse {
  success: boolean;
  data: ProfileResponse;
}

export interface PutUpsertBasicResponse {
  success: boolean;
  data: UpsertBasicResponse;
}
