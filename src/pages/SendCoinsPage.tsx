import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import styled from "@emotion/styled";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Spinner from "../components/ui/spinner";
import Toast from "../components/ui/toast";
import BackButton from "../components/common/BackButton";
import ContactList, { ContactItem } from "../components/ContactList";
import { useBackendPOST } from "../api/useBackend";
import {
  PageContainer,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  HeaderRow,
  SectionTitle,
  Section,
  pageVariants,
  cardVariants,
} from "../components/common/CardComponents";

// Mock contacts data
const mockContacts: ContactItem[] = [
  { id: "c1", name: "Ankit Sharma", phoneNumber: "+91 98765 43210" },
  { id: "c2", name: "Priya Patel", phoneNumber: "+91 87654 32109" },
  { id: "c3", name: "Rohit Verma", phoneNumber: "+91 76543 21098" },
  { id: "c4", name: "Neha Singh", phoneNumber: "+91 65432 10987" },
  { id: "c5", name: "Amit Kumar", phoneNumber: "+91 54321 09876" },
  { id: "c6", name: "Deepika Gupta", phoneNumber: "+91 43210 98765" },
  { id: "c7", name: "Rajesh Khanna", phoneNumber: "+91 32109 87654" },
  { id: "c8", name: "Sunita Jain", phoneNumber: "+91 21098 76543" },
];

const PointsInput = styled.div`
  margin-bottom: 1.5rem;
`;

const ContactsContainer = styled.div`
  margin-top: 1.5rem;
`;

const SendButton = styled(Button)`
  position: sticky;
  bottom: 1rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

interface SendCoinsFormProps {
  maxPoints: number;
  onSend: (points: number, contactId: string) => void;
  selectedContactId: string | null;
}

const SendCoinsForm: React.FC<SendCoinsFormProps> = ({ maxPoints, onSend, selectedContactId }) => {
  const [points, setPoints] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    const numPoints = Number(points);
    if (!points || isNaN(numPoints) || numPoints <= 0) {
      setError("Please enter a valid number of points");
      return;
    }

    if (numPoints > maxPoints) {
      setError(`You can send maximum ${maxPoints} points`);
      return;
    }

    if (!selectedContactId) {
      setError("Please select a contact to send points to");
      return;
    }

    setError(null);
    onSend(numPoints, selectedContactId);
  };

  return (
    <>
      <PointsInput>
        <Input
          label="Points to send"
          type="number"
          placeholder="Enter points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          fullWidth
          min={1}
          max={maxPoints}
          error={error || undefined}
        />
      </PointsInput>
      <SendButton primary fullWidth disabled={!selectedContactId} onClick={handleSend}>
        Send Points <Send size={16} style={{ marginLeft: "0.5rem" }} />
      </SendButton>
    </>
  );
};

interface TransactionInfo {
  totalPoints: number;
}

const SendCoinsPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch user transaction information
  const {
    data: transactionInfo,
    error: transactionError,
    isLoading,
  } = useBackendPOST<TransactionInfo>(
    "/protected/transaction/info",
    { userId },
    {
      revalidateOnFocus: false,
    }
  );

  const displayToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleContactSelect = (contact: ContactItem) => {
    setSelectedContact(contact);
  };

  const handleSendPoints = async (points: number, contactId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/protected/transaction/sharePoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount: points, clientId: contactId }),
      });

      if (response.ok) {
        setIsProcessing(false);
        setIsSuccess(true);
        const selectedContactName = mockContacts.find((c) => c.id === contactId)?.name || "the contact";
        displayToast(`Successfully sent ${points} points to ${selectedContactName}`, "success");
      } else {
        throw new Error("Failed to send points");
      }
    } catch {
      setIsProcessing(false);
      displayToast("Failed to send points", "error");
    }
  };

  if (isLoading) {
    return (
      <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <Card variants={cardVariants}>
          <CardHeader>
            <HeaderRow>
              <BackButton to="/rewards">Back</BackButton>
            </HeaderRow>
            <CardTitle>Send Points</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", justifyContent: "center", padding: "4rem 1rem" }}>
            <Spinner size={40} color="#4a80f0" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (transactionError) {
    return (
      <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <Card variants={cardVariants}>
          <CardHeader>
            <HeaderRow>
              <BackButton to="/rewards">Back</BackButton>
            </HeaderRow>
            <CardTitle>Send Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#e53e3e" }}>
              Failed to load your points information. Please try again.
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <Card variants={cardVariants}>
        <CardHeader>
          <HeaderRow>
            <BackButton to="/rewards">Back</BackButton>
          </HeaderRow>
          <CardTitle>Send Points</CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <Spinner size={40} color="#4a80f0" />
              <div style={{ marginTop: "1rem" }}>Processing your transaction...</div>
            </div>
          ) : isSuccess ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: "center", padding: "2rem 0" }}
            >
              <div style={{ color: "#10b981", fontSize: "24px", marginBottom: "1rem" }}>Success!</div>
              <div style={{ marginBottom: "2rem" }}>
                {selectedContact?.name
                  ? `You've successfully sent points to ${selectedContact.name}`
                  : "Your transaction was successful"}
              </div>
              <Button primary onClick={() => setIsSuccess(false)}>
                Send More Points
              </Button>
            </motion.div>
          ) : (
            <>
              <Section>
                <SectionTitle>Send Points</SectionTitle>
                <div style={{ fontSize: "14px", color: "#4b5563", marginBottom: "1rem" }}>
                  You have {transactionInfo?.totalPoints || 0} points available to send
                </div>

                <SendCoinsForm
                  maxPoints={transactionInfo?.totalPoints || 0}
                  onSend={handleSendPoints}
                  selectedContactId={selectedContact?.id || null}
                />
              </Section>

              <ContactsContainer>
                <SectionTitle>Select Contact</SectionTitle>
                <ContactList
                  contacts={mockContacts}
                  onContactSelect={handleContactSelect}
                  selectedContactId={selectedContact?.id}
                />
              </ContactsContainer>
            </>
          )}
        </CardContent>
      </Card>

      <Toast message={toastMessage} type={toastType} isVisible={showToast} onClose={() => setShowToast(false)} />
    </PageContainer>
  );
};

export default SendCoinsPage;
