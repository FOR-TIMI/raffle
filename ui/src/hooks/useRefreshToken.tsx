import { useDispatch } from "react-redux";
import axios from "../config/api";
import { USER_API_ROUTES } from "../config/constants";
import { AppDispatch } from "../config/store";
import { setUser } from "../features/auth/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch<AppDispatch>();

  const refresh = async () => {
    try {
      const response = await axios.post(USER_API_ROUTES.REFRESH_TOKEN, {
        withCredentials: true,
      });
      dispatch(setUser(response.data.user));
      return response.data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };
  return refresh;
};

export default useRefreshToken;
