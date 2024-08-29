import React, { createContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ROUTES } from "../config/constants";
import { RootState } from "../config/store";
import { setUser } from "../features/auth/authSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { User } from "../types";

interface AuthContextType {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
  };
}

const AuthContext = createContext<AuthContextType>({
  auth: {
    user: null,
    isAuthenticated: false,
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosPrivate.get(USER_API_ROUTES.GET_USER);
        dispatch(setUser(response.data));
      } catch (error) {
        console.error("Authentication check failed:", error);
        dispatch(setUser(null));
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
