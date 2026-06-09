import React, { useState, useEffect, useRef } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { useNavigate } from "react-router-dom";
import main from "../../../assets/gallery/Group (2).png";
import dotted from "../../../assets/gallery/vector_10.png";
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
  const [hoursValue, setHoursValue] = useState(initialValue ?? 0);
  const [hasChanged, setHasChanged] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    initialValue || "Select hours"
  );

  /* --- FIXED: Fade effect ko rokne ke liye bina key-reset wala Ref add kiya --- */
  const sliderRef = useRef(null);

  const [show, setShow] = useState("false");

  // Props change hone par state synchronized rakhne ke liye
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== null) {
      const parsed = initialValue | 0;
      setHoursValue(parsed);
      if (
        sliderRef.current &&
        typeof sliderRef.current.setValue === "function"
      ) {
        sliderRef.current.setValue(parsed);
      }
    }
  }, [initialValue]);

  const calculateTotalPrice = (hours, hourlyRate) => {
    const result = parseInt(hours, 10) * parseFloat(hourlyRate || 0);
    setTotalPrice(result);
    callbackTotalPrice(result);
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    const numericValue = parseInt(option, 10);
    setSelectedOption(numericValue);
    setHoursValue(numericValue);

    /* --- Dropdown value par slider knob ko inject karne ki setting --- */
    if (sliderRef.current && typeof sliderRef.current.setValue === "function") {
      sliderRef.current.setValue(numericValue);
    }

    if (callbacTotalHrs) callbacTotalHrs(numericValue);
    calculateTotalPrice(numericValue, perHourRate);
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
          borderRadius: "10px",
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
            padding: "10px",
          }}
        >
          <div
            id="slider"
            style={{
              position: "relative",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              aspectRatio: "1 / 1",
              objectFit: "contain",
              cursor: "pointer" /* Tap pointer hint */,
              boxShadow: `
              0px 35px 75px rgba(168, 133, 155, 0.22), 
              0px 15px 35px rgba(0, 0, 0, 0.02), 
              inset 0px -1px 5px rgba(255, 255, 255, 0.4)
            `,
              /* Zero flickering performance acceleration */
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
            }}
            /* --- FIXED: MATHEMATICAL CLICK TO JUMP DETECTOR ADDED --- */
            onClick={(e) => {
              // Goli par direct click ko handle mat karo, normal drag chalne do
              if (
                e.target.tagName === "circle" &&
                e.target.getAttribute("fill") === "#fff"
              ) {
                return;
              }

              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;

              let angle = Math.atan2(x, -y) * (180 / Math.PI);
              if (angle < 0) angle += 360;

              // Grid mapping matching min=0 and max=23 logic bounds safely
              const stepIndex = Math.round((angle / 360) * 23) | 0;
              const finalVal =
                stepIndex >= 23 ? 23 : stepIndex < 0 ? 0 : stepIndex;

              setHasChanged(true);
              setHoursValue(finalVal);
              setSelectedOption(finalVal);
              if (callbacTotalHrs) callbacTotalHrs(finalVal);
              calculateTotalPrice(finalVal, perHourRate);

              /* --- REF POSITION FORCE UPDATE: Isse zero fading ke sath knob jump karega --- */
              if (
                sliderRef.current &&
                typeof sliderRef.current.setValue === "function"
              ) {
                sliderRef.current.setValue(finalVal);
              }
            }}
          >
            <img
              src={main}
              loading="lazy"
              alt="Main Background"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "86%",
                height: "86%",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />

            <img
              src={dotted}
              loading="lazy"
              alt="Dotted Overlay"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%",
                height: "100%",
                color: "black",
                zIndex: 2,
                pointerEvents:
                  "none" /* FIXED: Is layer ko click pass through karne diya */,
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

            <div
              style={{ position: "relative", zIndex: 2 }}
              className={`hide-slider-pulse ${
                !hasChanged || hoursValue == 0 ? "range-ss" : ""
              }`}
            >
              <style>{`
                .hide-slider-pulse circle[style*="animation-name: pulse"] {
                  fill-opacity: 0 !important;
                  opacity: 0 !important;
                  display: none !important;
                }
              `}</style>
              <CircularSlider
                ref={sliderRef} /* Attached Ref instance */
                min={0}
                max={23}
                trackSize={45}
                progressSize={45}
                knobSize={62}
                knobColor="#fff"
                trackColor="transparent"
                progressColorFrom="#4aeab1"
                progressColorTo="#4aeab1"
                direction={1}
                dataIndex={hoursValue}
                labelColor="transparent"
                valueColor="transparent"
                valueFontSize="0rem"
                labelFontSize="1rem"
                onChange={(value) => {
                  const pureInteger = value | 0;

                  /* --- Anti looping render lock check --- */
                  if (hoursValue !== pureInteger) {
                    setHasChanged(true);
                    setHoursValue(pureInteger);
                    setSelectedOption(pureInteger);
                    if (callbacTotalHrs) callbacTotalHrs(pureInteger);
                    calculateTotalPrice(pureInteger, perHourRate);
                  }
                }}
              />
            </div>
          </div>

          <span
            style={{
              margin: "10px",
              color: "#000000",
              fontWeight: "400",
              fontSize: "17px",
            }}
          >
            Or
          </span>

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
              {selectedOption}{" "}
              {typeof selectedOption === "number" ? "Hours" : ""}
              <span>
                <img
                  src={`/images/dropdown.svg`}
                  alt={`Dropdown Icon`}
                  style={{
                    width: "12px",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </span>
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
              onClick={() =>
                hoursValue == 0
                  ? toast.error("please select at least 1 hour")
                  : isExtentionTime
                  ? onHide()
                  : setShowModal(true)
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

// import React, { useState } from "react";
// import CircularSlider from "@fseehawer/react-circular-slider";
// import { useNavigate } from "react-router-dom";
// import main from "../../../assets/gallery/Group (2).png";
// import dotted from "../../../assets/gallery/vector_10.png";
// import BookingExtensionModal from "./BookingExtensionModal";
// import { toast } from "react-toastify";

// const Range = ({
//   bookingData,
//   perHourRate = "10",
//   callbackTotalPrice,
//   callbacTotalHrs,
//   propertyIDD,
//   direct,
//   page = null,
//   onHide,
//   initialValue,
//   isExtentionTime = false,
// }) => {
//   const navigate = useNavigate();
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [hoursValue, setHoursValue] = useState(initialValue ?? 0);
//   const [hasChanged, setHasChanged] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(
//     initialValue || "Select hours"
//   );

//   const [show, setShow] = useState("false");

//   const calculateTotalPrice = (hours, hourlyRate) => {
//     const result = parseInt(hours) * parseFloat(hourlyRate || 0);
//     setTotalPrice(result);
//     callbackTotalPrice(result);
//   };

//   const [isOpen, setIsOpen] = useState(false);
//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const selectOption = (option) => {
//     const numericValue = parseInt(option);
//     setSelectedOption(numericValue);
//     setHoursValue(numericValue);
//     setIsOpen(false);
//   };

//   const handleSaveChanged = () => {
//     if (page === "extend") {
//       if (onHide) onHide();
//       return;
//     }

//     navigate("/booking-extended-time", {
//       state: {
//         perHourRate,
//         hoursValue,
//         totalPrice,
//         propertyIDD,
//         direct,
//         bookingData,
//       },
//     });
//   };

//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>
//       <div
//         style={{
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "20px",
//           width: "fit-content",
//           zIndex: 3,
//           backgroundColor: "white",
//           borderRadius: "10px",
//         }}
//       >
//         <div
//           className="hour-slider-wrap"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             width: "100%",
//             border: "1px solid block",
//             padding: "10px",
//           }}
//         >
//           <div
//             id="slider"
//             style={{
//               position: "relative",
//               width: "283px",
//               height: "283px",
//               borderRadius: "50%",
//               aspectRatio: "1 / 1",
//               objectFit: "contain",
//               boxShadow: `
//               0px 35px 75px rgba(168, 133, 155, 0.22),
//               0px 15px 35px rgba(0, 0, 0, 0.02),
//               inset 0px -1px 5px rgba(255, 255, 255, 0.4)
//             `,
//             }}
//           >
//             <img
//               src={main}
//               loading="lazy"
//               alt="Main Background"
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 width: "88%",
//                 height: "88%",
//                 zIndex: 3,
//                 pointerEvents: "none",
//               }}
//             />

//             <img
//               src={dotted}
//               loading="lazy"
//               alt="Dotted Overlay"
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 width: "120%",
//                 height: "100%",
//                 color: "black",
//                 zIndex: 2,
//                 // pointerEvents: "none"
//               }}
//             />

//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 zIndex: 3,
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "70px",
//                   color: "black",
//                   fontWeight: "500",
//                   lineHeight: "1",
//                 }}
//               >
//                 {hoursValue}
//               </div>
//               <div
//                 style={{
//                   fontSize: "24px",
//                   color: "black",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 Hours
//               </div>
//             </div>

//             <div
//               style={{ position: "relative", zIndex: 2 }}
//               className={`hide-slider-pulse ${
//                 !hasChanged || hoursValue == 0 ? "range-ss" : ""
//               }`}
//             >
//               <style>{`
//     .hide-slider-pulse circle[style*="animation-name: pulse"] {
//       fill-opacity: 0 !important;
//       opacity: 0 !important;
//       display: none !important;
//     }
//   `}</style>
//               <CircularSlider
//                 min={0}
//                 max={23}
//                 trackSize={45}
//                 progressSize={45}
//                 knobSize={59}
//                 knobColor="#fff"
//                 trackColor="transparent"
//                 progressColorFrom="#4aeab1"
//                 progressColorTo="#4aeab1"
//                 direction={1}
//                 dataIndex={hoursValue}
//                 initialValue={hoursValue}
//                 labelColor="transparent"
//                 valueColor="transparent"
//                 valueFontSize="0rem"
//                 labelFontSize="1rem"
//                 onChange={(value) => {
//                   setHasChanged(true);
//                   setHoursValue(value);
//                   setSelectedOption(value);
//                   callbacTotalHrs(value);
//                   calculateTotalPrice(value, perHourRate);
//                 }}
//               />
//             </div>
//           </div>

//           {/* <hr style={{ width: "100%", margin: "20px 0" }} /> */}
//           <span
//             style={{
//               margin: "10px",
//               color: "#000000",
//               fontWeight: "400",
//               fontSiz: "17px !important",
//             }}
//           >
//             Or
//           </span>

//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <div
//               style={{
//                 width: "250px",
//                 padding: "10px",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//                 backgroundColor: "#fff",
//               }}
//               onClick={toggleDropdown}
//             >
//               {selectedOption} Hours
//               <span>
//                 {" "}
//                 <img
//                   src={`/images/dropdown.svg`}
//                   alt={`Dropdown Icon`}
//                   style={{
//                     width: "12px",
//                     transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//                     transition: "transform 0.2s ease",
//                   }}
//                 />
//               </span>
//             </div>
//             {isOpen && (
//               <div
//                 style={{
//                   width: "250px",
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   backgroundColor: "#fff",
//                   position: "absolute",
//                   marginTop: "40px",
//                   zIndex: 4,
//                 }}
//               >
//                 <div
//                   style={{
//                     height: "180px",
//                     overflowY: "auto",
//                     border: "1px solid #ddd",
//                     padding: "10px",
//                   }}
//                 >
//                   {Array.from(
//                     { length: 23 },
//                     (_, i) => `${i + 1} Hour${i > 0 ? "s" : ""}`
//                   ).map((option) => (
//                     <div
//                       key={option}
//                       style={{
//                         padding: "10px",
//                         cursor: "pointer",
//                         borderBottom: "1px solid #eee",
//                       }}
//                       onClick={() => selectOption(option)}
//                     >
//                       {option}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* <div>{selectedOption}</div> */}
//             <button
//               style={{
//                 width: "250px",
//                 padding: "10px",
//                 backgroundColor: "#374B48",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//               // onClick={() => handleSaveChanged()}
//               onClick={() =>
//                 hoursValue == 0
//                   ? toast.error("please select at least 1 hour")
//                   : isExtentionTime
//                   ? onHide()
//                   : setShowModal(true)
//               }
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//       <BookingExtensionModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         totalAmount={totalPrice}
//         handleBook={handleSaveChanged}
//       />
//     </>
//   );
// };

// export default React.memo(Range);
