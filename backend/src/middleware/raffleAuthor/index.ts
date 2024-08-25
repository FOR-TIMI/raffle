import { NextFunction, Request, Response } from "express";
import { getUserRaffle } from "../../service/raffle";

const isRaffleCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user._id;
  const raffleId = req.params.raffleId;

  try {
    const userRaffles = await getUserRaffle(userId);

    // Check if the raffleId from params matches any of the user's raffles
    const isAuthor = userRaffles.some(
      (raffle) => raffle._id.toString() === raffleId
    );

    if (!isAuthor) {
      return res.status(403).send("You cannot perform this action");
    }

    next();
  } catch (error) {
    console.error("Error in isRaffleCreator middleware:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default isRaffleCreator;
