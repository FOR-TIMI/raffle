import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../config/store";
import { getUserRafflesThunk } from "../../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import DrawItem from "./DrawItem";

const DrawsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { raffles, status } = useSelector((state: RootState) => state.raffle);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    dispatch(getUserRafflesThunk(axiosPrivate));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error loading draws</div>;
  }

  return (
    <div>
      {raffles.map((draw, index) => (
        <DrawItem
          key={draw._id}
          id={draw._id}
          title={draw.title}
          date={new Date(draw.createdAt).toLocaleDateString()}
          status={draw.winnerCount === 0 ? "Active" : "Inactive"}
          participants={draw.participantCount}
        />
      ))}
    </div>
  );
};

export default DrawsList;
