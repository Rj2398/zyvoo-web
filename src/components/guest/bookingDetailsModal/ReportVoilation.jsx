import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import NotificationPopup from "./NotificationPopup";

const CustomSelect = ({ value, onChange, options, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={selectRef} style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: hasError ? "1px solid red" : "1px solid #ccc",
          color: "#444444",
          cursor: "pointer",
          backgroundColor: "white",
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption.label}
        <RiArrowDropDownLine
          style={{
            fontSize: "20px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            overflow: "hidden",
            marginTop: "-25px",
            boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.38)",
            width: "97%",
          }}
        >
          {options
            .filter((opt) => !opt.disabled)
            .map((option, index) => (
              <React.Fragment key={option.value}>
                <div
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    color: "#444444",
                    backgroundColor: "white",
                    ":hover": {
                      color: "#5EE6A0",
                    },
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#5EE6A0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#444444")
                  }
                  onClick={() => {
                    onChange({ target: { value: option.value } });
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
                {index < options.filter((opt) => !opt.disabled).length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "#444444",
                      opacity: 0.2,
                      margin: "0 8px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

const ReportViolation = ({ onClose }) => {
  const [reason, setReason] = useState("sel");
  const [details, setDetails] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason === "sel") {
      setError(true);
      return;
    }
    setShowPopup(true); 
  };

  const handleCloseAll = () => {
    setShowPopup(false);
    onClose();
  };

  return (
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
        zIndex: 1000,
      }}
    >
      {showPopup ? (
        <NotificationPopup onClose={handleCloseAll} />
      ) : (
        <div
          style={{
            backgroundColor: "white",
            padding: "30px 40px",
            borderRadius: "17px",
            width: "40%",
            maxWidth: "500px",
            maxHeight: "100vh",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            margin: "10px",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#2F3E46",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "white",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            &times;
          </button>

          <h3
            style={{
              textAlign: "center",
              marginBottom: "15px",
              fontSize: "20px",
              fontWeight: "bold",
              color: "black",
              marginTop: "5%",
            }}
          >
            Report Violation
          </h3>
          <hr />

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                border: "1px solid #ccc",
                margin: "10px 0px 10px 0px",
                padding: "10px",
                paddingBottom: "1px",
                borderRadius: "10px",
              }}
            >
              <label
                style={{
                  display: "block",
                  color: "black",
                  marginBottom: "5px",
                  color: " #444444",
                  fontWeight: "600",
                  padding: "7px 12px",
                }}
              >
                Please select a reason for reporting this user.
              </label>

              <CustomSelect
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError(false);
                }}
                options={[
                  { value: "sel", label: "Select", disabled: true },
                  { value: "Inappropriate", label: "Inappropriate" },
                  { value: "Misleading", label: "Misleading information" },
                  { value: "Spam", label: "Spam or Scam" },
                  { value: "Harassment", label: "Harassment" },
                  { value: "Discrimination", label: "Discrimination" },
                  { value: "Other", label: "Other issue" },
                ]}
                hasError={error}
              />
              {error && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "-10px",
                    marginBottom: "15px",
                  }}
                >
                  Please select a reason before submitting
                </p>
              )}

              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                  fontWeight: "600",
                  color: " #444444",
                  padding: "0 12px",
                }}
              >
                Add Additional Details
              </label>
              <textarea
                style={{
                  width: "100%",
                  height: "170px",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  marginBottom: "15px",
                  resize: "none",
                  color: " #444444",
                }}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="You can also add additional details to help us investigate further."
              />
            </div>{" "}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#5EE6A0",
                color: "black",
                border: "none",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Submit Report
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReportViolation;
