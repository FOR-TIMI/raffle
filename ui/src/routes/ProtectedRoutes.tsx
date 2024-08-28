import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import DrawsList from "../components/Smart/DrawList";
import RequireAuth from "../config/api/RequireAuth";
import { PAGE_ROUTES } from "../config/constants";

const DashboardPage = lazy(() => import("../pages/home"));
const CreateRaffleForm = lazy(
  () => import("../components/Smart/CreateRaffleForm")
);

const ProtectedRoutes = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <Route element={<RequireAuth />}>
        <Route path={PAGE_ROUTES.HOME} element={<DashboardPage />}>
          <Route index element={<DrawsList />} />
          <Route
            path={PAGE_ROUTES.CREATE_RAFFLE}
            element={<CreateRaffleForm />}
          />
        </Route>
      </Route>
    </Suspense>
  );
};

export default ProtectedRoutes;
