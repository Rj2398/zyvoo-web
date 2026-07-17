import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import Loader from "../../Loader";
import VerificationDone from "./verfiedModal";
import useProfile from "../../../hooks/useProfile";
import OtpInput from "react-otp-input";
import { KEYS } from "../../../config/Constant";

function VerificationModal({
  show,
  onHide,
  veficationByEmailOpen,
  regiserMail,
  verificationBy,
  createPassword,
  passEmail,
  passPhone,
  conutryCode,
  verPhone,
  verEmail,
}) {
  const {
    formState: { errors },
  } = useForm();
  //
  const {
    registerUser,
    signup_email,
    forgot_password_email,
    verify_email_verification_otp,
    verify_phone_verification_otp,
    otp_verify_update_phone,
    update_email,
    otp_verify_update_email,
    isLoading,
  } = useAuth();
  const user = useSelector(
    (state) => state?.user?.userInfo || state?.user?.storeData
  );

  // const { userInfo } = useSelector(({ user }) => user)

  const { getUserProfile } = useProfile();

  const localSaved =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const login_id = user?.userInfo?.user_id
    ? String(user?.userInfo?.user_id)
    : null || localSaved?.user_id
    ? String(localSaved?.user_id)
    : null;
  //
  const [error, setError] = useState(null);

  const [otp, setOtp] = useState([]);
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [openVerificationDoneModal, setOpenVerificationDoneModal] =
    useState(false);
  const handleOTPSubmit = async (data) => {
    const param = { temp_id: user?.user_id || login_id, otp: otp };
    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter the 4-digit code.");
      return;
    }
    if (otp != user?.otp) {
      // setError("Incorrect OTP. Please try again!");
      setError("Incorrect verification code. Please try again!");
      return;
    }

    try {
      if (verificationBy === "verificationByEmail") {
        const responseMail = await verify_email_verification_otp({
          user_id: user?.user_id || login_id,
          otp: otp,
        });
        if (responseMail) {
          await getUserProfile({ user_id: user?.user_id || login_id });
          onHide();
          setOpenVerificationDoneModal(true);
        }
      }
      if (verificationBy === "verificationByPhone") {
        const emailResponse = await verify_phone_verification_otp({
          user_id: user?.user_id || login_id,
          otp: otp,
        });
        if (emailResponse) {
          await getUserProfile({ user_id: user?.user_id || login_id });
          onHide();
          setOpenVerificationDoneModal(true);
        }
      }
      if (verificationBy === "changeVerifyotp") {
        const changeRespnse = await otp_verify_update_phone({
          user_id: user?.user_id || login_id,
          otp: otp,
        });

        if (changeRespnse) {
          await getUserProfile({ user_id: user?.user_id || login_id });
          onHide();
          setOpenVerificationDoneModal(true);
        }
      }

      if (verificationBy === "Verify_otp_email") {
        const changeEmailVerify = await otp_verify_update_email({
          user_id: user?.user_id || login_id,
          otp: otp,
        });

        if (changeEmailVerify) {
          await getUserProfile({ user_id: user?.user_id || login_id });
          onHide();
          setOpenVerificationDoneModal(true);
        }
      }
    } catch (error) {
      console.error("Error submitting OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimeLeft(60);
    setCanResend(false);

    if (
      verificationBy === "Verify_otp_email" ||
      verificationBy === "verificationByPhone"
    ) {
      handleResendEmail();
    } else {
      resendApi();
    }
  };

  const handleResendEmail = async () => {
    if (verificationBy === "Verify_otp_email") {
      const response = await update_email({
        user_id: user?.user_id || login_id,
        email: passEmail,
      });
    } else if (verificationBy === "verificationByPhone") {
      const response = await registerUser({
        user_id: user?.user_id || login_id,
        email: passPhone,
        phone_number: passPhone,
        country_code: conutryCode,
      });
    }
  };

  useEffect(() => {
    if (show) {
      setTimeLeft(60);
      setCanResend(false);
      setOtp([]);
      setError("");
    }
  }, [show]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // api hit resend

  const resendApi = async () => {
    try {
      let user_num = user?.otp_send_to;
      const countryCodes = ["+91", "+1", "+44", "+61", "+971"];
      let country_code =
        countryCodes.find((code) => user_num.startsWith(code)) || "";

      let clean_num = country_code
        ? user_num.replace(country_code, "")
        : user_num;

      if (regiserMail === "regiserMail") {
        const emailResponse = await signup_email({
          email: user?.otp_send_to,
          password: createPassword,
          fcm_token: "fg446654g6fdgg",
          device_type: "web",
        });
      } else if (veficationByEmailOpen === "veficationByEmail") {
        const emailResponse = await forgot_password_email({
          email: user?.email,
        });
      } else {
        const response = await registerUser({
          phone_number: clean_num,
          country_code: conutryCode,
          fcm_token: "bfbfb498b4644",
          device_type: "web",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  const [isMobileWidth, setIsMobileWidth] = useState(false);
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
      >
        <style>
          {`
          .custom-modal .modal-dialog {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }

          .custom-modal .modal-content {
            border-radius: 15px !important;
            // width: ${isMobileWidth ? "100%" : "70%"};
            // margin-Left: ${isMobileWidth ? "0" : "185px"};
            padding: 10px 30px 25px 30px!important;
          }
        `}
        </style>
        <Loader visible={isLoading} />
        <Modal.Header
          closeButton
          className="profile-close-btn"
          style={{ border: "none", paddingBottom: "0px" }}
        >
          <style>
            {`
              .btn-close {
                width: 10px;               /* Small circle size */
                height: 10px;
                background-color: #000;    /* Black background */
                border-radius: 50%;        /* Circular shape */
                opacity: 1;                /* Ensures visibility */
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .btn-close::after {
                content: '×';             /* Cross symbol */
                color: #fff;               /* White cross color */
                font-weight: bold;
                font-size: 20px;           /* Adjust size of the cross */
                line-height: 1;            /* Center the cross */
                margin-top: -4px;
              }
            `}
          </style>
        </Modal.Header>

        <Modal.Title className="w-100 text-center register-modal-header-title mt-3">
          {" "}
          OTP Verification{" "}
        </Modal.Title>

        <hr
          style={{
            width: "100%",
            display: "block",
            margin: "5px auto",
            border: "2px",
            borderTop: "1px solid #ddd",
            opacity: "1",
          }}
        />
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0",
          }}
        >
          {passPhone ? (
            <p className="mb-3 mt-2 register-modal-body-p register-p-small">
              Please type the verification code sent {!isMobileWidth && <br />}{" "}
              to{" "}
              <b style={{ fontWeight: "600" }}>
                {conutryCode} {passPhone}
              </b>
            </p>
          ) : (
            <p className="mb-3 mt-2 register-modal-body-p register-p-small">
              Please type the verification code sent {!isMobileWidth && <br />}{" "}
              to <b>{user?.otp_send_to || user?.email}</b>
            </p>
          )}
          <div className="otp-grp">
            <OtpInput
              value={otp}
              inputType="number"
              numInputs={4}
              onChange={(data) => {
                setOtp(data);
                setError("");
              }}
              renderSeparator={<span> - </span>}
              renderInput={(props, index) => {
                const isFilled = otp[index] && otp[index] !== "";
                return (
                  <input
                    {...props}
                    style={{
                      width: "50px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "600",
                      borderRadius: "13px",
                      border: isFilled ? "none" : "1px solid #C4C4C4",
                      backgroundColor: isFilled ? "rgb(74, 234, 177)" : "white",
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  />
                );
              }}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="custom-modal-label mt-3 mb-3">
            <Button
              onClick={() => handleOTPSubmit(otp)}
              className="register-modal-body-submit-btn"
            >
              Submit
            </Button>
          </div>

          <p className="register-modal-body-p register-p-small">
            Didn't receive the verification code?{" "}
            <a
              onClick={handleResend}
              style={{
                color: canResend ? "#4AEAB1" : "gray",
                cursor: canResend ? "pointer" : "not-allowed",
                textDecoration: "none",
              }}
            >
              Resend
            </a>
          </p>
          {timeLeft > 0 && (
            <p className="mb-0 register-modal-body-p register-p-small">
              Resend verification code in{" "}
              <span style={{ color: "#4AEAB1" }}>
                {formatTime(timeLeft)} sec
              </span>
            </p>
          )}
        </Modal.Body>
      </Modal>
      {/* <VerificationDone show={openVerificationDoneModal} isMobileWidth={isMobileWidth}
        onHide={() => setOpenVerificationDoneModal(false)}
        text={passPhone ? "Your phone number has been changed successfully" : "Your email has been changed successfully"}
      /> */}
      <VerificationDone
        show={openVerificationDoneModal}
        isMobileWidth={isMobileWidth}
        onHide={() => setOpenVerificationDoneModal(false)}
        text={
          passPhone
            ? verPhone
              ? "Your Phone/Email has been verified!"
              : "Your phone number has been changed successfully"
            : verEmail
            ? "Your Phone/Email has been verified!"
            : "Your email has been changed successfully"
        }
        verPhone={verPhone}
        verEmail={verEmail}
      />
    </>
  );
}

export default VerificationModal;

// import React, { useState, useEffect } from "react";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import { useForm } from "react-hook-form";
// import useAuth from "../../../hooks/useAuth";
// import { useSelector } from "react-redux";
// import Loader from "../../Loader";
// import VerificationDone from "./verfiedModal";
// import useProfile from "../../../hooks/useProfile";
// import OtpInput from "react-otp-input";
// import { KEYS } from "../../../config/Constant";

// function VerificationModal({ show, onHide, veficationByEmailOpen, regiserMail, verificationBy,
//   createPassword, passEmail, passPhone, conutryCode, }) {
//   const { formState: { errors }, } = useForm();
//   //
//   const { registerUser, signup_email, forgot_password_email, verify_email_verification_otp,
//     verify_phone_verification_otp, otp_verify_update_phone, update_email, otp_verify_update_email,
//     isLoading, } = useAuth();

//   const {userInfo} = useSelector(({user})=>user)
//   const { getUserProfile } = useProfile();

//   const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const login_id =userInfo?.user_id ? String(userInfo?.user_id) : null|| localSaved?.user_id ? String(localSaved?.user_id) : null;
//   //
//   const [error, setError] = useState(null);

//   const [otp, setOtp] = useState([]);
//   const [canResend, setCanResend] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [openVerificationDoneModal, setOpenVerificationDoneModal] = useState(false);
//   const user = useSelector((state) => state?.user?.userInfo);
//   const handleOTPSubmit = async (data) => {
//     const param = { temp_id: user?.user_id || login_id, otp: otp, };
//     if (!/^\d{4}$/.test(otp)) {
//       setError("Please enter a valid 4-digit numeric OTP.");
//       return;
//     }
//     if (otp != user?.otp) {
//       setError("Incorrect OTP. Please try again!");
//       return;
//     }

//     try {
//       if (verificationBy === "verificationByEmail") {
//         const responseMail = await verify_email_verification_otp({
//           user_id: user?.user_id || login_id, otp: otp,
//         });
//         if (responseMail) {
//           await getUserProfile({ user_id: (user?.user_id || login_id) });
//           onHide();
//           setOpenVerificationDoneModal(true);
//         }
//       }
//       if (verificationBy === "verificationByPhone") {
//         const emailResponse = await verify_phone_verification_otp({
//           user_id: (user?.user_id || login_id),
//           otp: otp,
//         });
//         if (emailResponse) {
//           await getUserProfile({ user_id: (user?.user_id || login_id) });
//           onHide();
//           setOpenVerificationDoneModal(true);
//         }
//       }
//       if (verificationBy === "changeVerifyotp") {
//         const changeRespnse = await otp_verify_update_phone({
//           user_id: user?.user_id || login_id,
//           otp: otp,
//         });

//         if (changeRespnse) {
//           await getUserProfile({ user_id: user?.user_id || login_id });
//           onHide();
//           setOpenVerificationDoneModal(true);
//         }
//       }

//       if (verificationBy === "Verify_otp_email") {
//         const changeEmailVerify = await otp_verify_update_email({
//           user_id: user?.user_id || login_id,
//           otp: otp,
//         });

//         if (changeEmailVerify) {
//           await getUserProfile({ user_id: user?.user_id || login_id });
//           onHide();
//           setOpenVerificationDoneModal(true);
//         }
//       }
//     } catch (error) {
//       console.error("Error submitting OTP:", error);
//       setError("Failed to verify OTP. Please try again.");
//     }
//   };

//   const handleResend = () => {
//     if (!canResend) return;
//     setTimeLeft(120);
//     setCanResend(false);

//     if (verificationBy === "Verify_otp_email" || verificationBy === "verificationByPhone") {
//       handleResendEmail();
//     } else {
//       resendApi();
//     }
//   };

//   const handleResendEmail = async () => {
//     if (verificationBy === "Verify_otp_email") {
//       const response = await update_email({ user_id: user?.user_id || login_id, email: passEmail});
//     } else if (verificationBy === "verificationByPhone") {
//       const response = await registerUser({
//         user_id: user?.user_id || login_id,
//         email: passPhone,
//         phone_number: passPhone,
//         country_code: conutryCode,
//       });
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       setTimeLeft(120);
//       setCanResend(false);
//       setOtp([]);
//       setError(""); }
//   }, [show]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [timeLeft]);

//   // api hit resend

//   const resendApi = async () => {
//     try {
//       let user_num = user?.otp_send_to;
//       const countryCodes = ["+91", "+1", "+44", "+61", "+971"];
//       let country_code = countryCodes.find((code) => user_num.startsWith(code)) || "";

//       let clean_num = country_code ? user_num.replace(country_code, "") : user_num;

//       if (regiserMail === "regiserMail") {
//         const emailResponse = await signup_email({
//           email: user?.otp_send_to,
//           password: createPassword,
//           fcm_token: "fg446654g6fdgg",
//           device_type: "web",
//         });
//       } else if (veficationByEmailOpen === "veficationByEmail") {
//         const emailResponse = await forgot_password_email({
//           email: user?.email,
//         });
//       } else {
//         const response = await registerUser({
//           phone_number: clean_num,
//           country_code: conutryCode,
//           fcm_token: "bfbfb498b4644",
//           device_type: "web",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   function formatTime(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2,"0")}`;
//   }

//   const [isMobileWidth, setIsMobileWidth] = useState(false)
//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth();
//     window.addEventListener('resize', checkWindowWidth);

//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, []);

//   return (
//     <>
//       <Modal show={show} onHide={onHide} size="md" aria-labelledby="contained-modal-title-vcenter"
//         centered dialogClassName="custom-modal"  >
//         <style>
//           {`
//           .custom-modal .modal-dialog {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             min-height: 100vh;
//           }

//           .custom-modal .modal-content {
//             border-radius: 15px !important;
//             // width: ${isMobileWidth ? "100%" : "70%"};
//             // margin-Left: ${isMobileWidth ? "0" : "185px"};
//             padding: 10px 30px 25px 30px!important;
//           }
//         `}
//         </style>
//         <Loader visible={isLoading} />
//         <Modal.Header closeButton className="profile-close-btn"
//           style={{ border: "none", paddingBottom: "0px"}}>
//           <style>
//             {`
//               .btn-close {
//                 width: 10px;               /* Small circle size */
//                 height: 10px;
//                 background-color: #000;    /* Black background */
//                 border-radius: 50%;        /* Circular shape */
//                 opacity: 1;                /* Ensures visibility */
//                 position: relative;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//               }

//               .btn-close::after {
//                 content: '×';             /* Cross symbol */
//                 color: #fff;               /* White cross color */
//                 font-weight: bold;
//                 font-size: 20px;           /* Adjust size of the cross */
//                 line-height: 1;            /* Center the cross */
//                 margin-top: -4px;
//               }
//             `}
//           </style>
//         </Modal.Header>

//         <Modal.Title className="w-100 text-center register-modal-header-title mt-3"> OTP Verification </Modal.Title>

//         <hr style={{
//             width: "100%",
//             display: "block",
//             margin: "5px auto",
//             border: "2px",
//             borderTop: "1px solid #ddd",
//             opacity: "1",
//           }}
//         />
//         <Modal.Body
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             padding: "0",
//           }}
//         >
//           {passPhone ? (
//             <p className="mb-3 mt-2 register-modal-body-p register-p-small" >
//               Please type the verification code sent  {!isMobileWidth && <br />} to{" "}
//               <b style={{fontWeight : "600"}}>
//                 {conutryCode} {passPhone}
//               </b>
//             </p>
//           ) : (
//             <p className="mb-3 mt-2 register-modal-body-p register-p-small">
//               Please type the verification code sent {!isMobileWidth && <br />} to{" "}
//               <b>{user?.otp_send_to || user?.email}</b>
//             </p>
//           )}
//         <div className="otp-grp">
//           <OtpInput value={otp} inputType="number" numInputs={4}
//             onChange={(data) => {
//               setOtp(data);
//               setError("");
//             }}
//             renderSeparator={<span> - </span>}
//             renderInput={(props, index) => {
//               const isFilled = otp[index] && otp[index] !== "";
//               return (
//                 <input {...props} style={{
//                     width: "50px",
//                     height: "50px",
//                     textAlign: "center",
//                     fontSize: "20px",
//                     fontWeight:"600",
//                     borderRadius: "13px",
//                     border : isFilled ? "none" : "1px solid #C4C4C4",
//                     backgroundColor: isFilled ? "rgb(74, 234, 177)" : "white",
//                     transition: "background-color 0.2s ease-in-out",
//                   }}
//                 />
//               );
//             }}
//           />
//         </div>
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           <div className="custom-modal-label mt-3 mb-3">
//             <Button onClick={() => handleOTPSubmit(otp)} className="register-modal-body-submit-btn">
//               Submit
//             </Button>
//           </div>

//           <p className="register-modal-body-p register-p-small">
//             Didn't receive the verification code?{" "}
//             <a
//               onClick={handleResend}
//               style={{
//                 color: canResend ? "#4AEAB1" : "gray",
//                 cursor: canResend ? "pointer" : "not-allowed",
//                 textDecoration: "none",
//               }}
//             >
//               Resend
//             </a>
//           </p>
//           {timeLeft > 0 && (
//             <p className="mb-0 register-modal-body-p register-p-small">
//               Resend verification code in{" "}
//               <span style={{ color: "#4AEAB1" }}>
//                 {formatTime(timeLeft)} sec
//               </span>
//             </p>
//           )}
//         </Modal.Body>
//       </Modal>
//       <VerificationDone show={openVerificationDoneModal} isMobileWidth={isMobileWidth}
//         onHide={() => setOpenVerificationDoneModal(false)}
//         text={passPhone ? "Your phone number has been changed successfully" : "Your email has been changed successfully"}
//       />
//     </>
//   );
// }

// export default VerificationModal;
