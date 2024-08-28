import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateRaffleForm from "../components/Smart/CreateRaffleForm";
import DrawsList from "../components/Smart/DrawList";
import RequireAuth from "../config/api/RequireAuth";
import { PAGE_ROUTES } from "../config/constants";
import AddParticipantForm from "../pages/OneRaffle/AddParticipant";
import ParticipantsList from "../pages/OneRaffle/ParticipantList";

const LoginPage = lazy(() => import("../pages/login"));
const SignUpPage = lazy(() => import("../pages/signup"));
const DashboardPage = lazy(() => import("../pages/home"));
const OneRaffle = lazy(() => import("../pages/OneRaffle"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path={PAGE_ROUTES.HOME} element={<DashboardPage />}>
              <Route index element={<DrawsList />} />
              <Route
                path={PAGE_ROUTES.CREATE_RAFFLE}
                element={<CreateRaffleForm />}
              />
            </Route>
            <Route path={PAGE_ROUTES.ONE_DRAW} element={<OneRaffle />}>
              <Route index element={<ParticipantsList />} />
              <Route
                path={PAGE_ROUTES.ADD_PARTICIPANT}
                element={<AddParticipantForm />}
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
