import { useState, createContext, useContext } from "react";
import styles from "../dashboard/css/CreateModal.module.css";
// Create Context
const ModalContext = createContext(null);

// Custom hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

// Modal Container
const ModalContainer = ({ children }) => {
  const { isOpen, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={closeModal} className={styles.closeButton}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// Modal component
export const Modal = () => {
  const { modalContent } = useModal();
  return <ModalContainer>{modalContent}</ModalContainer>;
};

// Modal Provider
export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, modalContent }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};
