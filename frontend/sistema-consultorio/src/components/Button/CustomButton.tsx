import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  variant?: "text" | "contained" | "outlined";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  disabled?: boolean;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  variant = "contained",
  color = "primary",
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
