import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { LuPartyPopper } from "react-icons/lu";
import { useSelector } from "react-redux";
import winnerBannerimg from "../../../assets/image/winner-banner.png";
import { RootState } from "../../../config/store";

type Props = {};

const WinnerBanner = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const currentRaffle = useSelector(
    (state: RootState) => state.raffle.currentRaffle
  );

  const handleSpinDraw = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "360px",
        background: `url(${winnerBannerimg})`,
        border: "1px solid #fff",
        margin: "1rem 0",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
    </Box>
  );
};

export default WinnerBanner;
