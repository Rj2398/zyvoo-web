import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { setStoreDataLoginOtp, setUserInfo } from "../store/slices/userSlice";

import { api, guestApi } from "../utils/api";

import { useState } from "react";
import { KEYS } from "../config/Constant";
import { toast } from "react-toastify";

export default function useAuth() {
  const dispatch = useDispatch();
  const [manualLoading, setManualLoading] = useState(false);

  const { mutateAsync: registerUser } = useMutation({
    mutationKey: ["signup_phone_number", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("signup_phone_number", payload);
        const { data } = response;
        if (data?.data) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
            dispatch(setStoreDataLoginOtp(data?.data));
          }, 500);
        }

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: numOtpVerify } = useMutation({
    mutationKey: [`otp_verify_signup_phone`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("otp_verify_signup_phone", payload);

        const { data } = response;

        if (data?.data) {
          localStorage.setItem(
            KEYS.USER_INFO,
            JSON.stringify({
              access_token: data?.data?.token,
              user_id: data?.data?.user_id,
            })
          );
        }

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: LoginWithPhone } = useMutation({
    mutationKey: [`login_phone_number`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("login_phone_number", payload);

        const { data } = response;
        if (data?.data) {
          // localStorage.setItem(
          //   KEYS.USER_INFO,
          //   JSON.stringify({
          //     access_token: data?.data?.token,
          //     user_id: data?.data?.user_id,
          //   }),
          // );

          setTimeout(() => {
            // dispatch(setUserInfo(data?.data));
            // -added-------
            dispatch(setStoreDataLoginOtp(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: otp_verify_login_phone } = useMutation({
    mutationKey: [`otp_verify_login_phone`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("otp_verify_login_phone", payload);

        const { data } = response;

        if (data?.data) {
          localStorage.setItem(
            KEYS.USER_INFO,
            JSON.stringify({
              access_token: data?.data?.token,
              user_id: data?.data?.user_id,
            })
          );

          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
            // -added-------
            dispatch(setStoreDataLoginOtp(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: forgot_password_email } = useMutation({
    mutationKey: [`forgot_password`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("forgot_password", payload);

        const { data } = response;
        if (data?.data) {
          setTimeout(() => {
            dispatch(setStoreDataLoginOtp(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        // const errorMessage = "Account not found. Please register first22.";
        // const errorMessage = "Account not found. Please register first22.";
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: otp_verify_forgot_password } = useMutation({
    mutationKey: [`otp_verify_forgot_password`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("otp_verify_forgot_password", payload);

        const { data } = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: reset_password } = useMutation({
    mutationKey: [`otp_verify_forgot_password`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("reset_password", payload);

        const { data } = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  //

  const { mutateAsync: login_email } = useMutation({
    mutationKey: [`login_email`, "logout"],
    mutationFn: async ({ rememberMe, payload }) => {
      try {
        setManualLoading(true);
        const response = await api.post("login_email", payload);
        const { data } = response;
        // console.log(rememberMe, "check remberme check up");

        if (data?.data) {
          if (rememberMe) {
            localStorage.setItem(
              KEYS.USER_INFO,
              JSON.stringify({
                access_token: data.data.token,
                user_id: data.data.user_id,
              })
            );
          } else {
            sessionStorage.setItem(
              KEYS.USER_INFO,
              JSON.stringify({
                access_token: data.data.token,
                user_id: data.data.user_id,
              })
            );
          }
          setTimeout(() => {
            dispatch(setUserInfo(data.data));
          }, 500);
          toast.success("Login Successful");
        }

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        // const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
        const errorMessage = " Invalid email or password";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: signup_email } = useMutation({
    mutationKey: [`signup_email`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("signup_email", payload);

        const { data } = response;

        if (data?.data) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
            dispatch(setStoreDataLoginOtp(data?.data));
          }, 500);
        }

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        // const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred" ||
          "please enter your email and password";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: otp_verify_signup_email } = useMutation({
    mutationKey: [`otp_verify_signup_email`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("otp_verify_signup_email", payload);

        const { data } = response;
        if (data?.data) {
          localStorage.setItem(
            KEYS.USER_INFO,
            JSON.stringify({
              access_token: data?.data?.token,
              user_id: data?.data?.user_id,
            })
          );

          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: send_email_verification_otp } = useMutation({
    mutationKey: [`email_verification`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("email_verification", payload);

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: verify_email_verification_otp } = useMutation({
    mutationKey: [`otp_verify_email_verification`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "otp_verify_email_verification",
          payload
        );

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: send_phone_verification_otp } = useMutation({
    mutationKey: [`phone_verification`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("phone_verification", payload);

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: verify_phone_verification_otp } = useMutation({
    mutationKey: [`otp_verify_phone_verification`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "otp_verify_phone_verification",
          payload
        );

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: update_phone_number } = useMutation({
    mutationKey: [`update_phone_number`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("update_phone_number", payload);
        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: update_email } = useMutation({
    mutationKey: [`update_email`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("update_email", payload);

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //
  const { mutateAsync: otp_verify_update_phone } = useMutation({
    mutationKey: [`otp_verify_update_phone`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "otp_verify_update_phone",
          payload
        );

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: otp_verify_update_email } = useMutation({
    mutationKey: [`otp_verify_update_email`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "otp_verify_update_email",
          payload
        );

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: updatePassword } = useMutation({
    mutationKey: [`update_password`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("update_password", payload);

        const { data } = response;
        if (data?.success) {
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: SocialLogin } = useMutation({
    mutationKey: [`social_login`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("social_login", payload);

        const { data } = response;
        if (data?.success) {
          localStorage.setItem(
            KEYS.USER_INFO,
            JSON.stringify({
              access_token: data?.data?.token,
              user_id: data?.data?.user_id,
            })
          );

          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 500);
        }
        return {
          ...data,
          status: 200,
        };
      } catch (error) {
        setManualLoading(false);
        console.error(error, "error message codes");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const isLoading = manualLoading;
  return {
    registerUser,
    isLoading,
    numOtpVerify,
    otp_verify_update_email,
    LoginWithPhone,
    otp_verify_login_phone,
    forgot_password_email,
    otp_verify_forgot_password,
    reset_password,
    login_email,
    signup_email,
    otp_verify_signup_email,
    send_email_verification_otp,
    verify_email_verification_otp,
    send_phone_verification_otp,
    verify_phone_verification_otp,
    update_phone_number,
    update_email,
    otp_verify_update_phone,
    updatePassword,
    SocialLogin,
  };
}
