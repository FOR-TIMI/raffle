import axiosInstance from "../../../config/api";
import { USER_API_ROUTES } from "../../../config/constants";
import { User } from "../../../types";

interface AuthStatus {
  isAuthenticated: boolean;
}

export const checkAuthStatus = async (): Promise<AuthStatus> => {
  try {
    const response = await axiosInstance.get<User>(USER_API_ROUTES.GET_USER, {
      withCredentials: true, // Important for including cookies in the request
    });

    // If the request is successful, the user is authenticated
    return {
      isAuthenticated: true,
    };
  } catch (error) {
    // If there's an error (e.g., 401 Unauthorized), the user is not authenticated
    console.error("Error checking auth status:", error);
    return {
      isAuthenticated: false,
    };
  }
};
