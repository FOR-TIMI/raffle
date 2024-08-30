import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/constants";
import { RootState } from "../../../config/store";
import { checkAuthStatus } from "./protected.service";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        try {
          const status = await checkAuthStatus();
        } catch (error) {
          console.error("Error verifying authentication:", error);
          navigate(PAGE_ROUTES.LOGIN, { replace: true });
        }
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [dispatch, navigate, isAuthenticated]);

  if (isChecking) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
