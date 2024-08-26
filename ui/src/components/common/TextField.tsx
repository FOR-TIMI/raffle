import {
  IconButton,
  InputAdornment,
  TextField as MuiTextField,
  SxProps,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const defaultStyles = {
  width: "100%",
  margin: "0.3rem 0",
};

type Props = {
  name: string;
  value: string;
  errors: any;
  touched: any;
  labelText?: string;
  onBlur?: (e) => void;
  onChange?: (e) => void;
  showPassword?: boolean;
  error?: boolean;
  handleClickShowPassword?: (e) => void;
  helperText?: string;
  sx?: SxProps;
  type?: "password" | "text";
  variant?: "outlined" | "filled";
};

const TextField = React.memo(
  ({
    name,
    value,
    errors,
    touched,
    labelText,
    onBlur,
    onChange,
    showPassword,
    handleClickShowPassword,
    helperText,
    type = "text",
    variant = "filled",
    sx,
  }: Props) => {
    const PRIMARY_COLOR = "#174B30";
    const errorText = useMemo(() => {
      return touched[name] && errors[name] ? errors[name].toString() : "";
    }, [touched, errors, name]);

    const isInvalid = useMemo(() => {
      return !!touched[name] && !!errors[name];
    }, [touched, errors]);

    const inputProps = useMemo(
      () => ({
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleClickShowPassword}
                name={name}
                edge="end"
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }),
      [showPassword, type]
    );

    const sxStyles = useMemo(
      () => ({
        ...defaultStyles,
        ...sx,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: `${PRIMARY_COLOR} !important`,
          },
          "&:hover fieldset": {
            borderColor: `${PRIMARY_COLOR} !important`,
          },
          "&.Mui-focused fieldset": {
            borderColor: `${PRIMARY_COLOR} !important`,
          },
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: `${PRIMARY_COLOR} !important`,
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: `${PRIMARY_COLOR} !important`,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: `${PRIMARY_COLOR} !important`,
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: PRIMARY_COLOR,
          borderColor: `${PRIMARY_COLOR} !important`,
        },
      }),
      [sx]
    );

    return (
      <MuiTextField
        label={labelText}
        type={!!showPassword ? "text" : type}
        onBlur={onBlur}
        onChange={onChange}
        variant={variant}
        value={value}
        name={name}
        error={isInvalid}
        helperText={helperText || errorText}
        InputProps={inputProps}
        sx={sxStyles}
      />
    );
  }
);

export default TextField;
