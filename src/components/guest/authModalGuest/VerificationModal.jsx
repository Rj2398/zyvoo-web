import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import Loader from "../../Loader";
import { toast } from "react-toastify";

function VerificationModal({
  show,
  onHide,
  LoginVerification,
  veficationByEmailOpen,
  regiserMail,
  createPassword,
  resend,
  countryCodes,
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // useEffect(() => {
  //   reset({otp0: "", otp1: "", otp2: "", otp3: "",});
  //   setError("");
  // }, [show, reset]);
  // ------------added by sunil---------

  useEffect(() => {
    if (show) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [show]);

  const {
    numOtpVerify,
    registerUser,
    otp_verify_login_phone,
    otp_verify_forgot_password,
    otp_verify_signup_email,
    signup_email,
    forgot_password_email,
    LoginWithPhone,
    isLoading,
  } = useAuth();

  const [error, setError] = useState(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(true);

  const [timeLeft, setTimeLeft] = useState();
  const timerRef = useRef(null);
  const [resentModal, setResentModal] = useState(false);
  const [hasResent, setHasResent] = useState(false);

  // const user = useSelector((state) => state?.user?.userInfo);
  const user = useSelector((state) => state.user.storeData);
  // console.log(user,"log user daa comes");

  const handleOTPSubmit = async (data) => {
    const otp = `${data?.otp0}${data?.otp1}${data?.otp2}${data?.otp3}`;

    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter the 4-digit code.");
      return;
    }
    if (otp != user?.otp) {
      // setError("Incorrect OTP. Please try again.");
      setError("Incorrect verification code. Please try again!");
      return;
    }

    try {
      if (regiserMail === "regiserMail") {
        const responseMail = await otp_verify_signup_email({
          temp_id: user?.temp_id,
          otp: otp,
        });
        if (responseMail) {
          onHide();
          navigate("/create-profile", { state: responseMail });
        }
      } else if (veficationByEmailOpen === "veficationByEmailOpen") {
        const emailResponse = await otp_verify_forgot_password({
          user_id: user?.user_id,
          otp: otp,
        });
        if (emailResponse) {
          setResentModal(true);
          onHide();
        }
      } else {
        const response = LoginVerification
          ? await otp_verify_login_phone({
              // user_id: user?.user_id,
              user_id: user?.temp_id || localStorage.getItem("user_id"),
              otp: otp,
            })
          : await numOtpVerify({ temp_id: user?.temp_id, otp: otp });

        if (response) {
          if (LoginVerification) {
            if (response?.is_profile_complete == false) {
              navigate("/create-profile", { state: response });
              setError("");
            } else {
              navigate("/");
              setError("");
              onHide();
            }
          } else {
            navigate("/create-profile", { state: response });
            setError("");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    }

    reset();
  };

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    let newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
    if (e.nativeEvent.inputType === "deleteContentBackward" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeLeft(60);
    setCanResend(false);
    setHasResent(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          setHasResent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleResend = (e) => {
    e.preventDefault();
    if (!canResend) return;

    setHasResent(true);
    startTimer();

    if (veficationByEmailOpen === "veficationByEmailOpen") {
      handleForgotPasswordEmail();
    } else {
      resendApi();
    }
  };

  const handleForgotPasswordEmail = async () => {
    try {
      const email = user?.email;
      if (!email) {
        console.warn("User email is missing.");
        return;
      }
      const emailResponse = await forgot_password_email({ email });
    } catch (error) {
      console.error("Error in forgot password email API:", error);
    }
  };

  const resendApi = async () => {
    try {
      const user_num = user?.otp_send_to || "";
      if (!user_num) {
        console.warn("User number (otp_send_to) is missing.");
        return;
      }
      const clean_num = countryCodes
        ? user_num.replace(countryCodes, "")
        : user_num;
      if (regiserMail === "regiserMail") {
        const emailResponse = await signup_email({
          email: user?.otp_send_to,
          password: createPassword,
          fcm_token: "fg446654g6fdgg",
          device_type: "web",
        });

        if (emailResponse) {
          toast.success(
            emailResponse?.message ||
              emailResponse?.data?.message ||
              "OTP resent successfully."
          );
        }
      } else {
        if (resend) {
          const response = await registerUser({
            phone_number: clean_num,
            country_code: countryCodes,
            fcm_token: "bfbfb498b4644",
            device_type: "web",
          });
          if (response.success) {
            toast.success(
              response?.message ||
                response?.data?.message ||
                "OTP resent successfully."
            );
          }
        } else {
          const response = await LoginWithPhone({
            phone_number: clean_num,
            country_code: countryCodes,
          });
          toast.success(
            response?.message ||
              response?.data?.message ||
              "OTP resent successfully."
          );
        }
      }
    } catch (error) {
      console.error("Error in resendApi:", error);
    }
  };

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalToggleValue, setModalToggleValue] = useState(false);
  const [registerModal, setRegisterModal] = useState(true);

  const handleModalToggle = (modalType, state) => {
    if (modalType == "register") setIsRegisterModalOpen(state);
    if (modalType == "login") setIsLoginModalOpen(state);
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");

    const match = digits.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return number;
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

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
          {" "}
          {` .custom-modal .modal-content { border-radius: 15px !important;  padding: 0 20px !important;} `}{" "}
        </style>

        <Loader visible={isLoading} />
        <Modal.Header
          closeButton
          style={{ border: "none", paddingBottom: "0px" }}
        >
          <style>
            {`
            .custom-modal .modal-content {
              border-radius: 15px !important;
            }
            .btn-close {
              width: 10px;               /* Small circle size */
              height: 10px;
              background: #3A4B4C;    /* Black background */
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
              font-weight: 500;
              font-size: 20px;           /* Adjust size of the cross */
              line-height: 1;            /* Center the cross */
            }
          `}
          </style>
        </Modal.Header>

        <Modal.Title className="w-100 text-center mt-4 mb-2 register-modal-header-title">
          OTP Verification
        </Modal.Title>

        <hr
          style={{
            width: "90%",
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
            paddingBottom: "30px",
            color: "black",
          }}
        >
          <p className="mb-3 register-modal-body-p">
            {" "}
            Please type the verification code send <br /> to{" "}
            <b style={{ fontWeight: "500" }}>
              {formatPhoneNumber(user?.otp_send_to || user?.email)}
            </b>
          </p>

          <form
            className="mb-3"
            onSubmit={handleSubmit(handleOTPSubmit)}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              className="otp-verification-code register-modal-body-p"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              {[0, 1, 2, 3]?.map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="otp-verification-code-in"
                  {...register(`otp${index}`)}
                  onInput={(e) => handleInput(e, index)}
                  onChange={(e) => {
                    e.target.style.backgroundColor = e.target.value
                      ? "#4AEAB1"
                      : "white";
                    e.target.style.color = e.target.value ? "#000" : "#C4C4C4";
                    e.target.style.border = e.target.value ? "none" : "";
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
              ))}
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="custom-modal-label mt-3">
              <Button type="submit" className="register-modal-body-submit-btn">
                Submit
              </Button>
            </div>
          </form>
          <p className="register-modal-body-p">
            Didn't receive the verification code?{" "}
            <Link
              to="#"
              onClick={handleResend}
              style={{
                color: canResend ? "#4AEAB1" : "#686868",
                cursor: canResend ? "pointer" : "not-allowed",
                textDecoration: "none",
                fontWeight: canResend ? "600" : "normal",
              }}
            >
              Resend
            </Link>
          </p>
          {/* {hasResent && (
            <p className="mb-0 register-modal-body-p">
              Resend verification code in{" "}
              <span style={{ color: "#4AEAB1" }}>{formatTime( timeLeft)} sec</span>
            </p>
          )} */}
          {/* // ------------added by sunil--------- */}
          {timeLeft > 0 && !canResend && (
            <p className="mb-0 register-modal-body-p">
              Resend verification code in{" "}
              <span style={{ color: "#4AEAB1" }}>
                {formatTime(timeLeft)} sec
              </span>
            </p>
          )}
        </Modal.Body>
      </Modal>
      <ResetPassword
        show={resentModal}
        handleClose={() => {
          setResentModal(false);
          handleModalToggle("login", true);
        }}
      />
    </>
  );
}
export default VerificationModal;

// import React, { useState, useEffect, useRef } from "react";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import { useForm } from "react-hook-form";
// import useAuth from "../../../hooks/useAuth";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import ResetPassword from "./ResetPassword";
// import Loader from "../../Loader";
// import { toast } from "react-toastify";

// function VerificationModal({ show, onHide, LoginVerification, veficationByEmailOpen, regiserMail, createPassword, resend, countryCodes, forgotEmail}) {

//   const navigate = useNavigate();
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   useEffect(() => {
//     reset({otp0: "", otp1: "", otp2: "", otp3: "",});
//     setError("");
//   }, [show, reset]);

//   const { numOtpVerify, registerUser, otp_verify_login_phone, otp_verify_forgot_password, otp_verify_signup_email, signup_email, forgot_password_email, LoginWithPhone, isLoading, } = useAuth();

//   const [error, setError] = useState(null);
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [canResend, setCanResend] = useState(true);

//   const [timeLeft, setTimeLeft] = useState();
//   const timerRef = useRef(null);
//   const [resentModal, setResentModal] = useState(false);
//   const [hasResent, setHasResent] = useState(false);

//   const user = useSelector((state) => state?.user?.userInfo);
//   const otpApi = useSelector((state) => state?.user?.otp);

//   console.log("otpApi111",otpApi)

//   const handleOTPSubmit = async (data) => {
//     const otp = `${data?.otp0}${data?.otp1}${data?.otp2}${data?.otp3}`;

//     if (!/^\d{4}$/.test(otp)) {
//       setError("Please enter the 4-digit code.");
//       return;
//     }
//     // if (otp != user?.otp) {
//     //   setError("Incorrect verification code. Please try again!");
//     //   return;
//     // }

//     if (otp != otpApi?.otp) {
//       // setError("Incorrect OTP. Please try again.");
//       setError("Incorrect verification code. Please try again!");
//       return;
//     }

//     try {
//       if (regiserMail === "regiserMail") {
//         const responseMail = await otp_verify_signup_email({
//           temp_id: user?.temp_id,
//           // temp_id: user?.user_id,
//           otp: otp,
//           // otp: otpApi?.otp,
//         });
//         if (responseMail) {
//           onHide();
//           navigate("/create-profile", { state: responseMail });
//         }
//       } else if (veficationByEmailOpen === "veficationByEmailOpen") {
//         const emailResponse = await otp_verify_forgot_password({
//           user_id: otpApi?.user_id,
//           otp: otp,
//         });
//         if (emailResponse) {
//           setResentModal(true);
//           onHide();
//         }
//       } else {
//         const response = LoginVerification
//           ? await otp_verify_login_phone({
//               user_id: user?.user_id,
//               otp: otp,
//             })
//           : await numOtpVerify({ temp_id: user?.temp_id, otp: otp });

//         if (response) {
//           if (LoginVerification) {
//             navigate("/");
//             setError("");
//             onHide();
//           } else {
//             navigate("/create-profile", { state: response });
//             setError("");
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error submitting OTP:", error);
//       setError("Failed to verify OTP. Please try again.");
//     }
//   };

//   const handleInput = (e, index) => {
//     const value = e.target.value;

//     if (!/^\d$/.test(value) && value !== "") {
//       e.target.value = "";
//       return;
//     }

//     let newOtp = [...otp];

//     newOtp[index] = value;

//     setOtp(newOtp);
//     if (value && index < 3) {
//       document.getElementById(`otp-${index + 1}`).focus();
//     }
//     if (e.nativeEvent.inputType === "deleteContentBackward" && index > 0) {
//       document.getElementById(`otp-${index - 1}`).focus();
//     }
//   };

//   const startTimer = () => {
//     if (timerRef.current) clearInterval(timerRef.current);

//     setTimeLeft(60);
//     setCanResend(false);
//     setHasResent(true)
//     timerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           setCanResend(true);
//           setHasResent(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   useEffect(() => {
//     startTimer();
//     return () => clearInterval(timerRef.current);
//   }, []);

//   const handleResend = (e) => {
//     e.preventDefault();
//     if (!canResend) return;

//     setHasResent(true);
//     startTimer();

//     if (veficationByEmailOpen === "veficationByEmailOpen") {
//       handleForgotPasswordEmail();
//     } else {
//       resendApi();
//     }
//   };

//   const handleForgotPasswordEmail = async () => {
//     try {
//       const email = forgotEmail || user?.email;
//       if (!email) {
//         console.warn("User email is missing.");
//         return;
//       }
//       const emailResponse = await forgot_password_email({ email });
//     } catch (error) {
//       console.error("Error in forgot password email API:", error);
//     }
//   };

//   const resendApi = async () => {
//     try {
//       const user_num = user?.otp_send_to || "";
//       if (!user_num) {
//         console.warn("User number (otp_send_to) is missing.");
//         return;
//       }
//       const clean_num = countryCodes
//         ? user_num.replace(countryCodes, "")
//         : user_num;
//       if (regiserMail === "regiserMail") {
//         const emailResponse = await signup_email({
//           email: user?.otp_send_to,
//           password: createPassword,
//           fcm_token: "fg446654g6fdgg",
//           device_type: "web",
//         });

//         if (emailResponse) {
//           toast.success(emailResponse?.message || emailResponse?.data?.message || "OTP resent successfully.")
//         }
//       } else {
//         if (resend) {
//           const response = await registerUser({
//             phone_number: clean_num,
//             country_code: countryCodes,
//             fcm_token: "bfbfb498b4644",
//             device_type: "web",
//           });
//           if (response.success) {
//             toast.success(response?.message || response?.data?.message || "OTP resent successfully.")
//           }
//         } else {
//           const response = await LoginWithPhone({
//             phone_number: clean_num,
//             country_code: countryCodes,
//           });
//           toast.success(response?.message || response?.data?.message || "OTP resent successfully.")
//         }
//       }
//     } catch (error) {
//       console.error("Error in resendApi:", error);
//     }
//   };

//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [modalToggleValue, setModalToggleValue] = useState(false);
//   const [registerModal, setRegisterModal] = useState(true);

//   const handleModalToggle = (modalType, state) => {
//     if (modalType == "register") setIsRegisterModalOpen(state);
//     if (modalType == "login") setIsLoginModalOpen(state);
//   };

//   const formatPhoneNumber = (number) => {
//     if (!number) return "";
//     const digits = number.replace(/\D/g, "");

//     const match = digits.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
//     if (match) {
//       return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
//     }
//     return number;
//   };

//   function formatTime(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2,"0")}`;
//   }

//   return (
//     <>
//       <Modal show={show} onHide={onHide} size="md" aria-labelledby="contained-modal-title-vcenter"
//         centered dialogClassName="custom-modal" >
//         <style> {` .custom-modal .modal-content { border-radius: 15px !important;  padding: 0 20px !important;} `} </style>

//         <Loader visible={isLoading} />
//         <Modal.Header closeButton style={{ border: "none", paddingBottom: "0px"}}>
//           <style>
//             {`
//             .custom-modal .modal-content {
//               border-radius: 15px !important;
//             }
//             .btn-close {
//               width: 10px;               /* Small circle size */
//               height: 10px;
//               background: #3A4B4C;    /* Black background */
//               border-radius: 50%;        /* Circular shape */
//               opacity: 1;                /* Ensures visibility */
//               position: relative;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//             }

//             .btn-close::after {
//               content: '×';             /* Cross symbol */
//               color: #fff;               /* White cross color */
//               font-weight: 500;
//               font-size: 20px;           /* Adjust size of the cross */
//               line-height: 1;            /* Center the cross */
//             }
//           `}
//           </style>
//         </Modal.Header>

//         <Modal.Title className="w-100 text-center mt-4 mb-2 register-modal-header-title">
//           OTP Verification
//         </Modal.Title>

//         <hr style={{
//             width: "90%",
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
//             paddingBottom: "30px",
//             color:"black"
//           }}
//         >
//           <p className="mb-3 register-modal-body-p">
//             {" "}
//             Please type the verification code send <br /> to{" "}
//             <b style={{fontWeight: "500"}}>{formatPhoneNumber(user?.otp_send_to || user?.email || forgotEmail)}</b>
//             {/* <b style={{fontWeight: "500"}}>{formatPhoneNumber(forgotEmail)}</b> */}
//           </p>

//           <form className="mb-3" onSubmit={handleSubmit(handleOTPSubmit)}
//             style={{
//               width: "100%",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }} >
//             <div className="otp-verification-code register-modal-body-p"
//               style={{
//                 display: "flex",
//                 gap: "10px",
//                 justifyContent: "center",
//                 marginBottom: "10px",
//               }}
//             >
//               {[0, 1, 2, 3]?.map((index) => (
//                 <input key={index} id={`otp-${index}`} type="text" inputMode="numeric"
//                   pattern="[0-9]*" maxLength={1} className="otp-verification-code-in"
//                   {...register(`otp${index}`)}
//                   onInput={(e) => handleInput(e, index)}
//                   onChange={(e) => {
//                     e.target.style.backgroundColor = e.target.value ? "#4AEAB1" : "white";
//                     e.target.style.color = e.target.value ? "#000" : "#C4C4C4";
//                     e.target.style.border = e.target.value ? "none" : "";
//                   }}
//                   onKeyDown={(e) => {
//                     if (["e", "E", "+", "-", "."].includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   onPaste={(e) => {
//                     e.preventDefault();
//                   }}
//                 />
//               ))}
//             </div>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <div className="custom-modal-label mt-3">
//               <Button type="submit" className="register-modal-body-submit-btn">
//                 Submit
//               </Button>
//             </div>
//           </form>
//           <p className="register-modal-body-p">
//             Didn't receive the verification code?{" "}
//             <Link
//               to="#"
//               onClick={handleResend}
//               style={{
//                 color: canResend ? "#4AEAB1" : "#686868",
//                 cursor: canResend ? "pointer" : "not-allowed",
//                 textDecoration: "none",
//                 fontWeight: canResend ? "600" : "normal",
//               }}
//             >
//               Resend
//             </Link>
//           </p>
//           {hasResent && (
//             <p className="mb-0 register-modal-body-p">
//               Resend verification code in{" "}
//               <span style={{ color: "#4AEAB1" }}>{formatTime( timeLeft)} sec</span>
//             </p>
//           )}
//         </Modal.Body>
//       </Modal>
//       <ResetPassword
//         show={resentModal}
//         handleClose={() => {
//           setResentModal(false);
//           handleModalToggle("login", true);
//         }}
//       />
//     </>
//   );
// }
// export default VerificationModal;
