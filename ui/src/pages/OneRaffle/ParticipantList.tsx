import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../config/store";
import OneParticipant from "./OneParticipant";

const ParticipantList = () => {
  const currentRaffle = useSelector(
    (state: RootState) => state.raffle.currentRaffle
  );
  const status = useSelector((state: RootState) => state.raffle.status);
  const isAuthor = useSelector(
    (state: RootState) => state.auth.user.email === currentRaffle?.creatorEmail
  );

  const isRefreshing = useSelector(
    (state: RootState) => state.raffle.isRefreshing
  );
  const isResetting = useSelector(
    (state: RootState) => state.raffle.isResetting
  );
  const isDeleting = useSelector((state: RootState) => state.raffle.isDeleting);

  if (status === "loading" || isRefreshing || isResetting || isDeleting) {
    return <div>Loading participants...</div>;
  }

  if (status === "failed") {
    return <div>Error loading participants</div>;
  }

  if (
    !currentRaffle ||
    !currentRaffle.participants ||
    !currentRaffle.participants.length
  ) {
    return <div>There are no participants for this raffle yet</div>;
  }

  return (
    <Grid container spacing={2}>
      {currentRaffle.participants.map((participant, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <OneParticipant
            participant={participant}
            isAuthor={isAuthor}
            raffleId={currentRaffle._id}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ParticipantList;
