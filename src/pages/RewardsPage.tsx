import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Coins, History, Send, Filter } from "lucide-react";
import styled from "@emotion/styled";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Spinner from "../components/ui/spinner";
import Toast from "../components/ui/toast";
import BackButton from "../components/common/BackButton";
import TransactionHistoryItem, { Transaction } from "../components/TransactionHistoryItem";
import VoucherCard, { Voucher } from "../components/VoucherCard";
import SendPointsForm from "../components/SendPointsForm";
import { useBackendPOST, useBackendGET, fetcherWithJWT } from "../api/useBackend";
import {
  PageContainer,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  HeaderRow,
  Section,
  SectionTitle,
  EmptyStateContainer,
  pageVariants,
  cardVariants,
  getInitials,
  getAvatarColor,
} from "../components/common/CardComponents";
import { mutate } from "swr";

// Define tab items
const tabItems = [
  { id: "cash", label: "Cash" },
  { id: "points", label: "Points" },
];

// Transaction history filter options
const historyFilterOptions = [
  { id: "all", label: "All" },
  { id: "Cash", label: "Cash" },
  { id: "Points", label: "Points" },
];

// Mock vouchers data
const mockVouchers: Voucher[] = [
  {
    id: "v1",
    title: "Amazon Gift Card",
    description: "Get a ₹500 Amazon gift card to spend on your favorite products",
    pointsRequired: 1000,
    imageUrl: "https://m.media-amazon.com/images/G/31/social_share/amazon_logo._CB633267191_.png",
  },
  {
    id: "v2",
    title: "Swiggy Voucher",
    description: "₹200 off on your next food order from Swiggy",
    pointsRequired: 500,
    imageUrl: "https://logos-world.net/wp-content/uploads/2022/01/Swiggy-Emblem.png",
  },
  {
    id: "v3",
    title: "Netflix Subscription",
    description: "1 month Netflix basic plan subscription voucher",
    pointsRequired: 1500,
    imageUrl: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png",
  },
  {
    id: "v4",
    title: "Uber Ride",
    description: "₹100 off on your next Uber ride",
    pointsRequired: 300,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/2048px-Uber_App_Icon.svg.png",
  },
];

const VoucherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const BalanceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BalanceIcon = styled.div<{ color?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: ${(props) => props.color || props.theme.colors.blue[100]};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const BalanceInfo = styled.div`
  flex: 1;
`;

const BalanceLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const BalanceAmount = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const TabsContainer = styled.div`
  display: flex;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  position: relative;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) => props.theme.fontSizes.md};
  cursor: pointer;
  position: relative;
  z-index: 1;
  background-color: transparent;
  color: ${(props) => (props.isActive ? "white" : props.theme.colors.text.secondary)};
  transition: color 0.2s ease;
`;

const ActiveTabIndicator = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.blue[500]};
  border-radius: 8px;
  z-index: 0;
  height: calc(100% - 1rem);
  width: calc(50% - 0.5rem);
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const HeaderAction = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.blue[500]};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;

  &:hover {
    background-color: ${(props) => props.theme.colors.blue[50]};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  border: none;
  background-color: ${(props) => (props.isActive ? props.theme.colors.blue[500] : props.theme.colors.gray[100])};
  color: ${(props) => (props.isActive ? "white" : props.theme.colors.text.secondary)};
  border-radius: 16px;
  padding: 0.375rem 0.75rem;
  font-size: ${(props) => props.theme.fontSizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? props.theme.colors.blue[600] : props.theme.colors.gray[200])};
  }
`;

const ContactsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ContactItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => props.theme.colors.gray[100]};
  overflow: hidden;
`;

const ContactItemContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ContactAvatar = styled.div<{ bgColor: string }>`
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

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const InviteButton = styled(Button)`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  min-width: 80px;
  margin-left: 0.75rem;
  flex-shrink: 0;
