import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Home = lazy(() => import("../pages/home"));
const LoginPage = lazy(() => import("../pages/login"));
const SignUpPage = lazy(() => import("../pages/signup"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* More routes here */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
