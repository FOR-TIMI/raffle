import RaffleModel from "../../model/raffle";

export async function getOneRaffle(userEmail: string) {
  return await RaffleModel.find({ creatorEmail: userEmail }).lean();
}
