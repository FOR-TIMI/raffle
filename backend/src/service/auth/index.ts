import { DocumentType } from "@typegoose/typegoose";
import config from "config";
import SessionModel from "../../model/session";
import { User } from "../../model/user";
import { signJwt } from "../../utils/jwt";
import parseDuration from "../../utils/parseDuration";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({ userId });
  const refreshTokenExiration =
    parseDuration(config.get<string>("refreshTokenTtl")) ||
    7 * 24 * 60 * 60 * 1000; // default 7 days

  const refreshToken = signJwt(
    { sessionId: session.id },
    "refreshTokenPrivateKey",
    {
      expiresIn: refreshTokenExiration,
    }
  );

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON();
  const accessTokenExiration =
    parseDuration(config.get<string>("accessTokenTtl")) || 15 * 60 * 1000;

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: accessTokenExiration,
  });

  return accessToken;
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}
