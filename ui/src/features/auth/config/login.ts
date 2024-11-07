// src/features/authAPI.ts
import axiosInstance from "../../../config/api"; // Adjust the path as necessary
import { LoginResponse, RefreshTokenResponse, User } from "../../../types";

// Function to log in
export const loginUserAPI = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/sessions", {
    email,
    password,
  });

  return response?.data;
};

export const refreshAccessTokenAPI = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<RefreshTokenResponse>(
    "/sessions/refresh",
    { refreshToken },
    { withCredentials: true }
  );
  return response.data; // Expecting { accessToken, user }
};

export const fetchUserDataAPI = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/user/data");
  return response.data;
};

export const logoutUserAPI = async (): Promise<void> => {
  await axiosInstance.post("/logout");
};
