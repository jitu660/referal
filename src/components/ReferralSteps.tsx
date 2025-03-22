import React from "react";
import styled from "@emotion/styled";
import { Share2, Users, Gift, X } from "lucide-react";

interface ReferralStepsProps {
  showTierRewards?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const StepsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
`;

const StepsTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.blue[600]};
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepIconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: ${(props) => props.theme.colors.blue[500]};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
`;

const StepNumber = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.blue[500]};
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.text.primary};
  padding-top: 0.25rem;
`;

const RewardText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.blue[600]};
  margin-top: 0.5rem;
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const ConnectingLine = styled.div`
  position: absolute;
  top: 0;
  left: 1.25rem;
  width: 2px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.blue[300]};
  z-index: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const ReferralSteps: React.FC<ReferralStepsProps> = ({ showTierRewards = false, onClose, showCloseButton = false }) => {
  return (
    <StepsContainer>
      {showCloseButton && onClose && (
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      )}
      <StepsTitle>HOW IT WORKS</StepsTitle>
      <StepsList>
        <ConnectingLine />
        <Step>
          <StepIconWrapper>
            <StepNumber>1</StepNumber>
            <Share2 size={18} />
          </StepIconWrapper>
          <div>
            <StepText>Share your referral link with friends</StepText>
            {showTierRewards && <RewardText>The more you share, the higher your tier and rewards!</RewardText>}
          </div>
        </Step>

        <Step>
          <StepIconWrapper>
            <StepNumber>2</StepNumber>
            <Users size={18} />
          </StepIconWrapper>
          <div>
            <StepText>Your friends sign up using your link</StepText>
            {showTierRewards && <RewardText>Each successful referral counts towards your next tier</RewardText>}
          </div>
        </Step>

        <Step>
          <StepIconWrapper>
            <StepNumber>3</StepNumber>
            <Gift size={18} />
          </StepIconWrapper>
          <div>
            <StepText>Both you and your friend earn rewards</StepText>
            {showTierRewards && (
              <RewardText>
                Bronze: ₹50 + 100 coins
                <br />
                Silver: ₹100 + 250 coins
                <br />
                Gold: ₹200 + 500 coins
                <br />
                Platinum: ₹500 + 1000 coins
              </RewardText>
            )}
          </div>
        </Step>
      </StepsList>
    </StepsContainer>
  );
};

export default ReferralSteps;
