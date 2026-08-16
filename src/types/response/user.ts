import { GenderPreference } from "@/config/constants";

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
  title: string;
  coverImage: string;
  city: string;
  locality: string;
  rent: number;
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
