import { combineReducers } from "@reduxjs/toolkit";
import alertReducer from "../../features/alert/alertSlice";
import authReducer from "../../features/auth/authSlice";
import raffleReducer from "../../features/raffle/raffleSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  raffle: raffleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
