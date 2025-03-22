import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Gift, DollarSign, Coins, Award, Copy, Share2, ArrowRight, CheckCircle } from "lucide-react";
import { useBackendGET } from "../api/useBackend";
import styled from "@emotion/styled";
import { formatNumber, formatCurrency } from "../lib/utils";

// Types
interface UserInfoData {
  totalCash: number;
  totalPoints: number;
  successfulReferralCount: number;
  badgeUrl: string;
  username: string;
  referralCode?: string;
}

interface ReferralCardProps {
  userId: string;
}

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
    },
  },
  exit: { opacity: 0, y: 20 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      delay: i * 0.05,
    },
  }),
  exit: { opacity: 0, y: 20 },
};

// Styled Components
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  padding: 1.5rem;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 2rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.fontSizes.md};
`;

const Card = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.xl};
  box-shadow: ${(props) => props.theme.shadows.card};
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.gray[100]};
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[100]};
  display: flex;
  align-items: center;
`;

const CardTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.blue[600]},
    ${(props) => props.theme.colors.primary[600]}
  );
  padding: 2rem 1.5rem;
  color: white;
`;

const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserSvgAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 60%;
    height: 60%;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserGreeting = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  opacity: 0.9;
  margin: 0 0 0.25rem 0;
  line-height: 1;
`;

const Username = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  margin: 0;
  line-height: 1.2;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: ${(props) => props.theme.colors.gray[50]};
`;

const StatItem = styled(motion.div)`
  padding: 1.25rem;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

const StatLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.fontSizes.sm};
  margin-bottom: 0.25rem;
`;

const IconWrapper = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.blue[600]};
`;

const StatValue = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ProgressContainer = styled.div`
  padding-top: 1.5rem;
`;

const ProgressInfo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ProgressLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const ProgressCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CurrentValue = styled.span`
  font-size: ${(props) => props.theme.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-right: 0.5rem;
`;

const TargetValue = styled.span`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ProgressBarContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const ProgressBarBackground = styled.div`
  height: 0.75rem;
  background-color: ${(props) => props.theme.colors.gray[100]};
  border-radius: 9999px;
  position: relative;
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    to right,
    ${(props) => props.theme.colors.blue[500]},
    ${(props) => props.theme.colors.primary[500]},
    ${(props) => props.theme.colors.secondary[500]}
  );
  border-radius: 9999px;
  position: absolute;
  top: 0;
  left: 0;
`;

const ProgressMarkers = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  position: relative;
`;

const ProgressMarker = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkerDot = styled.div<{ isActive: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  background-color: ${(props) =>
    props.isActive ? "linear-gradient(135deg, #60a5fa, #4f4fff)" : props.theme.colors.gray[200]};
  color: ${(props) => (props.isActive ? "white" : props.theme.colors.gray[500])};
  box-shadow: ${(props) => (props.isActive ? "0 0 15px rgba(79, 79, 255, 0.4)" : "none")};
  transition: all 0.3s ease;
  ${(props) =>
    props.isActive &&
    `
    animation: pulse 2s infinite;
  `}
`;

const MarkerLabel = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkerTitle = styled.span<{ isActive: boolean }>`
  font-weight: ${(props) => (props.isActive ? props.theme.fontWeights.semibold : props.theme.fontWeights.normal)};
  color: ${(props) => (props.isActive ? props.theme.colors.text.primary : props.theme.colors.text.secondary)};
`;

const MarkerValue = styled.span`
  margin-top: 0.25rem;
`;

const ProgressMessage = styled.div`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ActionGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled(motion.button)<{ isPrimary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: ${(props) => props.theme.radii.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) => props.theme.fontSizes.md};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 3.5rem;
  width: 100%;

  ${(props) =>
    props.isPrimary
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.blue[600]}, ${props.theme.colors.primary[600]});
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, ${props.theme.colors.blue[700]}, ${props.theme.colors.primary[700]});
    }
  `
      : `
    background-color: ${props.theme.colors.surface};
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.gray[200]};
    
    &:hover {
      background-color: ${props.theme.colors.gray[50]};
    }
  `}
`;

const ActionButtonIcon = styled.span<{ isPrimary?: boolean }>`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  color: ${(props) => (props.isPrimary ? "white" : props.theme.colors.blue[600])};
`;

