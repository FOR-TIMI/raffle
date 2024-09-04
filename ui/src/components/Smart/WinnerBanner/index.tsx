import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { LuPartyPopper } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import winnerBannerimg from "../../../assets/image/winner-banner.png";
import { AppDispatch, RootState } from "../../../config/store";
import {
  refreshRaffleDetails,
  spinRaffleThunk,
} from "../../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import WinnersList from "./WinnersList";

const MemoizedWinnersList = React.memo(WinnersList);

const WinnerBanner = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const currentRaffle = useSelector(
    (state: RootState) => state.raffle.currentRaffle
  );
  const axios = useAxiosPrivate();

  const winners = useMemo(() => {
    return currentRaffle?.participants?.filter((p) => p.isWinner) || [];
  }, [currentRaffle?.participants]);

  const handleSpinDraw = useCallback(() => {
    setIsLoading(true);
    dispatch(spinRaffleThunk({ raffleId: currentRaffle?._id, axios }))
      .then(() =>
        dispatch(refreshRaffleDetails({ id: currentRaffle?._id, axios }))
      )
      .finally(() => setIsLoading(false));
  }, [dispatch, currentRaffle?._id, axios]);

  const component = useMemo(() => {
    if (!currentRaffle) {
      return null; // or a loading indicator
    }

    if (winners.length > 0) {
      return <MemoizedWinnersList winners={winners} />;
    }

    return (
      <Button
        type="submit"
        disabled={isLoading}
        onClick={handleSpinDraw}
        sx={{
          height: "43px",
          backgroundColor: "#174B30",
          "&:hover": {
            cursor: isLoading ? "not-allowed" : "pointer",
            backgroundColor: "#174B30",
            opacity: 0.7,
          },
          width: "238px",
          textTransform: "none",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <CircularProgress
            sx={{
              color: "#D0EAC3",
            }}
            size={22}
          />
        ) : (
          <Typography color="#fff" display="flex" justifyContent="center">
            Spin Draw
            <LuPartyPopper style={{ marginLeft: "10px" }} size={20} />
          </Typography>
        )}
      </Button>
    );
  }, [winners, isLoading, handleSpinDraw, currentRaffle]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "360px",
        background: `url(${winnerBannerimg})`,
        border: "1px solid #fff",
        margin: "1rem 0",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {component}
    </Box>
  );
};

export default React.memo(WinnerBanner);
