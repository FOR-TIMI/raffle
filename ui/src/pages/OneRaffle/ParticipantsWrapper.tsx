import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  Button?: React.ReactNode;
};

const ParticipantsWrapper = ({ children, title, Button }: Props) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{ margin: "30px 0", fontSize: "24px", fontWeight: 500 }}
          className="my-4 mb-2"
        >
          {title}
        </Typography>
        {Button}
      </Box>
      {children}
    </>
  );
};

export default ParticipantsWrapper;
