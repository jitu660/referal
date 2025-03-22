import React, { useState } from "react";
import { Send, AlertCircle, CheckCircle, Filter } from "lucide-react";
import styled from "@emotion/styled";
import Button from "../components/ui/button";
import Spinner from "../components/ui/spinner";
import Toast from "../components/ui/toast";
import { useBackendGET } from "../api/useBackend";
import BackButton from "../components/common/BackButton";
import {
  PageContainer,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  HeaderRow,
  EmptyStateContainer,
  pageVariants,
  cardVariants,
  getInitials,
  getAvatarColor,
} from "../components/common/CardComponents";

// Types
interface ReferralType {
  status: string;
  username: string;
}

// Styled Components
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  background-color: ${(props) => (props.active ? props.theme.colors.blue[500] : "white")};
  color: ${(props) => (props.active ? "white" : props.theme.colors.text.primary)};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? props.theme.colors.blue[600] : props.theme.colors.gray[100])};
  }
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

const ReferralsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem 0;
  max-height: 500px;
  overflow-y: auto;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.gray[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.gray[300]};
    border-radius: 4px;
  }
`;

const ReferralItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => props.theme.colors.gray[100]};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;

const ReferralAvatar = styled.div<{ bgColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-weight: ${(props) => props.theme.fontWeights.bold};
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

const ReferralInfo = styled.div`
  flex: 1;
  padding: 0.25rem 0;
`;

const ReferralName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  background-color: ${(props) =>
    props.status === "successful" ? props.theme.colors.primary.light : props.theme.colors.blue[50]};

  color: ${(props) => (props.status === "successful" ? props.theme.colors.primary.main : props.theme.colors.blue[600])};
`;

const ReinviteButton = styled(Button)`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  min-width: 80px;
  margin-left: 0.75rem;
  flex-shrink: 0;
`;

const TrackPage = () => {
  const userId = "97fffc35b648278c"; // Hardcoded for demo
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loadingReinvite, setLoadingReinvite] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as const });

  const { data: referrals, isLoading } = useBackendGET<ReferralType[]>(
    `/protected/referral/trackReferrals/${userId}`,
    {}
  );

  const filteredReferrals = referrals
    ? referrals.filter((referral) => {
        if (filterStatus === "all") return true;
        return referral.status === filterStatus;
      })
    : [];

  const handleReinvite = (username: string) => {
    if (loadingReinvite.has(username)) return;

    // Add to loading set
    setLoadingReinvite((prev) => new Set([...prev, username]));

    // Simulate API call with timeout
    setTimeout(() => {
      // Remove from loading set
      setLoadingReinvite((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });

      // Show success toast
      setToast({
        visible: true,
        message: `Reinvited ${username} successfully`,
        type: "success",
      });
    }, 1000);
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <Card variants={cardVariants}>
        <CardContent>
          <BackButton to="/refer">Back to Referrals</BackButton>

          <CardHeader>
            <HeaderRow>
              <CardTitle>Track Referrals</CardTitle>
            </HeaderRow>
          </CardHeader>

          <FilterContainer>
            <FilterLabel>
              <Filter size={16} style={{ marginRight: "0.5rem" }} />
              Filter:
            </FilterLabel>
            <FilterButton active={filterStatus === "all"} onClick={() => setFilterStatus("all")}>
              All
            </FilterButton>
            <FilterButton active={filterStatus === "successful"} onClick={() => setFilterStatus("successful")}>
              Successful
            </FilterButton>
            <FilterButton active={filterStatus === "pending"} onClick={() => setFilterStatus("pending")}>
              Pending
            </FilterButton>
          </FilterContainer>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
              <Spinner size={32} />
            </div>
          ) : (
            <ReferralsList>
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral, index) => {
                  const initials = getInitials(referral.username);
                  const avatarColor = getAvatarColor(referral.username);
                  const isPending = referral.status === "pending";

                  return (
                    <ReferralItem key={index}>
                      <ReferralAvatar bgColor={avatarColor}>{initials}</ReferralAvatar>
                      <ReferralInfo>
                        <ReferralName>{referral.username}</ReferralName>
                        <StatusContainer>
                          <StatusBadge status={referral.status}>
                            {referral.status === "successful" ? (
                              <>
                                <CheckCircle size={14} />
                                <span>Successful</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle size={14} />
                                <span>Pending</span>
                              </>
                            )}
                          </StatusBadge>
                        </StatusContainer>
                      </ReferralInfo>

                      {isPending && (
                        <ReinviteButton primary onClick={() => handleReinvite(referral.username)}>
                          {loadingReinvite.has(referral.username) ? <Spinner size={16} /> : <Send size={16} />}
                          <span style={{ marginLeft: "0.5rem" }}>
                            {loadingReinvite.has(referral.username) ? "Sending" : "Reinvite"}
                          </span>
                        </ReinviteButton>
                      )}
                    </ReferralItem>
                  );
                })
              ) : (
                <EmptyStateContainer>
                  {filterStatus === "all" ? "No referrals found" : `No ${filterStatus} referrals found`}
                </EmptyStateContainer>
              )}
            </ReferralsList>
          )}
        </CardContent>
      </Card>

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={closeToast} duration={3000} />
    </PageContainer>
  );
};

export default TrackPage;
