import React from "react";
import styled from "@emotion/styled";
import { Award, Medal, Target, Trophy, X } from "lucide-react";
import { motion } from "framer-motion";

interface TierRewardsInfoProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Container = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  position: relative;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.blue[600]};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const TiersList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TierCard = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
`;

const TierIconWrapper = styled.div<{ tierColor: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background-color: ${(props) => props.tierColor};
  color: white;
  flex-shrink: 0;
`;

const TierInfo = styled.div`
  flex: 1;
`;

const TierName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const TierRequirement = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const TierRewards = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.blue[600]};

  &:first-of-type {
    color: ${(props) => props.theme.colors.primary.main};
  }
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

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const TierRewardsInfo: React.FC<TierRewardsInfoProps> = ({ onClose, showCloseButton = false }) => {
  // Tier data
  const tiers = [
    {
      name: "Bronze",
      icon: <Medal size={24} />,
      color: "#CD7F32",
      requirement: "2 successful referrals",
      cashReward: "₹50",
      coinReward: "100 coins",
    },
    {
      name: "Silver",
      icon: <Target size={24} />,
      color: "#C0C0C0",
      requirement: "5 successful referrals",
      cashReward: "₹100",
      coinReward: "250 coins",
    },
    {
      name: "Gold",
      icon: <Trophy size={24} />,
      color: "#FFD700",
      requirement: "10 successful referrals",
      cashReward: "₹200",
      coinReward: "500 coins",
    },
    {
      name: "Platinum",
      icon: <Award size={24} />,
      color: "#E5E4E2",
      requirement: "20 successful referrals",
      cashReward: "₹500",
      coinReward: "1000 coins",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } },
  };

  return (
    <Container>
      {showCloseButton && (
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      )}
      <Title>Tier Rewards</Title>
      <TiersList variants={containerVariants} initial="hidden" animate="visible">
        {tiers.map((tier) => (
          <TierCard key={tier.name} variants={itemVariants}>
            <TierIconWrapper tierColor={tier.color}>{tier.icon}</TierIconWrapper>
            <TierInfo>
              <TierName>{tier.name}</TierName>
              <TierRequirement>{tier.requirement}</TierRequirement>
              <TierRewards>
                <RewardItem>
                  <span>💰</span> {tier.cashReward}
                </RewardItem>
                <RewardItem>
                  <span>🪙</span> {tier.coinReward}
                </RewardItem>
              </TierRewards>
            </TierInfo>
          </TierCard>
        ))}
      </TiersList>
    </Container>
  );
};

export default TierRewardsInfo;
