import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      sparse: true,
    },

    google_id: {
      type: String,
      unique: true,
      sparse: true,
    },

    favorite_listings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model<User>("User", userSchema);
