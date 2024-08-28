import { Typography } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  Button: React.ReactNode;
  status?: "Active" | "Inactive";
};

const PageWrapper = ({ children, title, Button, status }: Props) => {
  const isActive = status === "Active";
  return (
    <div className="w-full h-screen my-10">
      <div className="mx-auto w-[90%] max-w-[1000px] my-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", fontSize: "32px" }}
            className="text-xl font-bold text-center md:text-left flex items-center"
          >
            {title}
            {status && (
              <span
                className={`max-w-[60px] ml-4 ${
                  isActive
                    ? "bg-green-100 text-green-600 border-green-500"
                    : "bg-red-100 text-red-600 border-red-500"
                } border rounded-full px-3 py-1 text-xs text-center`}
              >
                {status}
              </span>
            )}
          </Typography>

          {Button}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
