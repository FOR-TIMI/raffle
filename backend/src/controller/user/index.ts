import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyUserRequest,
} from "../../schemas/user";
import MailService from "../../service/mail";
import { createUser, findUserByEmail, findUserById } from "../../service/user";
import log from "../../utils/Logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserRequest>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await MailService.sendEmail({
      from: "timicancode@gmail.com",
      to: user.email,
      subject: "Please verify your account",
      text: `Verification code ${user.verificationCode}, Identity ${user.id}`,
    });

    return res.send("User created successfully");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("User already exists");
    }

    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserRequest>,
  res: Response
) {
  const { id, verificationCode } = req.params;

  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  if (user.verifiedEmail) {
    return res.send("User is already verified");
  }

  if (user.verificationCode === verificationCode) {
    user.verifiedEmail = true;
    await user.save();
    return res.send("User verified successfully");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordRequest>,
  res: Response
) {
  const { email } = req.body;
  log.info(email);
  const errorMessage =
    "If a user with this email exists, a password reset link has been sent to the email";

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`user with email ${email} not found`);
    return res.send(email);
  }

  if (!user.verifiedEmail) {
    log.debug(`user with email ${email} not verified`);
    return res.send(errorMessage);
  }

  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;

  await user.save();

  await MailService.sendEmail({
    to: user.email,
    from: "timicancode@gmail.com",
    subject: "Password reset",
    text: `Password reset code: ${passwordResetCode}. Id ${user.id}`,
  });

  log.debug(`Password reset code sent to ${email}`);

  return res.send(errorMessage);
}

export async function resetPasswordHandler(
  req: Request<
    ResetPasswordRequest["params"],
    {},
    ResetPasswordRequest["body"]
  >,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset password");
  }

  user.passwordResetCode = null;
  user.password = password;

  await user.save();

  return res.send("Password reset successful");
}

export async function getSignedInUserHandler(req: Request, res: Response) {
  const user = res.locals.user;

  return res.send(user);
}
