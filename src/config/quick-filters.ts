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
      "property.furnished_status": "fully-furnished",
    },
  },

  {
    id: "under-15k",
    label: "Under ₹15K",
    query: {
      "pricing.rent": { $lt: 15_000 },
    },
  },

  {
    id: "available-now",
    label: "Available Now",
    query: {
      "availability.available_immediately": true,
    },
  },

  {
    id: "attached-washroom",
    label: "Attached Washroom",
    query: {
      "property.attached_washroom": true,
    },
  },

  {
    id: "1bhk",
    label: "1 BHK",
    query: {
      "property.bhk": "1 BHK",
    },
  },

  {
    id: "2bhk",
    label: "2 BHK",
    query: {
      "property.bhk": "2 BHK",
    },
  },

  {
    id: "single-occupancy",
    label: "Single Occupancy",
    query: {
      "rental_scope.capacity": 1,
    },
  },

  {
    id: "wifi",
    label: "Wi-Fi Included",
    query: {
      "add_ons.type": { $in: ["WiFi", "Fiber Internet"] },
    },
  },
];

export const QUICK_FILTER_IDS = QUICK_FILTERS.map((filter) => filter.id) as [
  string,
  ...string[],
];
