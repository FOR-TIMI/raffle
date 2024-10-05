import config from "config";
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../../utils/jwt";
import log from "../../utils/Logger";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = "";

    // Try to get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      return next();
    }

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;
    } else {
      // If the token is invalid or expired, clear the cookie
      res.clearCookie("accessToken");
    }
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.clearCookie("accessToken");
  }

  return next();
};

export default deserializeUser;
