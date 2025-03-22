import React from "react";
import styled from "@emotion/styled";
import Button from "./ui/button";

export interface Voucher {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
}

interface VoucherCardProps {
  voucher: Voucher;
  onRedeem: (voucher: Voucher) => void;
  disabled?: boolean;
  currentPoints: number;
}

const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const VoucherImage = styled.div<{ imageUrl?: string }>`
  height: 120px;
  background-image: ${(props) =>
    props.imageUrl ? `url(${props.imageUrl})` : "linear-gradient(135deg, #4a80f0, #3161d1)"};
  background-size: cover;
  background-position: center;
`;

const VoucherContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const VoucherTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text.primary};
`;

const VoucherDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
  flex: 1;
`;

const VoucherPoints = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PointsRequired = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.blue[500]};
`;

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onRedeem, disabled = false, currentPoints }) => {
  const canRedeem = currentPoints >= voucher.pointsRequired;
  const buttonDisabled = disabled || !canRedeem;

  return (
    <Card>
      <VoucherImage imageUrl={voucher.imageUrl} />
      <VoucherContent>
        <VoucherTitle>{voucher.title}</VoucherTitle>
        <VoucherDescription>{voucher.description}</VoucherDescription>
        <VoucherPoints>
          <PointsRequired>{voucher.pointsRequired} pts</PointsRequired>
          {!canRedeem && (
            <span style={{ fontSize: "12px", color: "#e53e3e" }}>
              Need {voucher.pointsRequired - currentPoints} more
            </span>
          )}
        </VoucherPoints>
        <Button primary fullWidth disabled={buttonDisabled} onClick={() => onRedeem(voucher)}>
          Redeem
        </Button>
      </VoucherContent>
    </Card>
  );
};

export default VoucherCard;
