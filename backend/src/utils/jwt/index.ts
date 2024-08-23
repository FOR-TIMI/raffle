import config from "config";
import jwt from "jsonwebtoken";

export type PublicKeyName = "accessTokenPublicKey" | "refreshTokenPublicKey";
export type PrivateKeyName = "accessTokenPrivateKey" | "refreshTokenPrivateKey";

export function signJwt(
  object: Object,
  keyName: PrivateKeyName,
  options?: jwt.SignOptions | undefined
) {
  const signingKeyBase64 = config.get<string>(keyName);
  const signingKey = Buffer.from(signingKeyBase64, "base64").toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export const verifyJwt = <T>(
  token: string,
  keyName: PublicKeyName
): T | null => {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
