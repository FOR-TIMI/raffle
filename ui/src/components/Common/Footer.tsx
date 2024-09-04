import { Box, Divider, Typography } from "@mui/material";
import Logo from "../../assets/icon/logo";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#1D1D1D",
        padding: "20px 0",
        margin: "0",
        width: "100%",
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          width: "80%",
          margin: "0 auto",
        }}
      >
        <Box maxWidth="300px" margin="0 auto" position="relative">
          <Logo />
          <Typography
            position="absolute"
            top={65}
            color="#fff"
            ml="83px"
            variant="caption"
          >
            Raffle Draws Made Easy
          </Typography>
        </Box>

        <Box textAlign="center">
          <Divider
            sx={{
              width: "100%",
              margin: "20px 0",
              opacity: 0.7,
              backgroundColor: "#fff",
            }}
          />

          <Typography color="#fff" sx={{ opacity: 0.7 }} variant="caption">
            &copy; Raffler {new Date().getFullYear()}. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
