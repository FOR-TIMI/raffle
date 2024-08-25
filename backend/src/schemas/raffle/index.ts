import { number, object, string, TypeOf } from "zod";

export const createRaffleSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }).min(
      1,
      "Title cannot be empty"
    ),
    noOfpossibleWinners: number({
      required_error: "Number of possible winners is required",
    }).min(1, "There should be at least one winner"),
  }),
});

export const joinRaffleSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
  }),
});

export const spinRaffleSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
  }),
});

export const getRaffleDetailsSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
  }),
});

export const removeParticipantFromRaffleSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
    participantId: string({ required_error: "Participant ID is required" }).min(
      1,
      "Participant ID cannot be empty"
    ),
  }),
});

export type GetRaffleDetailsParams = TypeOf<
  typeof getRaffleDetailsSchema
>["params"];

export type SpinRaffleParams = TypeOf<typeof spinRaffleSchema>["params"];
export type RemoveParticipantFromRaffleParams = TypeOf<
  typeof removeParticipantFromRaffleSchema
>["params"];
export type JoinRaffleRequestParams = TypeOf<typeof joinRaffleSchema>["params"];
export type CreateRaffleRequest = TypeOf<typeof createRaffleSchema>;
