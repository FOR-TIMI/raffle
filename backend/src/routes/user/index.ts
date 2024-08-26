import express from "express";
import {
  createUserHandler,
  emailExistsHandler,
  forgotPasswordHandler,
  getSignedInUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../../controller/user";
import emailExistsMiddleware from "../../middleware/emailExists";
import requireUser from "../../middleware/requireUser";
import validateResource from "../../middleware/validate";

import {
  checkEmailSchema,
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
  emailExistsMiddleware,
  validateResource(createUserSchema),
  createUserHandler
);

router.post(
  buildUserRoute("checkemail"),
  validateResource(checkEmailSchema),
  emailExistsHandler
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
