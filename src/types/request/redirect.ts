import { Types } from "mongoose";
import z from "zod";

export const GetListingRedirectSchema = z.object({
  listingId: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid listing ID",
  }),
});

export type GetListingRedirectParams = z.infer<typeof GetListingRedirectSchema>;
