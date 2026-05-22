import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import VerificationModal from "./OtpVerification";
import Loader from "../../Loader";

function UpdateEmail({ show, handleClose, USERID }) {
  const { update_email, isLoading } = useAuth();
  const [verificationByEmailModal, setVerifictionByEmailModal] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  const { register, handleSubmit, reset, formState: { errors }, } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await update_email({
        user_id: USERID,
        email: data?.email,
      });

      if (response) {
        handleClose();
        setVerifictionByEmailModal(true);
        setEmail(data?.email);
      }
    } catch (error) {
      console.error(error, "error code");
      setError(error.message);
    }

    reset();
  };

  const handleModalClose = () => {
    setError(null); 
    reset();
    handleClose(); 
  };

  const [isMobileWidth, setIsMobileWidth] = useState(false)
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="md" aria-labelledby="contained-modal-title-vcenter"
        centered dialogClassName="custom-modal" >
        <style> {` .custom-modal .modal-content { border-radius: 15px !important; } `} </style>
        <Loader visible={isLoading} />

        <Modal.Header closeButton style={{ border: "none", paddingBottom: "0px" }} >
          <style>
            {`
            .custom-modal .modal-content {
              border-radius: 15px !important;
              // margin: 0;
              padding:${ isMobileWidth ?"":"0 30px 20px 30px !important"};
                 margin: ${isMobileWidth ? "6.5px" : "0"};
                 
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

        <Modal.Title className="w-100 text-center register-modal-header-title" style={{ marginTop: "25px", marginBottom: "20px" }}> Verification </Modal.Title>

        <hr style={{
            width: "100%",
            display: "block",
            margin: "5px auto",
            border: "2px",
            borderTop: "1px solid #ddd",
            opacity: "1",
          }}
        />
        <Modal.Body className="text-center">
          <p className="register-modal-body-p">
            Enter your email for the verification process, we will send 4-digit code to your email address.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-modal-label  my-4">
              <label>
                <img src="/images/popups/mail-input.svg" loading="lazy" alt="Email Icon" />
                <input type="text" placeholder="Enter your email here" style={{fontSize : isMobileWidth ? "12px" : ""}}
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "please enter a valid email address",
                    },
                  })}
                  className="form-control input-placeholder"
                />
              </label>
            </div>
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="custom-modal-label mt-3 ">
              <Button type="submit" className=" register-modal-body-submit-btn">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <VerificationModal
        show={verificationByEmailModal}
        onHide={setVerifictionByEmailModal}
        verificationBy={"Verify_otp_email"}
        passEmail={email}
      />
    </>
  );
}

export default UpdateEmail;