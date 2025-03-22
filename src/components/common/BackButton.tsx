import React from "react";
import styled from "@emotion/styled";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  to: string;
  children: React.ReactNode;
}

const StyledBackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
  //less left padding
  padding-left: 0.5rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.blue[50]};
  color: ${(props) => props.theme.colors.blue[600]};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  transition: all 0.2s ease;
  /* margin-bottom: 1.5rem; */

  &:hover {
    background-color: ${(props) => props.theme.colors.blue[100]};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const BackButton: React.FC<BackButtonProps> = ({ to, children }) => {
  return (
    <StyledBackButton to={to}>
      <ArrowLeft size={20} />
      {children}
    </StyledBackButton>
  );
};

export default BackButton;
