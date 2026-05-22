import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import VerificationModal from "./OtpVerification";
import Loader from "../../Loader";

function EmailVerification({ show, handleClose, USERID }) {
  const modalRef = useRef(null);
  const { send_email_verification_otp, isLoading } = useAuth();
  const [verificationByEmailModal, setVerifictionByEmailModal] = useState(false);
  const [error, setError] = useState(null);
  const emailVerified ="true";

  const {register, handleSubmit, reset, formState: { errors }} = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await send_email_verification_otp({
        user_id: USERID,
        email: data?.email,
      });
      if (response) {
        setVerifictionByEmailModal(true);
        handleClose();
      } else {
        setError(response?.data?.message);
      }
    } catch (error) {
      console.error(error?.response?.data?.message, "error code");
      setError(error?.response?.data?.message || error.message);
    }
    reset();
  };

  const handleModalClose = () => {
    setError(null); 
    reset();
    handleClose(); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleModalClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, handleModalClose]);

   const [isMobileWidth, setIsMobileWidth] = useState(false);
  
  useEffect(() => {
    const checkWindowWidth = () => {
    setIsMobileWidth(window.innerWidth <= 768);
    };
  
    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);
  
    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  return (
    <>
      {show && (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div ref={modalRef}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: isMobileWidth ? "6.5px" : "20px",
              width: "90%",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <Loader visible={isLoading} />

            <button onClick={handleModalClose}
              style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                background: "#3A4B4C",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                width: "25px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                lineHeight: 1,
              }}
            >
              &times;
            </button>

            <div style={{ padding: "20px", textAlign: "center" }}>
              <h5 className="w-100 text-center register-modal-header-title mb-4" >
                Verification
              </h5>
              <hr />
              <p className="register-modal-body-p register-p-small py-2">
                Enter your email for the verification process, we will send 4-digit code to your email address.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="custom-modal-label">
                  <label>
                    <img src="/images/popups/mail-input.svg" loading="lazy" alt="Email Icon" />
                    <input type="text" placeholder="Enter your email here"
                      {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        }, required: "Email is required",
                      })}
                      className="form-control"
                    />
                  </label>
                </div>
                {errors.email && (
                  <p className="register-modal-body-p register-p-small pt-2" style={{ color: "red" }}>{errors.email.message}</p>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="custom-modal-label mt-3">
                  <Button type="submit" className=" register-modal-body-submit-btn"
                    // style={{
                    //   backgroundColor: "#4AEAB1",
                    //   borderRadius: "30px",
                    //   border: "none",
                    //   padding: "12px 0",
                    //   width: "100%",
                    //   fontSize: "16px",
                    //   fontWeight: "bold",
                    //   color: "black",
                    // }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <VerificationModal show={verificationByEmailModal} 
        onHide={() => setVerifictionByEmailModal(false)}
        verificationBy={"verificationByEmail"}
        verEmail = {emailVerified}
      />
    </>
  );
}

export default EmailVerification;
