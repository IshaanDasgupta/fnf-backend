import { Router } from "express";

import * as UserController from "@/controller/user";
import { requireAuth } from "@/middleware/require-auth";
import { validate } from "@/middleware/validate";
import { UpsertBasicSchema } from "@/types/request/user";
const router = Router();

router.put(
  "/upsert-basic",
  requireAuth,
  validate({
    body: UpsertBasicSchema,
  }),
  UserController.upsertBasicController,
);

export default router;
