import RaffleModel from "../../model/raffle";

export async function getUserRaffle(userId: string) {
  return await RaffleModel.find({ creator: userId })
    .populate("participants")
    .populate("winners");
}
