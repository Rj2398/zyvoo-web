import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "react-bootstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import VerificationModal from "./VerificationModal";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ForgotWithEmail from "./ForgotWithEmail";
import EmailLoginModal from "./LoginWithEmail";
import Loader from "../../Loader";
import countries from "world-countries";
import { isValidNumber } from "libphonenumber-js";
import { PhoneNumberUtil } from "google-libphonenumber";

import {
  auth,
  provider,
  fbProvider,
  appleProvider,
  signInWithPopup,
  OAuthProvider,
} from "./FirebaseLogin.jsx";
// import { auth, fbProvider, initializeAppleSignInScript, provider, signInWithPopup, } from "./FirebaseLogin.jsx";
// import { auth,provider,fbProvider, signInWithPopup, initializeAppleSignInScript } from "./FirebaseLogin.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { ChevronDownIcon, Radius } from "lucide-react";
import { FaSortDown } from "react-icons/fa";
import { Facebook } from "react-feather";
import { appleConfiguration } from "../../../config/Constant.jsx";

function RegisterModal(props) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!props.show) {
      reset();
    }
  }, [props.show, reset]);

  const { registerUser, SocialLogin, LoginWithPhone, isLoading } = useAuth();
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [regionCodeTemp, setRegionCodeTemp] = useState("");
  const [switchLogin, setSwitchLogin] = useState(false);
  const [logigWithEmailModle, setLoingWithEmailModle] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [forgotEmailModal, setForgotemailModal] = useState(false);
  const [vefiModl, setVefiModl] = useState(false);
  const [LoginVerification, setloginVerification] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");

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

  // function getCountryInfo(countryName) {
  //   const country = countries.find(
  //     (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
  //   );

  //   if (!country) return;
  //   setSelectedCountryFlag(
  //     `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`
  //   );
  //   setSelectedCountryCode(
  //     `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
  //   );
  //   setSelectedCountry(countryName);
  //   setRegionCodeTemp(country.cca2);
  // }

  //   function getCountryInfo(countryName) {
  //   const country = countries.find(
  //     (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
  //   );

  //   if (!country) return;

  //   setSelectedCountryFlag(
  //     `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`
  //   );

  //   // ✅ FIX: Only use idd.root (not suffix)
  //   setSelectedCountryCode(country.idd.root || "");

  //   setSelectedCountry(countryName);
  //   setRegionCodeTemp(country.cca2);
  // }

  function getCountryInfo(countryName) {
    const country = countries.find(
      (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) return;

    // ✅ Set the flag correctly
    setSelectedCountryFlag(
      `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`
    );

    // ✅ Combine idd.root and idd.suffixes for full dialing code(s)
    const countryCode =
      country.idd?.root && country.idd?.suffixes?.length
        ? country.idd.suffixes.map((s) => `${country.idd.root}${s}`).join(", ")
        : country.idd?.root || "";

    setSelectedCountryCode(countryName == "United States" ? "+1" : countryCode);
    setSelectedCountry(countryName);
    setRegionCodeTemp(country.cca2);
  }

  const filteredCountries = countries
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
    .filter((c) =>
      c.name.common?.toLowerCase()?.includes(searchInput?.toLowerCase())
    );

  // useEffect(() => {
  //   initializeAppleSignInScript();
  // }, []);

  // const handleGoogleSignIn = async () => {
  //   try {
  //     console.log("Goofle login call");
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     const { displayName, email, uid } = user;

  //     console.log(user, "user*******");
  //     const nameParts = displayName ? displayName.split(" ") : [];
  //     const fname = nameParts[0] || "";
  //     const lname = nameParts.slice(1).join(" ") || "";

  //     const payload = { email, fname, lname, social_id: uid };

  //     const response = await SocialLogin(payload);
  //     if (response.status) {
  //       toast.success(response?.data?.message || "User Logged in Successfully");

  //       props?.CallBack(false);
  //       navigate("/");
  //       // if (props?.loginModal) {
  //       //   console.log('asss')
  //       //   props?.CallBack(false);
  //       //   navigate("/");
  //       // }
  //     } else {
  //       toast.error("Login successful, but an error occurred on the server.");
  //       console.error("Backend Response Error:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Firebase Google Login Error or Backend Error:", error);
  //     toast.error("Failed to login with Google.");
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1. Destructure fields including providerData
      const { displayName, email, providerData } = user;

      // 2. Split displayName into first and last name safely
      const nameParts = displayName ? displayName.split(" ") : [];
      const fname = nameParts[0] || "";
      const lname = nameParts.slice(1).join(" ") || "";

      // 3. Extract the Google provider UID if it exists, otherwise fallback to top-level uid
      const googleUid =
        providerData && providerData.length > 0
          ? providerData[0].uid
          : user.uid;

      // 4. Construct the updated payload with social_id mapped to the Google UID
      const payload = {
        email,
        fname,
        lname,
        social_id: googleUid,
        fcm_token: "",
        device_type: "web",
      };

      const response = await SocialLogin(payload);
      if (response.status) {
        toast.success(response?.data?.message || "User Logged in Successfully");

        props?.CallBack(false);
        navigate("/");
        // if (props?.loginModal) {
        //   console.log('asss')
        //   props?.CallBack(false);
        //   navigate("/");
        // }
      } else {
        toast.error("Login successful, but an error occurred on the server.");
        console.error("Backend Response Error:", response.data);
      }
    } catch (error) {
      console.error("Firebase Google Login Error or Backend Error:", error);
      toast.error("Failed to login with Google.");
    }
  };

  //facebook sign in

  // const fbProvider = new FacebookAuthProvider();
  // fbProvider.addScope('email');
  // fbProvider.addScope('public_profile');
  //rajan commented by
  // const handleFacebookSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, fbProvider);
  //     const user = result.user;

  //     console.log("Firebase User:", user);

  //     const { displayName, email, uid } = user;
  //     const nameParts = displayName ? displayName.split(" ") : [];
  //     const fname = nameParts[0] || "";
  //     const lname = nameParts.slice(1).join(" ") || "";

  //     const payload = { email, fname, lname, social_id: uid };
  //     const response = await SocialLogin(payload);

  //     console.log("Backend Response:", response);

  //     if (response.status) {
  //       toast.success(response?.data?.message || "User Logged in Successfully");
  //       props?.CallBack(false);
  //       navigate("/");
  //     } else {
  //       toast.error("Login successful, but backend error occurred.");
  //     }
  //   } catch (error) {
  //     console.error("Facebook Sign-In Error:", error);
  //     toast.error("Facebook login failed.");
  //   }
  // };
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, fbProvider);
      const user = result.user;

      console.log("Firebase User:", user);

      const { displayName = "", email, uid = "" } = user || {};

      // 1. Generate a default fallback email if Firebase returns null/undefined
      const finalEmail = email || `fb_${uid}@facebook.com`;

      // 2. Safe string splitting for first and last names
      const nameParts = displayName ? displayName.trim().split(" ") : [];
      const fname = nameParts[0] || "User";
      const lname = nameParts.slice(1).join(" ") || "";

      // 3. Construct the payload with the valid email string
      const payload = {
        email: finalEmail, // Guaranteed string format
        fname,
        lname,
        social_id: uid,
      };

      console.log("Sending Payload to Backend:", payload);

      const response = await SocialLogin(payload);
      console.log("Backend Response:", response);

      if (response?.status || response?.success) {
        // Added response?.success check just in case
        toast.success(
          props?.loginModal ? "Registered Successfully" : "Login Sucessfully"
        );
        props?.CallBack?.(false);
        navigate("/");
      } else {
        toast.error(
          response?.message || "Login successful, but backend error occurred."
        );
      }
    } catch (error) {
      console.error("Facebook Sign-In Error:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "An account already exists with this email using a different login method."
        );
      } else {
        toast.error("Facebook login failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;

    script.onload = () => {
      window.AppleID.auth.init({
        clientId: "com.zyvollc.web",
        scope: "email",
        redirectURI: "https://zyvo-3.vercel.app/",
        usePopup: true,
        responseMode: "fragment", // Keeps data in the URL hash fragment
      });

      console.log("Apple Initialized");
    };

    document.body.appendChild(script);
  }, []);

  // const handleAppleSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, appleProvider);
  //     const user = result.user;

  //     // 1. Get the initial email returned by Firebase/Apple
  //     let finalEmail = user?.email;

  //     // 2. Intercept if the user chose "Hide My Email" and force a real email input
  //     if (finalEmail && finalEmail.includes("privaterelay.appleid.com")) {
  //       const realEmailInput = prompt(
  //         "Apple has hidden your email address. Please provide your real email to complete registration:"
  //       );

  //       if (realEmailInput && realEmailInput.trim() !== "") {
  //         finalEmail = realEmailInput.trim();
  //       } else {
  //         toast.error("Your real email is required to log in.");
  //         return; // Halt execution if they cancel or leave it empty
  //       }
  //     }

  //     // 3. Initialize names with smart fallbacks
  //     let fname = "Apple";
  //     let lname = "User";

  //     // 4. If Apple actually gives us a name (Only happens on 1st login ever), parse it!
  //     if (user.displayName && user.displayName.trim() !== "") {
  //       const nameParts = user.displayName.trim().split(" ");
  //       fname = nameParts[0] || "Apple";
  //       lname = nameParts.slice(1).join(" ") || "User";
  //     } else {
  //       // If no name is provided, extract a fallback prefix from their verified real email
  //       if (finalEmail && !finalEmail.includes("privaterelay.appleid.com")) {
  //         const emailPrefix = finalEmail.split("@")[0];
  //         fname = emailPrefix;
  //         lname = "User";
  //       }
  //     }

  //     // 5. Construct payload using the static user.uid for backend lookups
  //     const payload = {
  //       email: finalEmail, // Now guaranteed to be their real email address string
  //       fname: fname,
  //       lname: lname,
  //       social_id: user?.uid, // ✅ FIXED: Changed from idToken to unique static UID
  //     };

  //     console.log("Sending clean payload to backend:", payload);

  //     const response = await SocialLogin(payload);

  //     if (response.status) {
  //       toast.success(
  //         props?.loginModal ? "Registered Successfully" : "Login Successfully"
  //       );
  //       props?.CallBack?.(false);
  //       navigate("/");
  //     } else {
  //       toast.error(
  //         response?.data?.message || "Login verification failed on backend."
  //       );
  //       console.error("Backend Error:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Apple Sign-In Error:", error);
  //     toast.error(error.message || "Failed to login with Apple.");
  //   }
  // };
  //code commente 10-06-2026
  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;

      const credential = OAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;

      // 1. Initialize names with smart fallbacks
      let fname = "Apple";
      let lname = "User";

      // 2. If Apple actually gives us a name (Only happens on 1st login ever), parse it!
      if (user.displayName && user.displayName.trim() !== "") {
        const nameParts = user.displayName.trim().split(" ");
        fname = nameParts[0] || "Apple";
        lname = nameParts.slice(1).join(" ") || "User";
      } else {
        // 3. OPTIONAL: If no name is provided, you can also extract a fallback prefix from their email
        if (user?.email) {
          const emailPrefix = user.email.split("@")[0];
          // If it's not a masked private relay email, use the prefix
          if (!user.email.includes("privaterelay.appleid.com")) {
            fname = emailPrefix;
            lname = "User";
          }
        }
      }

      // This safely ensures payload fields are NEVER empty strings
      const payload = {
        email: user?.email,
        fname: fname,
        lname: lname,
        social_id: idToken,
      };

      console.log("Sending clean payload to backend:", payload);

      const response = await SocialLogin(payload);

      if (response.status) {
        toast.success(
          props?.loginModal ? "Registered Successfully" : "Login Sucessfully"
        );
        props?.CallBack?.(false);
        navigate("/");
      } else {
        toast.error(
          response?.data?.message || "Login verification failed on backend."
        );
        console.error("Backend Error:", response.data);
      }
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
      toast.error(error.message || "Failed to login with Apple.");
    }
  };
  // const handleAppleSignIn = async () => {
  //   try {
  //     // 1. Trigger the popup via Firebase using the provider we exported
  //     const result = await signInWithPopup(auth, appleProvider);
  //     const user = result.user;

  //     // 2. Extract credential tokens if your backend needs the raw identity token
  //     const credential = OAuthProvider.credentialFromResult(result);
  //     const idToken = credential?.idToken;

  //     // 3. Handle names safely from Firebase's normalized user profile
  //     // Note: Apple only provides the name profile values on the VERY FIRST login.
  //     let fname = "";
  //     let lname = "";

  //     if (user.displayName) {
  //       const nameParts = user.displayName.trim().split(" ");
  //       fname = nameParts[0] || "Apple";
  //       lname = nameParts.slice(1).join(" ") || "";
  //     }

  //     // 4. Build your payload for your custom SocialLogin backend service
  //     const payload = {
  //       email: user?.email,
  //       fname: fname,
  //       lname: lname,
  //       social_id: idToken, // Sending the identity token verified by Firebase to your backend
  //     };

  //     // 5. Fire your Node backend API call
  //     const response = await SocialLogin(payload);

  //     if (response.status) {
  //       toast.success(response?.data?.message || "Registered Successfully");
  //       props?.CallBack?.(false); // Safeguard with optional chaining function call
  //       navigate("/");
  //     } else {
  //       toast.error(
  //         response?.data?.message ||
  //           "Login successful, but an error occurred on the server."
  //       );
  //       console.error("Backend Response Error:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Apple Sign-In Error:", error);

  //     // Friendly error tracking handles cancelations vs system drops
  //     if (error.code === "auth/popup-closed-by-user") {
  //       toast.error("Sign-in popup closed before completion.");
  //     } else {
  //       toast.error(error.message || "Failed to login with Apple.");
  //     }
  //   }
  // };
  // const handleAppleSignIn = async () => {
  //   try {
  //     const appleResponse = await window.AppleID.auth.signIn();
  //     const { authorization, user } = appleResponse;
  //     const fullName = user?.name
  //       ? `${user.name.firstName || ""} ${user.name.lastName || ""}`.trim()
  //       : "";

  //     const nameParts = fullName ? fullName.split(" ") : [];
  //     const fname = nameParts[0] || "";
  //     const lname = nameParts.slice(1).join(" ") || "";

  //     const payload = {
  //       email: user?.email,
  //       fname,
  //       lname,
  //       social_id: authorization.id_token,
  //     };

  //     const response = await SocialLogin(payload);

  //     if (response.status) {
  //       toast.success(response?.data?.message || "Registered Successfully");
  //       props?.CallBack(false);
  //       navigate("/");
  //       // if (props?.loginModal) {
  //       //   props?.CallBack(false);
  //       //   navigate("/");
  //       // }
  //     } else {
  //       toast.error("Login successful, but an error occurred on the server.");
  //       console.error("Backend Response Error:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Apple Sign-In Error:", error);
  //     toast.error("Failed to login with Apple.");
  //   }
  // };

  const onSubmit = async (data, event) => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    event?.preventDefault();
    const phoneNumber = selectedCountryCode + data.phoneNumber;
    if (Object.keys(errors)?.length === 0) {
      try {
        const parsedNumber = phoneUtil.parse(data?.phoneNumber, regionCodeTemp);
        const isValid = phoneUtil.isValidNumber(parsedNumber);

        if (!isValid && isValidNumber) {
          toast.error("Invalid phone number");
          return;
        }
        const response = props?.loginModal
          ? await registerUser({
              phone_number: data?.phoneNumber,
              country_code: selectedCountryCode,
              fcm_token: "bfbfb498b4644",
              device_type: "web",
            })
          : await LoginWithPhone({
              phone_number: data?.phoneNumber,
              country_code: selectedCountryCode,
              fcm_token: "bfbfb498b4644",
              device_type: "web",
            });
        if (response) {
          if (props?.loginModal) {
            props?.CallBack(false);
            setVefiModl(true);
          } else {
            setloginVerification(true);
            props?.CallBack(false);
            setVefiModl(true);
          }
        }
      } catch (error) {
        toast.error(error?.message);
        console.error("Login error:", error);
      }
    }
  };

  return (
    <>
      <Modal
        show={props?.show}
        dialogClassName="custom-modal"
        size={548}
        centered
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        onHide={() => {
          props?.onHide();
          reset();
        }}
      >
        <style>
          {`
            .custom-modal  {
              padding:5px !important;
            } 
            .custom-modal .modal-content {
              border-radius: 15px !important;
              padding:0px !important;
              height: ${isMobileWidth ? "520px" : ""} !important;
            }         
            .btn-close {
              width: 10px;
              height: 10px;
              background: #3A4B4C;
              border-radius: 50%;
              opacity: 1;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .btn-close::after {
              content: '×';
              color: #fff;
              font-weight: 500;
              font-size: 20px;
              line-height: 1;
              height: ${isMobileWidth ? "9px" : "10px"} !important;
              width: ${isMobileWidth ? "9px" : "10px"} !important;    
            }
          `}
        </style>
        <Loader visible={isLoading} />
        <Modal.Header
          closeButton
          style={{
            border: "none",
            paddingBottom: "0px",
          }}
        />

        <Modal.Title
          id="contained-modal-title-vcenter"
          className="w-100 text-center register-modal-header-title"
        >
          {props?.loginModal ? "Register Now" : "Login"}
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
          style={{
            fontFamily: "poppins",
            paddingTop: isMobileWidth ? "10px" : "",
          }}
        >
          <h3 className="register-modal-body-h3"> Welcome to Zyvo </h3>
          <p className="register-modal-body-p">
            {props?.loginModal
              ? "Enter your phone number to register your account."
              : "Enter your phone number to login your account."}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <div className="custom-modal-label d-flex align-items-center gap-2"
              style={{
                marginBottom: "15px",
                width: "90%",
                backgroundColor: "#fff",
                border: "2px solid #ccc",
                borderRadius: "50px",
                padding: "5px 10px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                marginLeft: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "23%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  if(isMobileWidth){
                    setShowNumberModal(true)
                  } else {
                    const select = e.currentTarget.querySelector("select");
                    if (select) {
                      select.focus();
                      select.click();
                    }
                  }
                }}
              >
                <img
                  src={selectedCountryFlag || "https://flagcdn.com/w20/us.png"}
                  alt=""
                  style={{
                    width: "20px",
                    height: "15px",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                  {selectedCountryCode || "+1"}
                </span>
                <div style={{ display: "flex",  justifyContent: "flex-end",
                    }} >
                  <ChevronDownIcon style={{ width:isMobileWidth?"10px":"20px", height: "20px" }} />
                </div>

                <select
                  value={selectedCountry}
                  onChange={(e) => getCountryInfo(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    paddingLeft: "10px",
                  }}
                >
                  <option value="">Select Country</option>
                  {[...countries]
                    .sort((a, b) => a.name.common.localeCompare(b.name.common))
                    .map((country) => (
                      <option
                        key={country.cca2}
                        value={country.name.common}
                        style={{ paddingLeft: "15px" }}
                      >
                        {country.name.common}
                      </option>
                    ))}
                </select>
              </div>

              <div
                style={{
                  width: "1.5px",
                  height: "80%",
                  backgroundColor: "#ccc",
                }}
              />

              <div
                style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  id="mobile_code"
                  placeholder="Enter your number here"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    validate: (value) => {
                      if (!regionCodeTemp) return "Country code missing";
                      try {
                        const phoneUtil = PhoneNumberUtil.getInstance();
                        const parsed = phoneUtil.parse(value, regionCodeTemp);
                        return (
                          phoneUtil.isValidNumber(parsed) ||
                          "Invalid phone number format"
                        );
                      } catch {
                        return "Invalid phone number";
                      }
                    },
                  })}
                  className="custom-input"
                  style={{
                    width: "100%",
                    height: "45px",
                    border: "none",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "#fff !important",
                    padding: "0 10px",
                    boxShadow: "none",
                    textOverflow: "ellipsis",
                  }}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                />
                  <style>
              </style>

              </div>
            </div> */}

            <div
              className="custom-modal-label d-flex align-items-center gap-2"
              style={{
                marginBottom: "15px",
                width: "90%",
                backgroundColor: "#fff",
                border: "2px solid #ccc",
                borderRadius: "50px",
                padding: "5px 10px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                marginLeft: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "23%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                  cursor: "pointer",
                  paddingRight: "6px", // ensures icon stays inside border
                  marginLeft: isMobileWidth && "10px",
                }}
                onClick={(e) => {
                  if (isMobileWidth) {
                    setShowNumberModal(true);
                  } else {
                    const select = e.currentTarget.querySelector("select");
                    if (select) {
                      select.focus();
                      select.click();
                    }
                  }
                }}
              >
                <img
                  src={selectedCountryFlag || "https://flagcdn.com/w20/us.png"}
                  alt=""
                  style={{
                    width: isMobileWidth ? "33px" : "25px",
                    height: isMobileWidth ? "18px" : "15px",
                    borderRadius: "2px",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {selectedCountryCode || "+1"}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "auto",
                  }}
                >
                  {isMobileWidth ? (
                    <FaSortDown
                      style={{
                        marginTop: "-11px",
                        width: "10px",
                        // height: "1px",
                        color: "#555",
                      }}
                    />
                  ) : (
                    <ChevronDownIcon
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#555",
                      }}
                    />
                  )}
                </div>

                <select
                  value={selectedCountry}
                  onChange={(e) => getCountryInfo(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    paddingLeft: "10px",
                  }}
                >
                  <option value="">Select Country</option>
                  {[...countries]
                    .sort((a, b) => a.name.common.localeCompare(b.name.common))
                    .map((country) => (
                      <option key={country.cca2} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                </select>
              </div>

              <div
                style={{
                  width: "1.5px",
                  height: "80%",
                  backgroundColor: "#ccc",
                  marginLeft: isMobileWidth ? "20px" : "0px",
                }}
              />

              <div
                style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  id="mobile_code"
                  placeholder="Enter your number here"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    validate: (value) => {
                      if (!regionCodeTemp) return "Country code missing";
                      try {
                        const phoneUtil = PhoneNumberUtil.getInstance();
                        const parsed = phoneUtil.parse(value, regionCodeTemp);
                        return (
                          phoneUtil.isValidNumber(parsed) ||
                          "Invalid phone number format"
                        );
                      } catch {
                        return "Invalid phone number";
                      }
                    },
                  })}
                  className="custom-input"
                  style={{
                    width: "100%",
                    height: "45px",
                    border: "none",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "#fff",
                    padding: "0 10px",
                    boxShadow: "none",
                    textOverflow: "ellipsis",
                    color: "#333",
                  }}
                />

                {/* 👇 Just placeholder color styling */}
                <style>
                  {`
        input::placeholder {
          color: #999 !important; /* gray placeholder */
           font-size: ${isMobileWidth ? "12px" : "14px"} !important;
        }

        @media (max-width: 600px) {
          .custom-modal-label img {
            width: 18px;
            height: 13px;
          }
          .custom-modal-label span {
            font-size: 13px;
          }
          .custom-modal-label svg {
            width: 14px;
            height: 14px;
            margin-right: 2px; /* ensures icon stays inside border */
          }
        }
      `}
                </style>
              </div>
            </div>

            {errors.phoneNumber && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {/* {errors.phoneNumber.message}. */}
                Please enter your phone number
              </p>
            )}
            <div
              className="custom-modal-label mt-3"
              style={{ marginLeft: isMobileWidth ? "5px" : "" }}
            >
              <Button
                type="submit"
                style={{
                  backgroundColor: "#4AEAB1",
                  borderRadius: "30px",
                  border: "none",
                  padding: isMobileWidth ? "10px 0" : "12px 0",
                  width: "90%",
                  fontSize: isMobileWidth ? "14px" : "16px",
                  fontWeight: "500",
                  color: "black",
                }}
              >
                Continue
              </Button>
            </div>

            {isMobileWidth && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    width: "90%",
                  }}
                >
                  {/* {!props?.loginModal &&   ( */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: isMobileWidth ? "13px" : "14px",
                      color: "#000",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "5px",
                        cursor: "pointer",
                        appearance: "none",
                        border: "2px solid #4AEAB1",
                        borderRadius: "3px",
                        backgroundColor: "transparent",
                        position: "relative",
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          e.target.style.backgroundColor = "#4AEAB1";
                          e.target.style.border = "2px solid #4AEAB1";
                          e.target.style.backgroundImage =
                            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20.285 5.289l-11.99 11.992-4.285-4.285-1.996 1.995 6.281 6.281 13.984-13.991z"/></svg>\')';
                          e.target.style.backgroundSize = "12px";
                          e.target.style.backgroundPosition = "center";
                          e.target.style.backgroundRepeat = "no-repeat";
                        } else {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.border = "2px solid #4AEAB1";
                          e.target.style.backgroundImage = "none";
                        }
                      }}
                    />
                    Keep me logged
                  </label>
                  {/* )} */}
                  {/* {!props?.loginModal && (
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#000",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setForgotemailModal(true);
                        props?.onHide();
                      }}
                    >
                      Forgot password?
                    </span>
                  )} */}
                </div>
              </div>
            )}

            {!props?.loginModal && !isMobileWidth && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    width: "90%",
                  }}
                >
                  {!props?.loginModal && (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "#000",
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                          cursor: "pointer",
                          appearance: "none",
                          border: "2px solid #4AEAB1",
                          borderRadius: "3px",
                          backgroundColor: "transparent",
                          position: "relative",
                        }}
                        onChange={(e) => {
                          if (e.target.checked) {
                            e.target.style.backgroundColor = "#4AEAB1";
                            e.target.style.border = "2px solid #4AEAB1";
                            e.target.style.backgroundImage =
                              'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20.285 5.289l-11.99 11.992-4.285-4.285-1.996 1.995 6.281 6.281 13.984-13.991z"/></svg>\')';
                            e.target.style.backgroundSize = "12px";
                            e.target.style.backgroundPosition = "center";
                            e.target.style.backgroundRepeat = "no-repeat";
                          } else {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.border = "2px solid #4AEAB1";
                            e.target.style.backgroundImage = "none";
                          }
                        }}
                      />
                      Keep me logged
                    </label>
                  )}
                  {/* {!props?.loginModal && (
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#000",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setForgotemailModal(true);
                        props?.onHide();
                      }}
                    >
                      Forgot password?
                    </span>
                  )} */}
                </div>
              </div>
            )}
          </form>

          <hr />
          <p
            style={{
              fontSize: isMobileWidth ? "12px" : "15px",
              margin: 0, // ✅ remove default margin
              textAlign: "center", // optional, if you want it centered
            }}
          >
            {isMobileWidth ? "OR" : "-OR-"}
          </p>
          <p
            style={{
              fontSize: isMobileWidth ? "12px" : "15px",
              margin: 0, // ✅ remove default margin
              textAlign: "center",
            }}
          >
            Login with
          </p>
          <div className="login-with-icons d-flex justify-content-center">
            <ul className="list-unstyled d-flex gap-3">
              {["google", "facebook", "apple", "mail"].map((provider) => (
                <li key={provider}>
                  <a
                    href="#"
                    onClick={(e) => {
                      if (provider === "mail") {
                        e.preventDefault();

                        if (props?.loginModal) {
                          setLoingWithEmailModle(true);

                          props?.onHide();
                          setSwitchLogin(false);
                        } else {
                          setLoingWithEmailModle(true);

                          props?.onHide();
                          setSwitchLogin(true);
                        }
                      }
                      if (provider == "google") {
                        e.preventDefault();
                        handleGoogleSignIn();
                      }
                      if (provider == "apple") {
                        e.preventDefault();
                        handleAppleSignIn();
                      }
                      if (provider == "facebook") {
                        e.preventDefault();
                        handleFacebookSignIn();
                      }
                    }}
                  >
                    <img
                      src={`/images/popups/${provider}.svg`}
                      alt={`${provider} Login`}
                      width="40"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div>
            {props?.loginModal ? (
              <div>
                <p style={{ fontSize: isMobileWidth ? "12px" : "" }}>
                  Already have an account?
                </p>
                <div className="bottom-btn">
                  <Button
                    variant="link"
                    className="register-btn"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      // border: "1px solid #4AEAB1",
                      fontSize: isMobileWidth ? "13px" : "16px",
                      fontWeight: "500",
                      width: isMobileWidth ? "80%" : "",
                    }}
                    onClick={() => {
                      props?.ToggleVal(false);
                    }}
                  >
                    Login Here
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: isMobileWidth ? "12px" : "" }}>
                  Don't have an account?
                </p>
                <div className="bottom-btn">
                  <Button
                    variant="link"
                    className="register-btn"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      // border: "1px solid #4AEAB1",
                      fontSize: isMobileWidth ? "13px" : "16px",
                      fontWeight: "500",
                      width: isMobileWidth ? "87%" : "",
                    }}
                    onClick={() => {
                      props?.ToggleVal(true);
                    }}
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <VerificationModal
        show={vefiModl}
        onHide={() => {
          setVefiModl(false);
          reset();
        }}
        LoginVerification={LoginVerification}
        resend={props?.loginModal}
        countryCodes={selectedCountryCode}
      />
      <ForgotWithEmail
        show={forgotEmailModal}
        handleClose={() => {
          setForgotemailModal(false);
          reset();
        }}
      />
      <EmailLoginModal
        show={logigWithEmailModle}
        handleClose={() => {
          setLoingWithEmailModle(false);
          reset();
        }}
        toggleModell={switchLogin}
      />

      <Modal
        dialogClassName="custom-modal"
        show={showNumberModal}
        onHide={() => setShowNumberModal(false)}
        centered
        size="lg"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>Select Country</Modal.Title>
        </Modal.Header> */}

        <style>
          {`
  .custom-modal {
    
    color: #000;
    // padding: 20px;
    // border: 1px solid #ccc;
    border-radius: 0;
    // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    max-width: 350px;
    margin: 0 auto;
  }
    .custom-modal .modal-content {
    border-radius: 0px !important;
    padding: 0px !important;
    height: 100% !important;
    margin-top:10% !important ;

}

  .modal-content {
  height: 100%;
  border-radius: 0; /* optional: make edges flush */
}

 .custom-modal.number-body {
    background: none !important;   /* No background */
    border: none;                  /* No border */
    border-radius: 0 !important;   /* No rounded corners */
    box-shadow: none;              /* No shadow */
    height: 200%;    
      overflow-y: auto;              /* Auto height */
  }
}
`}
        </style>
        <Modal.Body className="number-body">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="form-control "
            style={{
              borderBottom: "2px solid  green",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderRadius: "none",
            }}
          />

          <div
            style={{
              height: "100vh",
              overflowY: "auto",

              // borderRadius: "8px",
              padding: "10px",
            }}
          >
            {filteredCountries.map((country) => (
              <div
                key={country.cca2}
                onClick={() => {
                  getCountryInfo(country.name.common),
                    setShowNumberModal(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                <img
                  src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`}
                  alt=""
                  width="30"
                  style={{ marginRight: "12px" }}
                />
                <span>{country.name.common}</span>
              </div>
            ))}
          </div>
        </Modal.Body>

        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default React.memo(RegisterModal);
