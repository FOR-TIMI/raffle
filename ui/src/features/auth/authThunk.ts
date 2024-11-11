import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { USER_API_ROUTES } from "../../config/constants";
import { signUpApi, UserSignupRequestBody } from "./config/signup";

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuth",
  async (axiosPrivate: AxiosInstance, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(USER_API_ROUTES.GET_USER);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Authentication failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    {
      email,
      password,
      axios,
    }: { email: string; password: string; axios: AxiosInstance },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(USER_API_ROUTES.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (axios: AxiosInstance, { rejectWithValue }) => {
    try {
      await axios.post(USER_API_ROUTES.LOG_OUT, {});
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signUpUser = createAsyncThunk<
  { message: string },
  { body: UserSignupRequestBody },
  { rejectValue: any }
>("auth/signup", async ({ body }, { rejectWithValue }) => {
  try {
    const data = await signUpApi(body);
    return data;
  } catch (error) {
    return rejectWithValue((error as any).response?.data);
  }
});
