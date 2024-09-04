import { AxiosInstance } from "axios";
import { RAFFLES_API_ROUTES } from "../../config/constants";
import {
  CreateRaffleResponse,
  RaffleCreateParams,
  RaffleResponse,
  SpinRaffleResponse,
  User,
} from "../../types";

export const getUserRaffles = async (
  axios: AxiosInstance
): Promise<RaffleResponse[]> => {
  const response = await axios.get<RaffleResponse[]>(
    RAFFLES_API_ROUTES.GET_USER_RAFFLES,
    { withCredentials: true }
  );

  return response?.data;
};

export const createRaffle = async (
  body: RaffleCreateParams,
  axios: AxiosInstance
): Promise<CreateRaffleResponse> => {
  const response = await axios.post(RAFFLES_API_ROUTES.CREATE_RAFFLE, body, {
    withCredentials: true,
  });
  return response.data;
};

export const getRaffle = async (
  raffleId: string,
  axios: AxiosInstance
): Promise<RaffleResponse> => {
  const response = await axios.get<RaffleResponse>(
    RAFFLES_API_ROUTES.GET_RAFFLE_DETAILS.replace(":raffleId", raffleId),
    { withCredentials: true }
  );

  return response.data;
};

export const addParticipant = async (
  raffleId: string,
  participant: User,
  axios: AxiosInstance
): Promise<RaffleResponse> => {
  const response = await axios.post(
    RAFFLES_API_ROUTES.ADD_PARTICIPANT.replace(":raffleId", raffleId),
    participant,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const spinRaffle = async (
  raffleId: string,
  axiosInstance: AxiosInstance
): Promise<SpinRaffleResponse> => {
  const response = await axiosInstance.get(
    RAFFLES_API_ROUTES.SPIN_RAFFLE.replace(":raffleId", raffleId),
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const resetRaffle = async (
  raffleId: string,
  axiosInstance: AxiosInstance
): Promise<RaffleResponse> => {
  const response = await axiosInstance.get(
    RAFFLES_API_ROUTES.RESET_RAFFLE.replace(":raffleId", raffleId),
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteRaffle = async (
  raffleId: string,
  axiosInstance: AxiosInstance
): Promise<RaffleResponse> => {
  const response = await axiosInstance.delete(
    RAFFLES_API_ROUTES.DELETE_RAFFLE.replace(":raffleId", raffleId),
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const addParticipantWithFile = async (
  formData: FormData,
  raffleId: string,
  axios: AxiosInstance
): Promise<RaffleResponse> => {
  const response = await axios.post(
    RAFFLES_API_ROUTES.UPLOAD_PARTICIPANTS.replace(":raffleId", raffleId),
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const removeParticipantFromRaffle = async (
  raffleId: string,
  participantId: string,
  axios: AxiosInstance
): Promise<{ message: string }> => {
  // Implement this function
  const response = await axios.delete(
    RAFFLES_API_ROUTES.REMOVE_RAFFLE_PARTICIPANT.replace(
      ":raffleId",
      raffleId
    ).replace(":participantId", participantId),
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
