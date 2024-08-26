import { Box, SxProps } from "@mui/material";

type Props = {
  width?: string;
  height?: string;
  sx?: SxProps;
};

const Blob = ({ width = "300px", height = "300px", sx }: Props) => {
  return <Box sx={{ ...sx }} width={width} height={height}></Box>;
};

export default Blob;
