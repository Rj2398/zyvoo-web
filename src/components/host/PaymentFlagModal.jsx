import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Custom Modal Component ---
const PaymentFlagModal = ({ isOpen, onClose, title, message }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleAction = () => {
    onClose();
    navigate("/profile");
  };
  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        {/* Close Icon (Top Right) */}
        <button
          style={styles.closeIconButton}
          onClick={onClose}
          aria-label="Close"
        >
          &#x2715;
        </button>

        {/* Modal Header */}
        <h2 style={styles.title}>{title}</h2>

        <div style={styles.divider} />

        {/* Modal Body */}
        <p style={styles.message}>{message}</p>

        {/* Action Button */}
        <button style={styles.actionButton} onClick={handleAction}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default PaymentFlagModal;

// --- Inline Styles ---
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    width: "90%",
    maxWidth: "400px",
    borderRadius: "16px",
    padding: "32px 24px 24px 24px",
    textAlign: "center",
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
    boxSizing: "border-box",
  },
  closeIconButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#2e3a38",
    color: "#ffffff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "12px",
    lineHeight: "1",
  },
  title: {
    margin: "0 0 16px 0",
    fontSize: "20px",
    fontWeight: "500",
    color: "#000000",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    marginBottom: "24px",
    width: "100%",
  },
  message: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.5",
    marginBottom: "28px",
    padding: "0 8px",
  },
  actionButton: {
    width: "100%",
    padding: "14px 0",
    backgroundColor: "#4AEAB1",
    color: "#ffffff",
    border: "none",
    borderRadius: "24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
