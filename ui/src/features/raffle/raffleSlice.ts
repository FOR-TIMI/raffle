import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaffleResponse, User } from "../../types";
import {
  addParticipantThunk,
  createRaffleThunk,
  deleteRaffleThunk,
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
  isRefreshing: boolean;
  isDeleting: boolean;
  isResetting: boolean;
}

const initialState: RaffleState = {
  raffles: [],
  status: "idle",
  error: null,
  lastFetchTime: null,
  currentRaffle: null,
  isRefreshing: false,
  isDeleting: false,
  isResetting: false,
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
      .addCase(addParticipantThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(spinRaffleThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.raffles = state.raffles.map((raffle) => {
          if (raffle._id === action.payload.raffle._id) {
            const updatedParticipants = raffle.participants?.map(
              (participant) => {
                const winner = action.payload.winners.find(
                  (w) => w.email === participant.email
                );
                return { ...participant, isWinner: !!winner };
              }
            );

            // Update raffle properties
            return {
              ...raffle,
              participants: updatedParticipants,
              winnerCount: action.payload.raffle.winnerCount,
              participantCount: action.payload.raffle.participantCount,
              updatedAt: action.payload.raffle.updatedAt,
            };
          }
          return raffle;
        });
        state.currentRaffle = state.raffles.find(
          (r) => r._id === action.payload.raffle._id
        );
      })
      .addCase(spinRaffleThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(spinRaffleThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })

      .addCase(resetRaffleThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
        state.isResetting = false;
      })
      .addCase(refreshRaffleDetails.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshRaffleDetails.fulfilled, (state, action) => {
        state.currentRaffle = action.payload;
        state.isRefreshing = false;
      })
      .addCase(refreshRaffleDetails.rejected, (state) => {
        state.isRefreshing = false;
      })
      .addCase(deleteRaffleThunk.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteRaffleThunk.fulfilled, (state, action) => {
        state.raffles = state.raffles.filter(
          (raffle) => raffle._id !== state.currentRaffle?._id
        );
        state.currentRaffle = null;
        state.isDeleting = false;
      })
      .addCase(deleteRaffleThunk.rejected, (state) => {
        state.isDeleting = false;
      })

      .addCase(resetRaffleThunk.pending, (state) => {
        state.isResetting = true;
      })
      .addCase(resetRaffleThunk.fulfilled, (state, action) => {
        // Reset the current raffle
        if (state.currentRaffle) {
          state.currentRaffle = {
            ...state.currentRaffle,
            winnerCount: 0,
            participants: state.currentRaffle.participants?.map(
              (participant) => ({
                ...participant,
                isWinner: false,
              })
            ),
          };

          state.raffles = state.raffles.map((raffle) => {
            if (raffle._id === state.currentRaffle?._id) {
              return state.currentRaffle;
            }
            return raffle;
          });
        }

        state.isResetting = false;
      });
  },
});

export const { resetRaffleState, addParticipantToCurrentRaffle } =
  raffleSlice.actions;
export default raffleSlice.reducer;
