import { Router } from "express";

import * as LocalityController from "@/controller/locality";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/require-auth";
import { GetLocalitiesSchema } from "@/types/request/locality";

const router = Router();

router.get(
  "/",
  requireAuth,
  validate({
    query: GetLocalitiesSchema,
  }),
  LocalityController.getLocalities,
);

export default router;
