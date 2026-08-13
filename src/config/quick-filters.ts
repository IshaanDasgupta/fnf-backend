export type QuickFilter = {
  id: string;
  label: string;
  query?: Record<string, unknown>;
};

export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: "all",
    label: "All",
  },

  {
    id: "near",
    label: "Near me",
  },

  {
    id: "furnished",
    label: "Furnished",
    query: {
      "data.furnished_status": "fully-furnished",
    },
  },

  {
    id: "under-15k",
    label: "Under ₹15K",
    query: {
      "data.rent": { $lt: 15_000 },
    },
  },

  {
    id: "available-now",
    label: "Available Now",
    query: {
      "data.available_immediately": true,
    },
  },

  {
    id: "single-occupancy",
    label: "Single Occupancy",
    query: {
      "data.occupancy": "single",
    },
  },

  {
    id: "attached-bathroom",
    label: "Attached Bathroom",
    query: {
      "data.attached_bathroom": true,
    },
  },

  {
    id: "wifi",
    label: "Wi-Fi Included",
    query: {
      "data.wifi": "included",
    },
  },

  {
    id: "pet-friendly",
    label: "Pet Friendly",
    query: {
      "data.pets_present": true,
    },
  },

  {
    id: "1bhk",
    label: "1 BHK",
    query: {
      "data.bhk": "1BHK",
    },
  },

  {
    id: "2bhk",
    label: "2 BHK",
    query: {
      "data.bhk": "2BHK",
    },
  },
];

export const QUICK_FILTER_IDS = QUICK_FILTERS.map((filter) => filter.id) as [
  string,
  ...string[],
];
