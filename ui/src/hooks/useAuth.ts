import { useSelector } from "react-redux";
import { RootState } from "../config/store";

const useAuth = () => {
  return useSelector((state: RootState) => state.auth);
};

export default useAuth;
