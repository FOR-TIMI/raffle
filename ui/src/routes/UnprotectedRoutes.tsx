import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

const LoginPage = lazy(() => import("../pages/login"));
const SignUpPage = lazy(() => import("../pages/signup"));

const UnprotectedRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Suspense>
  );
};

export default UnprotectedRoutes;
