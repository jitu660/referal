import React, { useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Button from "./ui/button";
import Input from "./ui/input";
import Spinner from "./ui/spinner";

const FormContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  margin-top: 1rem;
`;

const InputWrapper = styled.div`
  flex: 1;
  margin-right: 0.75rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Only define animation for appearing, not for disappearing
const formVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0 },
      opacity: { duration: 0 },
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
      opacity: { duration: 0.2 },
    },
  },
};

interface SendPointsFormProps {
  onClose: () => void;
  onSubmit: (amount: number, username: string) => void;
  maxAmount: number;
  username: string;
  isLoading: boolean;
}

const SendPointsForm: React.FC<SendPointsFormProps> = ({ onClose, onSubmit, maxAmount, username, isLoading }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (isLoading) return;

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numAmount > maxAmount) {
      setError(`You can send maximum ${maxAmount} points`);
      return;
    }

    setError(null);
    onSubmit(numAmount, username);
  };

  return (
    <FormContainer initial="hidden" animate="visible" variants={formVariants}>
      <InputWrapper>
        <Input
          type="number"
          placeholder="Points to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          min={1}
          max={maxAmount}
          disabled={isLoading}
          error={error}
        />
      </InputWrapper>
      <ButtonGroup>
        <Button onClick={onClose} disabled={isLoading} size="sm">
          Cancel
        </Button>
        <Button primary onClick={handleSubmit} disabled={isLoading} size="sm">
          {isLoading ? <Spinner size={16} /> : "Send"}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default SendPointsForm;
