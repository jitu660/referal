import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "./ui/button";
import Input from "./ui/input";
import Spinner from "./ui/spinner";

interface SendPointsFormProps {
  onClose: () => void;
  onSubmit: (amount: number, username: string) => void;
  maxAmount: number;
  username: string;
  isLoading: boolean;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 14px;
`;

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
    <FormContainer>
      <div>
        <strong>Send Points to {username}</strong>
      </div>
      <Input
        label="Amount (points)"
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        min={1}
        max={maxAmount}
        disabled={isLoading}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonRow>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button primary onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size={16} />
              <span style={{ marginLeft: "0.5rem" }}>Sending...</span>
            </>
          ) : (
            "Send Points"
          )}
        </Button>
      </ButtonRow>
    </FormContainer>
  );
};

export default SendPointsForm;
