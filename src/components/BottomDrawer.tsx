import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DrawerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const DrawerContent = styled(motion.div)`
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  padding-top: 2rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

  /* Add a drag indicator */
  &::before {
    content: "";
    position: absolute;
    top: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 5px;
    background-color: ${(props) => props.theme.colors.gray[300]};
    border-radius: 10px;
  }
`;

const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose, children }) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <DrawerOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <DrawerContent
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on content
          >
            {children}
          </DrawerContent>
        </DrawerOverlay>
      )}
    </AnimatePresence>
  );
};

export default BottomDrawer;
