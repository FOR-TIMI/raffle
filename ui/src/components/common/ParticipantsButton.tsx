import { Box, Button, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../config/store";
import {
  addParticipantThunk,
  refreshRaffleDetails,
} from "../../features/raffle/raffleThunk";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type Props = {
  children: React.ReactNode;
  navToUrl?: string;
  title: string;
  type?: "button" | "link" | "file";
};

const ParticipantsButton = ({
  children,
  title,
  type = "button",
  navToUrl,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const raffleId = useSelector(
    (state: RootState) => state.raffle.currentRaffle?._id
  );
  const axios = useAxiosPrivate();

  const validateFile = (file: File): boolean => {
    const allowedExtensions = /\.(xlsx)$/i;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    if (!allowedExtensions.test(file.name)) {
      setError("Invalid file type!");
      return false;
    }

    if (file.size > maxSizeInBytes) {
      setError("File size exceeds the maximum limit of 5 MB.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleClick = () => {
    if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        dispatch(
          addParticipantThunk({ raffleId, type: "file", axios, payload: file })
        ).then(() => {
          dispatch(refreshRaffleDetails({ axios, id: raffleId }));
        });
      } else {
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const buttonProps = {
    component: type === "link" ? Link : "button",
    to: type === "link" ? navToUrl : undefined,
    onClick: type === "file" ? handleClick : undefined,
  };

  return (
    <Box position="relative">
      <Tooltip title={title} arrow>
        <Button
          color="primary"
          {...buttonProps}
          sx={{
            width: "32px",
            minWidth: "32px",
            height: "32px",
            minHeight: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
            boxShadow: "none",
            border: "1px solid rgb(249 250 251)",
            borderRadius: "0.5rem",
            transition: "all 0.3s",
            "&:hover": {
              bgcolor: "rgb(83 127 105)",
              transform: "scale(1.1)",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              "& svg": {
                fill: "white",
              },
            },
            "&:active": {
              transform: "scale(0.95)",
              bgcolor: "#fff",
            },
          }}
        >
          {children}
          {type === "file" && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept=".xlsx"
            />
          )}
        </Button>
      </Tooltip>
      <Box
        position="absolute"
        height="20px"
        width="900px"
        fontSize="12px"
        visibility={error ? "visible" : "hidden"}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Box>
    </Box>
  );
};

export default ParticipantsButton;
