import { Router } from "express";

import * as RedirectController from "@/controller/redirect";
import { validate } from "@/middleware/validate";
import { GetListingRedirectSchema } from "@/types/request/redirect";

const router = Router();

router.get(
  "/:listingId",
  validate({
    params: GetListingRedirectSchema,
  }),
  RedirectController.getListingRedirect,
);

export default router;
