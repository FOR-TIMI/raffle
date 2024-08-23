import { DocumentType } from "@typegoose/typegoose";
import config from "config";
import { omit } from "lodash";
import SessionModel from "../../model/session";
import { privateFields, User } from "../../model/user";
import { signJwt } from "../../utils/jwt";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({ userId });
  const refreshTokenExiration = config.get<string>("refreshTokenTtl");

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
  const payload = omit(user.toJSON(), privateFields);
  const accessTokenExiration = config.get<string>("accessTokenTtl");

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: accessTokenExiration,
  });

  return accessToken;
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}
