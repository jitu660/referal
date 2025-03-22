import React from "react";
import styled from "@emotion/styled";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export interface Transaction {
  id: string;
  type: "cash" | "points";
  amount: number;
  description: string;
  date: string;
  recipient?: string;
}

interface TransactionHistoryItemProps {
  transaction: Transaction;
}

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const IconContainer = styled.div<{ isCredit: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background-color: ${(props) =>
    props.isCredit ? props.theme.colors.success + "20" : props.theme.colors.danger + "20"};
  color: ${(props) => (props.isCredit ? props.theme.colors.success : props.theme.colors.danger)};
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const TransactionDescription = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const TransactionMeta = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TransactionDate = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const TransactionAmount = styled.div<{ isCredit: boolean }>`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => (props.isCredit ? props.theme.colors.success : props.theme.colors.danger)};
`;

const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({ transaction }) => {
  const isCredit = transaction.amount >= 0;

  return (
    <TransactionItem>
      <IconContainer isCredit={isCredit}>
        {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
      </IconContainer>
      <TransactionDetails>
        <TransactionDescription>{transaction.description}</TransactionDescription>
        <TransactionMeta>
          <TransactionDate>{transaction.date}</TransactionDate>
          <TransactionAmount isCredit={isCredit}>
            {isCredit ? "+" : ""}
            {transaction.type === "cash" ? "₹" : ""}
            {transaction.amount}
            {transaction.type === "points" ? " pts" : ""}
          </TransactionAmount>
        </TransactionMeta>
      </TransactionDetails>
    </TransactionItem>
  );
};

export default TransactionHistoryItem;
