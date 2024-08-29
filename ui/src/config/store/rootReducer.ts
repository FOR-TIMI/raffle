import { combineReducers } from "@reduxjs/toolkit";
import alertReducer from "../../features/alert/alertSlice";
import { authPersistedReducer } from "../../features/auth/authPersistor";
import { rafflePersistedReducer } from "../../features/raffle/rafflePersistor";

const rootReducer = combineReducers({
  auth: authPersistedReducer,
  alert: alertReducer,
  raffle: rafflePersistedReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
