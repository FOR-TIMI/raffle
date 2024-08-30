import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaffleResponse, User } from "../../types";
import {
  addParticipantThunk,
  createRaffleThunk,
  fetchRaffleDetails,
  getUserRafflesThunk,
  refreshRaffleDetails,
  resetRaffleThunk,
  spinRaffleThunk,
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
          state.currentRaffle.participantCount = 0;
        } else {
          const curr = state.currentRaffle;
          const updatedCurrentRaffle = {
            ...curr,
            participants: [action.payload, ...curr.participants],
            participantCount: (curr.participantCount += 1),
          };
          state.currentRaffle = updatedCurrentRaffle;
        }

        // Update raffles list
        state.raffles = state.raffles.map((raffle) => {
          if (raffle._id === state.currentRaffle?._id) {
            return state.currentRaffle;
          }
          return raffle;
        });
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
        const payload = action.payload;
        state.raffles.unshift({ ...payload.raffle });
      })
      .addCase(fetchRaffleDetails.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
      })
      .addCase(refreshRaffleDetails.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
      })
      .addCase(addParticipantThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(spinRaffleThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.raffles = state.raffles.map((raffle) => {
          if (raffle._id === state.currentRaffle?._id) {
            return state.currentRaffle;
          }
          return raffle;
        });
      })
      .addCase(spinRaffleThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(spinRaffleThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(resetRaffleThunk.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
      })
      .addCase(resetRaffleThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetRaffleThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { resetRaffleState, addParticipantToCurrentRaffle } =
  raffleSlice.actions;
export default raffleSlice.reducer;
