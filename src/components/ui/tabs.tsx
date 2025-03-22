import React from "react";
import styled from "@emotion/styled";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabsContainer = styled.div`
  display: flex;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: 12px;
  margin-bottom: 1.5rem;
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
  background-color: ${(props) => (props.isActive ? "white" : "transparent")};
  color: ${(props) => (props.isActive ? props.theme.colors.blue[500] : props.theme.colors.text.secondary)};
  box-shadow: ${(props) => (props.isActive ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "none")};
  transition: color 0.2s ease;
`;

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabButton key={tab.id} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)}>
          {tab.label}
        </TabButton>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
