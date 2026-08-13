import { z } from "zod";

export const UpsertBasicSchema = z.object({
  name: z.string().trim().min(1),
  age: z.number().int().min(18),
  gender: z.enum(["male", "female"]),
});

export type UpsertBasicBody = z.infer<typeof UpsertBasicSchema>;
