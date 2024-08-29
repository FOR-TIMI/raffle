import { useEffect, useMemo } from "react";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../config/store";
import { fetchRaffleDetails } from "../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ParticipantsWrapper from "./ParticipantsWrapper";

const ParticipantsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { _id: raffleId, winnerCount } = useSelector(
    (state: RootState) => state.raffle.currentRaffle
  );

  const isAddParticipantPage = location.pathname.includes("/add-participant");

  const title = useMemo(() => {
    return isAddParticipantPage ? "Add Participant" : "Participants";
  }, [isAddParticipantPage]);

  const handleButtonClick = () => {
    if (isAddParticipantPage) {
      navigate(`/draws/${raffleId}`);
    } else {
      navigate(`/draws/${raffleId}/add-participant`);
    }
  };

  const Button = useMemo(
    () =>
      winnerCount === 0 && (
        <button
          className="mt-4 md:mt-0 bg-[#174B30] text-white flex items-center px-4 py-2 rounded"
          onClick={handleButtonClick}
        >
          {isAddParticipantPage ? (
            <>
              <LuArrowLeft className="mr-2" />
              Back
            </>
          ) : (
            <>
              <LuPlus className="mr-2" />
              Add Participant
            </>
          )}
        </button>
      ),
    [isAddParticipantPage, raffleId, winnerCount]
  );

  useEffect(() => {
    if (raffleId) {
      dispatch(fetchRaffleDetails({ id: raffleId, axios }));
    }
  }, [dispatch, raffleId]);

  return (
    <ParticipantsWrapper title={title} Button={Button}>
      <Outlet />
    </ParticipantsWrapper>
  );
};

export default ParticipantsList;
