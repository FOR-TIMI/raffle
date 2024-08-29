import React, { useMemo } from "react";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/constants";
import { AppDispatch } from "../../../config/store";
import { createRaffleThunk } from "../../../features/raffle/raffleThunk";
import { RaffleCreateParams } from "../../../types";
import PageWrapper from "../../common/PageWrapper";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const isCreateRafflePage = useMemo(
    () => location.pathname === "/" + PAGE_ROUTES.CREATE_RAFFLE,
    [location.pathname]
  );

  const handleButtonClick = () => {
    if (isCreateRafflePage) {
      navigate(PAGE_ROUTES.HOME);
    } else {
      navigate(PAGE_ROUTES.CREATE_RAFFLE);
    }
  };

  const handleCreateRaffle = async (raffleData: RaffleCreateParams) => {
    try {
      await dispatch(createRaffleThunk(raffleData)).unwrap();
      navigate(PAGE_ROUTES.HOME);
    } catch (error) {
      console.error("Failed to create raffle:", error);
    }
  };

  const Button = useMemo(
    () => (
      <button
        className="mt-4 md:mt-0 bg-[#174B30] text-white flex items-center px-4 py-2 rounded"
        onClick={handleButtonClick}
      >
        {isCreateRafflePage ? (
          <>
            <LuArrowLeft className="mr-2" />
            Back to Home
          </>
        ) : (
          <>
            <LuPlus className="mr-2" />
            Create Draw
          </>
        )}
      </button>
    ),
    [isCreateRafflePage]
  );

  return (
    <PageWrapper title="Dashboard" Button={Button}>
      <div className="mt-5">
        <Outlet context={{ handleCreateRaffle }} />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;