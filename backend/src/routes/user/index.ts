import express from "express";
import {
  createUserHandler,
  forgotPasswordHandler,
  getSignedInUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../../controller/user";
import requireUser from "../../middleware/requireUser";
import validateResource from "../../middleware/validate";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../../schemas/user";

const router = express.Router();
const baseUserRoute = "/users";

const buildUserRoute = (route: string) => `${baseUserRoute}/${route}`;

router.get(buildUserRoute("healthcheck"), (_, res) => res.sendStatus(200));

router.post(
  baseUserRoute,
  validateResource(createUserSchema),
  createUserHandler
);

router.get(
  buildUserRoute("verify/:id/:verificationCode"),
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  buildUserRoute("forgotpassword"),
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  buildUserRoute("resetpassword/:id/:passwordResetCode"),
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

router.get(buildUserRoute("me"), requireUser, getSignedInUserHandler);

export default router;
