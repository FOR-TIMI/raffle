import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../config/store";
import { checkAuthThunk } from "../../../features/auth/authThunk";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const axios = useAxiosPrivate();

  useEffect(() => {
    if (!auth.isAuthenticated && auth.status === "idle") {
      dispatch(checkAuthThunk(axios));
    }
  }, [dispatch, auth.isAuthenticated, auth.status]);

  if (auth.status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
