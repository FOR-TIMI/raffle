import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PAGE_ROUTES } from "../../config/constants";
import { AppDispatch, RootState } from "../../config/store";
import { fetchRaffleDetails } from "../../features/raffle/raffleThunk";
import OneParticipant from "./OneParticipant";
import ParticipantsWrapper from "./ParticipantsWrapper";

const ParticipantsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { _id: raffleId } = useSelector(
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
    () => (
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
    [isAddParticipantPage, raffleId]
  );

  useEffect(() => {
    if (raffleId) {
      dispatch(fetchRaffleDetails(raffleId));
    }
  }, [dispatch, raffleId]);

  return (
    <ParticipantsWrapper title={title} Button={Button}>
      <Outlet />
    </ParticipantsWrapper>
  );
};

export default ParticipantsList;
