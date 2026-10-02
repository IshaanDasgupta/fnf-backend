import { DEFAULT_LISTING_IMAGE } from "@/config/constants";
import { UserModel } from "@/models/user.model";
import { UpsertBasicBody } from "@/types/request/user";
import { ProfileResponse, UpsertBasicResponse } from "@/types/response/user";

export async function getProfile(userId: string): Promise<ProfileResponse> {
  const user = await UserModel.findById(userId)
    .populate("favorite_listings")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  console.log(
    "POPULATED LISTINGS:",
    JSON.stringify(user?.favorite_listings, null, 2),
  );

  return {
    id: user._id.toString(),
    name: user.name!,
    email: user.email!,
    age: user.age!,
    gender: user.gender!,
    favorite_listings: user.favorite_listings.map((listing: any) => ({
      id: listing._id.toString(),
      coverImage:
        listing.cover_image || listing.images?.[0] || DEFAULT_LISTING_IMAGE,
      address: {
        locality: listing.property.locality,
        city: listing.property.city,
      },
      rent: listing.pricing.rent,
      bhk: listing.property.bhk,
      rentalScope: {
        type: listing.rental_scope.type,
        capacity: listing.rental_scope.capacity,
        totalOccupancy: listing.rental_scope.total_occupancy ?? undefined,
      },
      furnishedStatus: listing.property.furnished_status,
      genderPreference: listing.preferences?.gender ?? undefined,
      availableFrom: listing.availability?.available_from
        ? new Date(listing.availability.available_from).toISOString()
        : undefined,
      availableImmediately:
        listing.availability?.available_immediately ?? false,
    })),
  };
}

export async function upsertBasic(
  userId: string,
  input: UpsertBasicBody,
): Promise<UpsertBasicResponse> {
  const { name, age, gender } = input;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        name: name,
        age: age,
        gender: gender,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id.toString(),
    name: user.name!,
    email: user.email!,
    age: user.age!,
    gender: user.gender!,
  };
}
