import React from "react";
import useCommon from "../../../hooks/useCommon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const CancelPopup = ({ isOpen, onClose, onConfirm, userId, booking_Id }) => {
  const { cancelBooking } = useCommon();

  const handleBooking = async () => {
    try {
      const response = await cancelBooking({
        user_id: userId,
        booking_id: booking_Id,
      });

      if (response) {
        onConfirm(); 
        toast.success("Booking cancelled successfully.");
        // Navigate("/homeGuest");

      } else{
        onClose()
      }
    } catch (error) {
      console.error("Cancellation error:", error);
onClose()
      // const errorMessage =
      //   error.response?.data?.message ||
      //   error.message ||
      //   "Failed to cancel booking. Please try again.";

      toast.error(error);
    }
  };

  if (!isOpen) return null;

  return (
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
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          width: "350px",
          height:'300px',
          position: "relative",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        }}
      >
          <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#2F3E46",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "white",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          &times;
        </button>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Cancel</h2>
      <div
  style={{
    width: "80px",
    height: "80px",
    // borderRadius: "50%",
    // backgroundColor: "#5EE6A0",
    // color: "#FFFFFF",
    fontSize: "50px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    marginBottom: "10px",
    // boxShadow: "0 0 10px rgba(94, 230, 160, 0.7)", // soft glow
    fontFamily: "'Segoe UI Symbol', 'Arial', sans-serif", // smoother font
  }}
>
<img  style={{width:'100%'}} src="/images/popups/cancel.svg"/>
</div>

        <p style={{ fontSize: "15px", marginBottom: "20px" }}>
          Are you sure you want to cancel<br/> this booking?
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            style={{
              backgroundColor: "#4AEAB1",
              border: "none",
              padding: "10px 50px 10px 50px",
              borderRadius: "20px",
              color: "#000",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={() => {
              handleBooking();
            }}
          >
            Yes
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "1px solid #ccc",
              borderColor:'#4AEAB1',
               padding: "10px 40px 10px 40px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPopup;
