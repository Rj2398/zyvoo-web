import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Container, Row, Col, Card, Form, Dropdown } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import image1 from "../../../assets/gallery/stay.png";
import image2 from "../../../assets/gallery/event_spce.png";
import image3 from "../../../assets/gallery/photoShoot.png";
import image4 from "../../../assets/gallery/meeting.png";
import party from "../../../assets/gallery/party.png";
import flimShoot from "../../../assets/gallery/flim_shot.png";
import performance from "../../../assets/gallery/performance.png";
import workshop from "../../../assets/gallery/whats_app.png";
import corporate from "../../../assets/gallery/corpate_evnt.png";
import wedding from "../../../assets/gallery/wedding.png";
import dinner from "../../../assets/gallery/diner.png";
import retrate from "../../../assets/gallery/retreat.png";
import popup from "../../../assets/gallery/popup.png";
import networking from "../../../assets/gallery/networking.png";
import fitness from "../../../assets/gallery/fitness_clss.png";
import audio_recording from "../../../assets/gallery/audio_recording.png";
import swming from "../../../assets/swming.svg";
import { useDispatch } from "react-redux";
import { setAddPropertyDetails } from "../../../store/slices/hostuserSlice";
import { KEYS } from "../../../config/Constant";
import { Link } from "react-router-dom";

const options = [
  { id: "Stays", image: image1, label: "Stays" },
  { id: "Event Space", image: image2, label: "Event Space" },
  { id: "Photo shoot", image: image3, label: "Photo shoot" },
  { id: "Meeting", image: image4, label: "Meeting" },
];

const otherActiviy = [
  { id: "Meeting", image: image4, label: "Meeting" },
  { id: "Party", image: party, label: "Party" },
  { id: "Pool", image: swming, label: "Pool" },
  { id: "Film Shoot", image: flimShoot, label: "Film Shoot" },
  { id: "Performance", image: performance, label: "Performance" },
  { id: "Workshop", image: workshop, label: "Workshop" },
  { id: "Corporate Event", image: corporate, label: "Corporate Event" },
  { id: "Wedding", image: wedding, label: "Wedding" },
  { id: "Retreat", image: retrate, label: "Retreat" },
  { id: "Pop-up", image: popup, label: "Pop-up" },
  { id: "Networking", image: networking, label: "Networking" },
  { id: "Fitness Class", image: fitness, label: "Fitness Class" },
  { id: "Audio Recording", image: audio_recording, label: "Audio Recording" },
  { id: "Dinner", image: dinner, label: "Dinner" },
];

