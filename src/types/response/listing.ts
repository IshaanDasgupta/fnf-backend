export interface ListingCardResponse {
  id: string;
  title: string;
  coverImage?: string;

  address: {
    locality: string;
    city: string;
  };

  location: {
    latitude: number;
    longitude: number;
  };

  rent: number;

  bhk: string;
  occupancy?: string;

  availableFrom?: string;
  availableImmediately: boolean;

  tags: string[];

  favorite: boolean;
}

export interface GetListingsResponse {
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
  coverImage?: string;

  address: {
    locality: string;
    city: string;
  };

  bhk: string;
  occupancy?: string;

  favorite: boolean;
}

export interface GetMapListingsResponse {
  data: MapListingsResponse[];
  hasMore: boolean;
}
