import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import { MdArrowBack } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import ParticipantsButton from "../../components/common/ParticipantsButton";
import { PAGE_ROUTES } from "../../config/constants";
import { AppDispatch, RootState } from "../../config/store";
import { fetchRaffleDetails } from "../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ParticipantsWrapper from "./ParticipantsWrapper";

const ParticipantsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const axios = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(true);

  const { currentRaffle, isResetting, isRefreshing } = useSelector(
    (state: RootState) => state.raffle
  );
  const { _id: raffleId, participantCount } = currentRaffle;

  const isAddParticipantPage = location.pathname.includes("/add-participant");

  const navToUrl = useMemo(() => {
    const basePath = `${PAGE_ROUTES.DRAWS}/${raffleId}`;
    return isAddParticipantPage
      ? basePath
      : `${basePath}/${PAGE_ROUTES.ADD_PARTICIPANT}`;
  }, [raffleId, isAddParticipantPage]);

  const title = useMemo(
    () => (isAddParticipantPage ? "Back" : "Add Participants"),
    [isAddParticipantPage]
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
          <ParticipantsButton title={title} type="link" navToUrl={navToUrl}>
            {isAddParticipantPage ? (
              <MdArrowBack color="#000" />
            ) : (
              <GoPlus color="#000" />
            )}
          </ParticipantsButton>
        </Box>
        <Box ml="10px">
          <ParticipantsButton
            title={"Upload Participant list from excel file"}
            type="file"
            navToUrl={navToUrl}
          >
            <RiFileExcel2Line color="#000" />
          </ParticipantsButton>
        </Box>
      </Box>
    ),
    [isAddParticipantPage, title, navToUrl]
  );

  const TextComponent = useMemo(() => {
    if (isRefreshing || isResetting) {
      return <Box>Loading participants...</Box>;
    }
    if (!participantCount && !isAddParticipantPage) {
      return <Box>There are no participants for this raffle yet</Box>;
    }
    return null;
  }, [isRefreshing, isResetting, participantCount, isAddParticipantPage]);

  useEffect(() => {
    if (raffleId) {
      setIsLoading(true);
      dispatch(fetchRaffleDetails({ id: raffleId, axios })).finally(() =>
        setIsLoading(false)
      );
    }
  }, [dispatch, raffleId, axios]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ParticipantsWrapper title={title} Button={ButtonGroup}>
      <Outlet />
      {TextComponent}
    </ParticipantsWrapper>
  );
};

export default React.memo(ParticipantsList);
