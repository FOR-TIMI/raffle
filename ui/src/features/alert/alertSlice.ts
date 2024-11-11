import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  isOpen: boolean;
  message: string;
  alertType: AlertColor;
  duration?: number;
}

const initialState: AlertState = {
  isOpen: false,
  message: "",
  alertType: "info",
  duration: 5000,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlert: (state, action: PayloadAction<Partial<AlertState>>) => {
      state.isOpen = true;
      state.message = action.payload.message || state.message;
      state.alertType = action.payload.alertType || state.alertType;
    },
    closeAlert: (state) => {
      state.isOpen = false;
      state.duration = 0;
      state.message = "";
      state.alertType = "info";
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
