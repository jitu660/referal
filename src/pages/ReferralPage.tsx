import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ChevronRight, Users, Gift, Award, Medal, Target, Trophy } from "lucide-react";
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

// Additional animation for skeletons
const skeletonPulse = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 0.8, 0.6],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

// Styled Components
const PageContainer = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.background};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.5rem;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
  max-width: 100%; // Full width for mobile
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 480px; // Constrained on larger screens
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.gray[100]};
  overflow: hidden;
  margin-right: 1.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserSvgAvatar = styled.div`
  width: 60%;
  height: 60%;
  color: ${(props) => props.theme.colors.gray[400]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 16px;
  padding: 1.25rem;
`;

const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.blue[600]};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const MilestoneSection = styled.div`
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.blue[600]};
  margin: 0 0 1rem 0;
`;

const ProgressBar = styled.div`
  position: relative;
  margin: 1.5rem 0 1rem;
`;

const ProgressLine = styled.div`
  height: 3px;
  background-color: ${(props) => props.theme.colors.gray[200]};
  position: relative;
  width: 100%;
  border-radius: 3px;
`;

const ProgressFill = styled(motion.div)<{ width: number }>`
  height: 100%;
  width: ${(props) => `${Math.min(Math.max(props.width, 0), 100)}%`};
  background-color: ${(props) => props.theme.colors.blue[500]};
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px;
`;

const MilestoneMarkers = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  margin-top: -12px;
`;

const MilestoneMarker = styled.div<{ active: boolean; tier: string; achieved?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  position: relative;
  z-index: 1;
  background-color: ${(props) => {
    if (!props.active) return props.theme.colors.gray[200];

    switch (props.tier) {
      case "Bronze":
        return "#CD7F32"; // Bronze color
      case "Silver":
        return "#C0C0C0"; // Silver color
      case "Gold":
        return "#FFD700"; // Gold color
      case "Platinum":
        return "#E5E4E2"; // Platinum color
      default:
        return props.theme.colors.blue[500];
    }
  }};
  color: white;
  border: ${(props) => (props.achieved ? "2px solid #4a80f0" : "none")};
  box-shadow: ${(props) => (props.achieved ? "0 0 4px rgba(74, 128, 240, 0.5)" : "none")};
`;

const MilestoneValue = styled.div<{ active: boolean }>`
  font-size: 10px;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => (props.active ? props.theme.colors.blue[600] : props.theme.colors.gray[400])};
  margin-top: 4px;
  text-align: center;
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
`;

const ProgressMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 2rem;

  span {
    color: ${(props) => props.theme.colors.blue[600]};
    font-weight: ${(props) => props.theme.fontWeights.medium};
  }
`;

const ProgressCount = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const CurrentCount = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  margin-right: 0.25rem;
`;

const NextGoal = styled.span`
  color: ${(props) => props.theme.colors.blue[600]};
`;

const ActionButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 12px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) => props.theme.fontSizes.md};
  border: none;
  cursor: pointer;

  background-color: ${(props) => (props.primary ? props.theme.colors.blue[500] : "white")};
  color: ${(props) => (props.primary ? "white" : props.theme.colors.text.primary)};
  border: 1px solid ${(props) => (props.primary ? "transparent" : props.theme.colors.gray[200])};

  &:hover {
    background-color: ${(props) => (props.primary ? props.theme.colors.blue[600] : props.theme.colors.gray[50])};
  }
`;

const HowItWorksSection = styled.div`
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 16px;
  padding: 1.5rem;
`;

const HowItWorksTitle = styled.h2`
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

const ConnectingLine = styled.div`
  position: absolute;
  top: 0;
  left: 1.25rem;
  width: 2px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.blue[300]};
  z-index: 0;
`;

// Skeleton components
const SkeletonBox = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.gray[200]};
  border-radius: 8px;
`;

const SkeletonAvatar = styled(SkeletonBox)`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  margin-right: 1.5rem;
`;

const SkeletonText = styled(SkeletonBox)<{ width?: string }>`
  height: 1.25rem;
  width: ${(props) => props.width || "100%"};
  margin-bottom: 0.5rem;
