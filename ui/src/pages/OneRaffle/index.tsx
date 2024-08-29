import { Button, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import Sidebar from "../../components/Smart/SideBar/SideBar";
import SidebarItem from "../../components/Smart/SideBar/SideBarItem";
import WinnerBanner from "../../components/Smart/WinnerBanner";
import { AppDispatch, RootState } from "../../config/store";
import {
  fetchRaffleDetails,
  refreshRaffleDetails,
} from "../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ParticipantsList from "./ParticipantPage";

const OneRaffle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const raffleDetails = useSelector(
    (state: RootState) => state.raffle.currentRaffle
  );
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxiosPrivate();

  useEffect(() => {
    if (id) {
      dispatch(fetchRaffleDetails({ id, axios }));
    }
  }, [id, dispatch]);

  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(refreshRaffleDetails({ id, axios })).then(() => {
      setIsLoading(false);
    });
  };

  const CustomButton = useMemo(
    () => (
      <Button
        variant="contained"
        onClick={handleRefresh}
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? "Refreshing..." : "Refresh"}
      </Button>
    ),
    [isLoading]
  );

  if (!raffleDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Sidebar>
        <SidebarItem alert={true} icon={LuLayoutDashboard} text="Home" active />
      </Sidebar>

      <section className="flex">
        <PageWrapper
          status={raffleDetails.winnerCount > 0 ? "Inactive" : "Active"}
          title={raffleDetails.title}
          Button={!!raffleDetails.participantCount && CustomButton}
        >
          {!!raffleDetails.participantCount && <WinnerBanner />}
          <ParticipantsList />
        </PageWrapper>
      </section>
    </>
  );
};

export default OneRaffle;
