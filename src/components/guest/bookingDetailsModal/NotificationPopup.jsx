import React, { useState, useEffect } from "react";

const NotificationPopup = ({ onClose }) => {
  const [step, setStep] = useState(1);

    const [isMobileWidth, setIsMobileWidth] = useState(false);
  
   useEffect(() => {
        const checkWindowWidth = () => {
          setIsMobileWidth(window.innerWidth <= 768);
        };
    
        checkWindowWidth(); // run on mount
        window.addEventListener("resize", checkWindowWidth);
    
        return () => window.removeEventListener("resize", checkWindowWidth);
      }, []);

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleFirstOkay = () => {
    setStep(2);
  };

  return (
    // <div
    //   style={{
    //     position: "fixed",
    //     top: 0,
    //     left: 0,
    //     width: "100%",
    //     height: "100%",
    //     backgroundColor: "rgba(0, 0, 0, 0.5)",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     zIndex: 2,
    //   }}
    // >
    //   <div
    //     style={{
    //       backgroundColor: "white",
    //       padding: "20px 0px 20px 0px",
    //       borderRadius: "10px",
    //       maxWidth: "27%",
    //       height:'50%',
    //       textAlign: "center",
    //       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    //       position: "relative",
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",

    //     }}
    //   >
    //     {/* Close Button */}
    //     <button
    //       onClick={onClose}
    //       style={{
    //         position: "absolute",
    //         top: "10px",
    //         right: "10px",
    //         background: "#2F3E46",
    //         border: "none",
    //         fontSize: "20px",
    //         cursor: "pointer",
    //         color: "white",
    //         width: "20px",
    //         height: "20px",
    //         borderRadius: "50%",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       &times;
    //     </button>

    //     {step === 1 && (
    //       <>
    //         <h2 style={{ marginBottom: "15px", marginTop: "5%" }}>Notification</h2>

    //           <img src="/images/popups/success-icon.svg" style={{width:'25%'}}/>

    //         <p style={{ marginBottom: "15px", maxWidth: "80%" }}>
    //           Your report has been submitted. Thank you for helping us maintain a safe and respectful community.
    //         </p>

    //         <button
    //           onClick={handleFirstOkay}
    //           style={{
    //             padding: "10px",
    //             backgroundColor: "#5EE6A0",
    //             color: "black",
    //             border: "none",
    //             borderRadius: "20px",
    //             cursor: "pointer",
    //             fontSize: "16px",
    //             width: "50%",
    //             fontWeight: "bold",
    //           }}
    //         >
    //           Okay
    //         </button>
    //       </>
    //     )}

    //     {step === 2 && (
    //       <>
    //         <h3 style={{ marginBottom: "16px", marginTop: "5%" }}>Success</h3>

    //             <img src="/images/popups/success-icon.svg" style={{width:'25%'}}/>

    //         <p style={{ marginBottom: "15px", maxWidth: "80%" }}>
    //           We will review your report and take appropriate action if necessary.
    //         </p>

    //         <button
    //           onClick={onClose}
    //           style={{
    //             padding: "10px",
    //             backgroundColor: "#5EE6A0",
    //             color: "black",
    //             border: "none",
    //             borderRadius: "20px",
    //             cursor: "pointer",
    //             fontSize: "16px",
    //             width: "50%",
    //             fontWeight: "bold",
    //             marginBottom:'10px'
    //           }}
    //         >
    //           Okay
    //         </button>
    //       </>
    //     )}
    //   </div>
    // </div>

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        padding: "20px", // allows space on small screens
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px 10px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px", // allows responsiveness
          minHeight: "300px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Close Button */}
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
            color: "#fff",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        {step === 1 && (
          <>
            <h2
              style={{
                marginBottom: "15px",
                marginTop: "20px",
                fontSize: !isMobileWidth ?"28px" : "18px",
                   color:"black"
              }}
            >
              Notification
            </h2>

            <img
              src="/images/popups/success-icon.svg"
              loading="lazy"
              alt="Success"
              style={{ width: isMobileWidth ?"60px":"100px", height: isMobileWidth ?"60px":"100px", marginBottom: "15px" }}
            />

            <p
              style={{
                marginBottom: "20px",
                fontSize: "14px",
                padding: "0 10px",
              }}
            >
              Your report has been submitted. Thank you for helping us maintain
              a safe and respectful community.
            </p>

            <button
              onClick={handleFirstOkay}
              style={{
                padding: "10px",
                backgroundColor: "#5EE6A0",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                width: "80%",
                maxWidth: "250px",
                marginBottom: "10px",
              }}
            >
              Okay
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3
              style={{
                marginBottom: "15px",
                marginTop: "20px",
                 fontSize: !isMobileWidth ?"28px" : "18px",
                 color:"black"
              }}
            >
              Success
            </h3>

            <img
              src="/images/popups/success-icon.svg"
              loading="lazy"
              alt="Success"
              style={{ width:  isMobileWidth ?"60px":"100px", height:  isMobileWidth ?"60px":"100px", marginBottom: "15px" }}
            />

            <p
              style={{
                marginBottom: "20px",
                fontSize: "14px",
                padding: "0 10px",
              }}
            >
              We will review your report and take appropriate action if
              necessary.
            </p>

            <button
              onClick={onClose}
              style={{
                padding: "10px",
                backgroundColor: "#5EE6A0",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                width: "80%",
                maxWidth: "250px",
                marginBottom: "10px",
              }}
            >
              Okay
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(NotificationPopup);
