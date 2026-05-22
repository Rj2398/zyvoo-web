import { useState, useEffect } from "react";
import CancelPopup from "./CancelPopup";

const CancelBooking = ({ isOpen, amount, onCancel, userId, bookingId }) => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setShowCancelPopup(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return showCancelPopup ? (
    <CancelPopup
      isOpen={showCancelPopup}
      userId={userId}
      booking_Id={bookingId}
      onClose={() => {
        setShowCancelPopup(false);
        onCancel(); 
      }}
      onConfirm={() => {
        setShowCancelPopup(false);
        onCancel(); 
      }}
    />
  ) : (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          width: "300px",
          position: "relative",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#2F3E46",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "white",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={onCancel} 
        >
          &times;
        </button>
        <div style={{ fontSize: "30px", marginBottom: "10px" }}>$</div>
        <p style={{ fontSize: "14px", marginBottom: "20px" }}>
          Your new total amount is
        </p>
        <p style={{ fontSize: "20px", marginBottom: "10px" }}>${amount}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            style={{
              backgroundColor: "#5EE6A0",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => setShowCancelPopup(true)}
          >
            Yes
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "1px solid #ccc",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBooking;