const amenitiesList = [
  "Free Parking",
  "Meal Included",
  "Elevator/Lift Access",
  "Wheelchair Accessible",
  "Smoking Allowed",
  "Non-Smoking Property",
  "Security Cameras",
  "Concierge Service",
  "Airport Shuttle Service",
  "Bike Rental",
  "Business Centre",
  "Conference/Meeting Facilities",
  "Spa/Wellness Centre",
  "Outdoor Space (Garden Terrace)",
  "BBQ/Grill Area",
  "Games Room",
  "Ski-In/Ski-Out Access",
  "Waterfront Property",
  "Scenic Views",
  "Eco-Friendly/Green Certified",
  "Smart Home Technology",
  "Electric Vehicle Charging Station",
  "Yoga/Meditation Space",
  "On-Site Restaurant/Cafe",
  "Bar/Lounge Area",
  "Live Entertainment",
  "Pet Amenities (Pet Sitting Pet Spa)",
  "Sports Facilities (Tennis Court Golf Course)",
  "Cultural Experiences/Workshops",
  "Coffee/Tea Station ",
];
//
const AddProperty = ({ onCallBack, propertyDataa, onBack, activeTab }) => {
  const dispatch = useDispatch();
  const [croxProp, setCroxProp] = useState(false);

  const [peopleProp, setPeopPro] = useState(false);
  const [BedroomProp, setBedroomProps] = useState(false);
  const [BathroomProp, setBathroomProp] = useState(false);
  //
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [propertyData, setPropertyData] = useState(propertyDataa);
  useEffect(() => {
    setPropertyData(propertyDataa);
  }, [propertyDataa]);

  const [otherActivyShow, setOthActivyShow] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    propertyData?.activities != null && Array.isArray(propertyData.amenities)
      ? propertyData.activities
      : [],
  ); // for activiites
  const [selectedAmenities, setSelectedAmenities] = useState(
    propertyData?.amenities != null && Array.isArray(propertyData.amenities)
      ? propertyData.amenities
      : [],
  ); // for amentites
  const [selectedRoom, setSelectedRoom] = useState(
    propertyData?.space_type != null && propertyData?.space_type !== undefined
      ? propertyData.space_type
      : "Entire_Home",
  );
  const [showMore, setShowMore] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(
    propertyData?.property_size != null &&
      propertyData?.property_size !== undefined
      ? propertyData.property_size.toString()
      : "Any",
  );

  //

  const [selectedOptionsOtherActivity, setSelectedOptionsOtherActivity] =
    useState(
      propertyData?.property_size != null &&
        propertyData?.property_size !== undefined
        ? propertyData.property_size.toString()
        : [],
    );

  const [customPrice, setCustomPrice] = useState("");

  const priceOptions = ["Any", "250", "350", "450", "550", "650", "750"];

  // for guest
  const [selectedGuests, setSelectedGuests] = useState(
    propertyData?.max_guest_count != null &&
      propertyData?.max_guest_count !== undefined
      ? propertyData.max_guest_count.toString()
      : "Any",
  ); // Default value

  const [customGuests, setCustomGuests] = useState("");
  const guestOptions = ["Any", "1", "2", "3", "4", "5", "6", "7"];

  // for bedrooms
  const [selectedBedrooms, setSelectedBedrooms] = useState(
    propertyData?.bedroom_count != null &&
      propertyData?.bedroom_count !== undefined
      ? propertyData.bedroom_count.toString()
      : "Any",
  ); // Default value
  const [customBedrooms, setCustomBedrooms] = useState("");

  const bedroomOptions = ["Any", "1", "2", "3", "4", "5", "6", "7"];

  // for bedrooms
  const [selectedBathrooms, setSelectedBathrooms] = useState(
    propertyData?.bathroom_count != null &&
      propertyData?.bathroom_count !== undefined
      ? propertyData.bathroom_count.toString()
      : "Any",
  ); // Default value

  const [customBathrooms, setCustomBathrooms] = useState(""); // For manual input

  const bathroomOptions = ["Any", "1", "2", "3", "4", "5", "6", "7"];

  const [instantBook, setInstantBook] = useState(
    propertyData?.is_instant_book != null &&
      propertyData?.is_instant_book !== undefined
      ? propertyData?.is_instant_book.toString()
      : "0",
  );
  const [selfCheckIn, setSelfCheckIn] = useState(
    propertyData?.has_self_checkin != null &&
      propertyData?.has_self_checkin !== undefined
      ? propertyData?.has_self_checkin.toString()
      : "0",
  );
  const [allowsPets, setAllowsPets] = useState(
    propertyData?.allows_pets != null && propertyData?.allows_pets !== undefined
      ? propertyData?.allows_pets.toString()
      : "0",
  );
  const [selectedCancellation, setSelectedCancellation] = useState(
    propertyData?.cancellation_duration != null &&
      propertyData?.cancellation_duration !== undefined
      ? propertyData.cancellation_duration.toString()
      : "",
  );
  //

  const [show, setShow] = useState(false);

  const localSaved =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = localSaved?.user_id;

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
    setCustomPrice("");
  };

  const handleCustomPriceChange = (e) => {
    setCustomPrice(e.target.value);
    setSelectedPrice(e.target.value);
  };

  // for guest

  const handleGuestChange = (guest) => {
    setSelectedGuests(guest);
    setCustomGuests("");
  };

  const handleCustomGuestChange = (e) => {
    setCustomGuests(e.target.value);
    setSelectedGuests(e.target.value);
  };
  // for bedrooms

  const handleBedroomChange = (bedroom) => {
    setSelectedBedrooms(bedroom);
    setCustomBedrooms("");
  };

  const handleCustomBedroomChange = (e) => {
    setCustomBedrooms(e.target.value);
    setSelectedBedrooms(e.target.value);
  };
  // for bedroom

  const handleBathroomChange = (bathroom) => {
    setSelectedBathrooms(bathroom);
    setCustomBathrooms("");
  };

  const handleCustomBathroomChange = (e) => {
    setCustomBathrooms(e.target.value);
    setSelectedBathrooms(e.target.value);
  };
  // calculate hours

  const handleCancellationChange = (value) => {
    const numericValue = value.includes("Days")
      ? (parseInt(value) * 24).toString()
      : parseInt(value).toString();

    setSelectedCancellation(numericValue);
  };

  // for activites

  const handleSelection = (id) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };
  //other activity

  const handleOtherActiviy = (id) => {
    setSelectedOptionsOtherActivity((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  // for am
  const handleCheckboxChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  };

  //

  useEffect(() => {
    if (propertyDataa) {
      setSelectedOptions(
        Array.isArray(propertyDataa.activities) ? propertyDataa.activities : [],
      );
      setSelectedAmenities(
        Array.isArray(propertyDataa.amenities) ? propertyDataa.amenities : [],
      );
      setSelectedRoom(propertyDataa.space_type?.toLowerCase() || "Entire_Home");
      setSelectedPrice(
        propertyDataa.property_size
          ? propertyDataa.property_size.toString()
          : "Any",
      );
      setSelectedOptionsOtherActivity([]); // Update as needed
      setSelectedGuests(propertyDataa.max_guest_count?.toString() || "Any");
      setSelectedBedrooms(propertyDataa.bedroom_count?.toString() || "Any");
      setSelectedBathrooms(propertyDataa.bathroom_count?.toString() || "Any");
      setInstantBook(propertyDataa.is_instant_book?.toString() || "0");
      setSelfCheckIn(propertyDataa.has_self_checkin?.toString() || "0");
      setAllowsPets(propertyDataa.allows_pets?.toString() || "0");
      setSelectedCancellation(
        propertyDataa.cancellation_duration?.toString() || "",
      );
    }
  }, [propertyDataa]);

  let params = {
    user_id: userId,
    space_type: selectedRoom?.toLowerCase(),
    property_size: selectedPrice,
    max_guest_count: parseInt(selectedGuests),
    bedroom_count: selectedBedrooms,
    bathroom_count: selectedBathrooms,
    is_instant_book: instantBook,
    has_self_checkin: selfCheckIn,
    allows_pets: allowsPets,
    cancellation_duration: selectedCancellation,
    activities: [
      ...(selectedOptions || []),
      ...(selectedOptionsOtherActivity || []),
    ],
    amenities: selectedAmenities,
  };

  const validationHandling = () => {
    let flag = true;

    if (!selectedPrice || selectedPrice == "Any") {
      toast.error("Please select area of Property size (sq ft)!", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!selectedGuests || selectedGuests == "Any") {
      toast.error("Please select Number of people", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!selectedBedrooms || selectedBedrooms == "Any") {
      toast.error("Please select count of bedrooms", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!selectedBathrooms || selectedBathrooms === "Any") {
      toast.error("Please select count bathrooms", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (selectedOptions.length < 2) {
      toast.error("Please select at least 2 activities", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (selectedAmenities.length === 0) {
      toast.error("Please select any amenities!", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!selectedCancellation) {
      toast.error("Please select a Cancellation option!", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    return flag;
  };

  const handleHomeSetup = async () => {
    if (!validationHandling()) return;
    dispatch(setAddPropertyDetails(params));
    // setActiveTab("gallery_location");
    onCallBack("gallery_location");
  };

  const clarAll = () => {
    setSelectedGuests("");
    setSelectedRoom("");
    setSelectedPrice("");
    setSelectedRoom("");
    setSelectedGuests("");
    setSelectedCancellation(null);
    setSelectedBedrooms(null);
    setSelectedAmenities([]);
    setSelectedBathrooms([]);
    setSelectedOptions([]);
    setAllowsPets(null);
    setSelfCheckIn(null);
    setInstantBook(null);
    setSelectedOptionsOtherActivity([]);
  };

  // const [activeTab, setActiveTab] = useState("home_setup");
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  // Check if "Stays" is selected in activities
  const isStaysSelected = selectedOptions.includes("Stays") || selectedOptionsOtherActivity.includes("Stays");
  const isDisabled = !isStaysSelected;

  return (
    <>
      {isMobileWidth && (
        <>
          {/* <div className="mob-search-filter border-start-0 border-end-0"> */}
          <div
            className="container-fluid d-flex justify-content-between"
            style={{ padding: "12px 3px" }}
          >
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    {/* <Link to="/profile">
                      <i className="fa-regular fa-arrow-left" style={{ textAlign: 'center' }}></i>
                    </Link> */}

                    <button
                      onClick={() => {
                        if (onBack) {
                          onBack();
                        }
                      }}
                      className="mob-back-btn"
                      // style={{
                      //   background: "transparent",
                      //   border: "none",
                      //   fontSize: "20px",
                      //   cursor: "pointer",
                      //   border:"1px solid #ccc",
                      //   borderRadius:'50%',
                      //   height:'50px',
                      //   width:'50px',
                      //   padding:'10px',
                      // }}
                    >
                      <i
                        className="fa-regular fa-arrow-left"
                        style={{
                          textAlign: "center",
                          appearance: "none",
                          WebkitAppearance: "none",
                          color: "black",
                        }}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Button
              style={{
                backgroundColor: "#4AEAB1",
                borderColor: "#4AEAB1",
                color: "black",
                borderRadius: "40px",
                fontWeight: "300",
                fontSize: "14px",
              }}
              onClick={() => handleHomeSetup()}
            >
              Save and Continue
            </Button>
          </div>
          {/* </div> */}
        </>
      )}

      <hr style={{ borderColor: "black", width: "104%", marginLeft: "-2%" }} />

      {isMobileWidth && (
        <>
          <h4 className="property-modal-main-heading"> Manage your place </h4>
          <h6 className="property-modal-main-sub-heading">
            {" "}
            Setup places, availability, prices and more.{" "}
          </h6>

          <div className="property-modal-radio-switch">
            {[
              { key: "home_setup", label: "Home Setup" },
              { key: "gallery_location", label: "Gallery & Location" },
              { key: "price_availability", label: "Price and Availability" },
            ].map(({ key, label }) => (
              <button
                key={key}
                disabled
                className="property-modal-radio-switch-btn"
                onClick={() => onCallBack(key)}
                style={{
                  backgroundColor:
                    activeTab === key ? "#FFFFFF" : "transparent",
                  color: activeTab === key ? "#000000" : "#000",
                  border:
                    activeTab === key
                      ? "1px solid #FFFFFF"
                      : "2px solid transparent",
                  fontWeight: activeTab === key ? "500" : "400",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <>
        <h4 className="property-modal-main-heading"> Type of place </h4>
        <h6 className="property-modal-main-sub-heading">
          {" "}
          Setup places, availability, prices and more.
        </h6>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            border: "2px solid #EBEDED",
            borderRadius: "60px",
            padding: isMobileWidth ? "2px" : "10px",
            width: "100%",
            // maxWidth: "500px",
            margin: "20px auto",
            backgroundColor: "#EBEDED",
            height: isMobileWidth ? 44 : 55,
          }}
        >
          {["entire_home", "private_room"].map((room) => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              style={{
                padding: isMobileWidth ? "4px 20px" : "10px 20px",
                fontSize: isMobileWidth ? "12px" : "14px",
                backgroundColor:
                  selectedRoom === room ? "#FFFFFF" : "transparent",
                color: selectedRoom === room ? "#000000" : "#000",
                border:
                  selectedRoom === room
                    ? "2px solid #FFFFFF"
                    : "2px solid transparent",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: selectedRoom === room ? "500" : "400",
                transition: "all 0.3s ease",
                width: "80%",
                height: isMobileWidth ? 38 : 40,
              }}
            >
              {room
                ?.replace(/_/g, " ")
                .split(" ")
                .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>

        <hr
          style={{ borderColor: "black", width: "104%", marginLeft: "-2%" }}
        />

        <h4 className="property-modal-main-heading">Availability</h4>
        <div className="preferences-wrap-host">
          <h6 className="property-modal-sub-heading">
            {" "}
            Property size (Sq ft){" "}
            <span
              style={{ color: "black", fontSize: "14px", marginLeft: "4px" }}
            >
              *
            </span>{" "}
          </h6>
          <div className="price-filter-wrapper">
            {priceOptions.map((price) => (
              <button
                className="price-filter-wrapper-btn"
                key={price}
                onClick={() => handlePriceChange(price)}
                style={{
                  backgroundColor:
                    selectedPrice === price ? "#FFFFFF" : "transparent",
                  color: selectedPrice === price ? "#000000" : "#000",
                  border:
                    selectedPrice === price
                      ? "2px solid #FFFFFF"
                      : "2px solid transparent",
                  fontWeight: selectedPrice === price ? "500" : "400",
                }}
              >
                {price}
              </button>
            ))}
            {/* Custom Input Field */}

            <input
              type="text"
              placeholder="Type..."
              className="price-filter-wrapper-input"
              value={
                priceOptions.includes(selectedPrice)
                  ? customPrice
                  : selectedPrice
              }
              onChange={handleCustomPriceChange}
              disabled={!!croxProp}
            />

            <button
              className="last-check-btn"
              onClick={() => {
                setCroxProp(!croxProp);
                if (croxProp) {
                  setCustomPrice(""); // Clears the custom price state
                  setSelectedPrice(""); // Clears the selected price state
                }
              }}
            >
              {croxProp ? (
                <i className="fa-solid fa-xmark"></i> // Show cross icon if checked
              ) : (
                <i className="fa-solid fa-check"></i> // Show check icon if not checked
              )}
            </button>
          </div>

          <h6 className="property-modal-sub-heading">
            Number of people{" "}
            <span
              style={{ color: "black", fontSize: "14px", marginLeft: "4px" }}
            >
              *
            </span>
          </h6>
          <div className="price-filter-wrapper">
            {guestOptions.map((guest) => (
              <button
                className="price-filter-wrapper-btn"
                key={guest}
                onClick={() => handleGuestChange(guest)}
                style={{
                  backgroundColor:
                    selectedGuests === guest ? "#FFFFFF" : "transparent",
                  color: selectedGuests === guest ? "#000000" : "#000",
                  border:
                    selectedGuests === guest
                      ? "2px solid #FFFFFF"
                      : "2px solid transparent",
                  fontWeight: selectedGuests === guest ? "500" : "400",
                }}
              >
                {guest}
              </button>
            ))}

            {/* Custom Input Field */}

            <input
              type="text"
              className="price-filter-wrapper-input"
              placeholder="Type..."
              disabled={!!peopleProp}
              value={
                guestOptions.includes(selectedGuests)
                  ? customGuests
                  : selectedGuests
              }
              onChange={handleCustomGuestChange}
            />

            <button
              className="last-check-btn"
              onClick={() => {
                setPeopPro(!peopleProp);
                if (peopleProp) {
                  setCustomGuests("");
                  setSelectedGuests("");
                }
              }}
            >
              {peopleProp ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-solid fa-check"></i>
              )}
            </button>
          </div>

          <h6 className="property-modal-sub-heading">
            Bedrooms{" "}
            <span
              style={{ color: "black", fontSize: "14px", marginLeft: "4px" }}
            >
              *
            </span>
          </h6>

          <div className="price-filter-wrapper" style={{ opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? "none" : "auto", transition: "opacity 0.3s ease" }}>

             {/* const isBedroomsSection = section.name === "bedroom"; */}
            
            {bedroomOptions.map((bedroom) => (
              <button
                className="price-filter-wrapper-btn"
                key={bedroom}
                onClick={() => handleBedroomChange(bedroom)}
                style={{
                  backgroundColor:
                    selectedBedrooms === bedroom ? "#FFFFFF" : "transparent",
                  color: selectedBedrooms === bedroom ? "#000" : "#000",
                  border:
                    selectedBedrooms === bedroom
                      ? "2px solid #FFFFFF"
                      : "2px solid transparent",
                  fontWeight: selectedBedrooms === bedroom ? "500" : "400",
                }}

                disabled={isDisabled}
              >
                {bedroom}
              </button>
            ))}

            {/* Custom Input Field */}

            <input
              type="text"
              placeholder="Type..."
              className="price-filter-wrapper-input"
              disabled={!!BedroomProp || isDisabled}
              value={
                bedroomOptions.includes(selectedBedrooms)
                  ? customBedrooms
                  : selectedBedrooms
              }
              onChange={handleCustomBedroomChange}
            />
            <button
              className="last-check-btn"
              onClick={() => {
                setBedroomProps(!BedroomProp);
                if (BedroomProp) {
                  setCustomBedrooms("");
                  setSelectedBedrooms("");
                }
              }}
              disabled={isDisabled}
            >
              {BedroomProp ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-solid fa-check"></i>
              )}
            </button>
          </div>

          {isDisabled && (
            <p
              style={{
                fontSize: isMobileWidth ? "10px" : "12px",
                color: "#999",
                marginTop: "0px",
                marginLeft: "12px",
                fontStyle: "italic",
              }}
            >
              Bedrooms selection is only available for "Stays" activity
            </p>
          )}

          <h6 className="property-modal-sub-heading">
            Bathrooms{" "}
            <span
              style={{ color: "black", fontSize: "14px", marginLeft: "4px" }}
            >
              *
            </span>
          </h6>

          <div className="price-filter-wrapper">
            {bathroomOptions.map((bathroom) => (
              <button
                key={bathroom}
                onClick={() => handleBathroomChange(bathroom)}
                style={{
                  backgroundColor:
                    selectedBathrooms == bathroom ? "#FFFFFF" : "transparent",
                  color: selectedBathrooms == bathroom ? "#000" : "#000",
                  border:
                    selectedBathrooms == bathroom
                      ? "2px solid #FFFFFF"
                      : "2px solid transparent",
                  fontWeight: selectedBathrooms == bathroom ? "500" : "400",
                }}
                className="price-filter-wrapper-btn"
              >
                {bathroom}
              </button>
            ))}

            {/* Custom Input Field */}

            <input
              type="text"
              placeholder="Type..."
              className="price-filter-wrapper-input"
              disabled={!!BathroomProp}
              value={
                bathroomOptions?.includes(selectedBathrooms)
                  ? customBathrooms
                  : selectedBathrooms
              }
              onChange={handleCustomBathroomChange}
            />
            <button
              className="last-check-btn"
              onClick={() => {
                setBathroomProp(!BathroomProp);
                if (BathroomProp) {
                  setCustomBathrooms("");
                  setSelectedBathrooms("");
                }
              }}
            >
              {BathroomProp ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-solid fa-check"></i>
              )}
            </button>
          </div>
        </div>

        <hr
          style={{ borderColor: "black", width: "104%", marginLeft: "-2%" }}
        />

        {/* <h4
          style={{
            marginTop: "20px",
            fontSize: isMobileWidth ? "16px" : "28px",
            color: "#000000",
            marginLeft: "12px",
            fontWeight: isMobileWidth && "400",
          }}
        >
          Activities <span style={{ color: "black", fontSize: "14px", marginLeft: "4px" }}>*</span>
        </h4> */}

        <h4
          style={{
            marginTop: "20px",
            fontSize: isMobileWidth ? "16px" : "28px",
            color: "#000000",
            marginLeft: "12px",
            fontWeight: isMobileWidth ? "400" : undefined,
          }}
        >
          Activities{" "}
          <span
            style={{
              color: "black",
              fontSize: "14px",
              position: "relative",
              top: "-12px",
              marginLeft: "-3px",
            }}
          >
            *
          </span>
        </h4>
        <Container>
          <Row className="justify-content-center mt-4">
            {options
              ?.slice(0, isMobileWidth ? 3 : options.length)
              .map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <Col
                    key={option.id}
                    xs={isMobileWidth ? 4 : 6}
                    md={3}
                    className="mb-3 "
                  >
                    <Card
                      onClick={() => handleSelection(option.id)}
                      className={`addproperty-activities-card ${
                        isSelected ? "selected" : ""
                      }`}
                      style={{}}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={option.image}
                          alt={option.label}
                          style={{
                            objectFit: "contain",
                            transition: "all 0.3s ease",
                            width: isMobileWidth ? "22px" : "40px",
                            height: isMobileWidth ? "22px" : "40px",
                            // paddingTop: isMobileWidth ? "2px" : "2px",
                            filter: isMobileWidth
                              ? ""
                              : isSelected
                                ? "brightness(0) invert(1)"
                                : "none", // Turns image white when selected
                          }}
                        />
                        <Card.Text
                          style={{
                            fontWeight: "400",
                            marginTop: "10px",

                            fontSize: isMobileWidth ? "10px" : "15px",
                            color: isMobileWidth
                              ? ""
                              : isSelected
                                ? "white"
                                : "black",
                          }}
                        >
                          {option.label}
                        </Card.Text>
                      </div>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Container>
        <h6
          style={{
            marginTop: "20px",
            fontSize: isMobileWidth ? "13px" : "16px",
            fontWeight: "400",
            color: "#000000",
            cursor: "pointer",
            marginLeft: "12px",
          }}
          onClick={() => setOthActivyShow(!otherActivyShow)}
        >
          Other Activities{" "}
          {otherActivyShow ? <FaChevronUp /> : <FaChevronDown />}
        </h6>
        {otherActivyShow && (
          <Container>
            <Row
              className={
                !isMobileWidth
                  ? "justify-content-start mt-4"
                  : "justify-content-start mt-4"
              }
            >
              {otherActiviy
                ?.slice(isMobileWidth ? 0 : 1, otherActiviy.length)
                .map((option) => {
                  const isSelected = selectedOptionsOtherActivity.includes(
                    option.id,
                  );
                  return (
                    <Col
                      key={option.id}
                      xs={isMobileWidth ? 4 : 6}
                      md={3}
                      // className="mb-3 d-flex justify-content-center"
                      className="mb-3 "
                    >
                      <Card
                        onClick={() => handleOtherActiviy(option.id)}
                        className={`w-100 addproperty-activities-card ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={option.image}
                            alt={option.label}
                            style={{
                              objectFit: "contain",
                              transition: "all 0.3s ease",
                              width: isMobileWidth ? "22px" : "40px",
                              height: isMobileWidth ? "22px" : "40px",
                              // paddingTop: isMobileWidth ? "2px" : "2px",
                              filter: isMobileWidth
                                ? ""
                                : isSelected
                                  ? "brightness(0) invert(1)"
                                  : "none", // Turns image white when selected
                            }}
                          />
                          <Card.Text
                            style={{
                              fontWeight: "400",
                              marginTop: "10px",
                              fontSize: isMobileWidth ? "10px" : "",
                              color: isMobileWidth
                                ? ""
                                : isSelected
                                  ? "white"
                                  : "black",
                            }}
                          >
                            {option.label}
                          </Card.Text>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </Container>
        )}
        <hr
          style={{ borderColor: "black", width: "104%", marginLeft: "-2%" }}
        />
        <h4
          style={{
            marginTop: "20px",
            fontSize: isMobileWidth ? "16px" : "28px",
            color: "#000000",
            marginLeft: "12px",
            fontWeight: isMobileWidth && "400",
          }}
        >
          Amenities{" "}
          <span
            style={{
              color: "black",
              fontSize: "14px",
              position: "relative",
              top: "-12px",
              marginLeft: "-3px",
            }}
          >
            *
          </span>
        </h4>
        <Container style={{ marginLeft: "0px" }}>
          <Row>
            {/* Show Only 1 Item Per Column When Collapsed */}
            {!showMore ? (
              <div className="d-flex flex-wrap">
                {amenitiesList?.slice(0, 6).map((item, index) => {
                  return (
                    <Col key={index} style={{ minWidth: "48%", width: "48%" }}>
                      <Form.Check
                        type="checkbox"
                        label={item}
                        checked={selectedAmenities.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                        className="custom-checkbox"
                        style={{ display: "flex", whiteSpace: "normal" }}
                      />
                      <style>
                        {` .custom-checkbox{
                            margin-top:10px;                              
                          }
                          .custom-checkbox label{
                             margin-left: 8px;
                             margin-top:${isMobileWidth ? "4px" : "0px"};
                             font-size: ${isMobileWidth ? "13px" : "16px"} ;
                             align-content: center;
                          }
                          .form-check-input:checked[type=checkbox] {
                            --bs-form-check-bg-image : none !important;
                          }                     
                        `}
                      </style>
                    </Col>
                  );
                })}
              </div>
            ) : (
              // Show Full List When Expanded
              <div className="d-flex flex-wrap justify-content-between ">
                {amenitiesList.map((amenity, index) => (
                  <Col md={6} style={{ maxWidth: "48%", width: "48%" }}>
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleCheckboxChange(amenity)}
                      className="custom-checkbox"
                      style={{ display: "flex", whiteSpace: "normal" }}
                    />
                    <style>
                      {` .custom-checkbox{
                            margin-top:10px;
                          }
                          .custom-checkbox label{
                                margin-left: 8px;
                                margin-top:${isMobileWidth ? "4px" : "0px"};
                                font-size: ${isMobileWidth ? "13px" : "16px"} ;
                                align-content: center;
                          }

                              .form-check-input:checked[type=checkbox] {
                            --bs-form-check-bg-image : none !important;
                          } 
                        `}
                    </style>
                  </Col>
                ))}
              </div>
            )}
          </Row>

          {/* Show More / Show Less Button */}
          <div className="mt-3">
            <Button
              variant="link"
              onClick={() => setShowMore(!showMore)}
              style={{
                color: "black",
                fontWeight: "400",
                marginLeft: "-9px",
                fontSize: isMobileWidth ? "13px" : "16px",
              }}
            >
              {showMore ? "Show Less" : "Show More"}
            </Button>
          </div>

          <style>
            {`
    .custom-checkbox .form-check-input {
      border-radius: 50%; /* Makes it circular */
      width:  ${isMobileWidth ? "22px" : "30px"} ;
      height:${isMobileWidth ? "22px" : "30px"} ;
      border: 1px solid #B1B1B1; /* Outline color */
    }

    .custom-checkbox .form-check-input:checked {
       background-color: #4AEAB1;
       border-color: #c9d1d1;

    }
  `}
          </style>
        </Container>

        <hr
          style={{ borderColor: "black", width: "104%", marginLeft: "-2%" }}
        />
        <h4
          style={{
            marginTop: "20px",
            fontSize: isMobileWidth ? "16px" : "28px",
            color: "#000000",
            marginLeft: "12px",
            fontWeight: isMobileWidth && "400",
          }}
        >
          Booking
        </h4>
        <Container className="mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div style={{ maxWidth: "85%" }}>
              <h6
                style={{
                  fontWeight: isMobileWidth ? "400" : "500",
                  fontSize: isMobileWidth ? "15px" : "18px",
                  color: "black",
                }}
              >
                Instant Book
              </h6>
              <p
                className="text-black"
                style={{ fontSize: isMobileWidth ? "13px" : "16px" }}
              >
                Listings you can book without waiting for host approval.
              </p>
            </div>

            <div
              onClick={() => setInstantBook(instantBook === "0" ? "1" : "0")}
              style={{
                width: isMobileWidth ? "30px" : "60px",
                height: isMobileWidth ? "16px" : "28px",
                borderRadius: "20px",
                backgroundColor:
                  instantBook === "1"
                    ? isMobileWidth
                      ? "#B0B0B0"
                      : "#4AEAB1"
                    : "#B0B0B0",
                position: "relative",
                cursor: "pointer",
                marginTop: isMobileWidth && "-9px",
                transition: "background-color 0.3s",
              }}
            >
              <div
                style={{
                  width: isMobileWidth ? "18px" : "24px",
                  height: isMobileWidth ? "18px" : "24px",
                  borderRadius: "50%",
                  backgroundColor:
                    isMobileWidth && instantBook === "1" ? "#555353ff" : "#fff",
                  position: "absolute",
                  top: isMobileWidth ? "-1px" : "2px",
                  left:
                    instantBook === "1"
                      ? isMobileWidth
                        ? "20px"
                        : "33px"
                      : isMobileWidth
                        ? ""
                        : "3px",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </Container>

        <Container className="mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div style={{ maxWidth: "85%" }}>
              <h6
                style={{
                  fontWeight: isMobileWidth ? "400" : "500",
                  fontSize: isMobileWidth ? "15px" : "18px",
                  color: "black",
                }}
              >
                Self Check-in
              </h6>
              <p
                className="text-black"
                style={{ fontSize: isMobileWidth ? "13px" : "16px" }}
              >
                Easy access to the property once you arrive.
              </p>
            </div>

            <div
              onClick={() => setSelfCheckIn(selfCheckIn === "0" ? "1" : "0")}
              style={{
                width: isMobileWidth ? "30px" : "60px",
                height: isMobileWidth ? "16px" : "28px",
                borderRadius: "20px",
                backgroundColor:
                  selfCheckIn === "1"
                    ? isMobileWidth
                      ? "#B0B0B0"
                      : "#4AEAB1"
                    : "#B0B0B0",
                position: "relative",
                cursor: "pointer",
                marginTop: isMobileWidth && "-9px",
                transition: "background-color 0.3s",
              }}
            >
              <div
                style={{
                  width: isMobileWidth ? "18px" : "24px",
                  height: isMobileWidth ? "18px" : "24px",
                  borderRadius: "50%",
                  backgroundColor:
                    isMobileWidth && selfCheckIn === "1" ? "#555353ff" : "#fff",
                  position: "absolute",
                  top: isMobileWidth ? "-1px" : "2px",
                  left:
                    selfCheckIn === "1"
                      ? isMobileWidth
                        ? "20px"
                        : "33px"
                      : isMobileWidth
                        ? ""
                        : "3px",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </Container>
        <Container className="mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                maxWidth: "85%",
              }}
            >
              <h6
                style={{
                  fontWeight: isMobileWidth ? "400" : "500",
                  fontSize: isMobileWidth ? "15px" : "18px",
                  margin: "0px",
                }}
              >
                Allows Pets
              </h6>
              <span
                className="info-wrap"
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginLeft: "8px",
                  background: "shadowed",
                }}
              >
                <span
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <img
                    src="/images/create-profile/info.svg"
                    loading="lazy"
                    alt=""
                    style={{ cursor: "pointer", marginLeft: 0 }}
                  />
                  {isHovered && (
                    <span
                      style={{
                        display: "block",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "#fff",
                        color: "#000",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        width: "400px",
                        zIndex: 10,
                        whiteSpace: "normal",
                      }}
                    >
                      Your safety and peace of mind are our top priorities. ZYVO
                      is proud to provide comprehensive liability insurance
                      coverage for all bookings
                    </span>
                  )}
                </span>
              </span>
            </div>

            <div
              onClick={() => setAllowsPets(allowsPets === "0" ? "1" : "0")}
              style={{
                width: isMobileWidth ? "30px" : "60px",
                height: isMobileWidth ? "16px" : "28px",
                borderRadius: "20px",
                backgroundColor:
                  allowsPets === "1"
                    ? isMobileWidth
                      ? "#B0B0B0"
                      : "#4AEAB1"
                    : "#B0B0B0",
                position: "relative",
                cursor: "pointer",
                transition: "background-color 0.3s",
                marginTop: isMobileWidth && "-9px",
              }}
            >
              <div
                style={{
                  width: isMobileWidth ? "18px" : "24px",
                  height: isMobileWidth ? "18px" : "24px",
                  borderRadius: "50%",
                  backgroundColor:
                    isMobileWidth && allowsPets === "1" ? "#555353ff" : "#fff",
                  position: "absolute",
                  top: isMobileWidth ? "-1px" : "2px",
                  left:
                    allowsPets === "1"
                      ? isMobileWidth
                        ? "20px"
                        : "33px"
                      : isMobileWidth
                        ? ""
                        : "3px",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </Container>
        <Container className="mt-3">
          <div
            className={`d-flex align-items-center ${
              isMobileWidth ? "justify-content-between" : "justify-content-left"
            }`}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <h6
                  style={{
                    margin: 0,
                    fontWeight: isMobileWidth ? "400" : "500",
                    fontSize: isMobileWidth ? "15px" : "18px",
                  }}
                >
                  {isMobileWidth ? "Cancellation " : "Cancellation Policy"}{" "}
                  <span
                    style={{
                      color: "black",
                      fontSize: "14px",
                      position: "relative",
                      top: "-10px",
                      marginLeft: "-3px",
                    }}
                  >
                    *
                  </span>
                </h6>
                <span
                  className="info-wrap"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginLeft: "8px",
                  }}
                >
                  <span
                    onMouseEnter={() => setIsHovered1(true)}
                    onMouseLeave={() => setIsHovered1(false)}
                    style={{ display: "inline-block", position: "relative" }}
                  >
                    <img
                      src="/images/create-profile/info.svg"
                      loading="lazy"
                      alt=""
                      style={{ cursor: "pointer", marginLeft: 0 }}
                    />
                    {isHovered1 && (
                      <span
                        style={{
                          display: "block",
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          backgroundColor: "#fff",
                          color: "#000",
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          width: "400px",
                          zIndex: 10,
                          whiteSpace: "normal",
                        }}
                      >
                        Guest can cancel within selected time frame before
                        confirmed booking time (only ONE selection can be made)
                      </span>
                    )}
                  </span>
                </span>
              </div>
            </div>

            {/* Right Side - Bootstrap Dropdown */}
            {/* <Dropdown>
              <Dropdown.Toggle
                variant="outline-dark"
                style={{ border:'1px solid #FFF',borderRadius:'20px',boxShadow:"0 4px 8px rgba(0, 0, 0, 0.15)",color:'#ccc',fontWeight:'400'}}
              >
                {selectedCancellation
                  ? selectedCancellation == 24
                    ? "24 Hrs"
                    : `${selectedCancellation / 24} Days`
                  : "Select Dropdown"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {["24 Hrs", "3 Days", "7 Days", "15 Days", "30 Days"].map(
                  (option, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleCancellationChange(option)}
                    >
                      {option}
                    </Dropdown.Item>
                  )
                )}
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <Dropdown onToggle={(isOpen) => setShow(isOpen)}>
  <Dropdown.Toggle
    variant="outline-dark"
    style={{
      border: "1px solid #FFF",
      borderRadius: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
      color: "#ccc",
      fontWeight: "400",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >
    {selectedCancellation
      ? selectedCancellation == 24
        ? "24 Hrs"
        : `${selectedCancellation / 24} Days`
      : "Select Dropdown"}

    {show ? <FaChevronUp size={12}  style={{color:'black'}}/> : <FaChevronDown size={12} style={{color:'black'}} />}
  </Dropdown.Toggle>

  <Dropdown.Menu>
    {["24 Hrs", "3 Days", "7 Days", "15 Days", "30 Days"].map(
      (option, index) => (
        <Dropdown.Item
          key={index}
          onClick={() => handleCancellationChange(option)}
        >
          {option}
        </Dropdown.Item>
      )
    )}
  </Dropdown.Menu>
</Dropdown> */}

            <Dropdown onToggle={(isOpen) => setShow(isOpen)}>
              <Dropdown.Toggle
                variant="outline-light"
                className="no-caret"
                style={{
                  border: "1px solid #FFF",
                  borderRadius: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                  fontWeight: "400",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: isMobileWidth ? "155px" : "200px",
                }}
              >
                <span style={{ color: "#000000", opacity: "60%" }}>
                  {selectedCancellation
                    ? selectedCancellation == 24
                      ? "24 Hrs"
                      : `${selectedCancellation / 24} Days`
                    : "Select Dropdown"}
                </span>

                {show ? (
                  <FaChevronUp size={15} style={{ color: "black" }} />
                ) : (
                  <FaChevronDown size={15} style={{ color: "black" }} />
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {["24 Hrs", "3 Days", "7 Days", "15 Days", "30 Days"].map(
                  (option, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleCancellationChange(option)}
                    >
                      {option}
                    </Dropdown.Item>
                  ),
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
        <hr
          style={{
            borderColor: "black",
            width: "104%",
            marginLeft: "-2%",
            marginBottom: "20px",
          }}
        />

        {!isMobileWidth && (
          <>
            <Container className="mt-8 d-flex justify-content-between">
              {/* Clear All Button */}
              <Button
                className="clear-filter"
                variant="outline-success"
                onClick={clarAll}
                style={{
                  color: "#000",
                  background: "#fff",
                  borderColor: "#E5E5E5",
                  fontWeight: "400",
                  borderRadius: "40px",
                  padding: "13px 26px",
                  marginLeft: "-15px",
                }}
              >
                Clear All
              </Button>

              {/* Save and Continue Button */}
              <Button
                style={{
                  backgroundColor: "#4AEAB1",
                  borderColor: "#4AEAB1",
                  fontWeight: "400",
                  color: "black",
                  borderRadius: "40px",
                  padding: "13px 26px",
                }}
                onClick={() => handleHomeSetup()}
              >
                Save and Continue
              </Button>
            </Container>
          </>
        )}
      </>
    </>
  );
};

export default AddProperty;
