import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import VerificationModal from "./VerificationModal";
import Loader from "../../Loader";
import { toast } from "react-toastify";

function ForgotWithEmail({ show, handleClose }) {
  const { forgot_password_email, isLoading } = useAuth();
  const [verificationByEmailModal, setVerifictionByEmailModal] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, } = useForm();

  const onSubmit = async (data) => {
    try {
      // setSubmittedEmail(data.email);//  store email here
      const response = await forgot_password_email({email: data?.email,});
      if (response) {
        reset();
        handleClose();
        setVerifictionByEmailModal(true);
      }
    } catch (error) {
      // toast.error(error?.email);
      toast.error("Account not found. Please register first.")
    }
  };

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      const isMobileOrTablet = window.innerWidth <= 768; // includes tablets
      setIsMobileWidth(isMobileOrTablet);
    };

    checkWindowWidth(); // Check immediately on mount
    window.addEventListener("resize", checkWindowWidth);
    return () => {
      window.removeEventListener("resize", checkWindowWidth);
    };
  }, []); 

  // const [submittedEmail, setSubmittedEmail] = useState("");

  return (
    <>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
        <style>
          {`
            .custom-modal .modal-content {
              border-radius: 15px !important;
            }
          `}
        </style>
        <Loader visible={isLoading} />
        <Modal.Header closeButton
          style={{
            border: "none",
            paddingBottom: "0px",
          }}
        >
          <style>
            {`
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

        <Modal.Title className="w-100 text-center modal-heading-title register-modal-header-title" style={{ paddingBottom: isMobileWidth ? "0px" : "17px" }}>
          Forgot Password
        </Modal.Title>

        <hr 
          style={{
            width: "93%",
            display: "block",
            margin: "5px auto",
            border: "2px",
            borderTop: "1px solid #ddd",
            opacity: "1",
          }}
        />

        <Modal.Body
          className="text-center"
          style={{ fontFamily: "poppins", paddingBottom: "30px" }}
        >
          <p className="register-modal-body-p" 
          // style={{ fontSize: "16px", color: "#000", marginBottom: "20px" }}
          >
            Enter your email for the verification process, we will send 4-digit code to your registered email.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-modal-label">
              <label>
                <img src="/images/popups/mail-input.svg" loading="lazy" alt="Email Icon" />
                <input type="text" placeholder="Enter your email here"
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "please enter a valid email address",
                    },
                  })}
                  className="form-control"  style={{fontSize: isMobileWidth ? "13px" : ""}}
                />
              </label>
            </div>
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}

            <div className="custom-modal-label mt-3">
              <Button
                type="submit"
                style={{
                  backgroundColor: "#4AEAB1",
                  borderRadius: "30px",
                  border: "none",
                  padding: "12px 0",
                  width: "100%",
                  fontSize: isMobileWidth ? "13px" : "16px",
                  fontWeight: "500",
                  color: "black",
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <VerificationModal
        show={verificationByEmailModal}
        onHide={setVerifictionByEmailModal}
        veficationByEmailOpen={"veficationByEmailOpen"}
        // forgotEmail={submittedEmail}
      />
    </>
  );
}

export default ForgotWithEmail;
