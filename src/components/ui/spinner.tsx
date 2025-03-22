import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const SpinnerContainer = styled(motion.div)<{ size: number }>`
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  display: inline-block;
  position: relative;
`;

const SpinnerCircle = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  border: ${(props) => `${Math.max(2, props.size / 8)}px`} solid;
  border-color: ${(props) => props.color};
  border-radius: 50%;
  border-top-color: transparent;
  box-sizing: border-box;
`;

const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 0.8,
};

const Spinner: React.FC<SpinnerProps> = ({ size = 24, color = "#ffffff" }) => {
  return (
    <SpinnerContainer size={size}>
      <SpinnerCircle size={size} color={color} animate={{ rotate: 360 }} transition={spinTransition} />
    </SpinnerContainer>
  );
};

export default Spinner;
