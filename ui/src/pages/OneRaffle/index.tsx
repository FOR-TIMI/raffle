import { Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxReset } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import PageWrapper from "../../components/Common/PageWrapper";
import Sidebar from "../../components/Smart/SideBar/SideBar";
import SidebarItem from "../../components/Smart/SideBar/SideBarItem";
import WinnerBanner from "../../components/Smart/WinnerBanner";
import ParticipantsList from "./ParticipantPage";

import { PAGE_ROUTES } from "../../config/constants";
import { AppDispatch, RootState } from "../../config/store";
import {
  deleteRaffleThunk,
  fetchRaffleDetails,
  refreshRaffleDetails,
  resetRaffleThunk,
} from "../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const OneRaffle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentRaffle: raffleDetails,
    isRefreshing,
    isDeleting,
    isResetting,
  } = useSelector((state: RootState) => state.raffle);
  const axios = useAxiosPrivate();
  const navigte = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchRaffleDetails({ id, axios }));
    }
  }, [id, dispatch, axios]);

  const handleRefresh = useCallback(() => {
    if (id) {
      dispatch(refreshRaffleDetails({ id, axios }));
    }
  }, [id, dispatch, axios]);

  const handleDelete = useCallback(() => {
    if (id) {
      dispatch(deleteRaffleThunk({ raffleId: id, axios }));
      setTimeout(() => {
        navigte(PAGE_ROUTES.HOME, { replace: true });
      }, 0);
    }
  }, [id, dispatch, axios]);

  const handleReset = useCallback(() => {
    if (id) {
      dispatch(resetRaffleThunk({ raffleId: id, axios }));
      dispatch(refreshRaffleDetails({ id, axios }));
    }
  }, [id, dispatch, axios]);

  const CustomButton = useCallback(
    ({ icon: Icon, text, onClick, isLoading }) => (
      <Button
        startIcon={<Icon />}
        onClick={onClick}
        disabled={isLoading}
        className="mb-4"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          boxShadow: "none",
          border: "1px solid rgb(249 250 251)",
          borderRadius: "0.5rem",
          transition: "all 0.5s",
          color: "#000",
          padding: "8px 20px",

          "&:hover": {
            bgcolor: "#f0f0f0",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          },
          "&:active": {
            transform: "scale(0.95)",
            bgcolor: "#fff",
          },
        }}
      >
        {isLoading ? `${text}ing...` : text}
      </Button>
    ),
    []
  );

  const ButtonGroup = useMemo(
    () => (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        maxWidth="500px"
        padding="0 0 0 10px"
      >
        <Box ml="10px">
          <CustomButton
            icon={RxReset}
            text="Reset"
            onClick={handleReset}
            isLoading={isResetting}
          />
        </Box>
        <Box ml="10px">
          <CustomButton
            icon={FiRefreshCw}
            text="Refresh"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          />
        </Box>
        <Box ml="10px">
          <CustomButton
            icon={RiDeleteBinLine}
            text="Delete"
            onClick={handleDelete}
            isLoading={isDeleting}
          />
        </Box>
      </Box>
    ),
    [
      CustomButton,
      handleReset,
      handleRefresh,
      handleDelete,
      isResetting,
      isRefreshing,
      isDeleting,
    ]
  );

  if (!raffleDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <section className="flex">
        <PageWrapper
          status={raffleDetails.winnerCount > 0 ? "Inactive" : "Active"}
          title={raffleDetails.title}
          Component={ButtonGroup}
        >
          {!!raffleDetails.participantCount && <WinnerBanner />}
          <ParticipantsList />
        </PageWrapper>
      </section>
    </>
  );
};

export default React.memo(OneRaffle);
