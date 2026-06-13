import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { FaPlus, FaPen } from "react-icons/fa";
import ItemSelector from "./ItemSelector";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAddPropertyDetails,
  setAddnewPropertyState,
  setPropertyId,
} from "../../../store/slices/hostuserSlice";
import useHome from "../../../hooks/host/useHome";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const monthsRange = [
  { id: "00", label: "All" },
  { id: "01", label: "Jan" },
  { id: "02", label: "Feb" },
  { id: "03", label: "Mar" },
  { id: "04", label: "Apr" },
  { id: "05", label: "May" },
  { id: "06", label: "Jun" },
  { id: "07", label: "Jul" },
  { id: "08", label: "Aug" },
  { id: "09", label: "Sep" },
  { id: "10", label: "Oct" },
  { id: "11", label: "Nov" },
  { id: "12", label: "Dec" },
];

const daysRange = [
  { label: "all" },
  { label: "working_days" },
  { label: "weekends" },
];

const PriceAvailblity = ({
  switchToGallery,
  hideModal,
  propertyDataa,
  propertyID,
  onBack,
  activeTab,
}) => {
  const [propertyData, setPropertyData] = useState(propertyDataa);

  useEffect(() => {
    setPropertyData(propertyDataa);
  }, [propertyDataa]);

  const dispatch = useDispatch();
  const { addPropertyHost, updateProperyDetails } = useHome();
  const GallerySelect = useSelector(
    (state) => state?.hostuser?.addPropertyDetails,
  );
  const [minHour, setMinHour] = useState(
    propertyData?.min_booking_hours != null &&
      propertyData?.min_booking_hours !== undefined
      ? String(parseInt(propertyData?.min_booking_hours))
      : "2",
  );

  const [pricing, setPricing] = useState(
    propertyData?.hourly_rate != null && propertyData?.hourly_rate !== undefined
      ? String(parseInt(propertyData?.hourly_rate))
      : "10",
  );
  const [bulkHour, setBulkHour] = useState(
    propertyData?.bulk_discount_hour != null &&
      propertyData?.bulk_discount_hour !== undefined
      ? String(propertyData?.bulk_discount_hour)
      : "2",
  );
  const [bulkDiscount, setBulkDiscount] = useState(
    propertyData?.bulk_discount_rate != null &&
      propertyData?.bulk_discount_rate !== undefined
      ? String(parseInt(propertyData?.bulk_discount_rate))
      : "5",
  );
  const [cleaningFee, setCleaningFee] = useState(
    propertyData?.cleaning_fee != null &&
      propertyData?.cleaning_fee !== undefined
      ? propertyData?.cleaning_fee
      : "",
  );
  const [showCleaningFee, setShowCleaningFee] = useState(cleaningFee || false);

  const convertTo12HourFormat = (timeString) => {
    const [hour, minute] = timeString?.split(":");
    const date = new Date();
    date.setHours(hour, minute ?? 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [fromTime, setFromTime] = useState(
    propertyData?.available_from != null &&
      propertyData?.available_from !== undefined
      ? convertTo12HourFormat(propertyData?.available_from)
      : "00",
  );

  const [toTime, setToTime] = useState(
    propertyData?.available_to != null &&
      propertyData?.available_to !== undefined
      ? convertTo12HourFormat(propertyData?.available_to)
      : "00",
  );
  const [monthselect, setMonthsSelect] = useState(
    propertyData?.available_month != null &&
      propertyData?.available_month !== undefined
      ? propertyData?.available_month
      : "00",
  );
  const [selcteAvailiblity, setSelectAvailiblity] = useState(
    propertyData?.available_day != null &&
      propertyData?.available_day !== undefined
      ? propertyData?.available_day
      : "All",
  );

  const handleSelectMonths = (id) => {
    if (id === "00") {
      setMonthsSelect("00");
    } else {
      let selectedArray = monthselect ? String(monthselect).split(",") : [];
      selectedArray = selectedArray.filter((x) => x !== "00" && x !== "");
      if (selectedArray.includes(id)) {
        selectedArray = selectedArray.filter((x) => x !== id);
      } else {
        selectedArray.push(id);
      }
      if (selectedArray.length === 0) {
        setMonthsSelect("00");
      } else {
        selectedArray.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        setMonthsSelect(selectedArray.join(","));
      }
    }
  };

  const handleSelectAvailblity = (label) => {
    setSelectAvailiblity(label);
  };

  const [selectedItems, setSelectedItems] = useState(
    propertyData?.add_ons ?? [],
  );

  const handleItemsUpdate = (items) => {
    setSelectedItems(items);
  };

  let params = {
    min_booking_hours: minHour,
    hourly_rate: pricing,
    bulk_discount_hour: bulkHour,
    bulk_discount_rate: bulkDiscount,
    cleaning_fee: cleaningFee,
    available_month: monthselect,
    available_day: selcteAvailiblity,
    available_from: fromTime ? moment(fromTime, "hh:mm A").format("HH:mm") : "",
    available_to: toTime ? moment(toTime, "hh:mm A").format("HH:mm") : "",
    add_ons: selectedItems,
    ...GallerySelect,
  };

  const validatePricAvaility = () => {
    let flag = true;
    if (!minHour || !minHour?.trim()) {
      toast.error("Please enter minimum booking hours", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!pricing?.trim()) {
      toast.error("Please enter hourly rate", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!bulkHour?.trim()) {
      toast.error("Please enter bulk discount hours", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    // if (!cleaningFee?.trim()) {
    //   toast.error("Please add cleaning fee", {
    //     position: "top-right",
    //     autoClose: 3000,
    //   });
    //   flag = false;
    // }

    if (!bulkDiscount?.trim()) {
      toast.error("Please enter bulk discount rate", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (
      (!propertyData?.add_ons || propertyData.add_ons.length === 0) &&
      selectedItems.length === 0
    ) {
      toast.error("Please add at least one selected item", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (showCleaningFee && !cleaningFee.trim()) {
      toast.error("Please enter cleaning fee", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!selcteAvailiblity?.trim()) {
      toast.error("Please select availability", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!fromTime.trim() || fromTime == "00") {
      toast.error("Please select available from time", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (!toTime.trim() || toTime == "00") {
      toast.error("Please select available to time", {
        position: "top-right",
        autoClose: 3000,
      });
      flag = false;
    }

    if (fromTime === toTime) {
      toast.error("Start time and end time should be different");
      flag = false;
      return;
    } else {
      const [fromT, fromModifier] = fromTime.split(" ");
      const [toT, toModifier] = toTime.split(" ");
      const [fromH, fromM] = fromT.split(":").map(Number);
      const [toH, toM] = toT.split(":").map(Number);

      let fromTotalMinutes =
        (fromModifier === "PM" && fromH !== 12
          ? fromH + 12
          : fromH === 12 && fromModifier === "AM"
            ? 0
            : fromH) *
          60 +
        fromM;
      let toTotalMinutes =
        (toModifier === "PM" && toH !== 12
          ? toH + 12
          : toH === 12 && toModifier === "AM"
            ? 0
            : toH) *
          60 +
        toM;

      let duration = toTotalMinutes - fromTotalMinutes;
      if (duration < 0) {
        duration += 24 * 60; // handle overnight case
      }

      if (duration > 23 * 60) {
        toast.error("Duration should not exceed 23 hours");
        flag = false;
        return;
      }
    }

    return flag;
  };

  const handlePriceAvailbity = async () => {
    if (isPublishing) return;
    if (!validatePricAvaility()) return;

    setIsPublishing(true);
    if (propertyID != null && propertyID !== undefined) {
      await handleUpdate();
    } else {
      await handleStoreDetails();
    }
  };

  const handleStoreDetails = async () => {
    try {
      const response = await addPropertyHost(params);

      if (response) {
        toast.success("Property added successful");
        dispatch(setAddnewPropertyState(false));
        switchToGallery("home_setup");
        hideModal();
        dispatch(clearAddPropertyDetails());
        dispatch(setPropertyId(response?.data?.property_id));
      } else {
        setIsPublishing(false);
      }
    } catch (error) {
      console.error("Error adding property details:", error);
      setIsPublishing(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedParams = { ...params, property_id: propertyID };

      const response = await updateProperyDetails(updatedParams);
      if (response.success) {
        switchToGallery("home_setup");
        toast.success("Property updated successfully");
        hideModal();
      } else {
        setIsPublishing(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update property details");
      setIsPublishing(false);
    }
  };

  const [disabledTimes, setDisabledTimes] = useState([]);

  const handleFromTimeChange = (value) => {
    setFromTime(value);

    if (value && minHour) {
      const [time, meridian] = value.split(" ");
      const [hour, minute] = time.split(":");

      const startMins = timeToMinutes(hour ?? 0, minute ?? 0, meridian);
      const endMins = startMins + Number(minHour) * 60;
      const endTimeStrObj = minutesToTime(endMins);
      const formattedEnd = `${endTimeStrObj.hour}:${endTimeStrObj.minute} ${endTimeStrObj.meridian}`;
      setToTime(formattedEnd);

      const disabledRange = [];
      for (let i = 0; i < minHour; i++) {
        const mins = startMins + i * 60;
        const t = minutesToTime(mins);
        const timeStr = `${t.hour}:${t.minute} ${t.meridian}`;
        disabledRange.push(timeStr);
      }

      setDisabledTimes(disabledRange);
    }
  };

  const handleMinHourChange = (value) => {
    setMinHour(value);
    if (fromTime && fromTime !== "00") {
      handleFromTimeChange(fromTime);
    }
  };

  const [showDropdownTime, setShowDropdownTime] = useState(false);
  const [showDropdownTime2, setShowDropdownTime2] = useState(false);

  const [startTime, setStartTime] = useState(() => {
    const hr = fromTime?.split(" ")[0].split(":")[0];
    return hr && hr !== "00" ? hr.padStart(2, "0") : "01";
  });
  const [startMinute, setStartMinute] = useState(() => {
    const min = fromTime?.split(" ")[0].split(":")[1];
    return min && min !== "undefined" ? min.padStart(2, "0") : "00";
  });
  const [startMeridian, setStartMeridian] = useState(() => {
    const mer = fromTime?.split(" ")[1];
    return mer && mer !== "undefined" ? mer : "AM";
  });

  const [endTime, setEndTime] = useState(() => {
    const hr = toTime?.split(" ")[0].split(":")[0];
    return hr && hr !== "00" ? hr.padStart(2, "0") : "12";
  });
  const [endMinute, setEndMinute] = useState(() => {
    const min = toTime?.split(" ")[0].split(":")[1];
    return min && min !== "undefined" ? min.padStart(2, "0") : "00";
  });
  const [endMeridian, setEndMeridian] = useState(() => {
    const mer = toTime?.split(" ")[1];
    return mer && mer !== "undefined" ? mer : "AM";
  });

  useEffect(() => {
    if (fromTime && fromTime !== "00") {
      const parts = fromTime.split(" ");
      if (parts.length === 2) {
        const timeParts = parts[0].split(":");
        if (timeParts.length === 2) {
          const hr = timeParts[0].padStart(2, "0");
          const min = timeParts[1].padStart(2, "0");
          const mer = parts[1];
          if (hr !== "00") {
            setStartTime(hr);
          } else {
            setStartTime("01");
          }
          setStartMinute(min);
          setStartMeridian(mer);
        }
      }
    } else {
      setStartTime("01");
      setStartMinute("00");
      setStartMeridian("AM");
    }
  }, [fromTime]);

  useEffect(() => {
    if (toTime && toTime !== "00") {
      const parts = toTime.split(" ");
      if (parts.length === 2) {
        const timeParts = parts[0].split(":");
        if (timeParts.length === 2) {
          const hr = timeParts[0].padStart(2, "0");
          const min = timeParts[1].padStart(2, "0");
          const mer = parts[1];
          if (hr !== "00") {
            setEndTime(hr);
          } else {
            setEndTime("12");
          }
          setEndMinute(min);
          setEndMeridian(mer);
        }
      }
    } else {
      setEndTime("12");
      setEndMinute("00");
      setEndMeridian("PM");
    }
  }, [toTime]);

  const timeToMinutes = (h, m, mer) => {
    let hour = parseInt(h, 10);
    let minute = parseInt(m, 10);
    if (mer === "PM" && hour !== 12) hour += 12;
    if (mer === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  const minutesToTime = (mins) => {
    const totalMins = mins % (24 * 60);
    let hour = Math.floor(totalMins / 60);
    const minute = totalMins % 60;
    const meridian = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return {
      hour: hour.toString().padStart(2, "0"),
      minute: minute.toString().padStart(2, "0"),
      meridian,
    };
  };

  const getDisabledEndHours = () => {
    const startMins = timeToMinutes(startTime, startMinute, startMeridian);
    const endMins = startMins + Number(minHour) * 60;

    const disabled = new Set();

    for (let i = startMins; i <= endMins; i += 60) {
      const { hour, meridian } = minutesToTime(i);
      disabled.add(`${hour}-${meridian}`);
    }

    return disabled;
  };

  const handleSave2 = () => {
    const formattedStart = `${startTime}:${startMinute} ${startMeridian}`;
    setFromTime(formattedStart);

    const startMins = timeToMinutes(startTime, startMinute, startMeridian);
    const endMins = startMins + Number(minHour) * 60;
    const end = minutesToTime(endMins);

    const formattedEnd = `${end.hour}:${end.minute} ${end.meridian}`;
    setToTime(formattedEnd);

    setEndTime(end.hour);
    setEndMinute(end.minute);
    setEndMeridian(end.meridian);

    const disabled = [];
    for (let i = startMins; i < endMins; i += 15) {
      const t = minutesToTime(i);
      const timeStr = `${t.hour}:${t.minute} ${t.meridian}`;
      disabled.push(timeStr);
    }
    setDisabledTimes(disabled);

    setShowDropdownTime(false);
  };

  const handleSave3 = () => {
    const formattedEnd = `${endTime}:${endMinute} ${endMeridian}`;
    setToTime(formattedEnd);
    setShowDropdownTime2(false);
  };

  const renderMinuteOptions = () => {
    return [...Array(60).keys()].map((m) => {
      return (
        <option key={m} value={m.toString().padStart(2, "0")}>
          {m.toString().padStart(2, "0")}
        </option>
      );
    });
  };

  // const [activeTab, setActiveTab] = useState("home_setup");
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };

  const [isPublishing, setIsPublishing] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  return (
    <div
      className="p-lg-3"
      style={{
        marginBottom:
          isMobileWidth && (showDropdownTime || showDropdownTime2)
            ? "128px"
            : "",
      }}
    >
      {isMobileWidth && (
        <>
          {/* <div className="mob-search-filter border-start-0 border-end-0"> */}
          <div className="container-fluid d-flex justify-content-between">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <button
                      onClick={() => switchToGallery("gallery_location")}
                      className="mob-back-btn"
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
              className="save-continue-btn"
              disabled={isPublishing}
              style={{
                backgroundColor: "#4AEAB1",
                borderColor: "#4AEAB1",
                fontWeight: "400",
                color: "black",
                borderRadius: "40px",
              }}
              onClick={handlePriceAvailbity}
            >
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Button>
          </div>
          {/* </div> */}
        </>
      )}

      <hr
        className="property-modal-hr"
        style={{ marginTop: isMobileWidth ? "" : "-9px" }}
      />

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
                onClick={() => switchToGallery(key)}
                style={{
                  backgroundColor:
                    activeTab === key ? "#FFFFFF" : "transparent",
                  color: activeTab === key ? "#000000" : "#000",
                  border:
                    activeTab === key
                      ? "1px solid #FFFFFF"
                      : "2px solid transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      {isMobileWidth && <hr className="property-modal-hr" />}

      <h6
        style={{
          fontSize: isMobileWidth ? "16px" : "25px",
          marginLeft: isMobileWidth ? "9px" : "-4px",
          marginTop: "30px",
          fontWeight: isMobileWidth && "400",
        }}
      >
        Minimum hour & Pricing{" "}
      </h6>
      <Row className="mb-4">
        <Col
          md={4}
          style={{ width: isMobileWidth ? "50%" : "48%", marginTop: "2%" }}
        >
          <Form.Select
            value={minHour}
            onChange={(e) => handleMinHourChange(e.target.value)}
            className="custom-input"
            style={{ fontSize: isMobileWidth && "13px" }}
          >
            <style>
              {` .custom-input { color: black; // border:1px solid  black; border-radius:20px; padding:10px; }`}
            </style>

            <option value="2">2 Hours minimum</option>
            <option value="3">3 Hours minimum</option>

            <option value="4">4 Hours minimum</option>
            <option value="5">5 Hours minimum</option>
            <option value="6">6 Hours minimum</option>
            <option value="7">7 Hours minimum</option>
            <option value="8">8 Hours minimum</option>
            <option value="9">9 Hours minimum</option>
          </Form.Select>
        </Col>
        <Col md={4} style={{ width: "48%", marginTop: "2%" }}>
          <Form.Select
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="custom-input"
            style={{ fontSize: isMobileWidth && "13px" }}
          >
            <style>
              {` .custom-input {color: black; border-radius:20px; padding:10px; } `}
            </style>

            <option value="10">$10 per hour</option>
            <option value="20">$20 per hour</option>
            <option value="30">$30 per hour</option>
            <option value="40">$40 per hour</option>
            <option value="50">$50 per hour</option>
            <option value="60">$60 per hour</option>
            <option value="70">$70 per hour</option>
            <option value="80">$80 per hour</option>
          </Form.Select>
        </Col>
      </Row>
      <hr className="property-modal-hr" />

      {/* Bulk Discount */}
      <h6
        style={{
          fontSize: isMobileWidth ? "16px" : "25px",
          marginLeft: isMobileWidth ? "9px" : "-4px",
          marginTop: "30px",
          fontWeight: isMobileWidth && "400",
        }}
      >
        Bulk Discount{" "}
      </h6>
      <Row className="mb-4">
        <Col
          md={4}
          style={{ width: isMobileWidth ? "50%" : "48%", marginTop: "2%" }}
        >
          <Form.Select
            value={bulkHour}
            onChange={(e) => setBulkHour(e.target.value)}
            className="custom-input"
            style={{ fontSize: isMobileWidth && "13px" }}
          >
            <style>
              {` .custom-input { color: black; border-radius:20px; }`}
            </style>
            <option value="2">2 Hours minimum</option>
            <option value="3">3 Hours minimum</option>

            <option value="4">4 Hours minimum</option>
            <option value="5">5 Hours minimum</option>
            <option value="6">6 Hours minimum</option>
            <option value="7">7 Hours minimum</option>
            <option value="8">8 Hours minimum</option>
            <option value="9">9 Hours minimum</option>
          </Form.Select>
        </Col>
        <Col
          md={4}
          style={{ width: isMobileWidth ? "50%" : "48%", marginTop: "2%" }}
        >
          <Form.Select
            value={bulkDiscount}
            onChange={(e) => setBulkDiscount(e.target.value)}
            className="custom-input"
            style={{ fontSize: isMobileWidth && "13px" }}
          >
            <style>
              {` .custom-input { color: black; border-radius:20px; } `}
            </style>

            <option value="5">5% Discount</option>
            <option value="10">10% Discount</option>
            <option value="15">15% Discount</option>
            <option value="20">20% Discount</option>
            <option value="25">25% Discount</option>
            <option value="30">30% Discount</option>
            <option value="35">35% Discount</option>
            <option value="40">40% Discount</option>
          </Form.Select>
        </Col>
      </Row>
      <hr className="property-modal-hr" />
      <h6
        style={{
          fontSize: isMobileWidth ? "16px" : "25px",
          marginLeft: isMobileWidth ? "9px" : "-4px",
          marginTop: "30px",
          fontWeight: isMobileWidth && "400",
        }}
      >
        Add-ons from the host{" "}
        <span
          style={{
            color: "black",
            fontSize: "14px",
            position: "relative",
            top: "-8px",
            marginLeft: "-3px",
          }}
        >
          *
        </span>
      </h6>

      <Row className="">
        <Col md={12}>
          <ItemSelector
            onItemsUpdate={handleItemsUpdate}
            propertyData={propertyData}
            isMobileWidth={isMobileWidth}
          />
        </Col>
      </Row>
      <hr className="property-modal-hr" style={{ marginTop: "-5px" }} />
      {/* Cleaning Fee */}
      <h6
        style={{
          fontSize: isMobileWidth ? "16px" : "25px",
          marginLeft: isMobileWidth ? "9px" : "-4px",
          marginTop: "30px",
          fontWeight: isMobileWidth && "400",
        }}
      >
        Cleaning Fee{" "}
        <span
          style={{
            color: "black",
            fontSize: "14px",
            position: "relative",
            top: "-8px",
            marginLeft: "-3px",
          }}
        >
          *
        </span>
      </h6>
      <Row className="mb-4">
        <Col md={4}>
          {!showCleaningFee ? (
            <Button
              variant="light"
              onClick={() => setShowCleaningFee(true)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "999px",
                backgroundColor: "#fff",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                width: "100%",
              }}
              onMouseDown={(e) => (e.target.style.borderColor = "#007BFF")}
              onMouseUp={(e) => (e.target.style.borderColor = "#ddd")}
            >
              <span style={{ fontWeight: "400" }}>$</span>
              <span
                style={{
                  fontWeight: "400",
                  flexGrow: 1,
                  textAlign: "left",
                  fontSize: isMobileWidth && "13px",
                }}
              >
                Add Cleaning Fee
              </span>
              <span
                style={{
                  backgroundColor: "#3EF4AE",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                }}
              >
                <FaPlus />
              </span>
            </Button>
          ) : (
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                border: "1px solid #ddd",
                borderRadius: "999px",
                backgroundColor: "#fff",
                padding: "6px 12px",
                width: isMobileWidth ? "60%" : "100%",
                gap: "10px",
              }}
            >
              <span style={{ fontWeight: "400" }}>$</span>
              <Form.Control
                type="text"
                value={cleaningFee}
                onChange={(e) => setCleaningFee(e.target.value)}
                placeholder="Enter Fee"
                style={{
                  border: "none",
                  boxShadow: "none",
                  fontWeight: "400",
                  width: isMobileWidth ? "120px" : "142px",
                  padding: 0,
                  fontSize: isMobileWidth ? "13px" : "16px",
                }}
              />
              <span
                style={{
                  backgroundColor: "#3EF4AE",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                }}
              >
                <FaPen />
              </span>
            </div>
          )}
        </Col>
      </Row>
      <hr className="property-modal-hr" />
      <h6
        style={{
          fontSize: isMobileWidth ? "16px" : "25px",
          marginLeft: isMobileWidth ? "9px" : "-4px",
          marginTop: "30px",
          fontWeight: isMobileWidth && "400",
        }}
      >
        Availability - Days & Months{" "}
        <span
          style={{
            color: "black",
            fontSize: "14px",
            position: "relative",
            top: "-8px",
            marginLeft: "-3px",
          }}
        >
          *
        </span>
      </h6>
      <h6
        className="heading-title"
        style={{
          color: "black",
          fontWeight: isMobileWidth ? "400" : "500",
          marginLeft: isMobileWidth ? "9px" : "-4px",
        }}
      >
        Months
      </h6>
      <div
        className="months-selector-wrapper"
        // style={{
        //   display: "flex",
        //   justifyContent: "space-around",
        //   alignItems: "center",
        //   border: "2px solid #EBEDED",
        //   borderRadius: "60px",
        //   padding: "2px 5px",
        //   width: "100%",
        //   margin: "20px auto",
        //   backgroundColor: "#EBEDED",
        //   height: 55,
        //   marginBottom: "10px",
        // }}
      >
        {monthsRange.map((month) => {
          const isSelected = monthselect
            ? String(monthselect).split(",").includes(month.id)
            : false;
          return (
            <button
              key={month.id}
              onClick={() => handleSelectMonths(month.id)}
              className="month-btn "
              style={{
                backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                color: isSelected
                  ? "#000000"
                  : isMobileWidth
                    ? "black"
                    : "#3F3D56",
                border: isSelected
                  ? "2px solid #FFFFFF"
                  : "2px solid transparent",
                width: isMobileWidth ? "auto" : "7%",
                padding: isMobileWidth ? "0px 12px" : "0px",
                fontSize: isMobileWidth ? "10px" : "13px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "400",
                transition: "all 0.3s ease",
                height: 30,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {month.label}
            </button>
          );
        })}
      </div>

      <h6
        className="heading-title"
        style={{
          marginTop: isMobileWidth ? "0px" : "20px",
          color: "black",
          fontWeight: isMobileWidth ? "400" : "500",
          marginLeft: isMobileWidth ? "9px" : "-4px",
        }}
      >
        Days
      </h6>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          border: "2px solid #EBEDED",
          borderRadius: "60px",
          padding: "10px 4px",
          width: "100%",
          margin: "20px auto",
          backgroundColor: "#EBEDED",
          height: isMobileWidth ? 40 : 48,
          marginBottom: "5%",
        }}
      >
        {daysRange.map((label) => (
          <button
            key={label.id}
            onClick={() => handleSelectAvailblity(label.label)}
            style={{
              // padding: "10px 20px",
              padding: "2px 5px",
              fontSize: isMobileWidth ? "10px" : "14px",
              backgroundColor:
                selcteAvailiblity === label.label ? "#FFFFFF" : "transparent",
              color: selcteAvailiblity === label.label ? "#000000" : "#000",
              border:
                selcteAvailiblity === label.label
                  ? "2px solid #FFFFFF"
                  : "2px solid transparent",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "400",
              transition: "all 0.3s ease",
              width: "100%",
              height: isMobileWidth ? 36 : 40,
              textAlign: "center",
            }}
          >
            {/* {label.label} */}
            {label.label === "all"
              ? "All"
              : "Only " +
                label.label
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
          </button>
        ))}
      </div>

      <hr className="property-modal-hr" />
      {/* Availability - Hours */}
      <h6
        style={{
          fontSize: isMobileWidth ? "16px" : "25px",
          marginLeft: isMobileWidth ? "9px" : "-4px",
          marginTop: "30px",
          fontWeight: isMobileWidth && "400",
        }}
      >
        Availability - Hours{" "}
        <span
          style={{
            color: "black",
            fontSize: "14px",
            position: "relative",
            top: "-8px",
            marginLeft: "-3px",
          }}
        >
          *
        </span>
      </h6>
      <Row>
        <Col md={4} style={{ width: "48%", marginTop: "2%" }}>
          <span style={{ paddingBottom: "10px", paddingLeft: "10px" }}>
            From
          </span>
          <div>
            {/* <button onClick={() => setShowDropdownTime(!showDropdownTime)} style={{ width: "100%", color: "black", borderRadius: "20px", background: "white", border: "1px solid #dee2e6", textAlign: "left", fontSize: "1rem", padding: "10px", marginTop: 5, fontWeight: "400" }}>
              {fromTime == "00" ? "Select Start Time" : fromTime}
            </button> */}
            <button
              onClick={() => setShowDropdownTime(!showDropdownTime)}
              style={{
                width: "100%",
                color: "black",
                borderRadius: "20px",
                background: "white",
                border: "1px solid #dee2e6",
                textAlign: "left",
                fontSize: isMobileWidth ? "13px" : "14px",
                padding: "10px",
                marginTop: 5,
                fontWeight: "400",
                display: "flex", // added
                justifyContent: "space-between", // added
                alignItems: "center", // added
              }}
            >
              {fromTime === "00"
                ? isMobileWidth
                  ? "Start Time"
                  : "Select Start Time"
                : fromTime}
              <i
                className="fa-solid fa-chevron-down fa-sm"
                style={{
                  width: "18.016637802124023",
                  height: "11.019722938537598",
                }}
              ></i>
            </button>
          </div>

          {showDropdownTime && (
            <div
              style={{
                position: "absolute",
                background: "white",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginTop: "2px",
                zIndex: 10,
                width: "200px",
              }}
            >
              <div className="d-flex justify-content-between">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border p-1 rounded"
                  style={{ width: "33%", fontSize: "15px" }}
                >
                  {[...Array(12).keys()].map((h) => (
                    <option key={h + 1}>
                      {(h + 1).toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="border p-1 rounded"
                  style={{ width: "33%", fontSize: "15px" }}
                >
                  {renderMinuteOptions()}
                </select>
                <select
                  value={startMeridian}
                  onChange={(e) => setStartMeridian(e.target.value)}
                  className="border p-1 rounded"
                  style={{ width: "33%", fontSize: "15px" }}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              <button
                onClick={handleSave2}
                style={{
                  padding: "8px 15px",
                  background: "#2F3E46",
                  color: "white",
                  borderRadius: "5px",
                  border: "none",
                  width: "100%",
                  fontWeight: "bold",
                  marginTop: "10px",
                  fontSize: "15px",
                }}
              >
                Save Changes
              </button>
            </div>
          )}
        </Col>

        <Col md={4} style={{ width: "48%", marginTop: "2%" }}>
          <span style={{ paddingBottom: "10px", paddingLeft: "10px" }}>To</span>
          <div>
            {/* <button onClick={() => setShowDropdownTime2(!showDropdownTime2)} style={{ width: "100%", color: "black", borderRadius: "20px", background: "white", border: "1px solid #dee2e6", textAlign: "left", fontSize: "1rem", padding: "10px", marginTop: 5, fontWeight: "400" }}>
              {toTime == "00" ? "Select End Time" : toTime}
            </button> */}

            <button
              onClick={() => setShowDropdownTime2(!showDropdownTime2)}
              style={{
                width: "100%",
                color: "black",
                borderRadius: "20px",
                background: "white",
                border: "1px solid #dee2e6",
                textAlign: "left",
                fontSize: isMobileWidth ? "13px" : "14px",
                padding: "10px",
                marginTop: 5,
                fontWeight: "400",

                display: "flex", // added
                justifyContent: "space-between", // added
                alignItems: "center", // added
              }}
            >
              {toTime == "00"
                ? isMobileWidth
                  ? "End Time"
                  : "Select End Time"
                : toTime}
              <i
                className="fa-solid fa-chevron-down fa-sm"
                style={{
                  width: "18.016637802124023",
                  height: "11.019722938537598",
                }}
              ></i>
              {/* added icon */}
            </button>
          </div>

          {showDropdownTime2 && (
            <div
              style={{
                position: "absolute",
                background: "white",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginTop: "2px",
                zIndex: 10,
                width: "200px",
              }}
            >
              <div className="d-flex justify-content-between">
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border p-1 rounded"
                  style={{ width: "33%", fontSize: "15px" }}
                >
                  {[...Array(12).keys()].map((h) => {
                    const hour = (h + 1).toString().padStart(2, "0");
                    const isDisabled = getDisabledEndHours().has(
                      `${hour}-${endMeridian}`,
                    );
                    return (
                      <option key={hour} value={hour} disabled={isDisabled}>
                        {hour}
                      </option>
                    );
                  })}
                </select>
                <select
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="border p-1 rounded"
                  style={{ width: "33%", fontSize: "15px" }}
                >
                  {renderMinuteOptions()}
                </select>
                <select
                  value={endMeridian}
                  onChange={(e) => setEndMeridian(e.target.value)}
                  className="border p-1 rounded"
                  style={{ width: "33%", fontSize: "15px" }}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              <button
                onClick={handleSave3}
                style={{
                  padding: "8px 15px",
                  background: "#2F3E46",
                  color: "white",
                  borderRadius: "5px",
                  border: "none",
                  width: "100%",
                  fontWeight: "bold",
                  marginTop: "10px",
                  fontSize: "15px",
                }}
              >
                Save Changes
              </button>
            </div>
          )}
        </Col>
      </Row>

      <hr className="property-modal-hr" />

      {!isMobileWidth && (
        <>
          <Container className="mt-4 d-flex justify-content-between">
            {/* Clear All Button */}
            <Button
              className="go-back-btn save-continue-btn"
              variant="outline-success"
              onClick={() => switchToGallery("gallery_location")}
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
              Go back
            </Button>

            {/* Save and Continue Button */}
            <Button
              className="save-continue-btn"
              disabled={isPublishing}
              style={{
                backgroundColor: "#4AEAB1",
                borderColor: "#4AEAB1",
                fontWeight: "400",
                color: "black",
                borderRadius: "40px",
                padding: "13px 26px",
              }}
              onClick={handlePriceAvailbity}
            >
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Button>
          </Container>
        </>
      )}

      {/* <ToastContainer /> */}
    </div>
  );
};

export default PriceAvailblity;
