import styles from "./ResponseModal.module.css";

const ResponseModal = ({ isOpen, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalContent}>
      <p
        className={`${
          message.type === "error" ? styles.errorMessage : styles.successMessage
        } ${styles.content}`}
      >
        {message?.text}
      </p>
      <p
        className={`${styles.loader} ${styles.content} ${
          message.type === "error" ? styles.errorLoader : styles.successLoader
        }`}
      ></p>
    </div>
  );
};

export default ResponseModal;
