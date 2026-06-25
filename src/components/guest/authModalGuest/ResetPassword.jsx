import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import Loader from "../../Loader";
import { CheckCircle } from "react-bootstrap-icons";

const ResetPassword = ({ show, handleClose }) => {
  const user = useSelector((state) => state?.user?.storeData);
  const { reset_password, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const passwordsMatch = password === confirmPassword && password.length >= 6;

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data) => {
    if (passwordsMatch) {
      try {
        await reset_password({
          user_id: user?.user_id,
          password: data.password,
          password_confirmation: data.confirmPassword,
        });
        handleClose();
        setShowSuccess(true);
      } catch (error) {
        console.error("Password reset failed:", error);
      }
    }
  };

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
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <style>
          {` .custom-modal .modal-content { border-radius: 15px !important;
          padding: ${isMobileWidth ? "10px" : ""};
          
          } `}
        </style>
        <Loader visible={isLoading} />

        <Modal.Header
          closeButton
          style={{ border: "none", paddingBottom: "0px" }}
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

        <Modal.Title
          className="w-100 text-center register-modal-header-title"
          style={{ paddingBottom: isMobileWidth ? "0" : "17px" }}
        >
          New Password
        </Modal.Title>

        <hr
          style={{
            width: "90%",
            display: "block",
            margin: "5px auto",
            borderTop: "1px solid #ddd",
            opacity: "1",
          }}
        />

        <Modal.Body className="text-center" style={{ paddingBottom: "30px" }}>
          <p className="register-modal-body-p">Enter your new password here</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="custom-modal-label mb-3"
              style={{ position: "relative" }}
            >
              <label
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <img
                  src="/images/popups/lock-input.svg"
                  loading="lazy"
                  alt="Password Icon"
                  style={{ marginRight: "10px" }}
                />

                <input
                  type="password"
                  placeholder="Enter password"
                  className="form-control "
                  style={{ flex: 1, fontSize: isMobileWidth ? "13px" : "" }}
                  {...register("password", {
                    required: "Enter password",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {passwordsMatch && (
                  <CheckCircle
                    size={24}
                    color="green"
                    style={{ position: "absolute", right: "10px" }}
                  />
                )}
              </label>
            </div>

            {/* {errors.password && (<p style={{ color: "red" }}>{errors.password.message}</p>)} */}

            <div
              className="custom-modal-label"
              style={{ position: "relative" }}
            >
              <label
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <img
                  src="/images/popups/lock-input.svg"
                  loading="lazy"
                  alt="Confirm Password Icon"
                  style={{ marginRight: "10px" }}
                />

                <input
                  type="password"
                  placeholder="Enter Confirm password"
                  className="form-control"
                  style={{ flex: 1, fontSize: isMobileWidth ? "13px" : "" }}
                  {...register("confirmPassword", {
                    required: "Enter confirm password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />

                {passwordsMatch && (
                  <CheckCircle
                    size={24}
                    color="green"
                    style={{ position: "absolute", right: "10px" }}
                  />
                )}
              </label>
            </div>

            {/* {errors.confirmPassword && (
              <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
              // <p style={{ color: "red" }}>Please enter your new password</p>
            )} */}
            {/* {errors.confirmPassword && errors.password && (
              // <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
              <p style={{ color: "red" }}>Please enter your new password</p>
            )} */}

            {errors.password && (
              <p
                style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}
              >
                {errors.password.message}
              </p>
            )}

            {errors.confirmPassword && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.confirmPassword.message}
              </p>
            )}

            <div className="custom-modal-label mt-3">
              <Button type="submit" className="register-modal-body-submit-btn">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "380px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "#2D3E3F",
                color: "white",
                border: "none",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {" "}
              ✕{" "}
            </button>

            <h2 className="register-modal-header-title">Success</h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                border: isMobileWidth ? "1px solid #4AEAB1" : "",
                width: isMobileWidth ? "50px" : "100px",
                height: isMobileWidth ? "50px" : "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "15px 0",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <svg
                width={isMobileWidth ? "24" : "48"}
                height="37.65"
                viewBox="0 0 48 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 20L16 34L46 2"
                  stroke="#4AEAB1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              className="register-modal-body-p"
              style={{ color: "#333", fontSize: "14px", marginBottom: "20px" }}
            >
              {" "}
              Your password has been changed successfully.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="register-modal-body-submit-btn"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
