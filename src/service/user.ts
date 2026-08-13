import { UserModel } from "@/models/user.model";
import { UpsertBasicBody } from "@/types/request/user";
import { UpsertBasicResponse } from "@/types/response/user";
import logger from "@/utils/logger";

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
