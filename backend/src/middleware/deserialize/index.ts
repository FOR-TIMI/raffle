import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = "";

    // Try to get the token from the Authorization header
    const authHeader =
      (req.headers.authorization || "").replace(/^Bearer\s/, "") ||
      req.cookies?.accessToken;

    if (authHeader) {
      accessToken = authHeader;
    } else if (req.headers?.cookie) {
      // If not in Authorization header, try to extract from Cookie header
      const cookies = req.headers.cookie.split(";");
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("accessToken=")
      );
      if (accessTokenCookie) {
        accessToken = accessTokenCookie.split("=")[1].trim();
      }
    }

    if (!accessToken) {
      return next();
    }

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");
    if (decoded) {
      res.locals.user = decoded;
    }
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.clearCookie("accessToken");
  }

  return next();
};

export default deserializeUser;
