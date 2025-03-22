import React from "react";
import styled from "@emotion/styled";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
`;

const InputLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => (props.hasError ? props.theme.colors.danger : props.theme.colors.gray[200])};
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.text.primary};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(props) => (props.hasError ? props.theme.colors.danger : props.theme.colors.blue[400])};
    box-shadow: 0 0 0 2px
      ${(props) => (props.hasError ? props.theme.colors.danger + "40" : props.theme.colors.blue[100])};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.danger};
  margin-top: 0.25rem;
`;

const Input: React.FC<InputProps> = ({ label, error, fullWidth = false, ...props }) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;
