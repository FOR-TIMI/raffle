import express from "express";
import {
  createSessionHandler,
  logoutHandler,
  refreshTokenHandler,
} from "../../controller/auth";
import requireUser from "../../middleware/requireUser";
import validateResource from "../../middleware/validate";
import { createSessionSchema } from "../../schemas/auth";
import { asyncHandler } from "../../utils/asyncHandler";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.post(
  "/sessions",
  validateResource(createSessionSchema),
  asyncHandler(createSessionHandler)
);

router.post("/sessions/refresh", asyncHandler(refreshTokenHandler));
router.post("/sessions/end", asyncHandler(logoutHandler));

export default router;
