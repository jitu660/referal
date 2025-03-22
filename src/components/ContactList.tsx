import React from "react";
import styled from "@emotion/styled";
import { getInitials, getAvatarColor } from "./common/CardComponents";

export interface ContactItem {
  id: string;
  name: string;
  phoneNumber?: string;
}

interface ContactListProps {
  contacts: ContactItem[];
  onContactSelect: (contact: ContactItem) => void;
  selectedContactId?: string;
}

const ContactListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.gray[100]};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.gray[300]};
    border-radius: 10px;
  }
`;

const ContactItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? props.theme.colors.blue[50] : "white")};
  border: 1px solid ${(props) => (props.isSelected ? props.theme.colors.blue[200] : props.theme.colors.gray[200])};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isSelected ? props.theme.colors.blue[50] : props.theme.colors.gray[50])};
  }
`;

const Avatar = styled.div<{ bgColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: white;
  font-size: ${(props) => props.theme.fontSizes.sm};
  margin-right: 0.75rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ContactPhone = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const EmptyContacts = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.text.secondary};
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: 8px;
  border: 1px dashed ${(props) => props.theme.colors.gray[200]};
`;

const ContactList: React.FC<ContactListProps> = ({ contacts, onContactSelect, selectedContactId }) => {
  if (contacts.length === 0) {
    return <EmptyContacts>No contacts found</EmptyContacts>;
  }

  return (
    <ContactListContainer>
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          isSelected={contact.id === selectedContactId}
          onClick={() => onContactSelect(contact)}
        >
          <Avatar bgColor={getAvatarColor(contact.name)}>{getInitials(contact.name)}</Avatar>
          <ContactInfo>
            <ContactName>{contact.name}</ContactName>
            {contact.phoneNumber && <ContactPhone>{contact.phoneNumber}</ContactPhone>}
          </ContactInfo>
        </ContactItem>
      ))}
    </ContactListContainer>
  );
};

export default ContactList;
