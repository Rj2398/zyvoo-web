import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBookingDetailsData } from "../../../store/slices/userSlice";
import ExtendedTimeModal from "../ExtendedTimeModal";
import dollarIcon from "../../../assets/gallery/dollarIcon.png"
import {useNavigate } from "react-router-dom";

const BookingExtensionModal = ({show, handleClose, bookingDetails, totalAmount, handleBook}) => {
  const navigate = useNavigate();
  const [extendedModalVisible, setExtendedVisible] = useState(false);

  const dispatch = useDispatch();

  const [isMobileWidth, setIsMobileWidth] = useState(false)

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  const mergedBooking = {
    ...bookingDetails?.bookings?.[0],
    ...bookingDetails?.properties?.[0],
  };
  if (!show) return null;

  const handleExtend = () => {
    setExtendedVisible(true);
    dispatch(setBookingDetailsData(mergedBooking))
  };

  return (
    <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div style={{
          backgroundColor: "white",
          // padding: "3.5em",
          padding: isMobileWidth ? '1.5em' : '3.5em',
          borderRadius: "12px",
          textAlign: "center",
          width: "95%",
          maxWidth: "400px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >

        <button onClick={handleClose} style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "20px", 
            height: "20px",
            border: "none", 
            fontSize: "20px",
            cursor: "pointer",
            color: "white",
            backgroundColor: "#3A4B4C",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &times;
        </button>

        <h2 style={{ fontWeight: "600", fontSize: "1.5em", marginBottom: "10px" }} >
          {totalAmount ? "" : "Need More Time?"}
        </h2>

        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#2ee6a8",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
            margin: "30px auto",
          }} >
          <span style={{ fontSize: "32px", fontWeight: "bold", color: "white", fontFamily: "Arial, sans-serif"}} >
            {totalAmount ? <img src={dollarIcon} loading="lazy" alt="dollor"/> : " i"}
          </span>
        </div>
        {totalAmount ? (
          <p style={{ fontSize: "1em", color: "black", marginBottom: "20px" }}>
            Your new total amount is <br /> ${totalAmount}
          </p>
        ) : (
          <p style={{ fontSize: "1em", color: "black", marginBottom: "20px" }}>
            To extend your booking time, please click <span style={{fontWeight:'400'}}>"Yes"</span> below.
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }} >
          <button onClick={totalAmount ? handleBook : handleExtend}
            style={{
              backgroundColor: "#2ee6a8",
              color: "black",
              padding: "10px 20px",
              fontSize: "1em",
              borderRadius: "30px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "120px",
            }}
          >
            Yes
          </button>
          {/* <button onClick={handleClose} style={{ */}
          <button onClick={() => navigate("/")} style={{
              backgroundColor: "white",
              color: "black",
              padding: "10px 20px",
              fontSize: "1em",
              borderRadius: "30px",
              border: "1px solid #2ee6a8",
              cursor: "pointer",
              minWidth: "120px",
            }} >
             No
            
          </button>
        </div>
      </div>
      <ExtendedTimeModal
        show={extendedModalVisible}
        onHide={() => setExtendedVisible(false)}
        mergedBooking={mergedBooking}
      />
    </div>
  );
};

export default React.memo(BookingExtensionModal);
