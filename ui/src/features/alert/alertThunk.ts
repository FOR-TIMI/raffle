import { AlertColor } from "@mui/material";
import { AppThunk } from "../../config/store";
import { closeAlert, openAlert } from "./alertSlice";

export const openAlertWithAutoClose =
  (message: string, alertType: AlertColor, duration: number = 3000): AppThunk =>
  (dispatch) => {
    dispatch(openAlert({ message, alertType }));

    setTimeout(() => {
      dispatch(closeAlert());
    }, duration);
  };
