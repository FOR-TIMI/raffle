import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import CreateRaffleForm from "../components/Smart/CreateRaffleForm";
import { PAGE_ROUTES } from "../config/constants";

const LoginPage = lazy(() => import("../pages/login"));
const SignUpPage = lazy(() => import("../pages/signup"));
const DashboardPage = lazy(() => import("../pages/home"));
const OneRaffle = lazy(() => import("../pages/OneRaffle"));
const DrawsList = lazy(() => import("../components/Smart/DrawList"));
const RequireAuth = lazy(() => import("../config/api/RequireAuth"));
const ParticipantsList = lazy(
  () => import("../pages/OneRaffle/ParticipantList")
);
const AddParticipantForm = lazy(
  () => import("../pages/OneRaffle/AddParticipant")
);
const NoAuthRequired = lazy(() => import("../config/api/NoAuthRequired"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<NoAuthRequired />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

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
  );
};

export default AppRoutes;