const ReferralCodeContainer = styled.div`
  background-color: ${(props) => props.theme.colors.gray[50]};
  border: 1px dashed ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.radii.lg};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ReferralCode = styled.div`
  font-family: monospace;
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(motion.button)<{ variant?: "primary" | "secondary" }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${(props) => props.theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.blue[600]}, ${props.theme.colors.primary[600]});
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, ${props.theme.colors.blue[700]}, ${props.theme.colors.primary[700]});
    }
  `
      : `
    background-color: ${props.theme.colors.surface};
    color: ${props.theme.colors.blue[600]};
    border: 1px solid ${props.theme.colors.gray[200]};
    
    &:hover {
      background-color: ${props.theme.colors.gray[50]};
    }
  `}
`;

const HowItWorksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StepContainer = styled(motion.div)`
  display: flex;
  align-items: flex-start;
`;

const StepIconContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.blue[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.blue[600]};
  margin-right: 1rem;
  flex-shrink: 0;
`;

const StepContent = styled.div``;

const StepTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  margin: 0 0 0.25rem 0;
  color: ${(props) => props.theme.colors.text.primary};
`;

const StepDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const StepArrow = styled.div`
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.colors.gray[300]};
  margin: 0.5rem 0;
`;

const Toast = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.blue[600]},
    ${(props) => props.theme.colors.primary[600]}
  );
  color: white;
  padding: 0.75rem 1rem;
  border-radius: ${(props) => props.theme.radii.lg};
  display: flex;
  align-items: center;
  box-shadow: ${(props) => props.theme.shadows.lg};
