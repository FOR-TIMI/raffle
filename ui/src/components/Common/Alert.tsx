import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { GrClose } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../config/store";
import { closeAlert } from "../../features/alert/alertSlice";

export default function TransitionAlerts() {
  const dispatch = useDispatch();
  const { isOpen, message, alertType } = useSelector(
    (state: RootState) => state.alert
  );

  const handleClose = () => {
    dispatch(closeAlert());
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={isOpen}>
        <Alert
          severity={alertType}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <GrClose fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
}
