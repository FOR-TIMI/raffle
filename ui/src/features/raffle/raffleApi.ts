import axiosInstance from "../../config/api";
import { RAFFLES_API_ROUTES } from "../../config/constants";
import { RaffleCreateParams, RaffleResponse, User } from "../../types";

export const getUserRaffles = async (): Promise<RaffleResponse[]> => {
  const response = await axiosInstance.get<RaffleResponse[]>(
    RAFFLES_API_ROUTES.GET_USER_RAFFLES,
    { withCredentials: true }
  );

  return response?.data;
};

export const createRaffle = async (
  body: RaffleCreateParams
): Promise<RaffleResponse> => {
  const response = await axiosInstance.post(
    RAFFLES_API_ROUTES.CREATE_RAFFLE,
    body,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getRaffle = async (raffleId: string): Promise<RaffleResponse> => {
  const response = await axiosInstance.get<RaffleResponse>(
    RAFFLES_API_ROUTES.GET_RAFFLE_DETAILS.replace(":raffleId", raffleId),
    { withCredentials: true }
  );

  return response.data;
};

export const addParticipant = async (
  raffleId: string,
  participant: User
): Promise<RaffleResponse> => {
  const response = await axiosInstance.post(
    RAFFLES_API_ROUTES.ADD_PARTICIPANT.replace(":raffleId", raffleId),
    participant,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
