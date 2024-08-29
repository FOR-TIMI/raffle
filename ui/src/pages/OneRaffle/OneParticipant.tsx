import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";
import { User } from "../../types";

type Props = {
  participant: User;
};

const OneParticipant = ({ participant }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {`${participant.firstName} ${participant.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {participant.email}
        </Typography>
      </Box>
      <Box>
        {participant.isWinner && (
          <Chip
            label="Selected"
            color="primary"
            sx={{
              backgroundColor: "#ffd700",
              color: "#fff",
              fontWeight: "bold",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default OneParticipant;