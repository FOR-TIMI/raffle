import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PublicLayout from "../../components/Layout/PublicLayout";
import { RootState } from "../store";

const NoAuthRequired: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (auth && (auth.status === "loading" || auth.status === "idle")) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default NoAuthRequired;
