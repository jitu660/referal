import styled from "@emotion/styled";
import { motion } from "framer-motion";

// Animation variants
export const pageVariants = {
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

export const cardVariants = {
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

// Styled Components
export const PageContainer = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.background};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.5rem;
  }
`;

export const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
  max-width: 100%; // Full width for mobile
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 480px; // Constrained on larger screens
  }
`;

export const CardHeader = styled.div`
  padding: 1.5rem;
  //no left padding
  padding-left: 0;
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  letter-spacing: -0.5px;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[100]};
`;

export const CardTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

export const CardContent = styled.div`
  padding: 1.5rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

export const EmptyStateContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: 12px;
  border: 1px dashed ${(props) => props.theme.colors.gray[200]};
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.fontSizes.md};
  margin: 1rem 0;
`;

// Helper to get initials from name
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Function to get consistent color based on name
export const getAvatarColor = (name: string) => {
  const colors = [
    "#4a80f0", // blue
    "#f0704a", // coral
    "#4af0a0", // green
    "#f04a80", // pink
    "#804af0", // purple
    "#f0d14a", // yellow
  ];

  // Simple hash function to get a consistent color for a name
  const hashCode = name.split("").reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);

  return colors[Math.abs(hashCode) % colors.length];
};
