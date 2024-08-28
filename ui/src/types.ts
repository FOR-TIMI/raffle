type Status = "idle" | "loading" | "succeeded" | "failed";
type Error = string | null;

export interface ResponseState {
  status?: Status;
  error?: Error;
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
}

export interface RaffleCreateParams {
  title: string;
  noOfPossibleWinners: number;
}
