import express from "express";
import passport from "passport";
import {
  createSessionHandler,
  refreshTokenHandler,
} from "../../controller/auth";
import googleStrategy from "../../controller/auth/strategies/google-strategy";
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

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

passport.use(googleStrategy);

export default router;
