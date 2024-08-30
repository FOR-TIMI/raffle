import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../config/store";
import OneParticipant from "./OneParticipant";

type Props = {};

const ParticipantList = (props: Props) => {
  const currentRaffle = useSelector(
    (state: RootState) => state.raffle.currentRaffle
  );
  const status = useSelector((state: RootState) => state.raffle.status);

  if (status === "loading") {
    return <div>Loading participants...</div>;
  }

  if (status === "failed") {
    return <div>Error loading participants</div>;
  }

  if (!currentRaffle || !currentRaffle.participants) {
    return <div>No participants found</div>;
  }

  return (
    <Grid container spacing={2}>
      {currentRaffle.participants.map((participant, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <OneParticipant participant={participant} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ParticipantList;
