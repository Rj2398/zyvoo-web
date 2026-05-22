import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { RiArrowDropDownLine } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import VerificationModal from "./OtpVerification";
import Loader from "../../Loader";
import countries from "world-countries";
import { isValidNumber } from "libphonenumber-js";
import { toast } from "react-toastify";

function PhoneVerification({ show, handleClose, USERID }) {
  const { send_phone_verification_otp, isLoading } = useAuth();
  const [verificationByEmailModal, setVerifictionByEmailModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, } = useForm();
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
     const [showNumberModal, setShowNumberModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const verifiedPhone = "true";
  // function getCountryInfo(countryName) {
  //   const country = countries.find(
  //     (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
  //   );
  //   if (!country) return "Country not found";
  //   setSelectedCountryFlag(`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`);
  //   setSelectedCountryCode(`${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ""}`);
  //   setSelectedCountry(countryName);
  // }


function getCountryInfo(countryName) {
  const country = countries.find((c) => c.name.common.toLowerCase() === countryName.toLowerCase());

  if (!country) return "Country not found";

  // Set country flag
  setSelectedCountryFlag(`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`);

  // ✅ Build the full main calling code
  const root = country.idd?.root || "";
  const suffix = country.idd?.suffixes?.[0] || "";
  const fullCode = `${root}${suffix}`;

  setSelectedCountryCode(countryName == "United States" ? "+1" : fullCode);
  setSelectedCountry(countryName);
}




    const filteredCountries = countries
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .filter((c) =>
        c.name.common?.toLowerCase()?.includes(searchInput?.toLowerCase())
      );

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

  const onSubmit = async (data) => {
    try {
      const response = await send_phone_verification_otp({
        user_id: USERID,
        phone_number: data?.phoneNumber,
        country_code: selectedCountryCode, 
      });
      if (response) {
        handleClose();
        setSelectedPhone(data?.phoneNumber);
        setVerifictionByEmailModal(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    reset();
  };
  const handleModalClose = () => {
    toast.error(null);
    reset();
    handleClose();
  };
  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="md" centered dialogClassName="custom-modal" 
        aria-labelledby="contained-modal-title-vcenter">
        <style>
          {`
            .custom-modal .modal-content {
              border-radius: 15px !important;
              margin: ${isMobileWidth ? "6.5px" : "0"};
              padding: 0 30px 20px 30px !important;
            }
            .modal-body{
              padding: 1rem 0 !important;
            }
          `}
        </style>
        <Loader visible={isLoading} />

        <Modal.Header closeButton className="profile-close-btn" 
          style={{ border: "none", paddingBottom: "0px"}} >
          <style>
            {`
              .btn-close {
                width: 10px;               /* Small circle size */
                height: 10px;
                background-color: #000;    /* Black background */
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
                font-weight: bold;
                font-size: 20px;           /* Adjust size of the cross */
                line-height: 1;            /* Center the cross */
                margin-top: -4px;
              }
            `}
          </style>
        </Modal.Header>
        <Modal.Title className="w-100 text-center register-modal-header-title"
          style={{ marginTop: "25px", marginBottom: "20px" }} >
          Verification
        </Modal.Title>

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
            Enter your phone number for the verification process, we will send 4-digit code to your phone number.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-modal-label d-flex align-items-center gap-2 my-4"
              style={{
                marginBottom: "15px",
                width: "100%",
                backgroundColor: "#fff",
                border: "1px solid #C4C4C4",
                borderRadius: "50px",
                padding: "5px 15px",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }} >
              <div style={{
                  position: "relative",
                  width: "23%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
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
                }}} >
                <img src={selectedCountryFlag || "https://flagcdn.com/w20/us.png"} loading="lazy" alt=""
                  style={{
                    width: "20px",
                    height: "15px",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}> 
                  {selectedCountryCode || "+1"}
                </span>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "20px", 
                  }} >
                  <RiArrowDropDownLine style={{ width: "20px", height: "20px" }} />
                </div>
                <select value={selectedCountryCode} onChange={(e) => getCountryInfo(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    paddingLeft: "10px",
                  }} >
                  <option value="">Select Country</option>
                  {[...countries].sort((a, b) => a.name.common.localeCompare(b.name.common))
                    .map((country) => (
                      <option key={country.cca2} value={country.name.common} 
                        style={{ paddingLeft: "15px" }}
                      >
                        {country.name.common}
                      </option>
                    ))}
                </select>
              </div>
              <div style={{
                  width: "1.5px",
                  height: "80%",
                  backgroundColor: "#ccc",
                }} />
              <div style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }} >
                <input type="tel" id="mobile_code" placeholder="Enter your number here"
                  {...register("phoneNumber", {required: "Phone number is required",
                    validate: (value) => {
                      if (!selectedCountryCode) return true;
                      const phoneNumber = selectedCountryCode + value;
                      return (isValidNumber(phoneNumber) || "Invalid phone number format");
                    },
                  })}
                  className="form-control"
                  style={{
                    flex: 1,
                    height: "35px",
                    borderRadius: "40px",
                    border: "none",
                    fontSize: isMobileWidth ? "13px" : "14px",
                    outline: "none",
                    background: "transparent",
                    padding: "10px",
                    boxShadow: "none",
                  }}
                />
              </div>
            </div>
            {/* {/ {/ Error Message /} /} */}
            {errors.phoneNumber && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.phoneNumber.message}
              </p>
            )}
            {/* {/ {/ Continue Button /} /} */}
            <div className="custom-modal-label mt-3">
              <Button type="submit" className="register-modal-body-submit-btn">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal dialogClassName="custom-modal" show={showNumberModal} centered size="lg"
        onHide={() => setShowNumberModal(false)}>
        {/* <Modal.Header closeButton>
          <Modal.Title>Select Country</Modal.Title>
        </Modal.Header> */}

        <style>
          {`
            .custom-modal {
              color: #000;
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
          }`}
        </style>
        <Modal.Body className="number-body">
          <input type="text" placeholder="Search..." value={searchInput} className="form-control "
            onChange={(e) => setSearchInput(e.target.value)} 
            style={{
              borderBottom: "2px solid  green",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderRadius: "none",
            }} />

          <div style={{ height: "100vh", overflowY: "auto",  padding: "10px"}}>
            {filteredCountries.map((country) => (
              <div key={country.cca2} 
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
                }} >
                <img src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`} alt=""
                  width="30" style={{ marginRight: "12px" }}
                />
                <span>{country.name.common}</span>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* {/ KEPT YOUR ORIGINAL VERIFICATION MODAL /} */}
      <VerificationModal
        passPhone={selectedPhone}
        conutryCode={selectedCountryCode}
        show={verificationByEmailModal}
        onHide={setVerifictionByEmailModal}
        verificationBy={"verificationByPhone"}
        verPhone={verifiedPhone}
      />
    </>
  );
}
export default PhoneVerification;
