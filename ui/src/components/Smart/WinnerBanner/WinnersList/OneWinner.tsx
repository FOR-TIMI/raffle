import { Box, Paper, Typography } from "@mui/material";
import Champion from "../../../../assets/icon/Champion";
import { User } from "../../../../types";

type Props = {
  winner: User;
};

const OneWinner = ({ winner }: Props) => {
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
      <Box display="flex" justifyContent="center" alignItems="Center">
        <Champion />
        <Box ml="0.8rem">
          <Typography variant="subtitle1" fontWeight="bold">
            {`${winner.firstName} ${winner.lastName}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {winner.email}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default OneWinner;
