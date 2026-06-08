import Autocomplete from "react-google-autocomplete";
import { GOOGLE_KEY } from "../config/Constant";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { Modal, Form } from "react-bootstrap";
import { format } from "date-fns";
import main from "../assets/gallery/Group (2).png";
import dotted from "../assets/gallery/vector_4.png";
import CircularSlider from "@fseehawer/react-circular-slider";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const MobSearch = ({
  // State props
  selectedPlace = "",
  coordinates = { lat: null, lng: null },
  selectedActivity = "",
  selectedDate = "",
  toTime = "",
  newDate = null,
  flexibleDate = "",
  fromTime = "",
  start_time = "",
  end_time = "",
  // hour = "2",
  hour = 2,
  show = false,
  showMobSearch,
  handleToggleMobSearch,
  // Function props
  setCoordinates,
  setSelectedPlace,
  onActivityChange,
  onActivityPopupToggle,
  onDateChange,
  onTimeChange,
  onHourChange,
  onShowToggle,
  onFlexibleDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onCleanAll,
  onSearch,
  handleHourChange,
  timeOptions,
  handleTimeChange,
  handleDate,
  setFilterPrice,
  // Configuration props
  activities = [
    { id: 1, name: "Stays" },
    { id: 2, name: "Event Space" },
    { id: 3, name: "Photo Shoot" },
    { id: 4, name: "Meeting" },
    { id: 5, name: "Party" },
    { id: 6, name: "Pool" },
    { id: 7, name: "Film Shoot" },
    { id: 8, name: "Wedding" },
    // { id: 5, name: "Birthday Party" },
  ],
}) => {
  const [showActivityPopup, setShowActivityPopup] = useState(false);
  const [key, setKey] = useState("dates");

  const dropdownRef = useRef(null);

  // 👇 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActivityPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowActivityPopup]);

  // 👇 Handle keyboard navigation like a real <select>
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowActivityPopup(!showActivityPopup);
    } else if (e.key === "Escape") {
      setShowActivityPopup(false);
    }
  };
  // ----add sun------

  return (
    <>
      <Modal
        show={!!showMobSearch}
        onHide={handleToggleMobSearch}
        dialogClassName="custom-modal chat-screen-modal custom-modal-css"
        size="lg"
        style={{ zIndex: 9999999 }}
      >
        <div className="search-filter-wrap">
          <div className="container-fluid">
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <div className="search-filter-top border-start-0 border-end-0">
                <a
                  onClick={() => {
                    handleToggleMobSearch(), onShowToggle(false);
                  }}
                >
                  <i className="fa-regular fa-arrow-left"></i>
                </a>
                <div className="search-filter-top-btns">
                  <label className="search-filter-top-btns-in active">
                    <input
                      type="reset"
                      value="Clean All"
                      onClick={onCleanAll}
                    />
                    <i className="fa-solid fa-rotate-left"></i>
                  </label>
                  <label className="search-filter-top-btns-in">
                    <input
                      type="submit"
                      value="Search"
                      onClick={(e) => {
                        e.preventDefault();
                        onShowToggle(false);
                        onSearch();
                      }}
                    />
                    <i className="fa-regular fa-magnifying-glass"></i>
                  </label>
                </div>
              </div>
              <div className="search-filter-mid">
                <div className="search-filter-mid-where">
                  <div className="search-filter-mid-where-btn">
                    Where
                    <Autocomplete
                      apiKey={GOOGLE_KEY}
                      id="where-search"
                      onPlaceSelected={(place) => {
                        if (
                          place &&
                          place.geometry &&
                          place.geometry.location
                        ) {
                          const lat = place.geometry.location.lat();
                          const lng = place.geometry.location.lng();
                          setSelectedPlace(
                            place.formatted_address || place.name
                          );
                          setCoordinates({ lat, lng });
                        } else {
                          setSelectedPlace("");
                        }
                      }}
                      options={{ types: ["(cities)"] }}
                      placeholder="Type location..."
                      defaultValue={selectedPlace}
                      className="google-autocomplete"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="search-filter-mid-time nav-inner-time">
                  <div
                    className="search-filter-mid-time-btn"
                    onClick={() => onShowToggle && onShowToggle(!show)}
                  >
                    Time{" "}
                    <input
                      type="button"
                      value="Add Time"
                      id="time-search"
                      // onClick={() => onShowToggle && onShowToggle(!show)}
                    />
                  </div>

                  <div
                    className="search-filter-mid-time-list nav-inner-time-list"
                    style={{ display: show ? "block" : "none" }}
                  >
                    <div>
                      <div
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "12px",
                          padding: "32px 0 5px 5px",
                          width: "100%",
                          maxWidth: "380px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#f0ecec",
                            borderRadius: "40px",
                            color: "black",
                            padding: "3px",
                            fontSize: "18px",
                            fontWeight: "400px",
                            width: "100%",
                            height: "auto",
                          }}
                        >
                          <button
                            onClick={() => setKey("dates")}
                            style={{
                              backgroundColor:
                                key === "dates" ? "white" : "transparent",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "40px",
                              cursor: "pointer",
                              width: "100%",
                              height: "auto",
                              top: "29px",
                              left: "129px",
                              // for iphone
                              appearance: "none",
                              WebkitAppearance: "none",
                              color: "black",
                            }}
                          >
                            Dates
                          </button>
                          <button
                            onClick={() => setKey("hourly")}
                            style={{
                              backgroundColor:
                                key === "hourly" ? "white" : "transparent",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "40px",
                              cursor: "pointer",
                              width: "100%",
                              height: "auto",
                              top: "29px",
                              left: "129px",
                              // for iphone
                              appearance: "none",
                              WebkitAppearance: "none",
                              color: "black",
                            }}
                          >
                            Hourly
                          </button>
                          <button
                            onClick={() => setKey("flexible")}
                            style={{
                              backgroundColor:
                                key === "flexible" ? "white" : "transparent",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "40px",
                              cursor: "pointer",
                              width: "100%",
                              height: "auto",
                              top: "29px",
                              left: "129px",

                              // for iphone
                              appearance: "none",
                              WebkitAppearance: "none",
                              color: "black",
                            }}
                          >
                            Flexible
                          </button>
                        </div>

                        <div
                          style={{ margin: "20px 0" }}
                          className="date-picker"
                        >
                          {key === "dates" && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <DayPicker
                                mode="single"
                                selected={selectedDate}
                                disabled={{ before: new Date() }}
                                onSelect={(e) =>
                                  onDateChange &&
                                  onDateChange(e ? format(e, "yyyy-MM-dd") : "")
                                }
                                onChange={(e) => handleDate(e)}
                                footer={
                                  selectedDate
                                    ? `Selected: ${format(
                                        selectedDate,
                                        "MM-dd-yyyy"
                                      )}`
                                    : "Pick a day."
                                }
                              />
                            </div>
                          )}

                          {key === "hourly" && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  transition: "transform 0.2s ease-in-out",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                              >
                                <div className="hour-slider-wrap">
                                  <div
                                    id="slider"
                                    style={{
                                      position: "relative",
                                      width: "283px",
                                      height: "283px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "50%",
                                      aspectRatio: "1 / 1",
                                      objectFit: "contain",
                                      boxShadow: `
                              0px 35px 75px rgba(168, 133, 155, 0.22), 
                              0px 15px 35px rgba(0, 0, 0, 0.02), 
                              inset 0px -1px 5px rgba(255, 255, 255, 0.4)
                            `,
                                    }}
                                  >
                                    <img
                                      loading="lazy"
                                      src={main}
                                      alt="Main Background"
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: "82%",
                                        height: "82%",
                                        zIndex: 3,
                                        pointerEvents: "none",
                                      }}
                                    />
                                    <img
                                      loading="lazy"
                                      src={dotted}
                                      alt="Dotted Overlay"
                                      style={{
                                        position: "absolute",
                                        top: "auto",
                                        left: "auto",
                                        width: "86%",
                                        height: "86%",
                                        zIndex: 1,
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
                                          fontSize: "3rem",
                                          color: "black",
                                          fontWeight: "bold",
                                          lineHeight: "1",
                                        }}
                                      >
                                        {hour || 2}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "2rem",
                                          color: "black",
                                          marginTop: "0.2rem",
                                        }}
                                      >
                                        Hours
                                      </div>
                                    </div>
                                    <div
                                      className="hide-slider-pulse"
                                      style={{
                                        position: "relative",
                                        zIndex: 2,
                                      }}
                                    >
                                      <style>{`
    .hide-slider-pulse circle[style*="animation-name: pulse"] {
      fill-opacity: 0 !important;
      opacity: 0 !important;
      display: none !important;
    }
  `}</style>
                                      {/* {console.log("hour value in MobSearch:", hour, "type:", typeof hour)} */}
                                      <CircularSlider
                                        min={0}
                                        max={24}
                                        // value={hour}
                                        trackSize={55}
                                        progressSize={55}
                                        knobSize={72}
                                        knobColor="#fff"
                                        trackColor="transparent"
                                        progressColorFrom="#4aeab1"
                                        progressColorTo="#4aeab1"
                                        direction={0}
                                        // dataIndex={2}
                                        dataIndex={1}
                                        label=" "
                                        labelColor="transparent"
                                        valueColor="transparent"
                                        valueFontSize="0rem"
                                        labelFontSize="1rem"
                                        data={Array.from(
                                          { length: 23 },
                                          (_, i) => `${i + 1}`
                                        )}
                                        onChange={handleHourChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <style>
                                {`
                                @keyframes pulse {
                                  0% { transform: scale(1); }
                                  50% { transform: scale(1.15); }
                                  100% { transform: scale(1); }
                                }
                              `}
                              </style>
                            </div>
                          )}

                          {key === "flexible" && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                              >
                                <DayPicker
                                  mode="single"
                                  selected={newDate}
                                  disabled={{ before: new Date() }}
                                  onSelect={(e) => {
                                    const formattedDate = e
                                      ? format(e, "yyyy-MM-dd")
                                      : "";
                                    onDateChange && onDateChange(formattedDate);
                                  }}
                                />
                              </div>
                              <div
                                className="time-slot d-flex mt-4"
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "10px",
                                  padding: "0 7px 10px 7px",
                                }}
                              >
                                <Form.Select
                                  value={fromTime}
                                  onChange={(e) =>
                                    handleTimeChange("from", e.target.value)
                                  }
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "20px",
                                    width: "50%",
                                  }}
                                >
                                  {timeOptions.map((time, index) => (
                                    <option key={index} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Select
                                  value={toTime}
                                  onChange={(e) =>
                                    handleTimeChange("to", e.target.value)
                                  }
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "20px",
                                    width: "50%",
                                  }}
                                >
                                  {timeOptions.map((time, index) => (
                                    <option key={index} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="search-filter-mid-activity">
                <div className="search-filter-mid-activity-btn">
                  Activity
                  <input
                    type="button"
                    value={selectedActivity || "Choose Activity"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActivityPopup(!showActivityPopup);
                    }}
                  />
                </div>
                <div
                  className="search-filter-mid-activity-list nav-inner-activity-list"
                  style={{ display: showActivityPopup ? "block" : "none" }}
                >
                  <ul>
                    {activities.map((item, index) => (
                      <li className="activity-src-item" key={index}
                        onClick={() => {
                          onActivityChange && onActivityChange(item.name);
                          onActivityPopupToggle && onActivityPopupToggle(false);
                        }} >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
                <div className="search-filter-mid-activity" ref={dropdownRef}>
                  {key === "hourly" ? (
                    <div className="search-filter-mid-activity-btn">
                      Price
                      <input
                        type="number"
                        placeholder="Select price"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFilterPrice(e.target.value);
                        }}
                        id="where-search"
                        min={10}
                      />
                    </div>
                  ) : (
                    <div
                      className="search-filter-mid-activity-btn"
                      tabIndex="0" // makes it focusable like a real dropdown
                      onKeyDown={handleKeyDown}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowActivityPopup(!showActivityPopup);
                      }}
                    >
                      {selectedActivity || "Activity"}
                      {/* <input type="button" value={selectedActivity || "Choose Activity"}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowActivityPopup(!showActivityPopup);
                            }}
                      /> */}

                      <ChevronDownIcon
                        //  onClick={(e) => {
                        //   e.preventDefault();
                        //   e.stopPropagation();
                        //   setShowActivityPopup(!showActivityPopup);
                        // }}
                        style={{
                          width: "18px",
                          height: "18px",
                          color: "#555",
                          transition: "transform 0.2s ease",
                          transform: showActivityPopup
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="search-filter-mid-activity-list nav-inner-activity-list"
                    style={{
                      display: showActivityPopup ? "block" : "none",
                      position: "absolute",
                      zIndex: 1000,
                    }}
                  >
                    <ul>
                      {activities.map((item, index) => (
                        <li
                          className="activity-src-item"
                          key={index}
                          onClick={() => {
                            onActivityChange && onActivityChange(item.name);
                            onActivityPopupToggle &&
                              onActivityPopupToggle(false);
                            setShowActivityPopup(false); // close after select
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(MobSearch);

// import Autocomplete from "react-google-autocomplete";
// import { GOOGLE_KEY } from "../config/Constant";
// import { DayPicker } from "react-day-picker";
// import moment from "moment";
// import { Modal,Form } from "react-bootstrap";
// import { format } from "date-fns";
// import main from "../assets/gallery/Group (2).png";
// import dotted from "../assets/gallery/Vector (1).png";
// import CircularSlider from "@fseehawer/react-circular-slider";
// import React, { useState } from "react";

// const MobSearch = ({
//   // State props
//   selectedPlace = "",
//   coordinates = { lat: null, lng: null },
//   selectedActivity = "",
//   selectedDate = "",
//   toTime = "",
//   newDate = null,
//   flexibleDate = "",
//   fromTime = "",
//   start_time = "",
//   end_time = "",
//   hour = "2",
//   show = false,
//   showMobSearch,
//   handleToggleMobSearch,
//   // Function props
//   setCoordinates,
//   setSelectedPlace,
//   onActivityChange,
//   onActivityPopupToggle,
//   onDateChange,
//   onTimeChange,
//   onHourChange,
//   onShowToggle,
//   onFlexibleDateChange,
//   onStartTimeChange,
//   onEndTimeChange,
//   onCleanAll,
//   onSearch,
//   handleHourChange,
//   timeOptions,
//   handleTimeChange,
//   handleDate,

//   // Configuration props
//   activities = [
//     { id: 1, name: "Stays" },
//     { id: 2, name: "Event Space" },
//     { id: 3, name: "Photo Shoot" },
//     { id: 4, name: "Music Video" },
//     { id: 5, name: "Birthday Party" },
//     { id: 6, name: "Wedding" },
//     { id: 7, name: "Meeting" },
//     { id: 8, name: "Baby Shower" },
//     { id: 9, name: "Pool" },
//   ]
// }) => {

//     const [showActivityPopup, setShowActivityPopup] = useState(false)
//     const [key, setKey] = useState("dates");

//   return (
//     <>
//     <Modal show={!!showMobSearch} onHide={handleToggleMobSearch} dialogClassName="custom-modal chat-screen-modal custom-modal-css" size="lg" >
//       <div className="search-filter-wrap">
//         <div className="container-fluid">
//           <form action="" onSubmit={(e) => e.preventDefault()}>
//             <div className="search-filter-top border-start-0 border-end-0">
//               <a onClick={handleToggleMobSearch}>
//                 <i className="fa-regular fa-arrow-left"></i>
//               </a>
//               <div className="search-filter-top-btns">
//                 <label className="search-filter-top-btns-in active">
//                   <input
//                     type="reset"
//                     value="Clean All"
//                     onClick={onCleanAll}
//                   />
//                   <i className="fa-solid fa-rotate-left"></i>
//                 </label>
//                 <label className="search-filter-top-btns-in">
//                   <input
//                     type="submit"
//                     value="Search"
//                     onClick={(e) => {e.preventDefault(); onShowToggle(false)  ; onSearch()}}
//                   />
//                   <i className="fa-regular fa-magnifying-glass"></i>
//                 </label>
//               </div>
//             </div>
//             <div className="search-filter-mid">
//               <div className="search-filter-mid-where">
//                 <div className="search-filter-mid-where-btn">
//                   Where
//                   <Autocomplete apiKey={GOOGLE_KEY} id="where-search"
//                     onPlaceSelected={(place) => {
//                       if (place && place.geometry && place.geometry.location) {
//                         const lat = place.geometry.location.lat();
//                         const lng = place.geometry.location.lng();
//                         setSelectedPlace(place.formatted_address || place.name);
//                         setCoordinates({ lat, lng });
//                       } else {
//                         setSelectedPlace("");
//                       }
//                     }}
//                     options={{ types: ["(cities)"] }}
//                     placeholder="Type location..."
//                     defaultValue={selectedPlace}
//                     className="google-autocomplete"
//                     autoComplete="off"
//                   />
//                 </div>
//               </div>
//               <div className="search-filter-mid-time nav-inner-time">
//                 <div className="search-filter-mid-time-btn">
//                   Time{" "}
//                   <input
//                     type="button"
//                     value="Add Time" id="time-search"
//                     onClick={() => onShowToggle && onShowToggle(!show)}
//                   />
//                 </div>

//                 <div className="search-filter-mid-time-list nav-inner-time-list" style={{display: show ? "block" : "none"}}>
//                   <div>
//                     <div
//                       style={{
//                         backgroundColor: "#fff",
//                         borderRadius: "12px",
//                         padding: "32px 0 5px 5px",
//                         width: "100%",
//                         maxWidth: "380px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                         position: "relative",
//                       }}
//                     >

//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           backgroundColor: "#f0ecec",
//                           borderRadius: "40px",
//                           color: "black",
//                           padding: "3px",
//                           fontSize: "18px",
//                           fontWeight: "400px",
//                           width: "100%",
//                           height: "auto",
//                         }}
//                       >
//                         <button
//                           onClick={() => setKey("dates")}
//                           style={{
//                             backgroundColor:
//                               key === "dates" ? "white" : "transparent",
//                             border: "none",
//                             padding: "8px 16px",
//                             borderRadius: "40px",
//                             cursor: "pointer",
//                             width: "100%",
//                             height: "auto",
//                             top: "29px",
//                             left: "129px",
//                           }}
//                         >
//                           Dates
//                         </button>
//                         <button
//                           onClick={() => setKey("hourly")}
//                           style={{
//                             backgroundColor:
//                               key === "hourly" ? "white" : "transparent",
//                             border: "none",
//                             padding: "8px 16px",
//                             borderRadius: "40px",
//                             cursor: "pointer",
//                             width: "100%",
//                             height: "auto",
//                             top: "29px",
//                             left: "129px",
//                           }}
//                         >
//                           Hourly
//                         </button>
//                         <button
//                           onClick={() => setKey("flexible")}
//                           style={{
//                             backgroundColor:
//                               key === "flexible" ? "white" : "transparent",
//                             border: "none",
//                             padding: "8px 16px",
//                             borderRadius: "40px",
//                             cursor: "pointer",
//                             width: "100%",
//                             height: "auto",
//                             top: "29px",
//                             left: "129px",
//                           }}
//                         >
//                           Flexible
//                         </button>
//                       </div>

//                       <div style={{ margin: "20px 0" }} className="date-picker" >
//                         {key === "dates" && (
//                           <div style={{ display: "flex",  justifyContent: "center"}} >
//                             <DayPicker
//                               mode="single"
//                               selected={selectedDate}
//                               disabled={{ before: new Date() }}
//                               onSelect={(e) =>
//                                 onDateChange && onDateChange(e ? format(e, "yyyy-MM-dd") : "")
//                               }
//                               onChange={(e) => handleDate(e)}
//                               footer={
//                                 selectedDate
//                                   ? `Selected: ${format(selectedDate, "MM-dd-yyyy")}`
//                                   : "Pick a day."
//                               }
//                             />
//                           </div>
//                         )}

//                         {key === "hourly" && (
//                           <div style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               position: "relative",
//                             }} >
//                             <div style={{ transition: "transform 0.2s ease-in-out"}}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.transform = "scale(1.05)";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.transform = "scale(1)";
//                               }}>
//                               <div className="hour-slider-wrap">
//                                 <div id="slider" style={{
//                                     position: "relative",
//                                     width: "280px",
//                                     height: "280px",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                   }} >
//                                   <img src={main} loading="lazy" alt="Main Background"
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%, -50%)",
//                                       width: "93%",
//                                       height: "93%",
//                                       zIndex: 3,
//                                       pointerEvents: "none",
//                                     }}
//                                   />
//                                   <img src={dotted} loading="lazy" alt="Dotted Overlay"
//                                     style={{
//                                       position: "absolute",
//                                       top: "auto",
//                                       left: "auto",
//                                       width: "95%",
//                                       height: "95%",
//                                       zIndex: 1,
//                                     }}
//                                   />
//                                   <div style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%, -50%)",
//                                       zIndex: 3,
//                                       textAlign: "center",
//                                     }} >
//                                     <div style={{
//                                         fontSize: "3rem",
//                                         color: "black",
//                                         fontWeight: "bold",
//                                         lineHeight: "1",
//                                       }} >
//                                       {hour}
//                                     </div>
//                                     <div style={{
//                                         fontSize: "2rem",
//                                         color: "black",
//                                         marginTop: "0.2rem",
//                                       }} >
//                                       Hours
//                                     </div>
//                                   </div>
//                                   <div style={{ position: "relative", zIndex: 2 }} >
//                                     <CircularSlider
//                                       min={0}
//                                       max={24}
//                                       trackSize={40}
//                                       progressSize={40}
//                                       knobSize={40}
//                                       knobColor="#fff"
//                                       trackColor="transparent"
//                                       progressColorFrom="#4aeab1"
//                                       progressColorTo="#4aeab1"
//                                       direction={1}
//                                       dataIndex={3}
//                                       label=" "
//                                       labelColor="transparent"
//                                       valueColor="transparent"
//                                       valueFontSize="0rem"
//                                       labelFontSize="1rem"
//                                       data={Array.from(
//                                         { length: 23 },
//                                         (_, i) => `${i + 1}`
//                                       )}
//                                       onChange={handleHourChange}
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <style>
//                               {`
//                                 @keyframes pulse {
//                                   0% { transform: scale(1); }
//                                   50% { transform: scale(1.15); }
//                                   100% { transform: scale(1); }
//                                 }
//                               `}
//                             </style>
//                           </div>
//                         )}

//                         {key === "flexible" && (
//                           <>
//                             <div style={{ display: "flex", justifyContent: "center", width: "100%"}}>
//                               <DayPicker
//                                 mode="single"
//                                 selected={newDate}
//                                 disabled={{ before: new Date() }}
//                                 onSelect={(e) => {
//                                   const formattedDate = e ? format(e, "yyyy-MM-dd") : "";
//                                   onDateChange && onDateChange(formattedDate);
//                                 }}
//                               />
//                             </div>
//                             <div className="time-slot d-flex mt-4"
//                               style={{
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 gap: "10px",
//                                 padding:"0 7px 10px 7px"
//                               }}
//                             >
//                               <Form.Select
//                                 value={fromTime}
//                                 onChange={(e) =>
//                                   handleTimeChange("from", e.target.value)
//                                 }
//                                 style={{
//                                   border: "1px solid black",
//                                   borderRadius: "20px",
//                                   width: "50%",
//                                 }}
//                               >
//                                 {timeOptions.map((time, index) => (
//                                   <option key={index} value={time}>
//                                     {time}
//                                   </option>
//                                 ))}
//                               </Form.Select>
//                               <Form.Select
//                                 value={toTime}
//                                 onChange={(e) =>
//                                   handleTimeChange("to", e.target.value)
//                                 }
//                                 style={{
//                                   border: "1px solid black",
//                                   borderRadius: "20px",
//                                   width: "50%",
//                                 }}
//                               >
//                                 {timeOptions.map((time, index) => (
//                                   <option key={index} value={time}>
//                                     {time}
//                                   </option>
//                                 ))}
//                               </Form.Select>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="search-filter-mid-activity">
//                 <div className="search-filter-mid-activity-btn">
//                   Activity
//                   <input
//                     type="button"
//                     value={selectedActivity || "Choose Activity"}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setShowActivityPopup(!showActivityPopup);
//                     }}
//                   />
//                 </div>
//                 <div
//                   className="search-filter-mid-activity-list nav-inner-activity-list"
//                   style={{ display: showActivityPopup ? "block" : "none" }}
//                 >
//                   <ul>
//                     {activities.map((item, index) => (
//                       <li className="activity-src-item" key={index}
//                         onClick={() => {
//                           onActivityChange && onActivityChange(item.name);
//                           onActivityPopupToggle && onActivityPopupToggle(false);
//                         }} >
//                         {item.name}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//       </Modal>
//     </>
//   );
// };

// export default React.memo(MobSearch);
