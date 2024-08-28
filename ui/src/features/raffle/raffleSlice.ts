import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaffleResponse, User } from "../../types";
import {
  addParticipantThunk,
  createRaffleThunk,
  fetchRaffleDetails,
  getUserRafflesThunk,
  refreshRaffleDetails,
} from "./raffleThunk";

interface RaffleState {
  raffles: RaffleResponse[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastFetchTime: number | null;
  currentRaffle: RaffleResponse | null;
}

const initialState: RaffleState = {
  raffles: [],
  status: "idle",
  error: null,
  lastFetchTime: null,
  currentRaffle: null,
};

const raffleSlice = createSlice({
  name: "raffle",
  initialState,
  reducers: {
    resetRaffleState: (state) => {
      state.raffles = [];
      state.status = "idle";
      state.error = null;
      state.lastFetchTime = null;
    },
    addParticipantToCurrentRaffle: (state, action: PayloadAction<User>) => {
      if (state.currentRaffle) {
        if (!state.currentRaffle.participants) {
          state.currentRaffle.participants = [];
        }
        const curr = state.currentRaffle;
        const updatedCurrentRaffle = {
          ...curr,
          participants: [action.payload, ...curr.participants],
          participantCount: (curr.participantCount += 1),
        };
        state.currentRaffle = updatedCurrentRaffle;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserRafflesThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getUserRafflesThunk.fulfilled,
        (state, action: PayloadAction<RaffleResponse[]>) => {
          state.status = "succeeded";
          state.raffles = action.payload;
          state.error = null;
          state.lastFetchTime = Date.now();
        }
      )
      .addCase(getUserRafflesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(createRaffleThunk.fulfilled, (state, action) => {
        state.raffles.unshift(action.payload);
      })
      .addCase(fetchRaffleDetails.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
      })
      .addCase(refreshRaffleDetails.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
      })
      .addCase(addParticipantThunk.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
      });
  },
});

export const { resetRaffleState, addParticipantToCurrentRaffle } =
  raffleSlice.actions;
export default raffleSlice.reducer;
