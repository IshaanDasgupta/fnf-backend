import {
  BhkType,
  City,
  FurnishedStatus,
  GenderPreference,
  RentalScopeType,
} from "@/config/constants";

export type UserGender = "male" | "female";

export interface UpsertBasicResponse {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: UserGender;
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
  rentalScope: {
    type: RentalScopeType;
    capacity: number;
    totalOccupancy: number;
  };

  furnishedStatus: FurnishedStatus;

  genderPreference?: GenderPreference;

  availableFrom?: string;
  availableImmediately: boolean;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: UserGender;
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
