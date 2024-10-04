import React, { useContext } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { logoutUser } from "../../../../features/auth/authThunk";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { SidebarContext } from "../../SideBar/SideBar";

const LogoutButton: React.FC = () => {
  const { expanded } = useContext(SidebarContext);
  const dispatch = useAppDispatch();
  const axios = useAxiosPrivate();

  const handleClick = async () => {
    await dispatch(logoutUser(axios)).unwrap();
  };
  return (
    <button
      onClick={handleClick}
      className={`
            relative flex  items-center py-2 px-3 my-10
            font-medium rounded-md cursor-pointer
            transition-colors group
           hover:bg-indigo-50 text-gray-600
            before:content-['']
            before:absolute before:w-1 before:h-full
            before:bg-indigo-500 before:top-0 before:left-0
        `}
    >
      <RiLogoutCircleRLine size={20} />
      <span
        className={`overflow-hidden text-left transition-all line ${
          expanded ? "w-52 ml-3" : "hidden"
        }`}
      >
        Log out
      </span>
    </button>
  );
};

export default LogoutButton;
