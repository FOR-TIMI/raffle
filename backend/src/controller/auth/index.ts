import { Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionRequest } from "../../schemas/auth";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../../service/auth";
import { findUserByEmail, findUserById } from "../../service/user";
import { verifyJwt } from "../../utils/jwt";
import log from "../../utils/Logger";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionRequest>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verifiedEmail) {
    return res.send("Please verify your email");
  }

  const isVaild = await user.verifyPassword(password);

  if (!isVaild) {
    return res.send(message);
  }

  log.info(`User ${user.id} logged in`);

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken({ userId: user.id });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.send({ accessToken, refreshToken });
}

export async function refreshTokenHandler(req: Request, res: Response) {
  let refreshToken = get(req, "headers.x-refresh");
  const errorMessage = "Invalid refresh token";

  if (!refreshToken) {
    return res.status(401).send("No refresh token provided");
  }

  if (Array.isArray(refreshToken)) {
    if (refreshToken.length === 0 || refreshToken.length > 1) {
      return res.status(401).send(errorMessage);
    } else {
      refreshToken = refreshToken[0];
    }
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
    return res.status(401).send(errorMessage);
  }

  const accessToken = signAccessToken(user);
  return res.send({ accessToken });
}
