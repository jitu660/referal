import React, { useState } from "react";
import { Copy, CheckCircle, Search, Send, Info, ArrowLeft } from "lucide-react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Button from "../components/ui/button";
import Spinner from "../components/ui/spinner";
import Toast from "../components/ui/toast";
import ReferralSteps from "../components/ReferralSteps";
import BottomDrawer from "../components/BottomDrawer";
import { useBackendPOST } from "../api/useBackend";
import BackButton from "../components/common/BackButton";
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

// Mock data for contacts with Indian numbers
const MOCK_CONTACTS = Array(30)
  .fill(null)
  .map((_, index) => ({
    id: `contact-${index}`,
    name: [
      "Rahul Sharma",
      "Priya Patel",
      "Amit Kumar",
      "Sneha Singh",
      "Vikram Mehta",
      "Neha Gupta",
      "Raj Malhotra",
      "Ananya Desai",
      "Suresh Verma",
      "Pooja Reddy",
      "Karan Joshi",
      "Divya Chauhan",
      "Arjun Nair",
      "Meera Kapoor",
      "Sanjay Agarwal",
      "Ritu Khanna",
      "Vijay Saxena",
      "Deepika Iyer",
      "Ajay Tiwari",
      "Isha Bansal",
      "Rohit Choudhary",
      "Kavita Menon",
      "Nitin Bajaj",
      "Shweta Sharma",
      "Anil Thakur",
      "Anjali Das",
      "Rajesh Sinha",
      "Shreya Yadav",
      "Manish Goel",
      "Nisha Malik",
    ][index],
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 6000000000}`,
  }));

interface ContactType {
  id: string;
  name: string;
  phone: string;
}

const ReferralLinkBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.blue[50]};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ReferralLink = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.blue[600]};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.blue[500]};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  flex-shrink: 0;

  &:hover {
    color: ${(props) => props.theme.colors.blue[700]};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
  align-self: flex-start;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontSizes.md};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.blue[300]};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.blue[100]};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.gray[400]};
`;

const ContactsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem;
  width: 100%;

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

const ContactItem = styled.div`
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

const ContactInfo = styled.div`
  flex: 1;
  padding: 0.25rem 0;
`;

const ContactName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const ContactPhone = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
`;

const InviteButton = styled(Button)`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  min-width: 80px;
  margin-left: 0.75rem;
  flex-shrink: 0;
`;

const ContactsSection = styled(Section)`
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 0;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
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

const SearchTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const ContactCount = styled.span`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const InfoIconButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.blue[400]};
  padding: 0;
  margin-left: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.colors.blue[600]};
  }
`;

// Helper function to format Indian phone numbers nicely
const formatIndianPhoneNumber = (phoneNumber: string) => {
  // Strip any non-digit characters from the phone number
  const digits = phoneNumber.replace(/\D/g, "");

  // Check if it's an Indian number (starting with +91)
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.substring(2, 7)} ${digits.substring(7)}`;
  }

  // For 10-digit numbers without country code
  if (digits.length === 10) {
    return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
  }

  // Return the original if it doesn't match expected formats
  return phoneNumber;
};

const ReferPage = () => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts] = useState<ContactType[]>(MOCK_CONTACTS);
  const [loadingContacts, setLoadingContacts] = useState<Set<string>>(new Set());
  const [invitedContacts, setInvitedContacts] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as const });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: referralInfo } = useBackendPOST<{ userId: string; referralCode: string; clientId: string }>(
    "/protected/onboard",
    { clientId: "demo-client-id", phoneNumber: "1234567890", username: "DemoUser" }
  );

  const referralLink = `https://pice.refer.com?ref=${referralInfo?.referralCode || "loading"}`;

  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phone.includes(searchTerm)
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Show toast on copy
      setToast({
        visible: true,
        message: "Referral link copied to clipboard!",
        type: "success",
      });
    });
  };

  const handleInviteContact = (contactId: string) => {
    if (loadingContacts.has(contactId)) return;

    // Add to loading set
    setLoadingContacts((prev) => new Set([...prev, contactId]));

    // Simulate API call with timeout
    setTimeout(() => {
      // Remove from loading set
      setLoadingContacts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contactId);
        return newSet;
      });

      // Add to invited set
      setInvitedContacts((prev) => new Set([...prev, contactId]));

      // Show success toast
      const contact = contacts.find((c) => c.id === contactId);
      setToast({
        visible: true,
        message: `Invite sent to ${contact?.name} via SMS and WhatsApp`,
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
          <BackButton to="/">Back to Dashboard</BackButton>

          <CardHeader>
            <HeaderRow>
              <CardTitle>Refer & Earn</CardTitle>
              <InfoIconButton onClick={() => setDrawerOpen(true)}>
                <Info size={20} />
              </InfoIconButton>
            </HeaderRow>
          </CardHeader>

          {/* Referral Link Section */}
          <Section>
            <SectionTitle>Your Referral Link</SectionTitle>
            <ReferralLinkBox>
              <ReferralLink>{referralLink}</ReferralLink>
              <CopyButton onClick={handleCopyLink}>
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </CopyButton>
            </ReferralLinkBox>
            <Link to="/track" style={{ textDecoration: "none", display: "block" }}>
              <Button primary fullWidth>
                Track Your Referrals
              </Button>
            </Link>
          </Section>

          {/* Contacts Section */}
          <ContactsSection>
            <SearchTitleRow>
              <SectionTitle>Invite Contacts</SectionTitle>
              <ContactCount>{filteredContacts.length} contacts</ContactCount>
            </SearchTitleRow>
            <SearchContainer>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search contacts by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <ContactsList>
              {filteredContacts.map((contact) => {
                const initials = getInitials(contact.name);
                const avatarColor = getAvatarColor(contact.name);
                const formattedPhone = formatIndianPhoneNumber(contact.phone);

                return (
                  <ContactItem key={contact.id}>
                    <ContactAvatar bgColor={avatarColor}>{initials}</ContactAvatar>
                    <ContactInfo>
                      <ContactName>{contact.name}</ContactName>
                      <ContactPhone>{formattedPhone}</ContactPhone>
                    </ContactInfo>
                    <InviteButton
                      primary={!invitedContacts.has(contact.id)}
                      disabled={invitedContacts.has(contact.id)}
                      onClick={() => handleInviteContact(contact.id)}
                    >
                      {loadingContacts.has(contact.id) ? (
                        <Spinner size={16} />
                      ) : invitedContacts.has(contact.id) ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Send size={16} />
                      )}
                      <span style={{ marginLeft: "0.5rem" }}>
                        {loadingContacts.has(contact.id)
                          ? "Sending"
                          : invitedContacts.has(contact.id)
                            ? "Sent"
                            : "Invite"}
                      </span>
                    </InviteButton>
                  </ContactItem>
                );
              })}
              {filteredContacts.length === 0 && (
                <EmptyStateContainer>No contacts found matching your search</EmptyStateContainer>
              )}
            </ContactsList>
          </ContactsSection>
        </CardContent>
      </Card>

      {/* Bottom Drawer with Referral Steps */}
      <BottomDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ReferralSteps showTierRewards={true} showCloseButton={true} onClose={() => setDrawerOpen(false)} />
      </BottomDrawer>

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={closeToast} duration={3000} />
    </PageContainer>
  );
};

export default ReferPage;
