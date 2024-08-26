import { combineReducers } from "@reduxjs/toolkit";
import alertReducer from "../../features/alert/alertSlice";
import authReducer from "../../features/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
