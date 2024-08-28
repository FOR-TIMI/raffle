import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginResponse } from "../../types";
import {
  getAuthCookies,
  removeAuthCookies,
  setAuthCookies,
} from "./config/cookies";
import { loginUserAPI } from "./config/login";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  error: null,
  status: "idle",
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>("", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginUserAPI(email, password);
    setAuthCookies(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.isAuthenticated = false;
      removeAuthCookies();
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    updateTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      const { accessToken, refreshToken } = getAuthCookies();
      if (accessToken && refreshToken) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
          state.refreshToken = action.payload.refreshToken;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
        console.log("FAILED state", action.payload);
      });
  },
});

export const { logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
