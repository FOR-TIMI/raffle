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
import { asyncHandler } from "../../utils/asyncHandler";

const router = express.Router();
const baseUserRoute = "/users";

const buildUserRoute = (route: string) => `${baseUserRoute}/${route}`;

router.get(buildUserRoute("healthcheck"), (_, res) => res.sendStatus(200));

router.post(
  baseUserRoute,
  emailExistsMiddleware,
  validateResource(createUserSchema),
  asyncHandler(createUserHandler)
);

router.post(
  buildUserRoute("checkemail"),
  validateResource(checkEmailSchema),
  asyncHandler(emailExistsHandler)
);

router.get(
  buildUserRoute("verify/:id/:verificationCode"),
  validateResource(verifyUserSchema),
  asyncHandler(verifyUserHandler)
);

router.post(
  buildUserRoute("forgotpassword"),
  validateResource(forgotPasswordSchema),
  asyncHandler(forgotPasswordHandler)
);

router.post(
  buildUserRoute("resetpassword/:id/:passwordResetCode"),
  validateResource(resetPasswordSchema),
  asyncHandler(resetPasswordHandler)
);

router.get(
  buildUserRoute("me"),
  requireUser,
  asyncHandler(getSignedInUserHandler)
);

export default router;
