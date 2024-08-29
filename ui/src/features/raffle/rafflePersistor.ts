import persistReducer from "redux-persist/es/persistReducer";
import storage from "../../config/store/config";
import raffleReducer from "./raffleSlice";

export const rafflePersistConfig = {
  key: "raffle",
  storage: storage,
};

export const rafflePersistedReducer = persistReducer(
  rafflePersistConfig,
  raffleReducer
);
