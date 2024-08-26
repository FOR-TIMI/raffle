import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState, LoginResponse } from "../../types";
import { loginUserAPI } from "./config/login";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginUserAPI(email, password);
    return data; // Expecting { user, accessToken, refreshToken }
  } catch (error) {
    return rejectWithValue((error as any).response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
