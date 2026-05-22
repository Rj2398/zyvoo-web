import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import useBook from "../../hooks/host/useBook";
import { KEYS } from "../../config/Constant";
import NotificationPopup from "../guest/bookingDetailsModal/NotificationPopup";
import { isMoment } from "moment/moment";
import { useSelector } from "react-redux";

const CustomSelect = ({ value, onChange, options, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
    useEffect(() => {
      const checkWindowWidth = () => {
        setIsMobileWidth(window.innerWidth <= 768);
      };
  
      checkWindowWidth(); // run on mount
      window.addEventListener("resize", checkWindowWidth);
  
      return () => window.removeEventListener("resize", checkWindowWidth);
    }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={selectRef} style={{ position: "relative", width: "100%", }}   >
      <div
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: hasError ? "1px solid red" : "1px solid #ccc",
          color: "#444444",
          cursor: "pointer",
          backgroundColor: "white",
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize:'15px'
         
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption.label}

       <img src={`/images/dropdown.svg`} alt={`Dropdown Icon`} 
        
          style={{
            width:'12px',
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            overflow: "hidden",
            marginTop: "-25px",
            boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.38)",
            width: "97%",
          }}
        >
          {options
            .filter((opt) => !opt.disabled)
            .map((option, index) => (
              <React.Fragment key={option.value}>
                <div
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    color: "#444444",
                    backgroundColor: "white",
                    fontSize:"14px"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#5EE6A0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#444444")
                  }
                  onClick={() => {
                    onChange({ target: { value: option.value } });
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
                {index < options.filter((opt) => !opt.disabled).length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "#444444",
                      opacity: 0.2,
                      margin: "0 8px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

const ReportBookingModal = ({ show, handleClose, booking_id, property_id }) => {

    const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userType = localStorage.getItem("USER_TYPE");
  const userId =userInfo?.user_id || userData?.user_id ? String(userData?.user_id) : null;

  const { hostReportViolation, guestReportViolation } = useBook();

  const [selectedReason, setSelectedReason] = useState("sel");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

 useEffect(() => {
      const checkWindowWidth = () => {
        setIsMobileWidth(window.innerWidth <= 768);
      };
  
      checkWindowWidth(); // run on mount
      window.addEventListener("resize", checkWindowWidth);
  
      return () => window.removeEventListener("resize", checkWindowWidth);
    }, []);

  const reportReasonIdMap = {
    Inappropriate: 1,
    Misleading: 2,
    Spam: 3,
    Harassment: 4,
    Discrimination: 5,
    Other: 6,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedReason === "sel") {
      setError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: userId,
        booking_id: booking_id,
        property_id: property_id,
        report_reasons_id: reportReasonIdMap[selectedReason],
        additional_details: additionalDetails,
      };
      const submitResponse =
        (await userType) === "guest"
          ? guestReportViolation(payload)
          : hostReportViolation(payload);

      if (submitResponse) {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setShowPopup(false);
    handleClose();
    // Reset form
    setSelectedReason("sel");
    setAdditionalDetails("");
    setError(false);
  };

  if (!show) return null;

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
    //     zIndex: 1000,
    //   }}
    // >
    //   {showPopup ? (
    //     <NotificationPopup onClose={handleCloseAll} />
    //   ) : (
    //     <div
    //       style={{
    //         backgroundColor: "white",
    //         padding: "30px 40px",
    //         borderRadius: "17px",
    //         width: "80%",
    //         maxWidth: "500px",
    //         maxHeight: "100vh",
    //         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    //         position: "relative",
    //         display: "flex",
    //         flexDirection: "column",
    //         margin: "10px",
    //       }}
    //     >
    //       <button
    //         onClick={handleClose}
    //         style={{
    //           position: "absolute",
    //           top: "10px",
    //           right: "10px",
    //           background: "#2F3E46",
    //           border: "none",
    //           fontSize: "18px",
    //           cursor: "pointer",
    //           color: "white",
    //           width: "35px",
    //           height: "35px",
    //           borderRadius: "50%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         &times;
    //       </button>

    //       <h3
    //         style={{
    //           textAlign: "center",
    //           marginBottom: "15px",
    //           fontSize: "20px",
    //           fontWeight: "bold",
    //           color: "black",
    //           marginTop: "5%",
    //         }}
    //       >
    //         Report Violation
    //       </h3>
    //       <hr />

    //       <form
    //         onSubmit={handleSubmit}
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           flex: 1,
    //         }}
    //       >
    //         <div
    //           style={{
    //             display: "flex",
    //             flexDirection: "column",
    //             flex: 1,
    //             border: "1px solid #ccc",
    //             margin: "10px 0px 10px 0px",
    //             padding: "10px",
    //             paddingBottom: "1px",
    //             borderRadius: "10px",
    //           }}
    //         >
    //           <label
    //             style={{
    //               display: "block",
    //               // color: "black",
    //               marginBottom: "5px",
    //               color: " #444444",
    //               fontWeight: "600",
    //               padding: "7px 12px",
    //             }}
    //           >
    //             Please select a reason for reporting this user.
    //           </label>

    //           <CustomSelect
    //             value={selectedReason}
    //             onChange={(e) => {
    //               setSelectedReason(e.target.value);
    //               setError(false);
    //             }}
    //             options={[
    //               { value: "sel", label: "Select", disabled: true },
    //               { value: "Inappropriate", label: "Inappropriate Content" },
    //               { value: "Misleading", label: "Misleading Information" },
    //               { value: "Spam", label: "Spam or Scam" },
    //               { value: "Harassment", label: "Harassment" },
    //               { value: "Discrimination", label: "Discrimination" },
    //               { value: "Other", label: "Other Issue" },
    //             ]}
    //             hasError={error}
    //           />
    //           {error && (
    //             <p
    //               style={{
    //                 color: "red",
    //                 fontSize: "12px",
    //                 marginTop: "-10px",
    //                 marginBottom: "15px",
    //               }}
    //             >
    //               Please select a reason before submitting
    //             </p>
    //           )}

    //           <label
    //             style={{
    //               display: "block",
    //               // fontWeight: "bold",
    //               marginBottom: "5px",
    //               fontWeight: "600",
    //               color: " #444444",
    //               padding: "0 12px",
    //             }}
    //           >
    //             Add Additional Details
    //           </label>
    //           <textarea
    //             style={{
    //               width: "100%",
    //               height: "170px",
    //               padding: "8px 12px",
    //               borderRadius: "15px",
    //               border: "1px solid #ccc",
    //               marginBottom: "15px",
    //               resize: "none",
    //               color: " #444444",
    //             }}
    //             value={additionalDetails}
    //             onChange={(e) => setAdditionalDetails(e.target.value)}
    //             placeholder="You can also add additional details to help us investigate further."
    //           />
    //         </div>
    //         <button
    //           type="submit"
    //           disabled={isSubmitting}
    //           style={{
    //             width: "100%",
    //             padding: "10px",
    //             backgroundColor: "#5EE6A0",
    //             color: "black",
    //             border: "none",
    //             borderRadius: "20px",
    //             fontWeight: "bold",
    //             cursor: "pointer",
    //             fontSize: "16px",
    //             opacity: isSubmitting ? 0.7 : 1,
    //           }}
    //         >
    //           {isSubmitting ? "Submitting..." : "Submit Report"}
    //         </button>
    //       </form>
    //     </div>
    //   )}
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
    padding:isMobileWidth?"10px": "10px",
    boxSizing: "border-box",
    zIndex:9999
  }}
>
  {showPopup ? (
    <NotificationPopup onClose={handleCloseAll} />
  ) : (
    <div
      style={{
        backgroundColor: "white",
        padding:isMobileWidth ?"8px":"38px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "500px",
        maxHeight: "95vh",
        overflowY: "auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
       
      }}
    >
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "#2F3E46",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "white",
          // width: isMobileWidth?"25px":"35px",
          // height: isMobileWidth?"25px":"35px",
          width: "20px",
          height:"20px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        &times;
      </button>

      <h3
        style={{
          textAlign: "center",
          marginBottom: isMobileWidth ?"2px":"5px",
          fontSize: isMobileWidth ?"18px":'28px',
          fontWeight: "500",
          color: "black",
          marginTop: isMobileWidth ?"10px":"0px",
        }}
      >
        Report Violation
      </h3>
      <hr style={{ marginBottom: "20px" }} />

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            border: "1px solid #ccc",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <label
            style={{
              color: "#444444",
              fontWeight: "500",
              padding: "5px 8px",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Please select a reason for reporting this user.
          </label>

          <CustomSelect
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setError(false);
            }}
            options={[
              { value: "sel", label: "Select", disabled: true },
              { value: "Inappropriate", label: "Inappropriate Content" },
              { value: "Misleading", label: "Misleading Information" },
              { value: "Spam", label: "Spam or Scam" },
              { value: "Harassment", label: "Harassment" },
              { value: "Discrimination", label: "Discrimination" },
              { value: "Other", label: "Other Issue" },
            ]}
            hasError={error}
          />
          {error && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              Please select a reason before submitting
            </p>
          )}

          <label
            style={{
              fontWeight: "500",
              color: "#444444",
              padding: "5px 8px",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Add Additional Details
          </label>
          <textarea
            style={{
              width: "100%",
              height: "150px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "none",
              color: "#444444",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="You can also add additional details to help us investigate further."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width:isMobileWidth?'50%': "100%",
            padding: "12px",
            backgroundColor: "#4AEAB1",
            color: "black",
            border: "none",
            borderRadius: "25px",
            fontWeight: isMobileWidth?"500":"600",
            cursor: "pointer",
            fontSize: isMobileWidth?'14px':"16px",
            opacity: isSubmitting ? 0.7 : 1,
            marginBottom: "5px",
            margin: "0 auto",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>

       {isMobileWidth && (<span  style={{fontSize:'12px',textAlign:'center' ,marginTop:'10px'}}>
          You can also add the additional details to <br/>help us investigate further.
        </span>)}
      </form>
    </div>
  )}
</div>

  );
};

export default ReportBookingModal;


// import React, { useState, useRef, useEffect } from "react";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import useBook from "../../hooks/host/useBook";
// import { KEYS } from "../../config/Constant";
// import NotificationPopup from "../guest/bookingDetailsModal/NotificationPopup";
// import { isMoment } from "moment/moment";

// const CustomSelect = ({ value, onChange, options, hasError }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobileWidth, setIsMobileWidth] = useState(false);
//   const selectRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (selectRef.current && !selectRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
  
//     useEffect(() => {
//       const checkWindowWidth = () => {
//         setIsMobileWidth(window.innerWidth <= 768);
//       };
  
//       checkWindowWidth(); // run on mount
//       window.addEventListener("resize", checkWindowWidth);
  
//       return () => window.removeEventListener("resize", checkWindowWidth);
//     }, []);

//   const selectedOption =
//     options.find((opt) => opt.value === value) || options[0];

//   return (
//     <div ref={selectRef} style={{ position: "relative", width: "100%", }}   >
//       <div
//         style={{
//           width: "100%",
//           padding: "8px",
//           borderRadius: "5px",
//           border: hasError ? "1px solid red" : "1px solid #ccc",
//           color: "#444444",
//           cursor: "pointer",
//           backgroundColor: "white",
//           marginBottom: "15px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           fontSize:'15px'
         
//         }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {selectedOption.label}
//         <RiArrowDropDownLine
//           style={{
//             width:'25px',
//             height:'25px',
//             transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//             transition: "transform 0.2s ease",
//           }}
//         />
//       </div>

//       {isOpen && (
//         <div
//           style={{
//             position: "absolute",
//             top: "100%",
//             left: 0,
//             right: 0,
//             zIndex: 10,
//             backgroundColor: "white",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//             overflow: "hidden",
//             marginTop: "-25px",
//             boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.38)",
//             width: "97%",
//           }}
//         >
//           {options
//             .filter((opt) => !opt.disabled)
//             .map((option, index) => (
//               <React.Fragment key={option.value}>
//                 <div
//                   style={{
//                     padding: "8px",
//                     cursor: "pointer",
//                     color: "#444444",
//                     backgroundColor: "white",
//                     fontSize:"14px"
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.color = "#5EE6A0")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.color = "#444444")
//                   }
//                   onClick={() => {
//                     onChange({ target: { value: option.value } });
//                     setIsOpen(false);
//                   }}
//                 >
//                   {option.label}
//                 </div>
//                 {index < options.filter((opt) => !opt.disabled).length - 1 && (
//                   <div
//                     style={{
//                       height: "1px",
//                       backgroundColor: "#444444",
//                       opacity: 0.2,
//                       margin: "0 8px",
//                     }}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const ReportBookingModal = ({ show, handleClose, booking_id, property_id }) => {
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userType = localStorage.getItem("USER_TYPE");
//   const userId = userData?.user_id ? String(userData?.user_id) : null;

//   const { hostReportViolation, guestReportViolation } = useBook();

//   const [selectedReason, setSelectedReason] = useState("sel");
//   const [additionalDetails, setAdditionalDetails] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//  useEffect(() => {
//       const checkWindowWidth = () => {
//         setIsMobileWidth(window.innerWidth <= 768);
//       };
  
//       checkWindowWidth(); // run on mount
//       window.addEventListener("resize", checkWindowWidth);
  
//       return () => window.removeEventListener("resize", checkWindowWidth);
//     }, []);

//   const reportReasonIdMap = {
//     Inappropriate: 1,
//     Misleading: 2,
//     Spam: 3,
//     Harassment: 4,
//     Discrimination: 5,
//     Other: 6,
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedReason === "sel") {
//       setError(true);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         user_id: userId,
//         booking_id: booking_id,
//         property_id: property_id,
//         report_reasons_id: reportReasonIdMap[selectedReason],
//         additional_details: additionalDetails,
//       };
//       const submitResponse =
//         (await userType) === "guest"
//           ? guestReportViolation(payload)
//           : hostReportViolation(payload);

//       if (submitResponse) {
//         setShowPopup(true);
//       }
//     } catch (error) {
//       console.error("Error submitting report:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCloseAll = () => {
//     setShowPopup(false);
//     handleClose();
//     // Reset form
//     setSelectedReason("sel");
//     setAdditionalDetails("");
//     setError(false);
//   };

//   if (!show) return null;

//   return (
//     // <div
//     //   style={{
//     //     position: "fixed",
//     //     top: 0,
//     //     left: 0,
//     //     width: "100%",
//     //     height: "100%",
//     //     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     //     display: "flex",
//     //     justifyContent: "center",
//     //     alignItems: "center",
//     //     zIndex: 1000,
//     //   }}
//     // >
//     //   {showPopup ? (
//     //     <NotificationPopup onClose={handleCloseAll} />
//     //   ) : (
//     //     <div
//     //       style={{
//     //         backgroundColor: "white",
//     //         padding: "30px 40px",
//     //         borderRadius: "17px",
//     //         width: "80%",
//     //         maxWidth: "500px",
//     //         maxHeight: "100vh",
//     //         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//     //         position: "relative",
//     //         display: "flex",
//     //         flexDirection: "column",
//     //         margin: "10px",
//     //       }}
//     //     >
//     //       <button
//     //         onClick={handleClose}
//     //         style={{
//     //           position: "absolute",
//     //           top: "10px",
//     //           right: "10px",
//     //           background: "#2F3E46",
//     //           border: "none",
//     //           fontSize: "18px",
//     //           cursor: "pointer",
//     //           color: "white",
//     //           width: "35px",
//     //           height: "35px",
//     //           borderRadius: "50%",
//     //           display: "flex",
//     //           justifyContent: "center",
//     //           alignItems: "center",
//     //         }}
//     //       >
//     //         &times;
//     //       </button>

//     //       <h3
//     //         style={{
//     //           textAlign: "center",
//     //           marginBottom: "15px",
//     //           fontSize: "20px",
//     //           fontWeight: "bold",
//     //           color: "black",
//     //           marginTop: "5%",
//     //         }}
//     //       >
//     //         Report Violation
//     //       </h3>
//     //       <hr />

//     //       <form
//     //         onSubmit={handleSubmit}
//     //         style={{
//     //           display: "flex",
//     //           flexDirection: "column",
//     //           flex: 1,
//     //         }}
//     //       >
//     //         <div
//     //           style={{
//     //             display: "flex",
//     //             flexDirection: "column",
//     //             flex: 1,
//     //             border: "1px solid #ccc",
//     //             margin: "10px 0px 10px 0px",
//     //             padding: "10px",
//     //             paddingBottom: "1px",
//     //             borderRadius: "10px",
//     //           }}
//     //         >
//     //           <label
//     //             style={{
//     //               display: "block",
//     //               // color: "black",
//     //               marginBottom: "5px",
//     //               color: " #444444",
//     //               fontWeight: "600",
//     //               padding: "7px 12px",
//     //             }}
//     //           >
//     //             Please select a reason for reporting this user.
//     //           </label>

//     //           <CustomSelect
//     //             value={selectedReason}
//     //             onChange={(e) => {
//     //               setSelectedReason(e.target.value);
//     //               setError(false);
//     //             }}
//     //             options={[
//     //               { value: "sel", label: "Select", disabled: true },
//     //               { value: "Inappropriate", label: "Inappropriate Content" },
//     //               { value: "Misleading", label: "Misleading Information" },
//     //               { value: "Spam", label: "Spam or Scam" },
//     //               { value: "Harassment", label: "Harassment" },
//     //               { value: "Discrimination", label: "Discrimination" },
//     //               { value: "Other", label: "Other Issue" },
//     //             ]}
//     //             hasError={error}
//     //           />
//     //           {error && (
//     //             <p
//     //               style={{
//     //                 color: "red",
//     //                 fontSize: "12px",
//     //                 marginTop: "-10px",
//     //                 marginBottom: "15px",
//     //               }}
//     //             >
//     //               Please select a reason before submitting
//     //             </p>
//     //           )}

//     //           <label
//     //             style={{
//     //               display: "block",
//     //               // fontWeight: "bold",
//     //               marginBottom: "5px",
//     //               fontWeight: "600",
//     //               color: " #444444",
//     //               padding: "0 12px",
//     //             }}
//     //           >
//     //             Add Additional Details
//     //           </label>
//     //           <textarea
//     //             style={{
//     //               width: "100%",
//     //               height: "170px",
//     //               padding: "8px 12px",
//     //               borderRadius: "15px",
//     //               border: "1px solid #ccc",
//     //               marginBottom: "15px",
//     //               resize: "none",
//     //               color: " #444444",
//     //             }}
//     //             value={additionalDetails}
//     //             onChange={(e) => setAdditionalDetails(e.target.value)}
//     //             placeholder="You can also add additional details to help us investigate further."
//     //           />
//     //         </div>
//     //         <button
//     //           type="submit"
//     //           disabled={isSubmitting}
//     //           style={{
//     //             width: "100%",
//     //             padding: "10px",
//     //             backgroundColor: "#5EE6A0",
//     //             color: "black",
//     //             border: "none",
//     //             borderRadius: "20px",
//     //             fontWeight: "bold",
//     //             cursor: "pointer",
//     //             fontSize: "16px",
//     //             opacity: isSubmitting ? 0.7 : 1,
//     //           }}
//     //         >
//     //           {isSubmitting ? "Submitting..." : "Submit Report"}
//     //         </button>
//     //       </form>
//     //     </div>
//     //   )}
//     // </div>

//     <div
//   style={{
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding:isMobileWidth?"15px": "10px",
//     boxSizing: "border-box",
//     zIndex:9999
//   }}
// >
//   {showPopup ? (
//     <NotificationPopup onClose={handleCloseAll} />
//   ) : (
//     <div
//       style={{
//         backgroundColor: "white",
//         padding: "20px",
//         borderRadius: "15px",
//         width: "100%",
//         maxWidth: "500px",
//         maxHeight: "95vh",
//         overflowY: "auto",
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         boxSizing: "border-box",
       
//       }}
//     >
//       <button
//         onClick={handleClose}
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "10px",
//           background: "#2F3E46",
//           border: "none",
//           fontSize: "18px",
//           cursor: "pointer",
//           color: "white",
//           // width: isMobileWidth?"25px":"35px",
//           // height: isMobileWidth?"25px":"35px",
//           width: "20px",
//           height:"20px",
//           borderRadius: "50%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         &times;
//       </button>

//       <h3
//         style={{
//           textAlign: "center",
//           marginBottom: isMobileWidth ?"2px":"5px",
//           fontSize: isMobileWidth ?"18px":'28px',
//           fontWeight: "500",
//           color: "black",
//           marginTop: isMobileWidth ?"10px":"35px",
//         }}
//       >
//         Report Violation
//       </h3>
//       <hr style={{ marginBottom: "20px" }} />

//       <form
//         onSubmit={handleSubmit}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           flex: 1,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             flex: 1,
//             border: "1px solid #ccc",
//             marginBottom: "20px",
//             padding: "10px",
//             borderRadius: "10px",
//           }}
//         >
//           <label
//             style={{
//               color: "#444444",
//               fontWeight: "500",
//               padding: "5px 8px",
//               marginBottom: "8px",
//               fontSize: "14px",
//             }}
//           >
//             Please select a reason for reporting this user.
//           </label>

//           <CustomSelect
//             value={selectedReason}
//             onChange={(e) => {
//               setSelectedReason(e.target.value);
//               setError(false);
//             }}
//             options={[
//               { value: "sel", label: "Select", disabled: true },
//               { value: "Inappropriate", label: "Inappropriate Content" },
//               { value: "Misleading", label: "Misleading Information" },
//               { value: "Spam", label: "Spam or Scam" },
//               { value: "Harassment", label: "Harassment" },
//               { value: "Discrimination", label: "Discrimination" },
//               { value: "Other", label: "Other Issue" },
//             ]}
//             hasError={error}
//           />
//           {error && (
//             <p
//               style={{
//                 color: "red",
//                 fontSize: "12px",
//                 marginTop: "5px",
//                 marginBottom: "10px",
//               }}
//             >
//               Please select a reason before submitting
//             </p>
//           )}

//           <label
//             style={{
//               fontWeight: "500",
//               color: "#444444",
//               padding: "5px 8px",
//               marginBottom: "8px",
//               fontSize: "14px",
//             }}
//           >
//             Add Additional Details
//           </label>
//           <textarea
//             style={{
//               width: "100%",
//               height: "150px",
//               padding: "10px",
//               borderRadius: "10px",
//               border: "1px solid #ccc",
//               resize: "none",
//               color: "#444444",
//               fontSize: "14px",
//               boxSizing: "border-box",
//             }}
//             value={additionalDetails}
//             onChange={(e) => setAdditionalDetails(e.target.value)}
//             placeholder="You can also add additional details to help us investigate further."
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           style={{
//             width:isMobileWidth?'50%': "100%",
//             padding: "12px",
//             backgroundColor: "#5EE6A0",
//             color: "black",
//             border: "none",
//             borderRadius: "25px",
//             fontWeight: isMobileWidth?"500":"600",
//             cursor: "pointer",
//             fontSize: isMobileWidth?'14px':"16px",
//             opacity: isSubmitting ? 0.7 : 1,
//             marginBottom: "5px",
//             margin: "0 auto",
//           }}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Report"}
//         </button>

//        {isMobileWidth && (<span  style={{fontSize:'12px',textAlign:'center' ,marginTop:'10px'}}>
//           You can also add the additional details to <br/>help us investigate further.
//         </span>)}
//       </form>
//     </div>
//   )}
// </div>

//   );
// };

// export default ReportBookingModal;