`;

interface WithdrawFormProps {
  onClose: () => void;
  onSubmit: (amount: number, upiId: string) => void;
  maxAmount: number;
  isLoading: boolean;
}

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
`;

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

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onClose, onSubmit, maxAmount, isLoading }) => {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (isLoading) return;

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numAmount > maxAmount) {
      setError(`You can withdraw maximum ₹${maxAmount}`);
      return;
    }

    if (!upiId) {
      setError("Please enter your UPI ID");
      return;
    }

    setError(null);
    onSubmit(numAmount, upiId);
  };

  return (
    <FormContainer initial="hidden" animate="visible" exit="hidden" variants={formVariants}>
      <Input
        label="Amount (₹)"
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        min={1}
        max={maxAmount}
        disabled={isLoading}
      />
      <Input
        label="UPI ID"
        type="text"
        placeholder="username@upi"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        fullWidth
        disabled={isLoading}
      />
      {error && <div style={{ color: "#e53e3e", fontSize: "14px" }}>{error}</div>}
      <ButtonRow>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button primary onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size={16} />
              <span style={{ marginLeft: "0.5rem" }}>Processing...</span>
            </>
          ) : (
            "Withdraw"
          )}
        </Button>
      </ButtonRow>
    </FormContainer>
  );
};

interface ReferralType {
  status: string;
  username: string;
}

// Define transaction info interface
interface TransactionInfo {
  totalCash: number;
  totalCashSpent: number;
  totalPoints: number;
  totalPointsSpent: number;
  totalCashEarned: number;
  totalPointsEarned: number;
  bonusCash: number;
  bonusPoints: number;
}