`;

const SkeletonStatCard = styled(SkeletonBox)`
  height: 5rem;
  padding: 1rem;
  border-radius: 16px;
`;

const SkeletonProgressBar = styled(SkeletonBox)`
  height: 3px;
  width: 100%;
  margin: 1.5rem 0;
`;

const SkeletonMarker = styled(SkeletonBox)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const SkeletonButton = styled(SkeletonBox)`
  height: 3rem;
  border-radius: 12px;
`;

// Loading skeleton components
const ProfileSkeleton = () => (
  <ProfileSection>
    <SkeletonAvatar variants={skeletonPulse} initial="initial" animate="animate" />
    <div>
      <SkeletonText width="150px" variants={skeletonPulse} initial="initial" animate="animate" />
    </div>
  </ProfileSection>
);

const StatsSkeleton = () => (
  <StatsGrid>
    <SkeletonStatCard variants={skeletonPulse} initial="initial" animate="animate" />
    <SkeletonStatCard variants={skeletonPulse} initial="initial" animate="animate" />
  </StatsGrid>
);

const MilestonesSkeleton = () => (
  <MilestoneSection>
    <SkeletonText width="40%" variants={skeletonPulse} initial="initial" animate="animate" />
    <div style={{ margin: "1.5rem 0" }}>
      <SkeletonText width="60%" variants={skeletonPulse} initial="initial" animate="animate" />
    </div>
    <SkeletonProgressBar variants={skeletonPulse} initial="initial" animate="animate" />
    <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonMarker key={i} variants={skeletonPulse} initial="initial" animate="animate" />
      ))}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
      <SkeletonText width="30%" variants={skeletonPulse} initial="initial" animate="animate" />
      <SkeletonText width="20%" variants={skeletonPulse} initial="initial" animate="animate" />
    </div>
  </MilestoneSection>
);

const ActionButtonsSkeleton = () => (
  <ActionButtonsGrid>
    <SkeletonButton variants={skeletonPulse} initial="initial" animate="animate" />
    <SkeletonButton variants={skeletonPulse} initial="initial" animate="animate" />
  </ActionButtonsGrid>
);

const HowItWorksSkeleton = () => (
  <HowItWorksSection>
    <SkeletonText width="80%" variants={skeletonPulse} initial="initial" animate="animate" />
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <SkeletonMarker variants={skeletonPulse} initial="initial" animate="animate" />
        <SkeletonText
          width="70%"
          style={{ marginLeft: "1rem" }}
          variants={skeletonPulse}
          initial="initial"
          animate="animate"
        />
      </div>
    </div>
  </HowItWorksSection>
);

// Framer Motion Rotating Digits Component
const RotatingDigits = ({
  value,
  formatter,
  duration = 3000,
}: {
  value: number;
  formatter: (val: number) => string;
  duration?: number;
}) => {
  const formattedValue = formatter(value);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {formattedValue.split("").map((digit, i) => (
        <motion.span
          key={`${i}-${digit}`}
          style={{
            display: "inline-block",
            position: "relative",
            width: digit === "." || digit === "," ? "8px" : "auto",
            height: "1.5em",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${i}-${digit}`}
              initial={{
                y: -100,
                opacity: 0,
                rotateX: -90,
              }}
              animate={{
                y: 0,
                opacity: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1,
                  delay: i * 0.05, // Stagger the animations
                  duration: duration / 1000,
                },
              }}
              exit={{ y: 100, opacity: 0, rotateX: 90 }}
              style={{
                display: "inline-block",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      ))}
    </div>
  );
};

// Get appropriate icon for each tier
const getIconForTier = (tier: string) => {
  switch (tier) {
    case "Bronze":
      return <Medal size={14} />;
    case "Silver":
      return <Target size={14} />;
    case "Gold":
      return <Trophy size={14} />;
    case "Platinum":
      return <Award size={14} />;
    default:
      return null;
  }
};

