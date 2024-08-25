import express from "express";
import {
  createSessionHandler,
  refreshTokenHandler,
} from "../../controller/auth";
import validateResource from "../../middleware/validate";
import { createSessionSchema } from "../../schemas/auth";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.post(
  "/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.post("/sessions/refresh", refreshTokenHandler);

export default router;
