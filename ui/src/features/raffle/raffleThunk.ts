import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { RootState } from "../../config/store";
import {
  CreateRaffleResponse,
  RaffleCreateParams,
  RaffleResponse,
  SpinRaffleResponse,
  User,
} from "../../types";
import {
  addParticipant,
  createRaffle,
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
  { raffleId: string; participant: User; axios: AxiosInstance },
  { rejectValue: any }
>(
  "raffles/addParticipant",
  async ({ raffleId, participant, axios }, { rejectWithValue }) => {
    try {
      const data = await addParticipant(raffleId, participant, axios);
      return data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data);
    }
  }
);
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