// Calculate the overall progress percentage for the bar fill
const calculateProgressBarFill = (referralCount, milestones) => {
  // If no referrals, return 0%
  if (referralCount === 0) return 0;

  // If at or above max tier, return 100%
  if (referralCount >= milestones[milestones.length - 1].value) return 100;

  // Find the position between milestones
  for (let i = 0; i < milestones.length; i++) {
    // If we're below this milestone
    if (referralCount < milestones[i].value) {
      // If it's the first milestone, calculate percentage of the way there
      if (i === 0) {
        return Math.floor((referralCount / milestones[0].value) * 25);
      }

      // For milestones after the first:
      // Calculate how far we are between previous and current milestone
      const prevMilestone = milestones[i - 1].value;
      const nextMilestone = milestones[i].value;
      const progressInSegment = referralCount - prevMilestone;
      const segmentSize = nextMilestone - prevMilestone;
      const segmentPercentage = Math.floor((progressInSegment / segmentSize) * 25);

      // Each milestone represents 25% of the bar (4 milestones = 100%)
      return Math.min(i * 25 + segmentPercentage, 99);
    }
  }

  // Fallback (shouldn't reach here)
  return 100;
};

const ReferralPage = ({ userId }: ReferralCardProps) => {
  const [isLoadingMock, setIsLoadingMock] = useState(true);
  const { data: userInfo, isLoading: apiLoading } = useBackendGET<UserInfoData>(`/refluent/userinfo/${userId}`, {});

  // Simulate a loading delay to better demonstrate the skeleton animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingMock(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  const isLoading = apiLoading || isLoadingMock;

  // Define tier markers with their names and thresholds
  const milestones = [
    { name: "Bronze", value: 2 },
    { name: "Silver", value: 5 },
    { name: "Gold", value: 10 },
    { name: "Platinum", value: 20 },
  ];

  // Calculate current milestone progress with corrected logic
  const getCurrentMilestone = () => {
    if (!userInfo)
      return {
        currentMilestone: -1,
        nextMilestone: 0,
        referralsToNext: 2,
        barFillPercentage: 0,
      };

    const referralCount = userInfo.successfulReferralCount || 0;

    // Calculate the visual percentage for the progress bar fill
    const barFillPercentage = calculateProgressBarFill(referralCount, milestones);

    // Special case: If user has 0 referrals
    if (referralCount === 0) {
      return {
        currentMilestone: -1,
        nextMilestone: 0,
        referralsToNext: milestones[0].value,
        isMaxTier: false,
        barFillPercentage,
      };
    }

    // Find the milestone the user is currently at or has passed
    let currentMilestoneIndex = -1;

    // Loop through milestones to find where this user falls
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (referralCount >= milestones[i].value) {
        currentMilestoneIndex = i;
        break;
      }
    }

    // If we found a valid milestone and it's not the highest tier
    if (currentMilestoneIndex >= 0 && currentMilestoneIndex < milestones.length - 1) {
      const currentValue = milestones[currentMilestoneIndex].value;
      const nextValue = milestones[currentMilestoneIndex + 1].value;
      const totalRange = nextValue - currentValue;
      const userProgress = referralCount - currentValue;
      const percentage = Math.min(Math.floor((userProgress / totalRange) * 100), 99);
      const referralsToNext = nextValue - referralCount;

      return {
        currentMilestone: currentMilestoneIndex,
        nextMilestone: currentMilestoneIndex + 1,
        referralsToNext,
        isMaxTier: false,
        barFillPercentage,
      };
    }

    // If at or above the highest tier
    if (currentMilestoneIndex === milestones.length - 1) {
      return {
        currentMilestone: currentMilestoneIndex,
        nextMilestone: null,
        referralsToNext: 0,
        isMaxTier: true,
        barFillPercentage,
      };
    }

    // If below the first tier but has some referrals
    const firstMilestoneValue = milestones[0].value;
    const referralsToNext = firstMilestoneValue - referralCount;

    return {
      currentMilestone: -1,
      nextMilestone: 0,
      referralsToNext,
      isMaxTier: false,
      barFillPercentage,
    };
  };

  const { currentMilestone, nextMilestone, referralsToNext, isMaxTier, barFillPercentage } = getCurrentMilestone();

  const getCurrentTierName = () => {
    if (currentMilestone < 0) return "Starter";
    return milestones[currentMilestone].name;
  };

  const getNextTierName = () => {
    if (nextMilestone === null) return null;
    return milestones[nextMilestone].name;
  };

  return (
    <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <Card variants={cardVariants}>
        <CardContent>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <ProfileSkeleton />
                <StatsSkeleton />
                <MilestonesSkeleton />
                <ActionButtonsSkeleton />
                <HowItWorksSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {/* Profile Section */}
                <ProfileSection>
                  <Avatar>
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
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </UserSvgAvatar>
                  </Avatar>
                  <div>
                    <h2 style={{ margin: "0", fontSize: "1.25rem", fontWeight: 600 }}>
                      {userInfo?.username || "User"}
                    </h2>
                  </div>
                </ProfileSection>

                {/* Stats Section */}
                <StatsGrid>
                  <StatCard>
                    <StatLabel>Total cash</StatLabel>
                    <StatValue>
                      <RotatingDigits value={userInfo?.totalCash || 0} formatter={formatCurrency} duration={2000} />
                    </StatValue>
                  </StatCard>

                  <StatCard>
                    <StatLabel>Total coins</StatLabel>
                    <StatValue>
                      <RotatingDigits value={userInfo?.totalPoints || 0} formatter={formatNumber} duration={2000} />
                    </StatValue>
                  </StatCard>
                </StatsGrid>

                {/* Milestones Section */}
                <MilestoneSection>
                  <SectionTitle>Referral milestones</SectionTitle>

                  <ProgressCount>
                    <CurrentCount>{userInfo?.successfulReferralCount || 0}</CurrentCount> referrals
                    {currentMilestone >= 0 && (
                      <span style={{ marginLeft: "auto" }}>
                        Current tier: <span style={{ color: "#4a80f0" }}>{getCurrentTierName()}</span>
                      </span>
                    )}
                  </ProgressCount>

                  <ProgressBar>
                    <ProgressLine>
                      <ProgressFill
                        width={barFillPercentage}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(barFillPercentage, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </ProgressLine>

                    <MilestoneMarkers>
                      {milestones.map((milestone, index) => {
                        const isActive = isMaxTier
                          ? true
                          : index <= currentMilestone || (index === nextMilestone && barFillPercentage >= 50);
                        const isAchieved = userInfo?.successfulReferralCount >= milestone.value;

                        return (
                          <MilestoneMarker key={index} tier={milestone.name} active={isActive} achieved={isAchieved}>
                            {getIconForTier(milestone.name)}
                            <MilestoneValue active={isActive}>{milestone.value}</MilestoneValue>
                          </MilestoneMarker>
                        );
                      })}
                    </MilestoneMarkers>
                  </ProgressBar>

                  <ProgressMessage>
                    {isMaxTier ? (
                      <div>You've reached the maximum tier! 🎉</div>
                    ) : (
                      <>
                        <div>
                          <NextGoal>{referralsToNext}</NextGoal> more referrals to {getNextTierName()}
                        </div>
                        <div>
                          <span>{Math.round(barFillPercentage)}%</span> complete <ChevronRight size={16} />
                        </div>
                      </>
                    )}
                  </ProgressMessage>
                </MilestoneSection>

                {/* Action Buttons */}
                <ActionButtonsGrid>
                  <ActionButton primary>REfer</ActionButton>
                  <ActionButton>REWARD management</ActionButton>
                </ActionButtonsGrid>

                {/* How It Works Section */}
                <HowItWorksSection>
                  <HowItWorksTitle>HOW DOES IT WORK</HowItWorksTitle>
                  <StepsList>
                    <ConnectingLine />
                    <Step>
                      <StepIconWrapper>
                        <StepNumber>1</StepNumber>
                        <Share2 size={18} />
                      </StepIconWrapper>
                      <StepText>Share your referral link with friends</StepText>
                    </Step>

                    <Step>
                      <StepIconWrapper>
                        <StepNumber>2</StepNumber>
                        <Users size={18} />
                      </StepIconWrapper>
                      <StepText>Your friends sign up using your link</StepText>
                    </Step>

                    <Step>
                      <StepIconWrapper>
                        <StepNumber>3</StepNumber>
                        <Gift size={18} />
                      </StepIconWrapper>
                      <StepText>Both you and your friend earn rewards</StepText>
                    </Step>
                  </StepsList>
                </HowItWorksSection>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default ReferralPage;
