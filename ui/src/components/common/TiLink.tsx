import { Button, SxProps, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  to: string;
  text: string;
  sx?: SxProps;
  variant?: "link" | "button";
  buttonSx?: SxProps;
  disabled?: boolean;
};

const TiLink = ({
  to,
  text,
  sx,
  variant = "link",
  buttonSx,
  disabled,
}: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  const renderContent = () => (
    <Typography display="inline" textAlign="center">
      {text}
    </Typography>
  );

  const renderLink = () => (
    <Link
      to={disabled ? "#" : to}
      aria-disabled={disabled}
      style={{
        color: "#174B30",
        textDecoration: "underline",
        fontSize: "12px",
      }}
    >
      {renderContent()}
    </Link>
  );

  const renderButtonLikeLink = () => (
    <Button sx={buttonSx} disabled={disabled} onClick={handleClick}>
      {renderContent()}
    </Button>
  );

  return (
    <Typography component="span" sx={sx}>
      {variant === "link" ? renderLink() : renderButtonLikeLink()}
    </Typography>
  );
};

export default TiLink;
