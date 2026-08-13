import { GenderPreference } from "@/config/constants";

export interface UpsertBasicResponse {
  id: string;
  phone: string;
  name: string;
  email: string;
  age: number;
  gender: GenderPreference;
}

export interface PutUpsertBasicResponse {
  success: boolean;
  data: UpsertBasicResponse;
}
