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
        listing.data.cover_image ||
        listing.data.images?.[0] ||
        DEFAULT_LISTING_IMAGE,
      address: {
        locality: listing.data.locality,
        city: listing.data.city,
      },
      rent: listing.data.rent,
      bhk: listing.data.bhk,
      occupancy: listing.data.occupancy,
      totalOccupancy: listing.data.total_occupancy,
      furnishedStatus: listing.data.furnished_status,
      genderPreference: listing.data.gender_preference,
      availableFrom: listing.data.available_from
        ? new Date(listing.data.available_from).toISOString()
        : undefined,
      availableImmediately: listing.data.available_immediately,
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
