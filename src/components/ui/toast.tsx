import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const ToastContainer = styled(motion.div)<{ type: ToastType }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 300px;
  max-width: 90%;
  background-color: ${(props) => {
    switch (props.type) {
      case "success":
        return props.theme.colors.success;
      case "error":
        return props.theme.colors.danger;
      case "info":
        return props.theme.colors.blue[500];
      default:
        return props.theme.colors.blue[500];
    }
  }};
`;

const IconContainer = styled.div`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Message = styled.div`
  color: white;
  font-size: ${(props) => props.theme.fontSizes.md};
  flex: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
`;

const getIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <CheckCircle size={20} />;
    case "error":
      return <AlertCircle size={20} />;
    case "info":
      return <Info size={20} />;
    default:
      return null;
  }
};

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <ToastContainer
          type={type}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <IconContainer>{getIcon(type)}</IconContainer>
          <Message>{message}</Message>
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

export default Toast;
