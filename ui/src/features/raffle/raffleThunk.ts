import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { RootState } from "../../config/store";
import {
  AddParticipantParams,
  CreateRaffleResponse,
  RaffleCreateParams,
  RaffleResponse,
  SpinRaffleResponse,
  User,
} from "../../types";
import {
  addParticipant,
  addParticipantWithFile,
  createRaffle,
  deleteRaffle,
  getRaffle,
  getUserRaffles,
  resetRaffle,
  spinRaffle,
} from "./raffleApi";

export const getUserRafflesThunk = createAsyncThunk<
  RaffleResponse[],
  AxiosInstance,
  { state: RootState }
>(
  "raffles/getUserRaffles",
  async (axios: AxiosInstance, { getState, rejectWithValue }) => {
    const { raffle } = getState();
    const currentTime = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 minutes

    if (
      raffle.lastFetchTime &&
      currentTime - raffle.lastFetchTime < cacheTime
    ) {
      return raffle.raffles;
    }

    try {
      const data = await getUserRaffles(axios);
      return data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data);
    }
  }
);

export const createRaffleThunk = createAsyncThunk<
  CreateRaffleResponse,
  { params: RaffleCreateParams; axios: AxiosInstance },
  { rejectValue: any }
>("raffles/createRaffle", async ({ params, axios }, { rejectWithValue }) => {
  try {
    const data = await createRaffle(params, axios);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const addParticipantThunk = createAsyncThunk<
  RaffleResponse,
  AddParticipantParams,
  { rejectValue: any }
>("raffles/addParticipant", async (params, { rejectWithValue }) => {
  try {
    let data: RaffleResponse;

    if (params.type === "file") {
      const formData = new FormData();
      formData.append("file", params.payload as File);
      data = await addParticipantWithFile(
        formData,
        params.raffleId,
        params.axios
      );
    } else if (params.type === "manual" && !!params.payload) {
      data = await addParticipant(
        params.raffleId,
        params.payload as User,
        params.axios
      );
    } else {
      throw new Error(
        "Invalid payload: either participant or file must be provided"
      );
    }
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const fetchRaffleDetails = createAsyncThunk<
  RaffleResponse,
  { id: string; axios: AxiosInstance },
  { rejectValue: any }
>("raffle/fetchDetails", async ({ id, axios }, { rejectWithValue }) => {
  try {
    const data = await getRaffle(id, axios);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const refreshRaffleDetails = createAsyncThunk<
  RaffleResponse,
  { id: string; axios: AxiosInstance },
  { rejectValue: any }
>("raffle/refreshDetails", async ({ id, axios }, { rejectWithValue }) => {
  try {
    const data = await getRaffle(id, axios);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const spinRaffleThunk = createAsyncThunk<
  SpinRaffleResponse,
  { raffleId: string; axios: AxiosInstance }
>("raffles/spinRaffle", async ({ raffleId, axios }, { rejectWithValue }) => {
  try {
    const data = await spinRaffle(raffleId, axios);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const resetRaffleThunk = createAsyncThunk<
  RaffleResponse,
  { raffleId: string; axios: AxiosInstance }
>("raffles/resetRaffle", async ({ raffleId, axios }, { rejectWithValue }) => {
  try {
    const data = await resetRaffle(raffleId, axios);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const deleteRaffleThunk = createAsyncThunk<
  RaffleResponse,
  { raffleId: string; axios: AxiosInstance }
>("raffles/deleteRaffle", async ({ raffleId, axios }, { rejectWithValue }) => {
  try {
    const data = await deleteRaffle(raffleId, axios);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});
