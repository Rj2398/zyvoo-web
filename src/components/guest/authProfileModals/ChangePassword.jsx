import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../Loader";
import { KEYS } from "../../../config/Constant";
import { IoCheckmark, IoClose } from "react-icons/io5"; // instead of IoEye/IoEyeOff
import { useSelector } from "react-redux";

const ChangePassword = ({show, handleClose, showChangePasswordModal, setShowChangePasswordModal, setShowSuccess, }) => {
  const {userInfo} = useSelector(({user})=>user)

 
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  
  const userId = userInfo?.user_id ? String(userInfo?.user_id) : null||userData?.user_id ? String(userData?.user_id) : null;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  const [passwordValue, setPasswordValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const { updatePassword, isLoading } = useAuth();

         const [isMobileWidth, setIsMobileWidth] = useState(false)
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);


  const { register, handleSubmit, formState: { errors, touchedFields, isSubmitted }, watch, reset, } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await updatePassword({
        user_id: userId,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      if (response) {
        reset();
        setShowChangePasswordModal(!showChangePasswordModal);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <>
      {show && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} >
          <Loader visible={isLoading} />
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px", margin: "auto",padding:isMobileWidth ? '10px' :"" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title w-100 text-center register-modal-header-title">New Password</h5>
                <button type="button"
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "10px",
                    background: "#3A4B4C",
                    color: "white",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    borderRadius: "100%",
                    lineHeight: "40px",
                    textAlign: "center",
                    paddingBottom: "20px",
                  }}
                  onClick={handleClose}
                >
                  &times;
                </button>
              </div>
              <div className="w-100 modal-body text-center register-modal-body-p">
                <p>Enter your new password here</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="custom-modal-label" style={{ marginBottom: "10px" }}>
                    <label style={{ position: "relative", display: "block" }}>
                      <img src="/images/popups/lock-input.svg" loading="lazy" alt="Password Icon"
                        style={{
                          position: "absolute",
                          left: "5px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...register("password", {
                          required: "Enter password",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                          pattern: {
                            value: passwordRegex,
                            message:
                              "Password must contain uppercase, number, and special character",
                          },
                        })}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="form-control register-modal-input-box"
                      />
                      {passwordValue?.length > 0 && <span
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          backgroundColor: passwordRegex.test(passwordValue)
                            ? "green"
                            : "red",
                          color: "#fff",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {passwordRegex.test(passwordValue) ? (
                          <IoCheckmark />
                        ) : (
                          <IoClose />
                        )}
                      </span>}
                    </label>
                  </div>
                  {errors.password &&
                    (touchedFields.confirmPassword || isSubmitted) && (
                      // <p style={{ color: "red" }}>{errors.password.message}</p>
                           <p style={{ color: "red" }}> Enter password</p>
                    )}
                  <div className="custom-modal-label" style={{ position: "relative" }}>
                    <label>
                      <img src="/images/popups/lock-input.svg" loading="lazy" alt="Confirm Password Icon"/>
                      <input type={showConfirmPassword ? "text" : "password"}
                        placeholder="Enter Confirm password"
                        {...register("confirmPassword", {
                          required: "Enter confirm password",
                          validate: (value) =>
                            value === passwordValue || "Passwords do not match",
                        })}
                        onChange={(e) => setConfirmValue(e.target.value)}
                        className="form-control register-modal-input-box"
                      />

                      {confirmValue?.length > 0 && <span
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          backgroundColor: confirmValue === passwordValue && passwordRegex.test(passwordValue) ? "green" : "red",
                          color: "#fff",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {confirmValue === passwordValue && passwordRegex.test(passwordValue) ? ( <IoCheckmark /> ) : (<IoClose />)}
                      </span>}
                    </label>
                  </div>

                  {errors.confirmPassword &&
                    (touchedFields.confirmPassword || isSubmitted) && (
                      // <p style={{ color: "red" }}> {errors.confirmPassword.message}</p>
                      <p style={{ color: "red" }}> Enter confirm password</p>
                    )}

                  <div className="custom-modal-label mt-3">
                    <Button type="submit" className=" register-modal-body-submit-btn">
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
