import { AxiosInstance } from "axios";

type Status = "idle" | "loading" | "succeeded" | "failed";
type Error = string | null;

export interface ResponseState {
  status?: Status;
  error?: Error;
}
export interface ValidationErrorMessageType {
  validation: string;
  code: string;
  message: string;
  path: string[];
}
export interface ValidationErrorType {
  message?: ValidationErrorMessageType[];
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  isWinner?: boolean;
}
export interface AuthState extends ResponseState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated?: boolean;
}

export interface LoginResponse extends ResponseState {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse extends ResponseState {
  accessToken: string;
}

export interface RaffleResponse extends ResponseState {
  _id: string;
  title: string;
  creatorEmail: string;
  noOfPossibleWinners: number;
  participantCount: number;
  winnerCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  participants?: User[];
  qrCode?: string;
}

export interface CreateRaffleResponse extends ResponseState {
  raffle: RaffleResponse;
  qrCode: string;
}

export interface RaffleCreateParams {
  title: string;
  noOfPossibleWinners: number;
}

export interface SpinRaffleResponse {
  raffle: {
    _id: string;
    title: string;
    creatorEmail: string;
    noOfPossibleWinners: number;
    participantCount: number;
    winnerCount: number;
    qrCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  winners: User[];
}

export interface AddParticipantParamsParent<T extends "manual" | "file"> {
  raffleId: string;
  axios: AxiosInstance;
  type: T;
  payload: T extends "manual" ? User : File;
}

// Helper type for the thunk
export type AddParticipantParams =
  | AddParticipantParamsParent<"manual">
  | AddParticipantParamsParent<"file">;
