import axios from "axios";
import { AppDispatch, RootState } from "../../config/store";

let store: { getState: () => RootState; dispatch: AppDispatch };

export const injectStore = (_store: {
  getState: () => RootState;
  dispatch: AppDispatch;
}) => {
  store = _store;
};

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000/api";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
