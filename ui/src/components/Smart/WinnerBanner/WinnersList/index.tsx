import { Box, Grid, Typography } from "@mui/material";
import Trophy from "../../../../assets/icon/Trophy";
import { User } from "../../../../types";
import OneWinner from "./OneWinner";

type Props = {
  winners: User[];
};

const WinnersList = ({ winners }: Props) => {
  const gridItemSize = winners.length > 3 ? 4 : winners.length === 1 ? 12 : 6;

  return (
    <Box>
      <Box my="10px" display="flex" justifyContent="center" alignItems="center">
        <Typography
          fontSize="32px"
          fontWeight="bold"
          color="#2E5D45"
          textAlign="center"
          variant="h3"
        >
          WINNER{winners.length !== 1 && "S"}
        </Typography>
        <Trophy size={70} />
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {winners.map((winner, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={gridItemSize}
            key={i}
            display="flex"
            justifyContent="center"
          >
            <OneWinner winner={winner} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WinnersList;
