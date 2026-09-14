export interface LocalityResponse {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
export interface GetLocalitiesResponse {
  success: boolean;
  data: LocalityResponse[];
}
