import { DEFAULT_LISTING_IMAGE } from "@/config/constants";
import { UserModel } from "@/models/user.model";
import { UpsertBasicBody } from "@/types/request/user";
import { ProfileResponse, UpsertBasicResponse } from "@/types/response/user";
import logger from "@/utils/logger";

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
    phone: user.phone_number,
    name: user.name!,
    email: user.email!,
    age: user.age!,
    gender: user.gender!,
    favorite_listings: user.favorite_listings.map((listing: any) => ({
      id: listing._id.toString(),
      title: listing.data.title,
      coverImage: listing.data.images?.[0] ?? DEFAULT_LISTING_IMAGE,
      city: listing.data.city,
      locality: listing.data.locality,
      rent: listing.data.rent,
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
    phone: user.phone_number,
    name: user.name!,
    email: user.email!,
    age: user.age!,
    gender: user.gender!,
  };
}
