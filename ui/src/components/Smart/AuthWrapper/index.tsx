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
    const checkAUth = async () => {
      if (!auth.isAuthenticated && auth.status === "idle") {
        await dispatch(checkAuthThunk(axios)).unwrap();
      }
    };
    checkAUth();
  }, [dispatch, auth.isAuthenticated, auth.status]);

  if (auth.status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
