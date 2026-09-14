import { LocalityModel } from "@/models/localities.model";
import { GetLocalitiesQuery } from "@/types/request/locality";
import { GetLocalitiesResponse } from "@/types/response/locality";

export const getLocalities = async (
  input: GetLocalitiesQuery,
): Promise<GetLocalitiesResponse> => {
  const localities = await LocalityModel.find(
    { city: input.city },
    {
      _id: 0,
      name: 1,
      "location.coordinates": 1,
    },
  )
    .sort({ name: 1 })
    .lean();

  return {
    success: true,
    data: localities.map((locality) => ({
      name: locality.name,
      location: {
        longitude: locality.location.coordinates[0],
        latitude: locality.location.coordinates[1],
      },
    })),
  };
};
