import { NextFunction, Request, Response } from "express";
import { emailExists } from "../../service/user";

const emailExistsMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;

  try {
    const user = await emailExists(email);

    if (user) {
      return res.status(400).send("Email already in use");
    }

    next();
  } catch (error) {
    console.error("Error in emailExists middleware:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default emailExistsMiddleWare;
