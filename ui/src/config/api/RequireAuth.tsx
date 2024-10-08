import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthenticatedLayout from "../../components/Layout/AuthenticatedLayout";
import { RootState } from "../store";

const RequireAuth: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (auth.status === "loading" || auth.status === "idle") {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
};

export default RequireAuth;
