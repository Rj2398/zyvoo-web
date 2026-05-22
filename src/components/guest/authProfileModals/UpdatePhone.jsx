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
import { FaSortDown } from "react-icons/fa";
import { ChevronDownIcon } from "lucide-react";

function UpdatePhone({ show, handleClose, USERID }) {
  const { update_phone_number, isLoading } = useAuth();
  const [verificationByEmailModal, setVerifictionByEmailModal] = useState(false);
  const [error, setError] = useState(null);

  const {register,handleSubmit,reset,formState: { errors },} = useForm();

  const [selectedCountry, setSelectedCountry] = useState();
  const [passPhone, setPassPhone] = useState(null);
  const [conutryCode, setCountryCode] = useState(null);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
   const [showNumberModal, setShowNumberModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");
      const [isMobileWidth, setIsMobileWidth] = useState(false)
      useEffect(() => {
        const checkWindowWidth = () => {
          setIsMobileWidth(window.innerWidth <= 768);
        };
    
        checkWindowWidth();
        window.addEventListener('resize', checkWindowWidth);
    
        return () => window.removeEventListener('resize', checkWindowWidth);
      }, []);

function getCountryInfo(countryName) {
  const country = countries.find(
    (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
  );

  if (!country) return "Country not found";

  // ✅ Set the flag
  setSelectedCountryFlag(`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`);

  // ✅ Safely build the full dialing code
  const root = country.idd?.root || "";
  const suffixes = country.idd?.suffixes;

  let fullCode = root;
  if (suffixes && suffixes.length > 0 && suffixes[0] !== "") {
    fullCode += suffixes[0];
  }

 setSelectedCountryCode(countryName == "United States" ? "+1" : fullCode);
  setSelectedCountry(countryName);
}


   const filteredCountries = countries
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
    .filter((c) =>
      c.name.common?.toLowerCase()?.includes(searchInput?.toLowerCase())
    );
  const onSubmit = async (data) => {
    try {
      const response = await update_phone_number({
        user_id: USERID,
        phone_number: data?.phoneNumber,
        country_code: selectedCountryCode, 
      });
      if (response) {
        setPassPhone(data?.phoneNumber);
        setCountryCode(selectedCountryCode);
        handleClose();
        setVerifictionByEmailModal(true);
      } else {
        setError(response.data.message || response.message);
      }
    } catch (error) {
      setError(error.message);
    }
    reset();
  };
  const handleModalClose = () => {
    setError(null);
    reset();
    handleClose();
    setCountryCode("");
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
            }
          `}
        </style>
        <Loader visible={isLoading} />

        <Modal.Header closeButton className="profile-close-btn" 
          style={{ border: "none", paddingBottom: "0px" }} >
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

        <Modal.Title className="w-100 text-center register-modal-header-title" style={{ marginTop: "20px", marginBottom: "20px" }}>
          Verification
        </Modal.Title>

        <hr style={{
            width: "90%",
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
            {/* {/ {/ Phone Input Section /} /} */}
            <div className="custom-modal-label d-flex align-items-center gap-2"
              style={{
                marginBottom: "15px",
                width: "100%",
                backgroundColor: "#fff",
                border: "2px solid #ccc",
                borderRadius: "50px",
                padding: "5px 15px",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* {/ {/ Country Selection - Clickable Area /} /} */}
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
                  // Create and trigger a click event on the hidden select element

                    if (isMobileWidth) {
                    setShowNumberModal(true);
                  } else {
                  const select = e.currentTarget.querySelector("select");
                  if (select) {
                    select.focus();
                    select.click();
                  }}
                }}
              >
                <img src={selectedCountryFlag || "https://flagcdn.com/w20/us.png"}
                  loading="lazy" alt="COUNTRY"
                  style={{
                    width: "20px",
                    height: "15px",
                    borderRadius: "2px",
                  }}
                />
                {/* {/ {/ Country Code - Default to +1 /} /} */}
                <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                  {selectedCountryCode || "+1"}
                </span>
                {/* {/ {/ Dropdown Icon Wrapper - Keeps Fixed Gap /} /} */}
                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "20px", 
                  }}
                >
                  <RiArrowDropDownLine
                    style={{ width: "20px", height: "20px" }}
                  />
                </div> */}

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
                  value={selectedCountryCode}
                  onChange={(e) => getCountryInfo(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    // backgroundColor: "yellow",
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
                <input type="tel" id="mobile_code" placeholder="Enter your number here"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number must be exactly 10 digits",
                    },

                    validate: (value) => {
                      if (!selectedCountryCode) return true;
                      const phoneNumber = selectedCountryCode + value;
                      return (isValidNumber(phoneNumber) || "Invalid phone number format");
                    },
                  })}
                  className="form-control register-modal-input-box"
                  style={{
                    flex: 1,
                    height: "35px",
                    borderRadius: "40px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    padding: "10px",
                    boxShadow: "none",
                  }}
                />
              </div>
            </div>
            {errors.phoneNumber && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors?.phoneNumber?.message}
              </p>
            )}
            <div className="custom-modal-label mt-3">
              <Button type="submit" className=" register-modal-body-submit-btn">
                Submit
              </Button>
            </div>
          </form>
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

        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>



      {/* {/ KEPT YOUR ORIGINAL VERIFICATION MODAL /} */}
      <VerificationModal
        show={verificationByEmailModal}
        onHide={setVerifictionByEmailModal}
        verificationBy={"changeVerifyotp"}
        passPhone={passPhone}
        conutryCode={conutryCode}
      />
    </>
  );
}
export default UpdatePhone;
