import React, { useState } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { useNavigate } from "react-router-dom";
import main from "../../../assets/gallery/Group (2).png";
import dotted from "../../../assets/gallery/Vector (1).png";
import BookingExtensionModal from "./BookingExtensionModal";
import { toast } from "react-toastify";

const Range = ({
  bookingData,
  perHourRate = "10",
  callbackTotalPrice,
  callbacTotalHrs,
  propertyIDD,
  direct,
  page = null,
  onHide,
  initialValue,
  isExtentionTime = false,

}) => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [hoursValue, setHoursValue] = useState(initialValue ??0);
  const [hasChanged, setHasChanged] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    initialValue || "Select hours"
  );
  const [show, setShow] = useState("false");

  const calculateTotalPrice = (hours, hourlyRate) => {
    const result = parseInt(hours) * parseFloat(hourlyRate || 0);
    setTotalPrice(result);
    callbackTotalPrice(result);
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  

  const selectOption = (option) => {
    const numericValue = parseInt(option);
    setSelectedOption(numericValue);
    setHoursValue(numericValue);
    setIsOpen(false);
  };

  const handleSaveChanged = () => {
    if (page === "extend") {
      if (onHide) onHide();
      return;
    }

    navigate("/booking-extended-time", {
      state: {
        perHourRate,
        hoursValue,
        totalPrice,
        propertyIDD,
        direct,
        bookingData,
      },
    });
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        style={{
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          width: "fit-content",
          zIndex: 3,
          backgroundColor: "white",
          borderRadius:"10px"
        }}
      >
        <div
          className="hour-slider-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            border: "1px solid block",
            padding:'10px'
           
            
          }}
        >
          <div
            id="slider"
            style={{
               position: "relative",
               width: "280px",
               height: "280px",
               borderRadius: "50%",
               boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)", // outer shadow
              }}

          >
            <img
              src={main}
              loading="lazy" alt="Main Background"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "93%",
                height: "93%",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />

            <img
              src={dotted}
              loading="lazy" alt="Dotted Overlay"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "95%",
                height: "95%",
                color:'black',
                zIndex: 2,
                // pointerEvents: "none"
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 3,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "70px",
                  color: "black",
                  fontWeight: "500",
                  lineHeight: "1",
                }}
              >
                {hoursValue}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "black",
                  marginTop: "0.2rem",
                }}
              >
                Hours
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 2 }} className={(!hasChanged || hoursValue == 0) ? "range-ss" : ""}>
              <CircularSlider
                min={0}
                max={23}
                trackSize={40}
                progressSize={40}
                knobSize={40}
                knobColor="#fff"
                trackColor="transparent"
                progressColorFrom="#4aeab1"
                progressColorTo="#4aeab1"
                direction={1}
                dataIndex={hoursValue}
                initialValue={hoursValue}
                labelColor="transparent"
                valueColor="transparent"
                valueFontSize="0rem"
                labelFontSize="1rem"
                onChange={(value) => {
                  setHasChanged(true);
                  setHoursValue(value);
                  setSelectedOption(value);
                  callbacTotalHrs(value);
                  calculateTotalPrice(value, perHourRate);
                }}
             
              />              
            </div>
          </div>

          {/* <hr style={{ width: "100%", margin: "20px 0" }} /> */}
          <span style={{margin:'10px',color:'#000000',fontWeight:'400',fontSiz:"17px !important"}}>Or</span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "250px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#fff",
              }}
              onClick={toggleDropdown}
            >
              {selectedOption} Hours
              <span>  <img src={`/images/dropdown.svg`} alt={`Dropdown Icon`} style={{
            width:'12px',
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}/></span>
            </div>
            {isOpen && (
              <div
                style={{
                  width: "250px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  position: "absolute",
                  marginTop: "40px",
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    height: "180px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {Array.from(
                    { length: 23 },
                    (_, i) => `${i + 1} Hour${i > 0 ? "s" : ""}`
                  ).map((option) => (
                    <div
                      key={option}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => selectOption(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* <div>{selectedOption}</div> */}
            <button
              style={{
                width: "250px",
                padding: "10px",
                backgroundColor: "#374B48",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              // onClick={() => handleSaveChanged()}
              onClick={() =>
                hoursValue == 0
                  ? toast.error("please select at least 1 hour")
                  : isExtentionTime ? onHide() : setShowModal(true)
              }
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <BookingExtensionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        totalAmount={totalPrice}
        handleBook={handleSaveChanged}
      />
    </>
  );
};

export default React.memo(Range);