`;

const ToastIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const ReferralPage = ({ userId }: ReferralCardProps) => {
  const { data: userInfo } = useBackendGET<UserInfoData>(`/refluent/userinfo/${userId}`, {});
  const [showToast, setShowToast] = useState(false);

  // Define tier markers with their names and thresholds
  const tiers = [
    { name: "Bronze", value: 2, color: "#CD7F32" },
    { name: "Silver", value: 5, color: "#C0C0C0" },
    { name: "Gold", value: 10, color: "#FFD700" },
    { name: "Platinum", value: 20, color: "#E5E4E2" },
  ];

  // Calculate milestone progress
  const getMilestoneData = () => {
    if (!userInfo) return { percentage: 0, currentTier: null, nextTier: tiers[0] };

    const referralCount = userInfo.successfulReferralCount || 0;

    // Find current tier
    let currentTierIndex = -1;
    for (let i = 0; i < tiers.length; i++) {
      if (referralCount < tiers[i].value) {
        currentTierIndex = i - 1;
        break;
      }
    }

    // If above the highest tier
    if (currentTierIndex === -1 && referralCount >= tiers[tiers.length - 1].value) {
      return {
        percentage: 100,
        currentTier: tiers[tiers.length - 1],
        nextTier: null,
      };
    }

    // If below the first tier
    if (currentTierIndex === -1) {
      const nextTier = tiers[0];
      const percentage = (referralCount / nextTier.value) * 100;
      return { percentage, currentTier: null, nextTier };
    }

    const currentTier = tiers[currentTierIndex];
    const nextTier = tiers[currentTierIndex + 1];
    const prevValue = currentTierIndex > 0 ? tiers[currentTierIndex - 1].value : 0;
    const percentage = ((referralCount - prevValue) / (nextTier.value - prevValue)) * 100;

    return { percentage, currentTier, nextTier };
  };

  const { percentage, currentTier, nextTier } = getMilestoneData();

  // Copy referral code to clipboard
  const copyReferralCode = () => {
    if (userInfo?.referralCode) {
      navigator.clipboard.writeText(userInfo.referralCode);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <ContentContainer>
        {/* Header */}
        <Header variants={cardVariants}>
          <Title>Refer & Earn Rewards</Title>
          <Subtitle>Invite friends and boost your rewards with our tiered program</Subtitle>
        </Header>

        {/* User Profile Card */}
        <Card variants={cardVariants}>
          <ProfileHeader>
            <ProfileDetails>
              <Avatar>
                {userInfo?.badgeUrl ? (
                  <AvatarImage src={userInfo.badgeUrl} alt={userInfo?.username || "User"} />
                ) : (
                  <UserSvgAvatar>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </UserSvgAvatar>
                )}
              </Avatar>
              <UserInfo>
                <UserGreeting>Hello</UserGreeting>
                <Username>{userInfo?.username || "User"}</Username>
              </UserInfo>
            </ProfileDetails>
          </ProfileHeader>

          <StatsGrid>
            <StatItem whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <StatLabel>
                <IconWrapper>
                  <DollarSign size={16} />
                </IconWrapper>
                <span>Cash Earned</span>
              </StatLabel>
              <StatValue>{formatCurrency(userInfo?.totalCash || 0)}</StatValue>
            </StatItem>

            <StatItem whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <StatLabel>
                <IconWrapper>
                  <Coins size={16} />
                </IconWrapper>
                <span>Points Earned</span>
              </StatLabel>
              <StatValue>{formatNumber(userInfo?.totalPoints || 0)}</StatValue>
            </StatItem>
          </StatsGrid>
        </Card>

        {/* Referral Tier Progress Card */}
        <Card variants={cardVariants}>
          <CardHeader>
            <IconWrapper>
              <Award size={20} />
            </IconWrapper>
            <CardTitle>Referral Tier Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressContainer>
              <ProgressInfo>
                <ProgressLabel>
                  {currentTier ? `Current Tier: ${currentTier.name}` : "Working toward first tier"}
                </ProgressLabel>
                <ProgressCounter>
                  <CurrentValue>{userInfo?.successfulReferralCount || 0}</CurrentValue>
                  <TargetValue>{nextTier ? `/ ${nextTier.value} referrals` : `referrals`}</TargetValue>
                </ProgressCounter>
              </ProgressInfo>

              {/* Tier Progress Bar */}
              <ProgressBarContainer>
                <ProgressBarBackground>
                  <ProgressBarFill
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </ProgressBarBackground>

                <ProgressMarkers>
                  {tiers.map((tier) => {
                    const isActive = userInfo?.successfulReferralCount >= tier.value;

                    return (
                      <ProgressMarker key={tier.name} isActive={isActive}>
                        <MarkerDot isActive={isActive}>{isActive ? "✓" : ""}</MarkerDot>
                        <MarkerLabel>
                          <MarkerTitle isActive={isActive}>{tier.name}</MarkerTitle>
                          <MarkerValue>{tier.value}</MarkerValue>
                        </MarkerLabel>
                      </ProgressMarker>
                    );
                  })}
                </ProgressMarkers>
              </ProgressBarContainer>

              <ProgressMessage>
                {nextTier
                  ? `Complete ${nextTier.value - (userInfo?.successfulReferralCount || 0)} more referrals to reach ${nextTier.name} tier!`
                  : `You've reached the highest tier! Great job!`}
              </ProgressMessage>
            </ProgressContainer>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <ActionGrid variants={cardVariants}>
          <ActionButton isPrimary whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ActionButtonIcon isPrimary>
              <UserPlus size={18} />
            </ActionButtonIcon>
            Refer Friends
          </ActionButton>

          <ActionButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ActionButtonIcon>
              <Gift size={18} />
            </ActionButtonIcon>
            My Rewards
          </ActionButton>
        </ActionGrid>

        {/* Referral Code Card */}
        <Card variants={cardVariants}>
          <CardHeader>
            <IconWrapper>
              <Share2 size={20} />
            </IconWrapper>
            <CardTitle>Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferralCodeContainer>
              <ReferralCode>{userInfo?.referralCode || "LOADING"}</ReferralCode>
              <ActionButtons>
                <IconButton onClick={copyReferralCode} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Copy size={18} />
                </IconButton>
                <IconButton variant="primary" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Share2 size={18} />
                </IconButton>
              </ActionButtons>
            </ReferralCodeContainer>
          </CardContent>
        </Card>

        {/* How It Works Card */}
        <Card variants={cardVariants}>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <HowItWorksContainer>
              <StepContainer custom={0} variants={fadeInUp}>
                <StepIconContainer>
                  <UserPlus size={18} />
                </StepIconContainer>
                <StepContent>
                  <StepTitle>Invite Friends</StepTitle>
                  <StepDescription>Share your unique referral code with friends and family</StepDescription>
                </StepContent>
              </StepContainer>

              <StepArrow>
                <ArrowRight />
              </StepArrow>

              <StepContainer custom={1} variants={fadeInUp}>
                <StepIconContainer>
                  <Coins size={18} />
                </StepIconContainer>
                <StepContent>
                  <StepTitle>They Sign Up</StepTitle>
                  <StepDescription>When they join and qualify using your referral code</StepDescription>
                </StepContent>
              </StepContainer>

              <StepArrow>
                <ArrowRight />
              </StepArrow>

              <StepContainer custom={2} variants={fadeInUp}>
                <StepIconContainer>
                  <DollarSign size={18} />
                </StepIconContainer>
                <StepContent>
                  <StepTitle>Earn Rewards</StepTitle>
                  <StepDescription>You get cash, points, and climb reward tiers with each referral</StepDescription>
                </StepContent>
              </StepContainer>
            </HowItWorksContainer>
          </CardContent>
        </Card>
      </ContentContainer>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-5 inset-x-0 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Toast>
              <ToastIcon>
                <CheckCircle size={18} />
              </ToastIcon>
              <span>Referral code copied to clipboard!</span>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ReferralPage;
