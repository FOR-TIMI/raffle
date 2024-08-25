import { first } from "lodash";
import { number, object, string, TypeOf } from "zod";

export const createRaffleSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }).min(
      1,
      "Title cannot be empty"
    ),
    noOfPossibleWinners: number({
      required_error: "Number of possible winners is required",
    }).min(1, "There should be at least one winner"),
  }),
});

export const resetRaffleSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
  }),
});

export const joinRaffleSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
  }),
  body: object({
    firstName: string(),
    lastName: string(),
    email: string().email(),
  }),
});

export const getWinnersSchema = object({
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

export const getParticipantsSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
  }),
  query: object({
    page: string().optional(),
    limit: string().optional(),
  }),
});

export const deleteRaffleParticipantSchema = object({
  params: object({
    raffleId: string({ required_error: "Raffle ID is required" }).min(
      1,
      "Raffle ID cannot be empty"
    ),
    participantEmail: string({
      required_error: "Participant email is required",
    }).email(),
  }),
});

export type GetRaffleDetailsParams = TypeOf<
  typeof getRaffleDetailsSchema
>["params"];

export type GetParticipantsParams = TypeOf<
  typeof getParticipantsSchema
>["params"];

export type GetParticipantsQuery = TypeOf<
  typeof getParticipantsSchema
>["query"];

export type GetWinnersParams = TypeOf<typeof getWinnersSchema>["params"];

export type SpinRaffleParams = TypeOf<typeof spinRaffleSchema>["params"];
export type RemoveParticipantFromRaffleParams = TypeOf<
  typeof removeParticipantFromRaffleSchema
>["params"];
export type JoinRaffleRequestParams = TypeOf<typeof joinRaffleSchema>["params"];
export type JoinRaffleRequestBody = TypeOf<typeof joinRaffleSchema>["body"];
export type CreateRaffleRequest = TypeOf<typeof createRaffleSchema>;
export type ResetRaffleParams = TypeOf<typeof resetRaffleSchema>["params"];
