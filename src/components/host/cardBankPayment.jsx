import React, { useEffect, useRef, useState } from "react";

import { Button, Form, Modal } from "react-bootstrap";
import { X } from "react-feather";
import useCardDetails from "../../hooks/host/useCardDetails";
import { GOOGLE_KEY, KEYS } from "../../config/Constant";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Loader";
import StripePayment from "./CardAddHost";
import mastercard from "../../assets/gallery/mastercard.svg";
import visaCard from "../../assets/gallery/visa.svg";
import countries from "world-countries";

import vector from "../../assets/gallery/Vector.png";
import { Link } from "react-router-dom";
import { FaSortDown } from "react-icons/fa";
// const GOOGLE_KEY = "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw";
import { isValidPhoneNumber } from "libphonenumber-js";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

const CardBankPayment = ({
  showPayOutModal1,
  setShowPayOutModal1,
  modalText,
}) => {
  const { userInfo } = useSelector(({ user }) => user);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRef4 = useRef(null);
  const fileInputRef5 = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const iconRef = useRef(null);

  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));

  const userId = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || userData?.user_id
      ? String(userData?.user_id)
      : null;

  const {
    getCardorBankList,
    setPrimaryCardorBank,
    AddBankDetails,
    AddPayoutCard,
    deletePayoutMethod,
    getCountry,
    getState,
    getCity,
    isLoading,
  } = useCardDetails();

  const initialBankDetails = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    confirm_account_number: "",
    routing_number: "",
    verification_document_front: "",
    verification_document_back: "",
    bank_proof_document: "",
    dob: "",
    id_type: "",
    bankProofType: "",
    id_number: "",
    ssn_last_4: "",
  };

  // PayOut methord
  const [payoutDropdownOpen, setPayoutDropdownOpen] = useState(false);
  const [payoutMenuOpen, setPayoutMenuOpen] = useState(null);
  const [enablePayment, setEnablePayment] = useState(false);
  const [striptoken, setStriptoken] = useState("");

  // for bank handling details
  const [bankDetails, setBankDetails] = useState(initialBankDetails);
  const [showDeleteModalBank, setShowDeleteModalBank] = useState(false);
  const [showDeleteModalCard, setShowDeleteModalCard] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(
    "https://flagcdn.com/w40/us.png"
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  // Payout Modal function
  const [showPayoutModal, setShowPayoutModal] = useState(
    showPayOutModal1 ? true : false
  );
  const [selectedMethod, setSelectedMethod] = useState("bank");

  useEffect(() => {
    if (showPayOutModal1) {
      setShowPayoutModal(true);
    }
  }, [showPayOutModal1]);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  //  --------------------
  const [countries1, setCountries1] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountry1, setSelectedCountry1] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [zipcode, setZipcode] = useState("");

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  function getCountryInfo(countryName) {
    const country = countries.find(
      (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) return "Country not found";

    // Set country flag
    setSelectedCountryFlag(
      `https://flagcdn.com/w40/${(country?.cca2 || "us").toLowerCase()}.png`
    );

    // ✅ Build the full main calling code
    const root = country.idd?.root || "";
    const suffix = country.idd?.suffixes?.[0] || "";
    const fullCode = `${root}${suffix}`;

    setSelectedCountryCode(countryName == "United States" ? "+1" : fullCode);
    setSelectedCountry1(countryName);
  }

  const filteredCountries = countries
    .sort((a, b) => a.name?.common?.localeCompare(b.name.common))
    .filter((c) =>
      c.name.common?.toLowerCase()?.includes(searchInput?.toLowerCase())
    );

  const phoneNumber = bankDetails.phone_number;
  const countryCode = selectedCountryCode;

  // This line performs the actual validation
  const isNumberValid = isValidPhoneNumber(phoneNumber, countryCode);

  if (isNumberValid) {
    // The number is valid for the selected country
    console.log("Valid phone number!");
  } else {
    // The number is NOT valid for the selected country
    console.error("Invalid phone number format!");
  }

  // When component mounts
  useEffect(() => {
    getCountry().then((data) => setCountries1(data.data));
  }, []);

  // When a country is selected
  useEffect(() => {
    if (selectedCountry) {
      getState(selectedCountry).then((data) => {
        setStates(data.data);
        setSelectedState("");
        setCities([]);
      });
    }
  }, [selectedCountry]);

  // When a state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      getCity({ countryCode: selectedCountry, stateCode: selectedState }).then(
        (data) => setCities(data.data)
      );
    }
  }, [selectedState]);

  // const GOOGLE_KEY = ""; // Replace with your actual key
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [GOOGLE_KEY]);

  const [payoutMethods, setPayoutMethods] = useState({
    banks: [],
    cards: [],
  });
  const [refresh, setRefresh] = useState(false);
  //for drop down
  const togglePayoutDropdown = () => {
    setPayoutDropdownOpen(!payoutDropdownOpen);
    setPayoutMenuOpen(null);
  };
  //  for toggle
  const togglePayoutMenu = (id) => {
    setPayoutMenuOpen(payoutMenuOpen == id ? null : id);
  };

  // for dates
  const convertDOBToArray = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear());
    return [month, day, year];
  };

  // setpreffeer locally
  const setPreferred = (type, id) => {
    setPayoutMethods((prevState) => ({
      ...prevState,
      [type]: prevState[type].map((item) =>
        item.id === id
          ? { ...item, preferred: true }
          : { ...item, preferred: false }
      ),
    }));
    setPayoutMenuOpen(null);
  };

  //Payout method for api
  const handleSetPreferred = async (card) => {
    try {
      await setPrimaryCardorBank({
        user_id: userId,
        payout_method_id: card.id,
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error setting preferred card:", error);
    }
  };

  //for bank
  const handleRemove = async (id) => {
    try {
      await deletePayoutMethod({
        user_id: userId,
        payout_method_id: id,
      });
      setRefresh((prev) => !prev);
      setShowDeleteModalBank(false);
      setShowDeleteModalCard(false);
      setCurrentCard(null);
    } catch (error) {
      console.error("Error setting preferred card:", error);
    }
  };

  //fetch card details
  const fetchCardDetails = async () => {
    try {
      const response = await getCardorBankList({ user_id: userId });

      if (response) {
        setPayoutMethods({
          banks: response.data.bank_accounts || [],
          cards: response.data.cards || [],
        });
      }
    } catch (error) {
      console.error("Error fetching payout methods:", error);
    }
  };

  useEffect(() => {
    fetchCardDetails();
  }, [refresh]);

  const validateBankDetails = (bankDetails) => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      country,
      state,
      city,
      postal_code,
      bank_name,
      account_holder_name,
      account_number,
      confirm_account_number,
      routing_number,
      verification_document_front,
      verification_document_back,
      bank_proof_document,
      dob,
      id_type,
      bankProofType,
      id_number,
      ssn_last_4,
    } = bankDetails;

    if (!first_name.trim()) {
      toast.error("Enter your first name");
      return false;
    }

    if (!last_name.trim()) {
      toast.error("Enter your last name");
      return false;
    }

    if (!email.trim()) {
      toast.error("Enter your email");
      return false;
    }

    if (!phone_number.trim()) {
      toast.error("Enter your phone number");
      return false;
    }
    if (!id_type.trim()) {
      toast.error("Select your id type");
      return false;
    }
    if (!id_number.trim()) {
      toast.error("Select personal identinfication number");
      return false;
    }
    if (!ssn_last_4.trim()) {
      toast.error("Enter your SSN LAST 4 Number");
      return false;
    }

    if (!dob.trim()) {
      toast.error("Enter you dob");
      return false;
    }

    if (!address.trim()) {
      toast.error("Enter your address");
      return false;
    }

    if (!country.trim()) {
      toast.error("Select your country");
      return false;
    }

    if (!state.trim()) {
      toast.error("Select your state");
      return false;
    }

    if (!city.trim()) {
      toast.error("Select your city");
      return false;
    }

    if (!postal_code.trim()) {
      toast.error("Select your postal code");
      return false;
    }

    if (!bank_name.trim()) {
      toast.error("Enter your bank name");
      return false;
    }

    if (!account_holder_name.trim()) {
      toast.error("Enter account holder name");
      return false;
    }

    if (!account_number.trim()) {
      toast.error("Enter your account number");
      return false;
    }

    if (!confirm_account_number.trim()) {
      toast.error("Confirm your account number");
      return false;
    }

    if (account_number !== confirm_account_number) {
      toast.error("Account numbers do not match");
      return false;
    }

    if (!routing_number.trim()) {
      toast.error("Enter your routing number");
      return false;
    }
    if (!bankProofType.trim()) {
      toast.error("Enter your Bank proof Type ");
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!verification_document_front) {
      toast.error("Upload front of verification document");
      return false;
    } else if (!allowedTypes.includes(verification_document_front.type)) {
      toast.error("Front verification document must be JPG, JPEG, or PNG");
      return false;
    }

    if (!verification_document_back) {
      toast.error("Upload back of verification document");
      return false;
    } else if (!allowedTypes.includes(verification_document_back.type)) {
      toast.error("Back verification document must be JPG, JPEG, or PNG");
      return false;
    }

    if (!bank_proof_document) {
      toast.error("Upload bank proof document");
      return false;
    } else if (!allowedTypes.includes(bank_proof_document.type)) {
      toast.error("Bank proof document must be JPG, JPEG, or PNG");
      return false;
    }

    return true; // ✅ All good
  };

  //handle submitted
  const handleSubmit = async () => {
    if (!validateBankDetails(bankDetails)) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    const dobArray = convertDOBToArray(bankDetails.dob);
    dobArray.forEach((item, index) => formData.append(`dob[${index}]`, item));
    formData.append("user_id", userId);
    formData.append("first_name", bankDetails.first_name);
    formData.append("last_name", bankDetails.last_name);
    formData.append("email", bankDetails.email);
    formData.append("phone_number", bankDetails.phone_number);
    formData.append("address", bankDetails.address);
    formData.append("country", bankDetails.country);
    formData.append("state", bankDetails.state);
    formData.append("city", bankDetails.city);
    formData.append("postal_code", bankDetails.postal_code);
    formData.append("bank_name", bankDetails.bank_name);
    formData.append("account_holder_name", bankDetails.account_holder_name);
    formData.append("account_number", bankDetails.account_number);
    formData.append(
      "account_number_confirmation",
      bankDetails.confirm_account_number
    );
    formData.append("routing_number", bankDetails.routing_number);
    formData.append("id_number", bankDetails?.id_number);
    formData.append("ssn_last_4", bankDetails?.ssn_last_4);
    formData.append("id_type", bankDetails?.id_type);
    formData.append("bank_proof_type", bankDetails?.bankProofType);
    formData.append(
      "verification_document_front",
      bankDetails.verification_document_front
    );
    formData.append(
      "verification_document_back",
      bankDetails.verification_document_back
    );
    formData.append("bank_proof_document", bankDetails.bank_proof_document);

    try {
      const response = await AddBankDetails(formData);
      if (response.success) {
        toast.success("Bank details submitted successfully!");
        setBankDetails(initialBankDetails, {
          city: "",
          state: "",
          country: "",
          zipcode: "",
        });
        setShowPayoutModal(false);
        showPayOutModal1 && setShowPayOutModal1(false);
        setRefresh((prev) => !prev);
      } else {
        toast.error(response.message || "Failed to submit bank details.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validationCardDetails = (bankDetails) => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      country,
      state,
      city,
      postal_code,
      verification_document_front,
      verification_document_back,
      dob,
      id_type,
      id_number,
      ssn_last_4,
    } = bankDetails;

    if (!first_name.trim()) {
      toast.error("Enter your first name");
      return false;
    }

    if (!last_name.trim()) {
      toast.error("Enter your last name");
      return false;
    }

    if (!email.trim()) {
      toast.error("Enter your email");
      return false;
    }

    if (!phone_number.trim()) {
      toast.error("Enter your phone number");
      return false;
    }

    if (!id_type.trim()) {
      toast.error("Select your ID type");
      return false;
    }

    if (!id_number.trim()) {
      toast.error("Enter personal identification number");
      return false;
    }

    if (!ssn_last_4.trim()) {
      toast.error("Enter your SSN last 4 digits");
      return false;
    }

    if (!dob.trim()) {
      toast.error("Enter your date of birth");
      return false;
    }

    if (!address.trim()) {
      toast.error("Enter your address");
      return false;
    }
    if (!country.trim()) {
      toast.error("Select your country");
      return false;
    }

    if (!state.trim()) {
      toast.error("Select your state");
      return false;
    }

    if (!city.trim()) {
      toast.error("Select your city");
      return false;
    }

    if (!postal_code.trim()) {
      toast.error("Select your postal code");
      return false;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!verification_document_front) {
      toast.error("Upload front of verification document");
      return false;
    } else if (!allowedTypes.includes(verification_document_front.type)) {
      toast.error("Front verification document must be JPG, JPEG, or PNG");
      return false;
    }

    if (!verification_document_back) {
      toast.error("Upload back of verification document");
      return false;
    } else if (!allowedTypes.includes(verification_document_back.type)) {
      toast.error("Back verification document must be JPG, JPEG, or PNG");
      return false;
    }

    return true;
  };

  const handleCardClick = async () => {
    const {
      bank_proof_document,
      bankProofType,
      account_number,
      account_holder_name,
      bank_name,
      confirm_account_number,
      routing_number,
      ...filteredDetails
    } = bankDetails;

    if (!validationCardDetails(filteredDetails)) {
      return;
    }
    setEnablePayment((prev) => !prev);
    const formData = new FormData();
    const dobArray = convertDOBToArray(bankDetails.dob);
    dobArray.forEach((item, index) => formData.append(`dob[${index}]`, item));
    formData.append("user_id", userId);
    // Append text fields
    formData.append("first_name", bankDetails.first_name);
    formData.append("last_name", bankDetails.last_name);
    formData.append("email", bankDetails.email);
    formData.append("phone_number", bankDetails.phone_number);
    formData.append("address", bankDetails.address);
    formData.append("country", bankDetails.country);
    formData.append("state", bankDetails.state);
    formData.append("city", bankDetails.city);
    formData.append("postal_code", bankDetails.postal_code);
    formData.append("id_number", bankDetails?.id_number);
    formData.append("ssn_last_4", bankDetails?.ssn_last_4);
    formData.append("id_type", bankDetails?.id_type);
    formData.append("token", striptoken);
    formData.append(
      "verification_document_front",
      bankDetails.verification_document_front
    );
    formData.append(
      "verification_document_back",
      bankDetails.verification_document_back
    );

    if (striptoken) {
      setEnablePayment((prev) => !prev);
      try {
        const response = await AddPayoutCard(formData);
        if (response.success) {
          setBankDetails(initialBankDetails, {
            city: "",
            state: "",
            country: "",
            zipcode: "",
          });
          setShowPayoutModal(false);
          showPayOutModal1 && setShowPayOutModal1(false);
          setRefresh((prev) => !prev);
          setStriptoken(null);
        } else {
          setEnablePayment(false);
          toast.error(response.message || "Failed to submit bank details.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.";

        toast.error(errorMessage);
        setEnablePayment(false);
      }
    }
  };

  useEffect(() => {
    if (striptoken) {
      handleCardClick();
    }
  }, [striptoken]);

  // const renderTextField = (label, placeholder, type = "text", value, onChange) => (

  // <>

  //  <Form.Group
  //     className="mb-3"
  //     style={{
  //       display: "flex",
  //       flexDirection: "column",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       width: "100%",
  //     }}
  //   >

  //     <Form.Label
  //       style={{
  //         alignSelf: "flex-start",
  //         marginBottom: "5px",
  //         fontSize: "14px",
  //         fontWeight: "500",
  //       }}
  //     >
  //       {label}
  //     </Form.Label>

  //      <img src="./images/cardbankPayment/accountholder.png"/>
  //     <Form.Control
  //       as={type === "textarea" ? "textarea" : "input"}
  //       type={type !== "textarea" ? type : undefined}
  //       placeholder={placeholder}
  //       value={value}
  //       onChange={onChange}
  //       style={{
  //         width: "100%",
  //         height: type === "textarea" ? "100px" : "40px",
  //         padding: "10px",
  //         fontSize: "16px",
  //         border: "1px solid #ccc",
  //         borderRadius: "25px",
  //         outline: "none",
  //         resize: "none",
  //       }}
  //     />
  //   </Form.Group>
  // </>

  // );

  const renderTextField = (
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    imageSrc = null // 👈 optional image argument
  ) => (
    <>
      <Form.Group
        className="mb-3"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Label */}
        <Form.Label
          style={{
            alignSelf: "flex-start",
            marginBottom: "5px",
            fontSize: isMobileWidth ? "13px" : "14px",
            fontWeight: "500",
            marginLeft: isMobileWidth && "40px",
          }}
        >
          {label}
        </Form.Label>

        {/* 👇 Conditionally render image if provided */}
        {imageSrc && isMobileWidth ? (
          // 👇 Flex container when image exists on mobile
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "10px", // space between image and input
            }}
          >
            {/* Image on the left */}
            <img
              src={imageSrc}
              alt="icon"
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                borderRadius: "50%",
                padding: "2px",
                bottom: "10px",
              }}
            />

            {placeholder === "Enter phone" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "50px",
                }}
              >
                <span
                  style={{ padding: "0 10px" }}
                  onClick={() => setShowNumberModal(true)}
                >
                  <img style={{ width: "20px" }} src={selectedCountryFlag} />{" "}
                  <span style={{ fontSize: "13px" }}>
                    {" "}
                    {selectedCountryCode || "+1"}{" "}
                    <FaSortDown
                      style={{
                        marginTop: "-11px",
                        width: "10px",
                        // height: "1px",
                        color: "#555",
                      }}
                    />{" "}
                  </span>
                </span>
                <Form.Control
                  as={type === "textarea" ? "textarea" : "input"}
                  // type={type !== "textarea" ? type : undefined}
                  type={type !== "textarea" ? "number" : undefined}
                  placeholder={placeholder}
                  className="input-placeholder"
                  value={value}
                  onChange={onChange}
                  style={{
                    flex: 1, // makes input take full remaining width
                    height:
                      type === "textarea"
                        ? isMobileWidth
                          ? "20px"
                          : "100px"
                        : "40px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: isMobileWidth ? "10px" : "25px",
                    outline: "none",
                    resize: "none",
                    background: isMobileWidth && "#f5f4f9",
                  }}
                />
              </div>
            ) : (
              <Form.Control
                as={type === "textarea" ? "textarea" : "input"}
                type={type !== "textarea" ? type : undefined}
                placeholder={placeholder}
                className="input-placeholder"
                value={value}
                onChange={onChange}
                style={{
                  flex: 1, // makes input take full remaining width
                  height:
                    type === "textarea"
                      ? isMobileWidth
                        ? "20px"
                        : "100px"
                      : "40px",
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: isMobileWidth ? "10px" : "25px",
                  outline: "none",
                  resize: "none",
                  background: isMobileWidth && "#f5f4f9",
                }}
              />
            )}
          </div>
        ) : (
          // 👇 Default: just input without image
          <Form.Control
            as={type === "textarea" ? "textarea" : "input"}
            type={type !== "textarea" ? type : undefined}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
              width: "100%",
              height: type === "textarea" ? "100px" : "40px",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "25px",
              outline: "none",
              resize: "none",
            }}
          />
        )}
      </Form.Group>
    </>
  );

  const renderFileUpload = (label, multiple = false) => (
    <Form.Group
      className="mb-3"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Form.Label
        style={{
          marginBottom: "5px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {label}
      </Form.Label>
      <div
        style={{
          display: isMobileWidth ? "" : "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        {/* <Form.Control
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (label === "Bank Proof :") {
              setBankDetails((prev) => ({
                ...prev,
                bank_proof_document: file,
              }));
            } else {
              setBankDetails((prev) => ({
                ...prev,
                verification_document_front: file,
              }));
            }
          }}
          style={{
            flex: "1",
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "25px",
            outline: "none",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        /> */}

        {isMobileWidth ? (
          //       <div
          //      style={{
          //     display: "flex",
          //     alignItems: "center",
          //     border: "1px solid #ccc",
          //     borderRadius: isMobileWidth ? "" : "25px",
          //     overflow: "hidden",
          //     width: "100%",   // or specify maxWidth like 400px
          //     maxWidth: "400px",
          //     backgroundColor: "#fafafa",
          //   }}
          // >
          //   <input
          //     ref={label === "Bank Proof :"?fileInputRef:fileInputRef1}
          //     type="file"
          //     multiple={multiple}
          //     accept="image/*"
          //     onChange={(e) => {
          //       const file = e.target.files[0];
          //       if (!file) return;

          //       if (label === "Bank Proof :") {
          //         setBankDetails((prev) => ({
          //           ...prev,
          //           bank_proof_document: file,
          //         }));
          //       } else {
          //         setBankDetails((prev) => ({
          //           ...prev,
          //           verification_document_front: file,
          //         }));
          //       }
          //     }}
          //     style={{
          //       flexGrow: 1,
          //       padding: "10px 14px",
          //       fontSize: "12px",
          //       border: "none",
          //       outline: "none",
          //       cursor: "pointer",
          //       backgroundColor: "#f5f4f9",
          //       minWidth: 0,  // important to allow shrinking inside flexbox

          //       appearance: "none",
          //       WebkitAppearance: "none",
          //       color: "black",

          //     }}
          //   />

          //   <img
          //     src="./images/cardbankPayment/upload.png"
          //     alt="upload icon"
          //     style={{
          //       backgroundColor: "rgb(74, 234, 177)",
          //       padding: "10px 14px",

          //       // height: "40px",  // fixed height
          //       // width: "40px",   // fixed width
          //       cursor: "pointer",
          //       objectFit: "contain",
          //       transition: "transform 0.2s ease",
          //     }}
          //     onClick={() =>{label === "Bank Proof :"?fileInputRef.current.click(): fileInputRef1.current.click()}}
          //     onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          //     onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          //   />
          //      </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: isMobileWidth ? "" : "25px",
              overflow: "hidden",
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#f5f4f9", // Matches your original input bg
              cursor: "pointer",
            }}
            onClick={() =>
              label === "Bank Proof :"
                ? fileInputRef.current.click()
                : fileInputRef1.current.click()
            }
          >
            {/* HIDDEN FILE INPUT */}
            <input
              ref={label === "Bank Proof :" ? fileInputRef : fileInputRef1}
              type="file"
              multiple={multiple}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (label === "Bank Proof :") {
                  setBankDetails((prev) => ({
                    ...prev,
                    bank_proof_document: file,
                  }));
                } else {
                  setBankDetails((prev) => ({
                    ...prev,
                    verification_document_front: file,
                  }));
                }
              }}
              style={{ display: "none" }} // Completely hide the messy native UI
            />

            {/* CUSTOM TEXT DISPLAY */}
            <div
              style={{
                flexGrow: 1,
                padding: "10px 14px",
                fontSize: "12px",
                color: "#555",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {/* Logic to show the file name or placeholder */}
              {label === "Bank Proof :"
                ? bankDetails.bank_proof_document?.name || "No file choosen"
                : bankDetails.verification_document_front?.name ||
                "No file choosen"}
            </div>

            {/* UPLOAD ICON */}
            <img
              src="./images/cardbankPayment/upload.png"
              alt="upload icon"
              style={{
                backgroundColor: "rgb(74, 234, 177)",
                padding: "10px 14px",
                cursor: "pointer",
                objectFit: "contain",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ) : (
          <Form.Control
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (label === "Bank Proof :") {
                setBankDetails((prev) => ({
                  ...prev,
                  bank_proof_document: file,
                }));
              } else {
                setBankDetails((prev) => ({
                  ...prev,
                  verification_document_front: file,
                }));
              }
            }}
            style={{
              flex: "1",
              padding: "8px",
              fontSize: "13px",
              border: "1px solid #ccc",
              borderRadius: "25px",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          />
        )}

        {label !== "Bank Proof :" && (
          <>
            {isMobileWidth ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: isMobileWidth ? "" : "25px",
                  overflow: "hidden",
                  width: "100%", // or specify maxWidth like 400px
                  maxWidth: "400px",
                  // backgroundColor: "#fafafa",
                  backgroundColor: "#f5f4f9", // Matches your original input bg
                  marginTop: "10px",
                }}
              >
                {/* <input
    type="file"
    multiple={multiple}
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (label === "Bank Proof :") {
        setBankDetails((prev) => ({
          ...prev,
          bank_proof_document: file,
        }));
      } else {
        setBankDetails((prev) => ({
          ...prev,
          verification_document_front: file,
        }));
      }
    }}
    style={{
      flexGrow: 1,
      padding: "10px 14px",
      fontSize: "14px",
      border: "none",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "transparent",
      minWidth: 0,  // important to allow shrinking inside flexbox
    }}
  /> */}

                {/* <Form.Control
            ref={label !== "Bank Proof :"&& fileInputRef3}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => {
              const file = e.target.files[0];
              setBankDetails((prev) => ({
                ...prev,
                verification_document_back: file,
              }));
            }}
            style={{
              flex: "1",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "0px",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          />


  <img
    src="./images/cardbankPayment/upload.png"
    alt="upload icon"
    style={{
      backgroundColor: "rgb(74, 234, 177)",
      padding: "10px 14px",
     
      // height: "40px",  // fixed height
      // width: "40px",   // fixed width
      cursor: "pointer",
      objectFit: "contain",
      transition: "transform 0.2s ease",
    }}
    onClick={() => { label !== "Bank Proof :" && fileInputRef3.current.click()}}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  /> */}

                <input
                  ref={label !== "Bank Proof :" && fileInputRef3}
                  type="file"
                  accept="image/*"
                  multiple={multiple}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setBankDetails((prev) => ({
                      ...prev,
                      verification_document_back: file,
                    }));
                  }}
                  style={{
                    // flex: "1",
                    // padding: "8px",
                    // fontSize: "14px",
                    // border: "1px solid #ccc",
                    // borderRadius: "0px",
                    // outline: "none",
                    // backgroundColor: "#fff",
                    // cursor: "pointer",
                    display: "none",
                  }}
                />

                <div
                  style={{
                    flexGrow: 1,
                    padding: "10px 14px",
                    fontSize: "12px",
                    color: "#555",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {/* Logic to show the file name or placeholder */}
                  {bankDetails.verification_document_back
                    ? bankDetails.verification_document_back.name
                    : "No file chosen"}
                </div>

                <img
                  src="./images/cardbankPayment/upload.png"
                  alt="upload icon"
                  style={{
                    backgroundColor: "rgb(74, 234, 177)",
                    padding: "10px 14px",

                    // height: "40px",  // fixed height
                    // width: "40px",   // fixed width
                    cursor: "pointer",
                    objectFit: "contain",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => {
                    label !== "Bank Proof :" && fileInputRef3.current.click();
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>
            ) : (
              <Form.Control
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setBankDetails((prev) => ({
                    ...prev,
                    verification_document_back: file,
                  }));
                }}
                style={{
                  flex: "1",
                  padding: "8px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "25px",
                  outline: "none",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              />
            )}
          </>
        )}
      </div>
    </Form.Group>
  );

  // for id type
  const renderIdTypeSelect = (
    label,
    options,
    value,
    onChange,
    imageSrc = null
  ) => (
    <Form.Group
      className="mb-3"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Form.Label
        style={{
          alignSelf: "flex-start",
          marginBottom: "5px",
          fontSize: "14px",
          fontWeight: "500",
          marginLeft: isMobileWidth && "38px",
        }}
      >
        <option value="">{`${label == "SelectBankProofType" ? "Select Bank Proof Type" : label
          }`}</option>
      </Form.Label>

      {imageSrc && isMobileWidth ? (
        // 👇 Flex container when image exists on mobile
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "10px", // space between image and input
          }}
        >
          {/* Image on the left */}
          <img
            src={imageSrc}
            alt="icon"
            style={{
              width: "25px",
              height: "25px",
              objectFit: "contain",
              borderRadius: "50%",
              backgroundColor: "#ffc10730",
              padding: "2px",
              bottom: "10px",
            }}
          />

          <Form.Select
            value={value}
            onChange={onChange}
            style={{
              width: "100%",
              height: "40px",
              padding: "8px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
              backgroundColor: isMobileWidth && "#f5f4f9",
            }}
          >
            <option value="">
              {label === "SelectBankProofType"
                ? "Select Bank Proof Type"
                : label}
            </option>

            {options.map((option, index) => (
              <option key={index} value={option}>
                {option
                  ?.split("_")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ") || option}
              </option>
            ))}
          </Form.Select>
        </div>
      ) : (
        <Form.Select
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            height: "40px",
            padding: "8px 10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "25px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            outline: "none",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="">
            {label === "SelectBankProofType" ? "Select Bank Proof Type" : label}
          </option>

          {options.map((option, index) => (
            <option key={index} value={option}>
              {option
                ?.split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ") || option}
            </option>
          ))}
        </Form.Select>
      )}
    </Form.Group>
  );

  useEffect(() => {
    setBankDetails(initialBankDetails, {
      city: "",
      state: "",
      country: "",
      zipcode: "",
    });
  }, [!showPayoutModal]);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: isMobileWidth ? "167px" : "max-content",
        }}
      >
        {/* Dropdown Toggle */}
        {!modalText && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "500",
              padding: "12px",
              paddingLeft: "0",
              cursor: "pointer",
              borderRadius: "8px",
              background: "#fff",
              width: "185px",
              color: "#000",
            }}
            onClick={togglePayoutDropdown}
          >
            Payout Method
            <span>
              <i
                className="fa-solid fa-chevron-down"
                style={{
                  transition: "transform 0.3s",
                  fontSize: "14px",
                  transform: payoutDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              ></i>
            </span>
          </div>
        )}

        {/* Dropdown List */}
        {payoutDropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "40%",
              left: "0",
              marginTop: "5px",
              padding: "10px",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              minWidth: isMobileWidth ? "320px" : "380px",
              // zIndex: ,
            }}
          >
            {/* Banks */}
            <h6
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "5px 10px",
              }}
            >
              Bank
            </h6>
            {payoutMethods.banks.map((bank) => (
              <div
                key={bank.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                }}
              >
                <Loader visible={isLoading} />
                {/* Bank Details */}
                <div
                  style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                >
                  <i
                    className="fa-solid fa-university"
                    style={{ marginRight: "8px" }}
                  ></i>
                  <span>
                    {bank.bank_name} ....{bank?.last_four_digits}(
                    {bank?.currency})
                  </span>
                  {bank.default_for_currency && (
                    <p
                      style={{
                        color: "black",
                        fontSize: "15px",
                        fontWeight: "400",
                        marginLeft: "auto",
                        marginRight: "10px",
                        marginBottom: "2px",
                      }}
                    >
                      Preferred
                    </p>
                  )}
                </div>

                {/* Menu Dropdown */}
                <div style={{ position: "relative" }}>
                  <i
                    className="fa-solid fa-ellipsis-vertical"
                    style={{
                      cursor: "pointer",
                      fontSize: "17px",
                      color: "#555",
                    }}
                    onClick={() => {
                      togglePayoutMenu(bank.id);
                      setCurrentCard(bank.id);
                    }}
                  ></i>

                  {/* Dropdown Menu */}
                  <div
                    style={{
                      position: "absolute",
                      right: "-10px",
                      top: "25px",
                      background: "#fff",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "4px",
                      padding: "5px 8px",
                      minWidth: "120px",
                      fontSize: "12px",
                      zIndex: 10,
                      whiteSpace: "nowrap",
                      transition:
                        "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                      opacity: payoutMenuOpen == bank.id ? 1 : 0,
                      transform:
                        payoutMenuOpen == bank.id
                          ? "translateY(0)"
                          : "translateY(-5px)",
                      visibility:
                        payoutMenuOpen === bank.id ? "visible" : "hidden",
                    }}
                  >
                    {!bank.default_for_currency && (
                      <a
                        onClick={() => {
                          handleSetPreferred(bank);
                          // setPreferred("bank", bank.id);
                          setPreferred("banks", bank.id);
                        }}
                        style={{
                          display: "block",
                          padding: "6px",
                          color: "#333",
                          textDecoration: "none",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Make as Preferred
                      </a>
                    )}
                    <a
                      style={{
                        display: "block",
                        padding: "6px",
                        color: "#d9534f",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowDeleteModalBank(true)}
                    >
                      Remove
                    </a>
                  </div>
                </div>

                {showDeleteModalBank && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1050,
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        borderRadius: "13px",
                        backgroundColor: "white",
                        padding: "20px",
                        maxWidth: "400px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => setShowDeleteModalBank(false)}
                          style={{
                            background: "black",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <div style={{ textAlign: "center", padding: "0 20px" }}>
                        <h3
                          style={{
                            fontWeight: "400",
                            fontSize: "28px",
                            color: "#000000",
                            marginBottom: "10px",
                            fontFamily: "sans-serif poppins",
                          }}
                        >
                          Delete
                        </h3>

                        <div style={{ margin: "20px 0" }}>
                          <img
                            src={vector}
                            loading="lazy"
                            alt="delete"
                            style={{
                              width: "90px",
                              height: "90px",
                              marginBottom: "20px",
                            }}
                          />
                        </div>

                        <p style={{ marginBottom: "30px" }}>
                          Are you sure you want to delete this property ?
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px",
                            marginBottom: "20px",
                          }}
                        >
                          <button
                            onClick={() => handleRemove(currentCard)}
                            style={{
                              padding: "10px 50px",
                              borderRadius: "50px",
                              border: "none",
                              backgroundColor: "#4AEAB1",
                              color: "#000",
                              cursor: "pointer",
                            }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowDeleteModalBank(false)}
                            style={{
                              padding: "10px 37px",
                              border: "1px solid #4AEAB1",
                              borderRadius: "50px",
                              backgroundColor: "#fff",
                              color: "#000",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Debit Cards */}
            <h6
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "5px 10px",
                marginTop: "10px",
              }}
            >
              Debit Cards
            </h6>
            {payoutMethods.cards.map((card) => (
              <div
                key={card.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                }}
              >
                {/* Card Details */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexGrow: 1,
                  }}
                >
                  <img
                    src={
                      card?.brand == "Visa"
                        ? visaCard
                        : mastercard || "/images/payment-methods/visa.svg"
                    }
                    alt={card?.brand || "visa"}
                    style={{ width: "30px", height: "auto" }}
                  />
                  <h4
                    style={{
                      margin: "0 8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    **** {card.last_four_digits}
                  </h4>
                  {card.default_for_currency && (
                    <p
                      style={{
                        color: "black",
                        fontSize: "15px",
                        fontWeight: "400",
                        marginLeft: "auto",
                        marginRight: "10px",
                        marginBottom: "2px",
                      }}
                    >
                      Preferred
                    </p>
                  )}
                </div>

                {/* Menu Dropdown */}
                <div style={{ position: "relative" }}>
                  <i
                    ref={iconRef}
                    className="fa-solid fa-ellipsis-vertical"
                    style={{
                      cursor: "pointer",
                      fontSize: "17px",
                      color: "#555",
                    }}
                    onClick={() => togglePayoutMenu(card.id)}
                  ></i>

                  {/* Dropdown Menu */}
                  <div
                    ref={menuRef}
                    style={{
                      position: "absolute",
                      right: "-10px",
                      top: "20px",
                      background: "#fff",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "4px",
                      padding: "5px 8px",
                      minWidth: "120px",
                      fontSize: "12px",
                      zIndex: 10,
                      whiteSpace: "nowrap",
                      opacity: payoutMenuOpen === card.id ? 1 : 0,
                      transform:
                        payoutMenuOpen === card.id
                          ? "translateY(0)"
                          : "translateY(-5px)",
                      visibility:
                        payoutMenuOpen === card.id ? "visible" : "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {!card?.default_for_currency && (
                        <a
                          onClick={() => {
                            handleSetPreferred(card);
                            setPreferred("cards", card.id);
                          }}
                          style={{
                            display: "block",
                            padding: "6px",
                            color: "#333",
                            textDecoration: "none",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          Make as Preferred
                        </a>
                      )}
                      <a
                        style={{
                          display: "block",
                          padding: "6px",
                          color: "#d9534f",
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowDeleteModalCard(true)}
                      >
                        Remove
                      </a>
                    </div>
                  </div>
                </div>

                {showDeleteModalCard && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1050,
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        borderRadius: "13px",
                        backgroundColor: "white",
                        padding: "20px",
                        maxWidth: "400px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => setShowDeleteModalCard(false)}
                          style={{
                            background: "black",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <div style={{ textAlign: "center", padding: "0 20px" }}>
                        <h3
                          style={{
                            fontWeight: "400",
                            fontSize: "28px",
                            color: "#000000",
                            marginBottom: "10px",
                            fontFamily: "sans-serif poppins",
                          }}
                        >
                          Delete
                        </h3>

                        <div style={{ margin: "20px 0" }}>
                          <img
                            src={vector}
                            loading="lazy"
                            alt="delete"
                            style={{
                              width: "90px",
                              height: "90px",
                              marginBottom: "20px",
                            }}
                          />
                        </div>

                        <p style={{ marginBottom: "30px" }}>
                          Are you sure you want to delete this property ?
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px",
                            marginBottom: "20px",
                          }}
                        >
                          <button
                            onClick={() => handleRemove(card?.id)}
                            style={{
                              padding: "10px 50px",
                              borderRadius: "50px",
                              border: "none",
                              backgroundColor: "#4AEAB1",
                              color: "#000",
                              cursor: "pointer",
                            }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowDeleteModalCard(false)}
                            style={{
                              padding: "10px 37px",
                              border: "1px solid #4AEAB1",
                              borderRadius: "50px",
                              backgroundColor: "#fff",
                              color: "#000",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!modalText && (
          <div style={{ margin: "-8px" }}>
            <Button
              onClick={() => setShowPayoutModal(true)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#fff",
                color: "black",
                border: "1px solid #b6b6b8",
                borderRadius: "20px",
                padding: "10px 13px",
                fontWeight: "400",
                fontSize: "16px",
                cursor: "pointer",
                height: "45px",
                width: isMobileWidth ? "76%" : "80%",
                margin: "5px 5px",
              }}
            >
              Add Card
              <div
                style={{
                  display: "flex",
                  height: isMobileWidth ? "20px" : "25px",
                  width: isMobileWidth ? "20px" : "25px",
                  borderRadius: "50%",
                  backgroundColor: "#2EE5A1",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <i className="fa-solid fa-plus"></i>
              </div>
            </Button>
          </div>
        )}
      </div>
      {/* Bank Payout modal */}
      <Modal
        className="add-payout-modal custom-modal-css"
        show={showPayoutModal}
        onHide={() => {
          showPayOutModal1 && setShowPayOutModal1(false);
          setShowPayoutModal(false);
        }}
        size="lg"
        centered
        dialogClassName={isMobileWidth ? "mobile-fullscreen-modal" : ""}
        contentClassName={isMobileWidth ? "mobile-fullscreen-content" : ""}
        style={isMobileWidth ? { margin: 0, maxWidth: "100vw" } : {}}
      >
        <Modal.Body
          style={{
            padding: isMobileWidth ? "" : "30px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            height: isMobileWidth ? "100vh" : "auto",
            overflowY: isMobileWidth ? "auto" : "visible",
            marginBottom: isMobileWidth && "66px",
          }}
        >
          {isMobileWidth && (
            <div className="mob-search-filter border-start-0 border-end-0">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mob-search-filter-in">
                      <div className="mob-search-bar-back">
                        {/* <Link to="/profile"> */}
                        <div
                          onClick={() => {
                            setShowPayoutModal(false);
                            showPayOutModal1 && setShowPayOutModal1(false);
                          }}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: "50%",
                            backgroundColor: "white",
                            padding: "10px",
                          }}
                        >
                          <i
                            className="fa-regular fa-arrow-left"
                            style={{ textAlign: "center", fontWeight: "700" }}
                          ></i>
                        </div>
                        {/* </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mob-design">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center">
              <h5
                style={{
                  fontWeight: isMobileWidth ? "500" : "600",
                  margin: "0 auto",
                  fontSize: isMobileWidth ? "16px" : "20px",
                  // borderBottom: "2px solid #ddd",
                  // paddingBottom: "10px",
                  width: "100%",
                  textAlign: "center",
                  marginTop: isMobileWidth && "10px",
                }}
              >
                {isMobileWidth ? "Select Payout Method" : "Add Payout Method"}
              </h5>

              {!isMobileWidth && (
                <X
                  onClick={() => {
                    setShowPayoutModal(false);
                    showPayOutModal1 && setShowPayOutModal1(false);
                  }}
                  className="close-modal"
                  style={
                    isMobileWidth
                      ? {
                        position: "absolute",
                        right: "15px",
                        top: "15px",
                        zindex: 1,
                      }
                      : {}
                  }
                />
              )}
            </div>

            {/* Payment Method Tabs */}

            <div
              className="d-flex justify-content-center mt-3"
              style={{
                backgroundColor: "#D4D4D480",
                borderRadius: "30px",
                margin: isMobileWidth && "auto",
                width: isMobileWidth && "fit-content",
              }}
            >
              <Button
                onClick={() => {
                  setSelectedMethod("bank");
                  setEnablePayment(true);
                }}
                style={{
                  borderRadius: "30px",
                  padding: isMobileWidth ? "12px 30px" : "12px 25px",
                  backgroundColor:
                    selectedMethod === "bank" ? "#4AEAB1" : "transparent",
                  color: selectedMethod === "bank" ? "#000" : "#000",
                  border: "none",
                  fontWeight: isMobileWidth ? "" : "500",
                  fontSize: isMobileWidth ? "13px" : "16px",
                  transition: "all 0.3s ease-in-out",
                  width: isMobileWidth ? "" : "50%",
                }}
              >
                Bank Account
              </Button>
              <Button
                onClick={() => setSelectedMethod("debit")}
                style={{
                  borderRadius: "30px",
                  padding: isMobileWidth ? "12px 42px" : "12px 25px",
                  backgroundColor:
                    selectedMethod === "debit" ? "#4AEAB1" : "transparent",
                  color: selectedMethod === "debit" ? "#000" : "#000",
                  border: "none",
                  fontWeight: isMobileWidth ? "" : "500",
                  fontSize: isMobileWidth ? "13px" : "16px",
                  transition: "all 0.3s ease-in-out",
                  width: isMobileWidth ? "" : "50%",
                }}
              >
                Debit Card
              </Button>
            </div>

            {/* Form Section */}
            <div
              className="mt-4 add-payout-form"
              style={{
                textAlign: "left",
                padding: "1 0px 0px",
                maxHeight: isMobileWidth ? "calc(100vh - 120px)" : "auto",
                overflowY: isMobileWidth ? "auto" : "visible",
                backgroundColor: isMobileWidth && "#fff",
                borderRadius: isMobileWidth && "10px",
                padding: isMobileWidth && "10px",
              }}
            >
              <Loader visible={isLoading} />

              {isMobileWidth && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "10px 0px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {selectedMethod == "bank" ? (
                    <span>Bank Account</span>
                  ) : (
                    <span>Debit Card</span>
                  )}
                </div>
              )}

              {/* <Form> */}
              {/* {renderTextField(
              "First Name :",
              "Enter first name",
              "text",
              bankDetails.first_name,
              (e) =>
                setBankDetails({
                  ...bankDetails,
                  first_name: e.target.value,
                }),
              {
                style: {
                  borderRadius: "50px",
                  padding: isMobileWidth?"0px 20px":"10px 25px",
                  border: "1px solid #ccc",
                  width: "100%",
                  fontSize: isMobileWidth?"12px":"14px",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                  outline: "none",
                  border:'10px solid black'
                },
              }
            )} */}

              {renderTextField(
                "First Name :",
                "Enter first name",
                "text",
                bankDetails.first_name,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    first_name: e.target.value,
                  }),
                "./images/cardbankPayment/accountholder.png",
                {
                  style: {
                    borderRadius: "50px",
                    padding: "10px 25px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: isMobileWidth ? "12px" : "14px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                    outline: "none",
                  },
                }
              )}
              {renderTextField(
                "Last Name :",
                "Enter last name",
                "text",
                bankDetails.last_name,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    last_name: e.target.value,
                  }),
                "./images/cardbankPayment/accountholder.png", // 👈 image here
                {
                  style: {
                    borderRadius: "50px",
                    padding: "10px 25px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: isMobileWidth ? "12px" : "14px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                    outline: "none",
                  },
                }
              )}
              {renderTextField(
                "Email :",
                "Enter email",
                "email",
                bankDetails.email,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    email: e.target.value,
                  }),
                "./images/cardbankPayment/email.png"
              )}

              {renderTextField(
                "Phone Number :",
                "Enter phone",
                "text",
                bankDetails.phone_number,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    phone_number: e.target.value,
                  }),
                "./images/cardbankPayment/phone.png"
              )}

              {/*  for dOB part */}
              <Form.Group
                className="mb-3 dob-dateRange-picker"
                style={{ width: "100%" }}
              >
                <Form.Label
                  style={{
                    fontWeight: "500",
                    marginLeft: isMobileWidth && "40px",
                    fontSize: isMobileWidth && "13px",
                  }}
                >
                  Date of Birth
                </Form.Label>

                {isMobileWidth ? (
                  // 👇 Flex container for mobile view (image + input)
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "10px", // space between image and input
                    }}
                  >
                    {/* Image on the left */}
                    <img
                      src="/images/cardbankPayment/dob.png"
                      alt="icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        backgroundColor: "#ffc10730",
                        padding: "2px",
                        bottom: "10px",
                      }}
                    />

                    {/* Date input field */}
                    {/* <Form.Control
      ref={inputRef}
      type="date"
      value={bankDetails.dob}
      max={new Date().toISOString().split("T")[0]}
      onClick={() => {
        inputRef.current?.showPicker?.();
      }}
      onChange={(e) =>
        setBankDetails({ ...bankDetails, dob: e.target.value })
      }
      style={{
        flex: 1, // makes input fill remaining space beside image
        height: "40px",
        padding: "8px 10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "25px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        outline: "none",
        backgroundColor: "#fff",
        cursor: "pointer",
        margin: "0 auto",
      }}
    /> */}
                    <DatePicker
                      selected={
                        bankDetails.dob
                          ? parse(bankDetails.dob, "MM-dd-yyyy", new Date())
                          : null
                      }
                      onChange={(date) =>
                        setBankDetails({
                          ...bankDetails,
                          dob: format(date, "MM-dd-yyyy"),
                        })
                      }
                      dateFormat="MM-dd-yyyy"
                      placeholderText="MM-DD-YYYY"
                      dropdownMode="select"
                      className="input-placeholder form-control"
                      showMonthDropdown="true"
                      showYearDropdown="true"
                      // showMonthYearDropdown="true"
                      maxDate={new Date()}
                      scrollableYearDropdown
                      yearDropdownItemNumber={10}
                      style={{
                        width: "100%",
                        height: "40px",
                        borderRadius: "25px",
                      }}
                    />
                  </div>
                ) : (
                  // 👇 Desktop version (just input)
                  // <Form.Control
                  //   ref={inputRef}
                  //   type="date"
                  //   value={bankDetails.dob}
                  //   max={new Date().toISOString().split("T")[0]}
                  //   onClick={() => {
                  //     inputRef.current?.showPicker?.();
                  //   }}
                  //   onChange={(e) =>
                  //     setBankDetails({ ...bankDetails, dob: e.target.value })
                  //   }
                  //   style={{
                  //     width: "100%",
                  //     height: "40px",
                  //     padding: "8px 10px",
                  //     fontSize: "16px",
                  //     border: "1px solid #ccc",
                  //     borderRadius: "25px",
                  //     boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  //     outline: "none",
                  //     backgroundColor: "#fff",
                  //     cursor: "pointer",
                  //     margin: "0 auto",
                  //   }}
                  // />

                  <DatePicker
                    selected={
                      bankDetails.dob
                        ? parse(bankDetails.dob, "MM-dd-yyyy", new Date())
                        : null
                    }
                    onChange={(date) =>
                      setBankDetails({
                        ...bankDetails,
                        dob: format(date, "MM-dd-yyyy"),
                      })
                    }
                    dateFormat="MM-dd-yyyy"
                    placeholderText="MM-DD-YYYY"
                    dropdownMode="select"
                    className="form-control"
                    showMonthDropdown="true"
                    showYearDropdown="true"
                    // showMonthYearDropdown="true"
                    scrollableYearDropdown
                    maxDate={new Date()}
                    yearDropdownItemNumber={10}
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "25px",
                    }}
                  />
                )}
              </Form.Group>

              {renderIdTypeSelect(
                "ID Type",
                ["driver_license", "passport"],
                bankDetails.id_type,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    id_type: e.target.value,
                  }),
                "./images/cardbankPayment/license.png"
              )}

              {renderTextField(
                "Personal identification number",
                "personal identification number",
                "number",
                bankDetails.id_number,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    id_number: e.target.value,
                  }),
                "./images/cardbankPayment/license.png"
              )}
              {renderTextField(
                "SSN (Last 4 Number)",
                "SSN",
                "number",
                bankDetails.ssn_last_4,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    ssn_last_4: e.target.value,
                  }),
                "./images/cardbankPayment/ssn_icon.svg"
              )}

              {renderTextField(
                "Address :",
                "Enter address",
                "input",
                bankDetails.address,
                (e) =>
                  setBankDetails({
                    ...bankDetails,
                    address: e.target.value,
                  }),
                "./images/cardbankPayment/address.png"
              )}

              <div
                className="form-group"
                style={{
                  width: "100%",
                  margin: "0 auto",
                  marginBottom: "20px",
                }}
              >
                {/* Country */}

                {isMobileWidth && (
                  <span className="address-title">Country:</span>
                )}

                {isMobileWidth ? (
                  // 👇 Flex container for mobile view (image + input)
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "10px", // space between image and input
                    }}
                  >
                    {/* Image on the left */}
                    <img
                      src="/images/cardbankPayment/country.png"
                      alt="icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        backgroundColor: "#ffc10730",
                        padding: "2px",
                        bottom: "10px",
                      }}
                    />

                    <select
                      className="custom-input"
                      value={selectedCountry}
                      onChange={(e) => {
                        setBankDetails({
                          ...bankDetails,
                          country: e.target.value,
                          state: "",
                          city: "",
                        });
                        setSelectedCountry(e.target.value);
                      }}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        padding: "12px",
                        marginTop: "10px",
                        border: "1px solid rgb(204, 204, 204)",
                        fontSize: isMobileWidth && "13px",
                        background: isMobileWidth && "#f5f4f9",
                        appearance: "none",
                        WebkitAppearance: "none",
                        color: "black",
                      }}
                    >
                      <option value="" className="input-placeholder">
                        Select Country
                      </option>

                      {countries1.map((country) => (
                        <option key={country.iso2} value={country.iso2}>
                          {country.name} ({country.iso2})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <select
                    className="custom-input "
                    value={selectedCountry}
                    onChange={(e) => {
                      setBankDetails({
                        ...bankDetails,
                        country: e.target.value,
                        state: "",
                        city: "",
                      });
                      setSelectedCountry(e.target.value);
                    }}
                    style={{
                      width: "100%",
                      borderRadius: "30px",
                      padding: "12px",
                      marginTop: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                    }}
                  >
                    <option value="">Select Country</option>

                    {countries1.map((country) => (
                      <option key={country.iso2} value={country.iso2}>
                        {country.name} ({country.iso2})
                      </option>
                    ))}
                  </select>
                )}

                {/* State */}
                {isMobileWidth && <span className="address-title">State:</span>}
                {isMobileWidth ? (
                  // 👇 Flex container for mobile view (image + input)
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "10px", // space between image and input
                    }}
                  >
                    {/* Image on the left */}
                    <img
                      src="/images/cardbankPayment/state.png"
                      alt="icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        backgroundColor: "#ffc10730",
                        padding: "2px",
                        bottom: "10px",
                      }}
                    />

                    <select
                      className="custom-input"
                      value={selectedState}
                      onChange={(e) => {
                        setBankDetails({
                          ...bankDetails,
                          state: e.target.value,
                          city: "", // Reset city when state changes
                        });
                        setSelectedState(e.target.value);
                      }}
                      disabled={!bankDetails.country}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        padding: "12px",
                        marginTop: "10px",
                        border: "1px solid rgb(204, 204, 204)",
                        fontSize: isMobileWidth && "13px",
                        background: isMobileWidth && "#f5f4f9",
                        appearance: "none",
                        WebkitAppearance: "none",
                        color: "black",
                      }}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.iso2} value={state.iso2}>
                          {state.name} ({state.iso2})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <select
                    className="custom-input"
                    value={selectedState}
                    onChange={(e) => {
                      setBankDetails({
                        ...bankDetails,
                        state: e.target.value,
                        city: "", // Reset city when state changes
                      });
                      setSelectedState(e.target.value);
                    }}
                    disabled={!bankDetails.country}
                    style={{
                      width: "100%",
                      borderRadius: "30px",
                      padding: "12px",
                      marginTop: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                    }}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.iso2} value={state.iso2}>
                        {state.name} ({state.iso2})
                      </option>
                    ))}
                  </select>
                )}

                {/* City */}

                {isMobileWidth && <span className="address-title">City:</span>}
                {isMobileWidth ? (
                  // 👇 Flex container for mobile view (image + input)
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "10px", // space between image and input
                    }}
                  >
                    {/* Image on the left */}
                    <img
                      src="/images/cardbankPayment/city.png"
                      alt="icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        backgroundColor: "#ffc10730",
                        padding: "2px",
                        bottom: "10px",
                      }}
                    />

                    <select
                      className="custom-input"
                      disabled={!bankDetails.state}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        padding: "12px",
                        marginTop: "10px",
                        border: "1px solid rgb(204, 204, 204)",
                        fontSize: isMobileWidth && "13px",
                        background: isMobileWidth && "#f5f4f9",
                        appearance: "none",
                        WebkitAppearance: "none",
                        color: "black",
                      }}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          city: e.target.value,
                        })
                      }
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <select
                    className="custom-input"
                    disabled={!bankDetails.state}
                    style={{
                      width: "100%",
                      borderRadius: "30px",
                      padding: "12px",
                      marginTop: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                    }}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        city: e.target.value,
                      })
                    }
                  >
                    <option value="">Select City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Zipcode */}
                {isMobileWidth && (
                  <span className="address-title">
                    {isMobileWidth ? "Postal code:" : "Zipcode:"}
                  </span>
                )}

                {isMobileWidth ? (
                  // 👇 Flex container for mobile view (image + input)
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "10px", // space between image and input
                    }}
                  >
                    {/* Image on the left */}
                    <img
                      src="/images/cardbankPayment/postalcode.png"
                      alt="icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        backgroundColor: "#ffc10730",
                        padding: "2px",
                        bottom: "10px",
                      }}
                    />

                    <input
                      type="number"
                      name="zipcode"
                      value={zipcode}
                      onChange={(e) => {
                        setBankDetails({
                          ...bankDetails,
                          postal_code: e.target.value,
                        });
                        setZipcode(e.target.value);
                      }}
                      placeholder="Zipcode"
                      className="custom-input input-placeholder"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        padding: "12px",
                        marginTop: "10px",
                        border: "1px solid rgb(204, 204, 204)",
                        fontSize: isMobileWidth && "13px",
                        background: isMobileWidth && "#f5f4f9",
                      }}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    name="zipcode"
                    value={zipcode}
                    onChange={(e) => {
                      setBankDetails({
                        ...bankDetails,
                        postal_code: e.target.value,
                      });
                      setZipcode(e.target.value);
                    }}
                    placeholder="Zipcode"
                    className="custom-input"
                    style={{
                      width: "100%",
                      borderRadius: "30px",
                      padding: "12px",
                      marginTop: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                    }}
                  />
                )}
              </div>

              {selectedMethod === "bank" && (
                <>
                  {renderTextField(
                    "Bank Name :",
                    "Enter Bank Name",
                    "text",
                    bankDetails.bank_name,
                    (e) =>
                      setBankDetails({
                        ...bankDetails,
                        bank_name: e.target.value,
                      }),
                    "/images/cardbankPayment/bankname.png"
                  )}
                  {renderTextField(
                    "Account Holder Name :",
                    "Enter Account Holder Name",
                    "text",
                    bankDetails.account_holder_name,
                    (e) =>
                      setBankDetails({
                        ...bankDetails,
                        account_holder_name: e.target.value,
                      }),
                    "./images/cardbankPayment/accountholder.png"
                  )}
                  {renderTextField(
                    "Bank Account Number :",
                    "Enter Account Number",
                    "number",

                    bankDetails.account_number,
                    (e) =>
                      setBankDetails({
                        ...bankDetails,
                        account_number: e.target.value,
                      }),
                    "./images/cardbankPayment/bankaccountnumber.png"
                  )}
                  {renderTextField(
                    "Confirm Account Number :",
                    "Confirm Account Number",
                    "number",
                    bankDetails.confirm_account_number,
                    (e) =>
                      setBankDetails({
                        ...bankDetails,
                        confirm_account_number: e.target.value,
                      }),
                    "./images/cardbankPayment/bankaccountnumber.png"
                  )}
                  {renderTextField(
                    "Routing Number :",
                    "Enter Routing Number",
                    "number",
                    bankDetails.routing_number,
                    (e) =>
                      setBankDetails({
                        ...bankDetails,
                        routing_number: e.target.value,
                      }),
                    "./images/cardbankPayment/routingnumber.png"
                  )}

                  {renderIdTypeSelect(
                    "SelectBankProofType",
                    ["bank_statement", "voided_check", "bank_letterhead"],
                    bankDetails.bankProofType,
                    (e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankProofType: e.target.value,
                      }),
                    "./images/cardbankPayment/bankname.png"
                  )}
                  {renderFileUpload("Bank Proof :")}
                </>
              )}

              {selectedMethod == "debit" && (
                <div className="d-flex justify-content-center align-items-center ml-3">
                  <StripePayment
                    enablePayment={enablePayment}
                    callBack={(txt) => setStriptoken(txt)}
                    allowCard={"debit"}
                  />
                </div>
              )}

              {renderFileUpload("Verification Document (front & back) :", true)}

              <Button
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "12px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#fff",
                  width: "100%",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
                onClick={() =>
                  selectedMethod === "bank" ? handleSubmit() : handleCardClick()
                }
              >
                {selectedMethod === "bank" ? "Add Bank" : "Add Card"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
      </Modal>

      {/* //Css for popups to cover full width of mobile */}

      {/* //Css for popups to cover full width of mobile */}
    </>
  );
};

export default CardBankPayment;
