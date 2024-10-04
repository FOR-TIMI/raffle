import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Champion from "../../assets/icon/Champion";
import { AppDispatch, RootState } from "../../config/store";
import { removeParticipantFromRaffleThunk } from "../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { User } from "../../types";

type Props = {
  participant: User;
  isAuthor: boolean;
  raffleId: string;
};

const OneParticipant = ({ participant, isAuthor }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const raffleId = useSelector(
    (state: RootState) => state.raffle.currentRaffle?._id
  );
  const isLoading = useSelector(
    (state: RootState) => state.raffle.status === "loading"
  );

  const axios = useAxiosPrivate();

  const handleRemoveParticipant = () => {
    dispatch(
      removeParticipantFromRaffleThunk({
        raffleId,
        participantId: participant.id,
        axios,
      })
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        height: "100%",
        position: "relative",
        top: 0,
      }}
    >
      <Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {`${participant.firstName} ${participant.lastName}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {participant.email}
          </Typography>
        </Box>

        <Box position="absolute" top="0" right="0">
          {isAuthor && (
            <Button
              onClick={handleRemoveParticipant}
              disabled={isLoading}
              sx={{
                minWidth: "32px",
                width: "100%",
                height: "100%",
                cursor: "pointer",
                top: "0",
                right: "0",
                minHeight: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#fff",
                boxShadow: "none",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                <IoClose color="#dc3545" />
              )}
            </Button>
          )}
        </Box>
      </Box>
      <Box>{participant.isWinner && <Champion />}</Box>
    </Paper>
  );
};

export default OneParticipant;
