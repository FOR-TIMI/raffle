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
    const user = await createUser({
      email: body.email.toLowerCase().trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      password: body.password,
    });

    await MailService.sendEmail({
      from: "timicancode@gmail.com",
      to: user.email.trim(),
      subject: "Please verify your account",
      text: `Verification code ${user.verificationCode}, Identity ${user.id}`,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Internal server error", error: e });
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserRequest>,
  res: Response
) {
  const { id, verificationCode } = req.params;

  const user = await findUserById(id.trim());

  if (!user) {
    return res.status(400).json({ message: "Could not verify user" });
  }

  if (user.verifiedEmail) {
    return res.status(200).send({ message: "User is already verified" });
  }

  if (user.verificationCode === verificationCode) {
    user.verifiedEmail = true;
    await user.save();
    return res.status(201).json({ message: "User verified successfully" });
  }

  return res.status(500).json({ message: "Could not verify user" });
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordRequest>,
  res: Response
) {
  const { email: emailWithoutrim } = req.body;
  const email = emailWithoutrim.trim();
  log.info(email);
  const errorMessage =
    "If a user with this email exists, a password reset link has been sent to the email";

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`user with email ${email} not found`);
    return res.status(201).json({ message: errorMessage });
  }

  if (!user.verifiedEmail) {
    log.debug(`user with email ${email} not verified`);
    return res.status(201).json({ message: errorMessage });
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

  return res.status(201).json({ message: errorMessage });
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
    return res.status(400).json({ message: "Could not reset password" });
  }

  user.passwordResetCode = null;
  user.password = password;

  await user.save();

  return res.status(201).json({ message: "Password reset successful" });
}

export async function getSignedInUserHandler(req: Request, res: Response) {
  const user = res.locals.user;

  return res.status(200).json(user);
}

export async function emailExistsHandler(req: Request, res: Response) {
  const email = req.body.email.trim() as string;

  const user = await findUserByEmail(email);

  if (user) {
    return res.status(200).json({ message: "Email exists" });
  }

  return res.status(404).json({ message: "Email does not exist" });
}
