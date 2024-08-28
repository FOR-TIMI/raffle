import { Typography } from "@mui/material";
import React from "react";
import { IoMdPerson } from "react-icons/io";
import { Link } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/constants";

type Props = {
  title: string;
  date: string;
  status: "Active" | "Inactive";
  participants: number;
  id: string;
};

const DrawItem: React.FC<Props> = ({
  title,
  date,
  status,
  participants,
  id,
}) => {
  const isActive = status === "Active";

  return (
    <Link
      to={PAGE_ROUTES.ONE_DRAW.replace(":id", id)}
      className="grid grid-cols-4 gap-4 bg-white rounded-lg shadow-sm my-3 items-center py-3 px-6 border border-gray-200"
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "600" }}
        className=" font-extrabold"
      >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: "600" }}>
        {date}
      </Typography>
      <span
        className={`max-w-[60px] ${
          isActive
            ? "bg-green-100 text-green-600 border-green-500"
            : "bg-red-100 text-red-600 border-red-500"
        } border rounded-full px-3 py-1 text-xs text-center`}
      >
        {status}
      </span>
      <Typography
        variant="subtitle1"
        className="text-gray-700 flex justify-end items-center"
      >
        <IoMdPerson size={17} className="mr-1" />
        {participants}
      </Typography>
    </Link>
  );
};

export default DrawItem;
