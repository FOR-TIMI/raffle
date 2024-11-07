import { createSlice } from "@reduxjs/toolkit";
import { User, ValidationErrorType } from "../../types";
import { checkAuthThunk, loginUser, logoutUser } from "./authThunk";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(
        loginUser.rejected,
        (state, action: { payload: string | ValidationErrorType }) => {
          state.status = "failed";
          const payload = action.payload;
          console.log(payload);
          if (typeof payload === "string" && payload.length) {
            state.error = payload;
          } else if (
            payload &&
            typeof payload === "object" &&
            "message" in payload
          ) {
            console.log({
              message: payload.message + "             In Obj",
              isArr: Array.isArray(payload.message),
            });

            if (Array.isArray(payload.message) && payload.message.length > 0) {
              console.log({
                message: payload.message + "             In Obj",
                isArr: Array.isArray(payload.message),
              });
              state.error =
                payload.message[0]?.message || "Something Went wrong";
            } else if (typeof payload.message === "string") {
              state.error = payload.message;
            }
          } else {
            state.error = "Oops, Something went wrong :(";
          }
        }
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "succeeded";
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(checkAuthThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
