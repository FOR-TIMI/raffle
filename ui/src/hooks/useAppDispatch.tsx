import { useDispatch as useReduxDispatch } from "react-redux";
import { AppDispatch } from "../config/store"; // Import AppDispatch from your store

// Typed useDispatch hook
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