// Main RewardsPage component
const RewardsPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("cash");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [sendingPoints, setSendingPoints] = useState<string | null>(null);
  const [loadingSend, setLoadingSend] = useState<Set<string>>(new Set());

  // Fetch user transaction information
  const {
    data: transactionInfo,
    error: transactionError,
    isLoading: isLoadingTransactionInfo,
  } = useBackendPOST<TransactionInfo>(
    "/protected/transaction/info",
    { userId },
    {
      revalidateOnFocus: true,
    }
  );

  // Fetch transaction history
  const { data: transactionHistory, isLoading: isLoadingHistory } = useBackendGET<
    Array<{
      username: string;
      amount: number;
      type: "Cash" | "Points";
    }>
  >(`/protected/transaction/transactionHistory/${userId}`, {
    revalidateOnFocus: true,
  });

  // Fetch successful referrals
  const { data: referrals, isLoading: isLoadingReferrals } = useBackendGET<ReferralType[]>(
    `/protected/referral/trackReferrals/${userId}`,
    {
      revalidateOnFocus: true,
    }
  );

  const successfulReferrals = referrals ? referrals.filter((ref) => ref.status === "successful") : [];

  const displayToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Handle withdraw cash
  const handleWithdraw = async (amount: number, upiId: string) => {
    setIsProcessing(true);
    try {
      await fetcherWithJWT("/protected/transaction/withdrawCash", "POST", {
        userId,
        amount,
        upiId,
      });

      // Revalidate transaction info
      mutate(["/protected/transaction/info", "POST", JSON.stringify({ userId })]);

      // Also revalidate transaction history
      mutate(`/protected/transaction/transactionHistory/${userId}`);

      setIsProcessing(false);
      setIsWithdrawing(false);
      displayToast(`Successfully withdrawn ₹${amount} to ${upiId}`, "success");
    } catch (error) {
      setIsProcessing(false);
      displayToast("Failed to withdraw cash", "error");
      console.error("Withdrawal error:", error);
    }
  };

  // Handle voucher redemption
  const handleRedeemVoucher = (voucher: Voucher) => {
    if (transactionInfo && transactionInfo.totalPoints >= voucher.pointsRequired) {
      displayToast(`Successfully redeemed ${voucher.title}`, "success");

      // Revalidate transaction info
      mutate(["/protected/transaction/info", "POST", JSON.stringify({ userId })]);

      // Also revalidate transaction history
      mutate(`/protected/transaction/transactionHistory/${userId}`);
    } else {
      displayToast("Not enough points to redeem this voucher", "error");
    }
  };

  // Handle sending points
  const handleSendPoints = async (amount: number, username: string) => {
    setLoadingSend((prev) => new Set([...prev, username]));

    try {
      await fetcherWithJWT("/protected/transaction/sharePoints", "POST", {
        userId,
        amount: -amount, // Make it negative as it's a debit for the sender
        clientId: "demo-client-id",
        recipientUsername: username,
      });

      // Revalidate transaction info
      mutate(["/protected/transaction/info", "POST", JSON.stringify({ userId })]);

      // Also revalidate transaction history
      mutate(`/protected/transaction/transactionHistory/${userId}`);

      setSendingPoints(null);
      displayToast(`Successfully sent ${amount} points to ${username}`, "success");
    } catch (error) {
      displayToast(`Failed to send points to ${username}`, "error");
      console.error("Send points error:", error);
    } finally {
      setLoadingSend((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    }
  };

  // Transform and filter transactions from the API for display
  const getFilteredTransactions = useCallback(() => {
    if (!transactionHistory) return [];

    return transactionHistory
      .map((tx) => {
        // Transform API transaction data to our component's format
        const transaction: Transaction = {
          id: `${tx.username}-${tx.amount}-${tx.type}`,
          type: tx.type,
          amount: tx.amount,
          description: `${tx.amount >= 0 ? "Received from" : "Sent to"} ${tx.username}`,
          date: new Date().toLocaleDateString(), // API doesn't provide date, use current date as fallback
        };

        if (transactionFilter === "all") return transaction;
        if (transactionFilter === "Cash" && transaction.type === "Cash") return transaction;
        if (transactionFilter === "Points" && transaction.type === "Points") return transaction;

        return null;
      })
      .filter(Boolean) as Transaction[];
  }, [transactionFilter, transactionHistory]);

  const isLoading = isLoadingTransactionInfo || isLoadingReferrals || isLoadingHistory;

  if (isLoading) {
    return (
      <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <Card variants={cardVariants}>
          <CardContent>
            <BackButton to="/">Back to Dashboard</BackButton>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spinner size={40} color="#4a80f0" />
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (transactionError) {
    return (
      <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <Card variants={cardVariants}>
          <CardContent>
            <BackButton to="/">Back to Dashboard</BackButton>

            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#e53e3e" }}>
              Failed to load rewards information. Please try again.
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <Card variants={cardVariants}>
        <CardContent>
          <BackButton to="/">Back to Dashboard</BackButton>
          <CardHeader>
            <HeaderRow>
              <CardTitle>Rewards</CardTitle>
              {!showHistory ? (
                <HeaderAction onClick={() => setShowHistory(true)}>
                  <History size={18} />
                  Transaction History
                </HeaderAction>
              ) : null}
            </HeaderRow>
          </CardHeader>

          {/* Balance Dashboard - Always visible */}
          <BalanceDisplay>
            <BalanceRow>
              <BalanceIcon color="#4a80f0">
                <Wallet size={24} />
              </BalanceIcon>
              <BalanceInfo>
                <BalanceLabel>Available Cash</BalanceLabel>
                <BalanceAmount>₹{transactionInfo?.totalCash || 0}</BalanceAmount>
              </BalanceInfo>
            </BalanceRow>
            <BalanceRow>
              <BalanceIcon color="#f0704a">
                <Coins size={24} />
              </BalanceIcon>
              <BalanceInfo>
                <BalanceLabel>Available Points</BalanceLabel>
                <BalanceAmount>{transactionInfo?.totalPoints || 0} pts</BalanceAmount>
              </BalanceInfo>
            </BalanceRow>
            <BalanceRow>
              <BalanceIcon color="#4af0a0">
                <Coins size={24} />
              </BalanceIcon>
              <BalanceInfo>
                <BalanceLabel>Bonus Earned</BalanceLabel>
                <BalanceAmount>
                  ₹{transactionInfo?.bonusCash || 0} + {transactionInfo?.bonusPoints || 0} pts
                </BalanceAmount>
              </BalanceInfo>
            </BalanceRow>
          </BalanceDisplay>

          {/* Main Content - Tabs or History */}
          <AnimatePresence mode="wait" initial={false}>
            {!showHistory ? (
              <motion.div
                key="tabs-content"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Custom Tab UI with Framer motion */}
                <TabsContainer>
                  <ActiveTabIndicator
                    initial={false}
                    animate={{
                      x: activeTab === "cash" ? 0 : "100%",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                  {tabItems.map((tab) => (
                    <TabButton key={tab.id} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                      {tab.label}
                    </TabButton>
                  ))}
                </TabsContainer>

                {/* Tab Content */}
                <div style={{ position: "relative", overflow: "hidden", minHeight: "200px" }}>
                  <motion.div
                    initial={false}
                    animate={{
                      x: activeTab === "cash" ? 0 : "-100%",
                      opacity: activeTab === "cash" ? 1 : 0,
                      position: activeTab === "cash" ? "relative" : "absolute",
                    }}
                    style={{ width: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      layout="position"
                      transition={{
                        layout: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 },
                      }}
                    >
                      {!isWithdrawing ? (
                        <Button
                          primary
                          fullWidth
                          onClick={() => setIsWithdrawing(true)}
                          disabled={!transactionInfo?.totalCash || transactionInfo.totalCash <= 0}
                        >
                          Withdraw Cash
                        </Button>
                      ) : (
                        <Section>
                          <SectionTitle>Withdraw Cash</SectionTitle>
                          {isProcessing ? (
                            <div style={{ textAlign: "center", padding: "2rem 0" }}>
                              <Spinner size={40} color="#4a80f0" />
                              <div style={{ marginTop: "1rem" }}>Processing your withdrawal...</div>
                            </div>
                          ) : (
                            <WithdrawForm
                              onClose={() => setIsWithdrawing(false)}
                              onSubmit={handleWithdraw}
                              maxAmount={transactionInfo?.totalCash || 0}
                              isLoading={isProcessing}
                            />
                          )}
                        </Section>
                      )}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={false}
                    animate={{
                      x: activeTab === "points" ? 0 : "100%",
                      opacity: activeTab === "points" ? 1 : 0,
                      position: activeTab === "points" ? "relative" : "absolute",
                    }}
                    style={{ width: "100%", top: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Section>
                      <SectionTitle>Your Successful Referrals</SectionTitle>
                      {successfulReferrals.length > 0 ? (
                        <ContactsList>
                          {successfulReferrals.map((referral) => {
                            const initials = getInitials(referral.username);
                            const avatarColor = getAvatarColor(referral.username);
                            const isSending = loadingSend.has(referral.username);
                            const isActive = sendingPoints === referral.username;

                            return (
                              <ContactItem
                                key={referral.username}
                                layout="position"
                                transition={{
                                  layout: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 },
                                }}
                              >
                                <ContactItemContent>
                                  <ContactAvatar bgColor={avatarColor}>{initials}</ContactAvatar>
                                  <ContactInfo>
                                    <ContactName>{referral.username}</ContactName>
                                  </ContactInfo>
                                  {!isActive && (
                                    <InviteButton
                                      primary
                                      onClick={() => setSendingPoints(referral.username)}
                                      disabled={isSending}
                                    >
                                      {isSending ? <Spinner size={16} /> : <Send size={16} />}
                                      <span style={{ marginLeft: "0.5rem" }}>
                                        {isSending ? "Sending" : "Send Points"}
                                      </span>
                                    </InviteButton>
                                  )}
                                </ContactItemContent>

                                {isActive && (
                                  <SendPointsForm
                                    onClose={() => setSendingPoints(null)}
                                    onSubmit={handleSendPoints}
                                    maxAmount={transactionInfo?.totalPoints || 0}
                                    username={referral.username}
                                    isLoading={loadingSend.has(referral.username)}
                                  />
                                )}
                              </ContactItem>
                            );
                          })}
                        </ContactsList>
                      ) : (
                        <EmptyStateContainer>No successful referrals yet</EmptyStateContainer>
                      )}
                    </Section>

                    <Section>
                      <SectionTitle>Redeem Vouchers</SectionTitle>
                      <VoucherGrid>
                        {mockVouchers.map((voucher) => (
                          <VoucherCard
                            key={voucher.id}
                            voucher={voucher}
                            onRedeem={handleRedeemVoucher}
                            currentPoints={transactionInfo?.totalPoints || 0}
                          />
                        ))}
                      </VoucherGrid>
                    </Section>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Section>
                  <HeaderRow>
                    <SectionTitle>Transaction History</SectionTitle>
                    <Button size="sm" onClick={() => setShowHistory(false)}>
                      Back to Rewards
                    </Button>
                  </HeaderRow>
                  <FilterContainer>
                    {historyFilterOptions.map((option) => (
                      <FilterButton
                        key={option.id}
                        isActive={transactionFilter === option.id}
                        onClick={() => setTransactionFilter(option.id)}
                      >
                        {option.id === "all" && <Filter size={14} />}
                        {option.label}
                      </FilterButton>
                    ))}
                  </FilterContainer>

                  {isLoadingHistory ? (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                      <Spinner size={40} color="#4a80f0" />
                    </div>
                  ) : getFilteredTransactions().length > 0 ? (
                    <div style={{ marginTop: "1rem" }}>
                      {getFilteredTransactions().map((transaction) => (
                        <TransactionHistoryItem key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                  ) : (
                    <EmptyStateContainer>No transactions found</EmptyStateContainer>
                  )}
                </Section>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Toast message={toastMessage} type={toastType} isVisible={showToast} onClose={() => setShowToast(false)} />
    </PageContainer>
  );
};

export default RewardsPage;
