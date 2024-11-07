import config from "config";
import { Request, Response } from "express";
import SessionModel from "../../model/session";
import { CreateSessionRequest } from "../../schemas/auth";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../../service/auth";
import { findUserByEmail, findUserById } from "../../service/user";
import { verifyJwt } from "../../utils/jwt";
import log from "../../utils/Logger";
import parseDuration from "../../utils/parseDuration";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionRequest>,
  res: Response
) {
  try {
    const message = "Invalid email or password";
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(200).json({ message: message });
    }

    if (!user.verifiedEmail) {
      return res.status(400).json({ message: "Please verify your email" });
    }

    const isVaild = await user.verifyPassword(password);

    log.info(`User ${user.id} logged in is valid ${isVaild}`);

    if (!isVaild) {
      return res.status(200).json({
        message,
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken({ userId: user.id });

    const accessTokenTtl =
      parseDuration(config.get<string>("accessTokenTtl")) || 15 * 60 * 1000; // default 15 minutes
    const refreshTokenTtl =
      parseDuration(config.get<string>("refreshTokenTtl")) ||
      7 * 24 * 60 * 60 * 1000; // default 7 days

    res.cookie("accessToken", accessToken, {
      maxAge: accessTokenTtl,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: refreshTokenTtl,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    log.info(`User ${user.id} logged in`);

    return res.status(200).json({
      message: "Login Successful",
    });
  } catch (e: any) {
    return res.status(500).json({ message: "Internal server error", error: e });
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  const refreshToken = req?.cookies?.refreshToken;
  const errorMessage = "Invalid refresh token";

  if (!refreshToken) {
    return res.status(401).send("No refresh token provided");
  }

  const decoded = verifyJwt<{ sessionId: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );

  if (!decoded) {
    return res.status(401).send(errorMessage);
  }

  const session = await findSessionById(decoded.sessionId);

  if (!session || !session.valid) {
    return res.status(401).send(errorMessage);
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send({ errorMessage });
  }

  const accessToken = signAccessToken(user);
  const newRefreshToken = await signRefreshToken({ userId: user.id });

  const accessTokenTtl =
    parseDuration(config.get<string>("accessTokenTtl")) || 15 * 60 * 1000; // default 15 minutes

  const refreshTokenTtl =
    parseDuration(config.get<string>("refreshTokenTtl")) ||
    7 * 24 * 60 * 60 * 1000; // default 7 days

  // Set new cookies
  res.cookie("accessToken", accessToken, {
    maxAge: accessTokenTtl,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.cookie("refreshToken", newRefreshToken, {
    maxAge: refreshTokenTtl,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}

export async function logoutHandler(req: Request, res: Response) {
  // Clear the cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  // Optionally, invalidate the session in the database
  const refreshToken = req?.cookies?.refreshToken;
  if (refreshToken) {
    const decoded = verifyJwt<{ sessionId: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (decoded) {
      await SessionModel.findByIdAndUpdate(decoded.sessionId, { valid: false });
    }
  }

  return res.send({ success: true, message: "Logged out successfully" });
}
