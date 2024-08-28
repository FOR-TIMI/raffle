import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../config/store";
import { RaffleCreateParams, RaffleResponse, User } from "../../types";
import {
  addParticipant,
  createRaffle,
  getRaffle,
  getUserRaffles,
} from "./raffleApi";

export const getUserRafflesThunk = createAsyncThunk<
  RaffleResponse[],
  void,
  { state: RootState }
>("raffles/getUserRaffles", async (_, { getState, rejectWithValue }) => {
  const { raffle } = getState();
  const currentTime = Date.now();
  const cacheTime = 5 * 60 * 1000; // 5 minutes

  if (raffle.lastFetchTime && currentTime - raffle.lastFetchTime < cacheTime) {
    return raffle.raffles;
  }

  try {
    const data = await getUserRaffles();
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const createRaffleThunk = createAsyncThunk<
  RaffleResponse,
  RaffleCreateParams
>("raffles/createRaffle", async (params, { rejectWithValue }) => {
  try {
    const data = await createRaffle(params);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

export const fetchRaffleDetails = createAsyncThunk<RaffleResponse, string>(
  "raffle/fetchDetails",
  async (id: string) => {
    const data = await getRaffle(id);
    return data;
  }
);

export const refreshRaffleDetails = createAsyncThunk<RaffleResponse, string>(
  "raffle/refreshDetails",
  async (id: string) => {
    const data = await getRaffle(id);
    return data;
  }
);

export const addParticipantThunk = createAsyncThunk<
  RaffleResponse,
  { raffleId: string; participant: User }
>(
  "raffles/addParticipant",
  async ({ raffleId, participant }, { rejectWithValue }) => {
    try {
      const data = await addParticipant(raffleId, participant);
      return data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data);
    }
  }
);
