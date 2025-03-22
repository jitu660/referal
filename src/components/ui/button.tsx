import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const StyledButton = styled(motion.button)<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.size === "sm" ? "0.75rem" : props.size === "lg" ? "1.25rem" : "1rem")};
  border-radius: 12px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) =>
    props.size === "sm"
      ? props.theme.fontSizes.sm
      : props.size === "lg"
        ? props.theme.fontSizes.lg
        : props.theme.fontSizes.md};
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  background-color: ${(props) => (props.primary ? props.theme.colors.blue[500] : "white")};
  color: ${(props) => (props.primary ? "white" : props.theme.colors.text.primary)};
  border: 1px solid ${(props) => (props.primary ? "transparent" : props.theme.colors.gray[200])};

  transition: all 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.blue[200]};
  }
`;

const Button = ({
  children,
  primary = false,
  disabled = false,
  fullWidth = false,
  size = "md",
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      primary={primary}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
      }}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
