import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Home = lazy(() => import("../pages/home"));

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* More routes here */}
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
