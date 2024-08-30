import { Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: any) => {
  if (!res?.locals?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};

export default requireUser;
