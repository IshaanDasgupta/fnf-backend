import { CITIES } from "@/config/constants";
import z from "zod";

const CitySchema = z.enum(CITIES);

export const GetLocalitiesSchema = z.object({
  city: CitySchema,
});

export type GetLocalitiesQuery = z.infer<typeof GetLocalitiesSchema>;
