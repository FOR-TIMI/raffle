import persistReducer from "redux-persist/es/persistReducer";
import storage from "../../config/store/config";
import authReducer from "./authSlice";

export const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["accessToken", "refreshToken"],
};

export const authPersistedReducer = persistReducer(
  authPersistConfig,
  authReducer
);
