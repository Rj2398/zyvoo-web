import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import ForgotWithEmail from "./ForgotWithEmail";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import VerificationModal from "./VerificationModal";
import Loader from "../../Loader";
import { IoCheckmark, IoClose, IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { GoEye, GoEyeClosed } from "react-icons/go";

const EmailLoginModal = ({ show, handleClose, toggleModell }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const [toggleModel, setToggleModal] = useState(toggleModell);
  const { login_email, signup_email, isLoading } = useAuth();

  const [openForgotModal, setForgotModal] = useState(false);
  const [createPassword, setCreatePassword] = useState(null);
  const [createPasswordValue, setCreatePasswordValue] = useState("");
  const [veriModal, setVerifyModl] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [hasInput, setHasInput] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      const isMobileOrTablet = window.innerWidth <= 991;
      setIsMobileWidth(isMobileOrTablet);
    };

    checkWindowWidth(); // Check immediately on mount
    window.addEventListener("resize", checkWindowWidth);
    return () => {
      window.removeEventListener("resize", checkWindowWidth);
    };
  }, []);

  const encryptData = (data) => {
    return btoa(encodeURIComponent(data));
  };

  const decryptData = (data) => {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const savedCredentials = localStorage.getItem("zyvoCredentials");
    const remembermeValue = localStorage.getItem("remembermeValue");
    if (savedCredentials) {
      try {
        const { email, password } = JSON.parse(savedCredentials);
        setValue("email", email);
        setValue("password", decryptData(password));
        setRememberMe(true);
      } catch (error) {
        localStorage.removeItem("zyvoCredentials");
      }
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      if (rememberMe) {
        localStorage.setItem(
          "zyvoCredentials",
          JSON.stringify({
            email: data.email,
            password: encryptData(data.password),
          })
        );
      } else {
        sessionStorage.setItem(
          "zyvoCredentials",
          JSON.stringify({
            email: data.email,
            password: encryptData(data.password),
          })
        );
        localStorage.removeItem("zyvoCredentials");
        localStorage.removeItem("USER_INFO");
      }

      //       if (rememberMe) {
      //   localStorage.setItem(
      //     "zyvoCredentials",
      //     JSON.stringify({
      //       email: data.email,
      //       password: encryptData(data.password),
      //     })
      //   );

      //   sessionStorage.removeItem("zyvoCredentials");
      //   sessionStorage.removeItem("USER_INFO");
      // } else {
      //   sessionStorage.setItem("zyvoCredentials");
      //       localStorage.removeItem("USER_INFO");
      //       localStorage.removeItem("zyvoCredentials");
      // }

      //       if (rememberMe) {
      //   sessionStorage.setItem(
      //     "zyvoCredentials",
      //     JSON.stringify({
      //       email: data.email,
      //       password: encryptData(data.password),
      //     })
      //   );
      // } else {
      //   sessionStorage.removeItem("zyvoCredentials");
      //   sessionStorage.removeItem("USER_INFO");
      // }

      const response = toggleModel
        ? await login_email({
            rememberMe: rememberMe,
            payload: { email: data?.email, password: data?.password },
          })
        : await signup_email({
            email: data?.email,
            password: data?.password,
            fcm_token: "fg446654g6fdgg",
            device_type: "web",
          });
      if (response) {
        handleClose();

        if (toggleModel) {
          navigate("/");
        } else {
          setVerifyModl(true);
          setCreatePassword(data?.password);
        }
      }
    } catch (error) {}
  };

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          reset();
        }}
        centered
        dialogClassName="custom-modal"
      >
        <style>
          {`.custom-modal  {
              padding:5px !important;
            } 

            .custom-modal .modal-content {
              border-radius: 15px !important;
                padding:5px !important;
                height: ${isMobileWidth ? "490px" : ""} !important;
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
              font-size: 10px;           /* Adjust size of the cross */
              line-height: 1;            /* Center the cross */
              height: ${isMobileWidth ? "8px" : "10px"} !important;
              width: ${isMobileWidth ? "8px" : "10px"} !important;
            }
          `}
        </style>

        <Loader visible={isLoading} />
        <Modal.Header
          closeButton
          style={{ border: "none", paddingBottom: "0px" }}
        ></Modal.Header>

        <Modal.Title className="w-100 text-center pb-2 register-modal-header-title">
          {toggleModel ? "Login" : "Register Now"}
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

        <Modal.Body className="text-center">
          {toggleModel ? (
            <>
              <h3 className="register-modal-body-h3"> Welcome to Zyvo </h3>
              <p className="register-modal-body-p">
                Enter your email and Password to Login your account.
              </p>
            </>
          ) : (
            <>
              {/* <h3 style={{ fontSize: isMobileWidth ? "14px" : "20px" }}> */}
              <h3 className="register-modal-body-h3">Welcome to Zyvo</h3>{" "}
              {/* <p
                style={{
                  fontSize: isMobileWidth ? "13px" : "16px",
                  textAlign: "center", // centers text inside <p>
                  alignSelf: "center", // centers within flex parent (if any)
                  width: isMobileWidth ? "70%" : "100%", // limits line width for better readability
                  margin: "0 auto", // ensures horizontal centering when parent isn’t flex
                  color: "#333",
                  marginBottom: "10px",
                }}
              > */}
              <p className="register-modal-body-p">
                Enter your email to Register your account.
              </p>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-modal-label position-relative d-flex align-items-center">
              <img
                src="/images/popups/mail-input.svg"
                alt="Email Icon"
                className="position-absolute ms-2"
                style={{ left: "0px", height: isMobileWidth ? "30px" : "40px" }}
              />
              <input
                type="email"
                placeholder="Enter your email here"
                {...register("email", {
                  required: "Please enter your email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="form-control"
                style={{
                  height: isMobileWidth ? "40px" : "50px",
                  borderRadius: "40px",
                  paddingLeft: "60px",
                }}
              />
            </div>
            {errors.email && hasInput && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}

            {/* {errors.email && ( <p style={{ color: "red" }}>please enter a valid email address</p> )} */}

            <div className="custom-modal-label position-relative d-flex align-items-center mt-3">
              <img
                src="/images/popups/lock-input.svg"
                alt="Password Icon"
                className="position-absolute ms-2"
                style={{ left: "0px", height: isMobileWidth ? "30px" : "40px" }}
              />

              {toggleModel ? (
                <>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    {...register("password", {
                      required: "Please enter your password",
                      //    pattern: {
                      //   value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                      //   message: "Password must be at least 8 characters, include a number, an uppercase letter, and a special character",
                      // },
                    })}
                    className="form-control"
                    onChange={(e) => setHasInput(e.target.value.length > 0)} // track typing
                    style={{
                      height: isMobileWidth ? "40px" : "50px",
                      borderRadius: "40px",
                      paddingLeft: "60px",
                    }}
                  />

                  <style>
                    {` input::placeholder {
                        color: #6e6464ff !important; /* gray placeholder */
                        font-size: ${
                          isMobileWidth ? "13px" : "14px"
                        } !important;
                    }`}
                  </style>

                  {/* {hasInput && (
                    <div
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? <IoEye /> : <IoEyeOff />}
                    </div>
                  )} */}

                  <div
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <IoEye /> : <IoEyeOff />}
                  </div>
                </>
              ) : (
                <>
                  <input
                    type={createPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    {...register("password", {
                      required: "Please enter your password",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                        message:
                          "Password must be at least 8 characters, include a number, an uppercase letter, and a special character",
                      },
                    })}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("password", value);
                      setCreatePasswordValue(value);
                    }}
                    className="form-control"
                    style={{
                      height: isMobileWidth ? "40px" : "50px",
                      borderRadius: "40px",
                      paddingLeft: "60px",
                    }}
                  />
                  <style>
                    {`
                      input::placeholder {
                        color: #6e6464ff !important; /* gray placeholder */
                        font-size: ${
                          isMobileWidth ? "13px" : "14px"
                        } !important;
                      }
                    `}
                  </style>

                  <div
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      // backgroundColor: passwordRegex.test(createPasswordValue) ? "green" : "red",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    {/* {passwordRegex.test(createPasswordValue) ? ( <IoCheckmark /> ) : ( <IoClose /> )} */}
                    {createPassword ? (
                      <GoEye
                        color="black"
                        onClick={() => setCreatePassword(!createPassword)}
                      />
                    ) : (
                      <GoEyeClosed
                        color="black"
                        onClick={() => setCreatePassword(!createPassword)}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
            {errors.password && !hasInput && !errors.email && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}

            {errors.email && errors.password && !hasInput && (
              <p style={{ color: "red" }}>
                Please enter your email and password.
              </p>
            )}

            <div className="custom-modal-label mt-3">
              <Button
                type="submit"
                style={{
                  backgroundColor: "#4AEAB1",
                  borderRadius: "30px",
                  border: "none",
                  padding: isMobileWidth ? "" : "12px 0",
                  width: "100%",
                  fontSize: isMobileWidth ? "14px" : "16px",
                  fontWeight: isMobileWidth ? "500" : "600",
                  color: "black",
                  paddingTop: isMobileWidth ? "10px" : "",
                  paddingBottom: isMobileWidth ? "10px" : "",
                }}
              >
                {toggleModel ? "Login" : "Create Account"}
              </Button>
            </div>
          </form>

          <div
            className="keep-me-forgot mt-3"
            style={{ gap: isMobileWidth ? "2px" : "8px" }}
          >
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  marginRight: "5px",
                  cursor: "pointer",
                  appearance: "none",
                  border: "2px solid #4AEAB1",
                  borderRadius: "3px",
                  backgroundColor: rememberMe ? "#4AEAB1" : "transparent",
                  position: "relative",
                }}
              />
              Keep me logged
            </label>
            <a
              href="#"
              onClick={() => {
                setForgotModal(true);
                handleClose();
              }}
            >
              {toggleModel ? (
                <u
                  style={{
                    textDecoration: isMobileWidth ? "none" : "",
                    fontSize: isMobileWidth ? "12px" : "16px",
                  }}
                >
                  Forgot Password?
                </u>
              ) : (
                ""
              )}
            </a>
          </div>
          <hr />
          {toggleModel ? (
            <p
              className="text-black"
              style={{ fontSize: isMobileWidth ? "12px" : "" }}
            >
              Don't have an account?
            </p>
          ) : (
            <p
              className="text-black"
              style={{ fontSize: isMobileWidth ? "12px" : "" }}
            >
              Already have an account?
            </p>
          )}
          <div className="bottom-btn">
            <Button
              variant="link"
              onClick={() => setToggleModal(!toggleModel)}
              style={{
                textDecoration: "none",
                color: "black",
                border: "1px solid #B3B3B3",
                fontSize: isMobileWidth ? "14px" : "16px",
                fontWeight: "500",
                marginBottom: isMobileWidth ? "" : "16px",
              }}
            >
              {toggleModel ? "Register Now" : "Login Here"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <ForgotWithEmail
        show={openForgotModal}
        handleClose={() => {
          setForgotModal(false);
        }}
      />

      <VerificationModal
        show={veriModal}
        regiserMail={"regiserMail"}
        createPassword={createPassword}
        onHide={() => {
          setVerifyModl(false);
          reset();
        }}
      />
    </>
  );
};

export default React.memo(EmailLoginModal);
