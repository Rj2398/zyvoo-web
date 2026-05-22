import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, InputGroup, Form, } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { SlidersHorizontal } from "lucide-react";
import { format, eachDayOfInterval, parse } from "date-fns";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { imageBase } from "../../config/Constant";
import AddPropertyModal from "../../components/host/addBusiness/AddPropertyModal";
import useBook from "../../hooks/host/useBook";
import "react-datepicker/dist/react-datepicker.css"; // Essential styles for react-datepicker
import { toast } from "react-toastify";

const generate24HourTimes = () => {
  const generatedTimes = []; // Generates an array of strings for all 24 hourly time
  for (let hour = 0; hour < 24; hour++) {
    const meridian = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12; // Corrected: 00:00 is 12 AM, 12:00 is 12 PM
    generatedTimes.push(
      `${displayHour.toString().padStart(2, "0")}:00 ${meridian}`
    );
  }
  return generatedTimes;
};

const formatDateToDay = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  return `${month} ${day}`;
};


const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";



const MyPlaceHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { routedData } = location.state || {};
    const [propertyDetails, setPropertyDetails] = useState(); // Stores full API response data
  const [bookings, setBookings] = useState([]);
  console.log(bookings,propertyDetails)
  const propertyData = routedData;
  console.log(propertyData)

  useEffect(() => {
    if (!propertyData) {
      toast.error("Please book a property first");
      navigate("/");
    }
  }, [propertyData]);

  const { propertyBookingDetails, toggleBookingStatus } = useBook();

  const [isMobileWidth, setIsMobileWidth] = useState(false);
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    }

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);


  const [addProperyShow, setAddPropertyShow] = useState(false);
 // Stores just the bookings array from API

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6); // Default to a 7-day range (today + 6 more days)
    return d;
  });
  const [days, setDays] = useState([]); // Formatted day strings for table headers

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const times = generate24HourTimes();

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return format(parsedDate, "yyyy-MM-dd");
  };

  // Helper to format date for API calls (YYYY-MM-DD)
  const formatDateForApi = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Handles date range selection from the DatePicker
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    // Ensure start date is always before or equal to end date for logical range
    if (start && end && end < start) {
      setStartDate(end);
      setEndDate(start);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  // Effect to update the 'days' array and fetch bookings whenever startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      const newDays = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM d") // Format as "Jun 10"
      );
      setDays(newDays);
      getPropertBookingList();
    }
  }, [startDate, endDate]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPropertBookingList = async () => {
    try {
      const response = await propertyBookingDetails({
        property_id: propertyData?.property_id,
        user_id: propertyData?.host_id,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        latitude: propertyData?.latitude,
        longitude: propertyData?.longitude,
      });
      if (response) {
        if (response) {
          setPropertyDetails(response.data);
          setBookings(response.data?.bookings);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ToogleBooking = async () => {
    try {
      const response = await toggleBookingStatus({
        property_id: propertyDetails?.property_id,
        user_id: propertyData?.host_id,
      });
      if (response.success) {
        toast.success(response.message);
        getPropertBookingList();
      } else {
        toast.error("status not changed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPropertBookingList();
  }, []);

  const formatDayLabel = (dayStr) => {
    try {
      const parsedDate = parse(dayStr, "MMM d", new Date());
      return format(parsedDate, "d - EEE");
    } catch (error) {
      console.error("Invalid date:", dayStr);
      return dayStr;
    }
  };

  function formatReview(value) {
    const num = Number(value);

    if (isNaN(num)) return ""; // handle invalid inputs
    return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
  }

  return (
    <>
      <main>
        <Container
          fluid
          className="my-place-mobile-container" // Add this class
          style={{
            padding: "20px",
            background: "#F8F9FA",
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
            backgroundSize: "20px 20px",
            // border: "5px solid red"
          }}
        >
          {isMobileWidth ? (
            <>
              {/* 1. Back Button and Calendar First */}
              <Row className="mb-3">
                <Col xs={12}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="mob-search-filter-in">
                      <div className="mob-search-bar-back" style={{padding:'10px !important'}}>
                        <Link to="/">
                          <i className="fa-regular fa-arrow-left" style={{ textAlign: 'center', fontSize: '20px' }}></i>
                        </Link>
                      </div>
                    </div>

                    <div
                      style={{ position: "relative", display: "inline-block" ,left:isMobileWidth && '-31px' }}
                      ref={calendarRef}
                    >
                      <InputGroup
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "30px",
                          padding: "8px 15px",
                          background: "#fff",
                          cursor: "pointer",
                          minWidth: "250px",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <img
                          src="/images/Host/date-range-host.svg"
                          loading="lazy" alt="Calendar icon"
                          width={20}
                          style={{ marginRight: "10px" }}
                        />
                        <Form.Control
                          type="text"
                          readOnly
                          value={`${format(startDate, "MMM d")} - ${format(
                            endDate,
                            "MMM d yyyy"
                          )} (EST)`}
                          style={{
                            fontSize:isMobileWidth ?"12px":'16px',
                            fontWeight: "500",
                            color: "#252849",
                            background: "none",
                            border: "none",
                            boxShadow: "none",
                            cursor: "pointer",
                          }}
                        />
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "14px",
                            color: "#252849",
                          }}
                        >
                          <img
                            src="/images/Host/date-down-icon.svg"
                            loading="lazy" alt="down arrow"
                            width={15}
                            style={{ marginRight: "10px" }} />
                        </span>
                      </InputGroup>

                      {showCalendar && (
                        <div
                          className="my-place-date-range"
                          style={{
                            position: "fixed", // Changed from absolute to fixed
                            top:isMobileWidth?"54%":"44%", // Center vertically
                            left:isMobileWidth?"1%":"50%", // Center horizontally
                            transform: "translate(3%, -58%)", // Center the calendar
                            zIndex: "1000",
                            background: "#fff",
                            padding: "15px",
                            borderRadius: "10px",
                            border: "3px solid #3A4B4C",
                            width: "90vw", // Use viewport width
                            maxWidth:isMobileWidth?"355px":"365px", // Maximum width
                            maxHeight: "80vh", // Maximum height
                            overflow: "auto", // Enable scrolling if needed
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
                          }}
                        >
                          <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                            calendarClassName="responsive-calendar" // Add custom class for additional styling
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* 2. Property Card (Col md={3}) in Horizontal Layout */}
              <Row className="mb-3">
                <Col xs={12}>
                  <Card
                    className="my-place-mobile-card"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      padding: "15px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div className="d-flex">
                      <div style={{ flex: "0 0 120px", marginRight: "15px" }}>
                        <Card.Img
                          variant="top"
                          src={imageBase + propertyDetails?.property_image}
                          loading="lazy" alt="Property Image"
                          style={{
                            height: "100px",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                      <div style={{ flex: "1" }}>
                        <Card.Title
                          style={{
                            // fontSize: "16px",
                            // fontWeight: "bold",
                            // marginBottom: "5px",
                          }}
                        >
                          {propertyData?.title}
                        </Card.Title>

                        <Card.Text
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "5px",
                          }}
                        >
                          <FaStar style={{ color: "#FFD700", marginRight: "5px" }} />
                          <span style={{ fontWeight: "500", color: "#333" }}>
                            {formatReview(propertyData?.property_rating)}
                          </span>
                          <span style={{ color: "#999", marginRight: "5px" }}>
                            {" "}
                            ({propertyData?.property_review_count})
                          </span>
                        </Card.Text>

                        {!isMobileWidth &&<Card.Text
                          style={{
                            fontSize: "14px",
                            color: "#999",
                            marginBottom: "5px",
                          }}
                        >
                          <i className="fa-solid fa-clock"></i> $
                          {parseFloat(propertyData?.hourly_rate)} / h
                        </Card.Text>}

                        <Card.Text
                          style={{
                            fontSize: "14px",
                            color: "#999",
                            marginBottom: "10px",
                          }}
                        >
                          <img
                            src="/images/locations-grid/location-icon.svg"
                            loading="lazy" alt="Location"
                            style={{ width: "14px", marginRight: "8px" }}
                          />
                          {propertyDetails?.distance_miles} miles away
                        </Card.Text>
                      

                      </div>

                    
                    </div>
                       <hr/>
                    <div className="d-flex" style={{ gap: "10px" }}>
                      <Button
                        onClick={() => ToogleBooking()}
                        variant="dark"
                        style={{
                          flex: "1",
                          borderRadius: "8px",
                          // fontWeight: "400",
                          backgroundColor: "#2E3A35",
                          border: "none",
                          padding: "6px 12px",
                          fontSize: "14px"
                        }}
                      >
                        {propertyDetails?.property_status == "active"
                          ? "Pause Bookings"
                          : "Resume Bookings "}
                      </Button>

                      <Button
                        variant="outline-dark"
                        onClick={() => setAddPropertyShow(true)}
                        style={{
                          flex: "1",
                          borderRadius: "8px",
                          fontWeight: "500",
                          border: "1px solid #333",
                          padding: "6px 12px",
                          fontSize: "14px"
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* 3. Booking History Table */}
              <Row>
                <Col xs={12}>
                  <div
                    style={{
                      width: "100%",
                      maxHeight: "60vh",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{ overflowX: "auto" }}>
                      <table
                        className="my-place-history-table"
                        style={{
                          width: "max-content",
                          minWidth: "100%",
                          borderCollapse: "separate",
                          borderSpacing: "6px",
                        }}
                      >
                        {/* Table content remains the same */}
                        <thead>
                          <tr>
                            <th style={{ width: 80, background: "transparent" }}></th>
                            {days.map((day, index) => (
                              <th
                                key={index}
                                style={{
                                  minWidth: 120,
                                  height: 50,
                                  backgroundColor:isMobileWidth?"rgb(214 230 225)":"rgb(239, 242, 245)",
                                  fontSize: 14,
                                  color:isMobileWidth?"black": "#333",
                                  textAlign: "center",
                                  fontWeight: "600",
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 5,
                                  borderRadius:isMobileWidth && '12px',
                              
                                }}
                              >

                                 { formatDayLabel(day) }
                                    
                                
                           

                                {/* <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 50,
                                    borderRadius: 12,
                                    backgroundColor:isMobileWidth?"rgb(214 230 225)": "#EFF2F5",
                                    
                                    padding: 8,
                                  }}
                                > 
                                  {formatDayLabel(day)}
                                 </div> */}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {times.map((timeSlotLabel, rowIndex) => (
                            <tr key={rowIndex}>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  background: "transparent",
                                  textAlign: "center",
                                  position: "sticky",
                                  left: 0,
                                  zIndex: 10,
                                  // border: "1px solid #ddd",
                                  width: 80,
                                  borderRadius: 12,
                                  // backgroundColor:'black'
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height:60,
                                    borderRadius: 12,
                                    backgroundColor: "rgb(214, 230, 225)",
                                    padding: "0 18px",
                                  }}
                                >
                                  {timeSlotLabel}
                                </div>
                              </td>
                              {days.map((day, colIndex) => {
                                const bookingsForDay = bookings.filter(
                                  (b) => formatDateToDay(b.booking_date) === day
                                );

                                let bookingToDisplay = null;
                                let showName = false;

                                let [slotHourStr, slotMinuteStr] = timeSlotLabel
                                  .split(" ")[0]
                                  .split(":");
                                  let slotHour = parseInt(slotHourStr);
                                  const slotMeridian = timeSlotLabel.split(" ")[1];

                                if (slotMeridian === "PM" && slotHour !== 12) {
                                  slotHour += 12;
                                } else if (slotMeridian === "AM" && slotHour === 12) {
                                  slotHour = 0; // 12 AM (midnight) corresponds to hour 0
                                }

                                const currentSlotStart = new Date(
                                  `2000-01-01T${slotHour
                                    .toString()
                                    .padStart(2, "0")}:${slotMinuteStr}:00`
                                );
                                const currentSlotEnd = new Date(currentSlotStart);
                                currentSlotEnd.setHours(currentSlotEnd.getHours() + 1);

                                for (const booking of bookingsForDay) {
                                  const [bookingStart24, bookingEnd24] =
                                    booking.booking_start_end.split(" - ");

                                  const bookingStartDate = new Date(
                                    `2000-01-01T${bookingStart24}:00`
                                  );
                                  const bookingEndDate = new Date(
                                    `2000-01-01T${bookingEnd24}:00`
                                  );

                                  if (
                                    bookingStartDate < currentSlotEnd &&
                                    bookingEndDate > currentSlotStart
                                  ) {
                                    bookingToDisplay = booking;
                                    showName = true; // Set to true if any booking overlaps
                                    break;
                                  }
                                }

                                if (bookingToDisplay) {
                                  return (
                                    <td
                                      key={colIndex}
                                      // style={{
                                      //   padding: 8,
                                      //   borderRadius: 12,
                                      //   border: "1px solid #ddd",
                                      //   fontSize: "12px", // Smaller font for multiple lines
                                      //   lineHeight: "1.3", // Adjust line height for readability
                                      // }}
                                         style={{
                                      padding: 0,
                                      borderRadius: 12,
                                      border: "none",
                                      fontSize: "12px", // Smaller font for multiple lines
                                      lineHeight: "1.3", // Adjust line height for readability
                                      borderLeftColor: bookingToDisplay.booking_status ===
                                        "finished" ? "#4AEAB1"
                                        : bookingToDisplay.booking_status === "confirmed" 
                                          ? "#85D6FF" : bookingToDisplay.booking_status ===
                                          "waiting_payment" ? "#F5A43D" : "#ccc",
                                          // borderTopColor:'black'
                                        
                                    }}
                                    >
                                      {showName && (
                                        <>
                                          <div
                                            className="booking-item-mobile"
                                            // style={{
                                            //   border: "1px solid #e0e0e0",
                                            //   borderRadius: "16px",
                                            //   padding: "12px",
                                            //   margin: "8px 0",
                                            //   display: "flex",
                                            //   flexDirection: "column",
                                            //   justifyContent: "flex-start",
                                            //   fontFamily: "sans-serif",
                                            //   position: "relative",
                                            //   boxShadow: "0 0 4px rgba(0,0,0,0.05)",
                                            // }}

                                                   style={{
                                           border: "1px solid #e0e0e0",
                                            borderRadius: "16px",
                                            padding: "12px",
                                            margin: "0",
                                            // margin: "8px 0",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                            fontFamily: "sans-serif",
                                            position: "relative",
                                            boxShadow: "0 0 4px rgba(0,0,0,0.05)",
                                            borderLeft: bookingToDisplay.booking_status === "finished"
                                             ? "2px solid #4AEAB1"
                                             : bookingToDisplay.booking_status === "confirmed"
                                             ? "2px solid #85D6FF"
                                             : bookingToDisplay.booking_status === "waiting_payment"
                                             ? "2px solid #F5A43D"
                                             : "2px solid #ccc",

                                            
                                          }}

                                          >
                                            <div
                                              style={{
                                                // position: "absolute",
                                                // top: 0,
                                                // bottom: 0,
                                                // left: 0,
                                                // width: "5px",
                                                // backgroundColor:
                                                //   bookingToDisplay.booking_status ===
                                                //     "finished"
                                                //     ? "#3EF2B1"
                                                //     : bookingToDisplay.booking_status ===
                                                //       "confirmed"
                                                //       ? "#85D6FF"
                                                //       : bookingToDisplay.booking_status ===
                                                //         "waiting-payment"
                                                //         ? "#F5A43D"
                                                //         : "#ccc",
                                                // borderTopLeftRadius: "20px",
                                                // borderBottomLeftRadius: "20px",

                                              }}
                                            />

                                            <div
                                              className="guest-name"
                                              style={{
                                                fontWeight: "600",
                                                fontSize: "15px",
                                              }}
                                            >
                                              {bookingToDisplay.guest_name}
                                            </div>

                                            {/* <div
                                              style={{
                                                // color:
                                                //   bookingToDisplay.booking_status ===
                                                //     "finished"
                                                //     ? "#3EF2B1"
                                                //     : bookingToDisplay.booking_status ===
                                                //       "confirmed"
                                                //       ? "#2196F3"
                                                //       : bookingToDisplay.booking_status ===
                                                //         "waiting-payment"
                                                //         ? "#F5A43D"
                                                //         : "#ccc",

                                                  color: bookingToDisplay.booking_status === "finished"
                                             ? "2px solid #4AEAB1"
                                             : bookingToDisplay.booking_status === "confirmed"
                                             ? "2px solid #85D6FF"
                                             : bookingToDisplay.booking_status === "awaiting_payment"
                                             ? "2px solid #F5A43D"
                                             : "2px solid #ccc",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                              }}
                                            >
                                              {bookingToDisplay.booking_status}
                                            </div> */}

                                            <div
                                            style={{
                                              color:
                                                bookingToDisplay.booking_status ===
                                                  "finished"
                                                  ? "#4AEAB1"
                                                  : bookingToDisplay.booking_status ===
                                                    "confirmed"
                                                    ? "#85D6FF"
                                                    : bookingToDisplay.booking_status ===
                                                      "waiting_payment"
                                                      ? "#F5A43D"
                                                      : "#ccc",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            { bookingToDisplay?.booking_status=="waiting_payment"?"Waiting payment":
                                               bookingToDisplay?.booking_status?.charAt(0)?.toUpperCase() + bookingToDisplay?.booking_status?.slice(1)}
                                          </div>

                                            <div
                                              style={{
                                                fontSize: "13px",
                                                color: "#000",
                                                marginTop: "4px",
                                              }}
                                            >
                                              {bookingToDisplay.booking_start_end}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </td>
                                  );
                                }

                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      border: "1px solid #DDD",
                                      height: 60,
                                      padding: 8,
                                      textAlign: "center",
                                    }}
                                  />
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>
            </>

          ) : (
            <Row className="my-place-mobile-reorder"> {/* Add this class */}
              <Col
                md={9}
                style={{
                  background: "transparent",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    style={{ position: "relative", display: "inline-block",marginLeft:'22px' }}
                    ref={calendarRef}
                  >
                    <InputGroup
                      onClick={() => setShowCalendar(!showCalendar)}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "30px",
                        padding: "8px 15px",
                        background: "#fff",
                        cursor: "pointer",
                        minWidth: "350px",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <img
                        src="/images/Host/date-range-host.svg" // Ensure this path is correct
                        loading="lazy" alt="Calendar icon"
                        width={20}
                        style={{ marginRight: "10px" }}
                      />
                      <Form.Control
                        type="text"
                        readOnly
                        value={`${format(startDate, "MMM d")} - ${format(
                          endDate,
                          "MMM d yyyy"
                        )} (EST)`}
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#252849",
                          background: "none",
                          border: "none",
                          boxShadow: "none",
                          cursor: "pointer",
                          marginLeft:'-11px'
                        }}
                      />
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "14px",
                          color: "#252849",
                        }}
                      >
                        {/* ▼ */}
                        <img
                          src="/images/Host/date-down-icon.svg" // Ensure this path is correct
                          loading="lazy" alt="down arrow"
                          width={15}
                          style={{ marginRight: "10px" }} />
                      </span>
                    </InputGroup>

                    {showCalendar && (
                      <div className="my-place-date-range"
                        style={{
                          position: "absolute",
                          top: "110%",
                          left: "0",
                          zIndex: "1000",
                          background: "#fff",
                          padding: "0",
                          borderRadius: "10px",
                          border: "3px solid #3A4B4C",
                        }}
                      >
                        <DatePicker
                          selected={startDate}
                          onChange={handleDateChange}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          inline // Display calendar directly within the popover
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className="my-place-filter" // Add this class
                    style={{
                      display: "none",
                      justifyContent: "space-around",
                      alignItems: "center",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "30px",
                      cursor: "pointer",
                    }}
                  >
                    <SlidersHorizontal
                      size={20}
                      color="black"
                      fontWeight={"500"}
                    />
                    <Button
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Booking History Table */}
                <div
                  style={{
                    width: "100%",
                    maxHeight: "80vh", // Limits table height, enabling vertical scroll
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ overflowX: "auto" }}>
                    <table
                      className="my-place-history-table"
                      style={{
                        width: "max-content", // Allows table to expand if content is wider
                        minWidth: "100%", // Ensures table takes at least 100% width
                        borderCollapse: "separate", // Removes double borders between cells
                        borderSpacing: "6px", // Adds space between borders for better readability
                        padding:'0px 0px'
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: 80, background: "transparent" }} ></th>{" "}
                          {days.map((day, index) => (
                            <th key={index}
                              style={{
                                minWidth: 120,
                                height: 50,
                                backgroundColor: "#EFF2F5",
                                // fontSize: 14,
                                color: "#333",
                                textAlign: "center",
                                // fontWeight: "600",
                                position: "sticky", // Sticky header for horizontal scroll
                                top: 0,
                                padding: 20,
                                fontSize:"15px",
                                fontWeight:'400',
                                color:'black',
                                zIndex: 5,
                                borderRadius:'12px'
                               
                              }}
                            >

                               {formatDayLabel(day)}
                              {/* <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 50,
                                  borderRadius: 12,
                                  backgroundColor: "#EFF2F5",
                                  padding: 8,
                                  fontSize:"15px",
                                  fontWeight:'400',
                                  color:'black'
                                }}
                              >
                               
                              </div> */}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {times.map((timeSlotLabel, rowIndex) => (
                          <tr key={rowIndex}>
                            <td
                              style={{
                                fontWeight: "bold",
                                background: "transparent",
                                textAlign: "center",
                                position: "sticky", // Sticky time column for vertical scroll
                                left: 0,
                                zIndex: 10,
                                border: "1px solid #ddd",
                                width: 80,
                                borderRadius: 12,
                                
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 80,
                                  borderRadius: "20px",
                                  backgroundColor: "#EFF2F5",
                                  padding: "0 18px",
                                  fontWeight:'400',
                                  color:'black',
                                  fontSize:'15px'

                                }}
                              >
                                {timeSlotLabel}
                              </div>
                            </td>
                            {days.map((day, colIndex) => {
                              const bookingsForDay = bookings.filter(
                                (b) => formatDateToDay(b.booking_date) === day
                              );

                              let bookingToDisplay = null;
                              let showName = false;

                              let [slotHourStr, slotMinuteStr] = timeSlotLabel
                                .split(" ")[0]
                                .split(":");
                              let slotHour = parseInt(slotHourStr);
                              const slotMeridian = timeSlotLabel.split(" ")[1];

                              if (slotMeridian === "PM" && slotHour !== 12) {
                                slotHour += 12;
                              } else if (
                                slotMeridian === "AM" &&
                                slotHour === 12
                              ) {
                                slotHour = 0; // 12 AM (midnight) corresponds to hour 0
                              }

                              const currentSlotStart = new Date(
                                `2000-01-01T${slotHour
                                  .toString()
                                  .padStart(2, "0")}:${slotMinuteStr}:00`
                              );
                              const currentSlotEnd = new Date(currentSlotStart);
                              currentSlotEnd.setHours(
                                currentSlotEnd.getHours() + 1
                              );

                              for (const booking of bookingsForDay) {
                                const [bookingStart24, bookingEnd24] =
                                  booking.booking_start_end.split(" - ");

                                const bookingStartDate = new Date(
                                  `2000-01-01T${bookingStart24}:00`
                                );
                                const bookingEndDate = new Date(
                                  `2000-01-01T${bookingEnd24}:00`
                                );

                                if (
                                  bookingStartDate < currentSlotEnd &&
                                  bookingEndDate > currentSlotStart
                                ) {
                                  bookingToDisplay = booking;
                                  showName = true; // Set to true if any booking overlaps
                                  break;
                                }
                              }

                              if (bookingToDisplay) {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      padding: 0,
                                      borderRadius: 12,
                                      border: "none",
                                      fontSize: "12px", // Smaller font for multiple lines
                                      lineHeight: "1.3", // Adjust line height for readability
                                      borderLeftColor: bookingToDisplay.booking_status ===
                                        "finished" ? "#4AEAB1"
                                        : bookingToDisplay.booking_status === "confirmed" 
                                          ? "#85D6FF" : bookingToDisplay.booking_status ===
                                          "waiting_payment" ? "#F5A43D" : "#ccc",
                                          // borderTopColor:'black'
                                        
                                    }}
                                    // style={{
                                    //   padding: 8,
                                    //   borderRadius: 12,
                                    //   border: "1px solid #ddd",
                                    //   fontSize: "12px", // Smaller font for multiple lines
                                    //   lineHeight: "1.3", // Adjust line height for readability
                                    //   borderLeftColor: bookingToDisplay.booking_status ===
                                    //     "finished" ? "#4AEAB1"
                                    //     : bookingToDisplay.booking_status === "confirmed" 
                                    //       ? "#85D6FF" : bookingToDisplay.booking_status ===
                                    //       "waiting_payment" ? "#F5A43D" : "#ccc",
                                    // }}
                                    
                                  >
                                    {showName && (
                                      <>
                                        <div
                                          className="booking-item-mobile" // Add this class
                                          style={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "16px",
                                            padding: "12px",
                                            margin: "0",
                                            // margin: "8px 0",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                            fontFamily: "sans-serif",
                                            position: "relative",
                                            boxShadow: "0 0 4px rgba(0,0,0,0.05)",
                                            borderLeft: bookingToDisplay.booking_status === "finished"
                                             ? "2px solid #4AEAB1"
                                             : bookingToDisplay.booking_status === "confirmed"
                                             ? "2px solid #85D6FF"
                                             : bookingToDisplay.booking_status === "waiting_payment"
                                             ? "2px solid #F5A43D"
                                             : "2px solid #ccc",
                                          }}
                                          
                                        >
                                          {/* <div
                                            style={{
                                              position: "absolute",
                                              top: 0,
                                              bottom: 0,
                                              left: 0,
                                              width: "5px",
                                              backgroundColor:
                                                bookingToDisplay.booking_status ===
                                                  "finished"
                                                  ? "#4AEAB1"
                                                  : bookingToDisplay.booking_status ===
                                                    "confirmed"
                                                    ? "#85D6FF"
                                                    : bookingToDisplay.booking_status ===
                                                      "waiting_payment"
                                                      ? "#F5A43D"
                                                      : "#ccc",
                                              borderTopLeftRadius: "16px",
                                              borderBottomLeftRadius: "16px",
                                            }}
                                          /> */}

                                          <div
                                            className="guest-name" // Add this class
                                            style={{
                                              fontWeight: "600",
                                              fontSize: "15px",
                                              // border:'1px solid black'
                                            }}
                                          >
                                            {bookingToDisplay.guest_name}
                                          </div>

                                          <div
                                            style={{
                                              color:
                                                bookingToDisplay.booking_status ===
                                                  "finished"
                                                  ? "#4AEAB1"
                                                  : bookingToDisplay.booking_status ===
                                                    "confirmed"
                                                    ? "#85D6FF"
                                                    : bookingToDisplay.booking_status ===
                                                      "waiting_payment"
                                                      ? "#F5A43D"
                                                      : "#ccc",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            { bookingToDisplay?.booking_status=="waiting_payment"?"Waiting payment":
                                               bookingToDisplay?.booking_status?.charAt(0)?.toUpperCase() + bookingToDisplay?.booking_status?.slice(1)}
                                          </div>

                                          <div
                                            style={{
                                              fontSize: "13px",
                                              color: "#000",
                                              marginTop: "4px",
                                            }}
                                          >
                                            {bookingToDisplay.booking_start_end}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </td>
                                );
                              }

                              return (
                                // <td key={colIndex}
                                //   style={{
                                //     border: "1px solid #eee",
                                //     height: 80,
                                //     padding: 8,
                                //     textAlign: "center",
                                //   }}
                                // />
                                <td 
                                    style={{
                                      padding: 0,
                                      borderRadius: 12,
                                      border: "1px solid #eee",
                                      fontSize: "12px", // Smaller font for multiple lines
                                      lineHeight: "1.3", // Adjust line height for readability
                                    }}
                                  ></td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>

              <Col md={3}>
                <Card
                  className="my-place-mobile-card" // Add this class
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    padding: "25px",
                    backgroundColor: "#fff",
                    height: "100%", // Limits height for scrolling
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >


                  <Card.Img
                    variant="top"
                    src={imageBase + propertyDetails?.property_image}
                    loading="lazy" alt="Property Image"
                    style={{
                      height: "350px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />


                  <Card.Body style={{ padding: "0px" }}>
                    <Card.Title
                      style={{
                        fontSize: "18px",
                        fontWeight: "400",
                        marginBottom: "5px",
                        marginTop: "10px",
                        color:'black'
                      }}
                    >
                      {propertyData?.title}
                    </Card.Title>

                    <Card.Text
                      style={{
                        fontSize: "16px",
                        color: "#666",
                        marginBottom: "5px",
                        alignItems:'baseline'
                      }}
                    >
                      <FaStar style={{ color: "#FCA800", marginRight: "5px",marginBottom:'5px' }} />
                      <span style={{ fontWeight: "400", color: "#FCA800",fontSize:'14px' }}>
                        {formatReview(propertyData?.property_rating)}
                      </span>
                      <span style={{ color: "#A4A4A4", marginRight: "5px",fontSize:'14px' }}>
                        {" "}
                        ({propertyData?.property_review_count})
                      </span>

                      <span
                        style={{
                          fontWeight: "400",
                          marginLeft: "10px",
                          fontSize:'14px'
                        }}
                      >
                        <i className="fa-solid fa-clock" style={{ color: "#3A4B4C",}}></i> <span style={{ whiteSpace: 'nowrap', padding: 0, margin: 0,color:'black' }}>
                         {'$'+ parseFloat(propertyData?.hourly_rate)+'/h'}
                      </span>
                      </span>
                    </Card.Text>

                    <Card.Text
                      style={{
                        fontSize: "14px",
                        color: "#999",
                        marginBottom: "5px",

                      }}
                    >
                      <img
                        src="/images/locations-grid/location-icon.svg"
                        loading="lazy" alt="Location"
                        style={{ width: "14px", marginRight: "5px",marginBottom:'4px' }}
                      />
                      {propertyData?.distance_miles} miles away
                    </Card.Text>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#ccc",
                          position: "relative",
                          margin: "15px",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        onClick={() => ToogleBooking()}
                        variant="dark"
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          fontWeight: "400",
                          backgroundColor: "#2E3A35",
                          border: "none",
                          padding: '10px'
                        }}
                      >
                        {propertyDetails?.property_status == "active"
                          ? "Pause Bookings"
                          : "Resume Bookings"}
                      </Button>

                      <Button
                        variant="outline-dark"
                        onClick={() => setAddPropertyShow(true)}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          fontWeight: "400",
                          border: "1px solid #333",
                        }}
                      >
                        Edit Place
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

        </Container>
      </main>

      <AddPropertyModal
        show={addProperyShow}
        onHide={() => {
          setAddPropertyShow(false);
          getPropertBookingList();
        }}
        property_id={propertyData?.property_id} // Pass property ID if needed for editing
      />

    </>
  );
};

export default MyPlaceHistory;


// import { useEffect, useRef, useState } from "react";
// import { Container, Row, Col, Card, Button, InputGroup, Form, } from "react-bootstrap";
// import { FaStar } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import { SlidersHorizontal } from "lucide-react";
// import { format, eachDayOfInterval, parse } from "date-fns";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { imageBase } from "../../config/Constant";
// import AddPropertyModal from "../../components/host/addBusiness/AddPropertyModal";
// import useBook from "../../hooks/host/useBook";
// import "react-datepicker/dist/react-datepicker.css"; // Essential styles for react-datepicker
// import { toast } from "react-toastify";

// const generate24HourTimes = () => {
//   const generatedTimes = []; // Generates an array of strings for all 24 hourly time
//   for (let hour = 0; hour < 24; hour++) {
//     const meridian = hour >= 12 ? "PM" : "AM";
//     let displayHour = hour % 12;
//     if (displayHour === 0) displayHour = 12; // Corrected: 00:00 is 12 AM, 12:00 is 12 PM
//     generatedTimes.push(
//       `${displayHour.toString().padStart(2, "0")}:00 ${meridian}`
//     );
//   }
//   return generatedTimes;
// };

// const formatDateToDay = (dateStr) => {
//   const date = new Date(dateStr);
//   const day = date.getDate();
//   const month = date.toLocaleString("default", { month: "short" });
//   return `${month} ${day}`;
// };


// const capitalizeFirst = (str) =>
//   str ? str.charAt(0).toUpperCase() + str.slice(1) : "";



// const MyPlaceHistory = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { routedData } = location.state || {};
//     const [propertyDetails, setPropertyDetails] = useState(); // Stores full API response data
//   const [bookings, setBookings] = useState([]);
//   console.log(bookings,propertyDetails)
//   const propertyData = routedData;
//   console.log(propertyData)

//   useEffect(() => {
//     if (!propertyData) {
//       toast.error("Please book a property first");
//       navigate("/");
//     }
//   }, [propertyData]);

//   const { propertyBookingDetails, toggleBookingStatus } = useBook();

//   const [isMobileWidth, setIsMobileWidth] = useState(false);
//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     }

//     checkWindowWidth();
//     window.addEventListener('resize', checkWindowWidth);

//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, []);


//   const [addProperyShow, setAddPropertyShow] = useState(false);
//  // Stores just the bookings array from API

//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(() => {
//     const d = new Date();
//     d.setDate(d.getDate() + 6); // Default to a 7-day range (today + 6 more days)
//     return d;
//   });
//   const [days, setDays] = useState([]); // Formatted day strings for table headers

//   const [showCalendar, setShowCalendar] = useState(false);
//   const calendarRef = useRef(null);

//   const times = generate24HourTimes();

//   const formatDate = (date) => {
//     const parsedDate = new Date(date);
//     return format(parsedDate, "yyyy-MM-dd");
//   };

//   // Helper to format date for API calls (YYYY-MM-DD)
//   const formatDateForApi = (date) => {
//     return format(date, "yyyy-MM-dd");
//   };

//   // Handles date range selection from the DatePicker
//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     // Ensure start date is always before or equal to end date for logical range
//     if (start && end && end < start) {
//       setStartDate(end);
//       setEndDate(start);
//     } else {
//       setStartDate(start);
//       setEndDate(end);
//     }
//   };

//   // Effect to update the 'days' array and fetch bookings whenever startDate or endDate changes
//   useEffect(() => {
//     if (startDate && endDate) {
//       const newDays = eachDayOfInterval({ start: startDate, end: endDate }).map(
//         (date) => format(date, "MMM d") // Format as "Jun 10"
//       );
//       setDays(newDays);
//       getPropertBookingList();
//     }
//   }, [startDate, endDate]);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (calendarRef.current && !calendarRef.current.contains(event.target)) {
//         setShowCalendar(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getPropertBookingList = async () => {
//     try {
//       const response = await propertyBookingDetails({
//         property_id: propertyData?.property_id,
//         user_id: propertyData?.host_id,
//         start_date: formatDate(startDate),
//         end_date: formatDate(endDate),
//         latitude: propertyData?.latitude,
//         longitude: propertyData?.longitude,
//       });
//       if (response) {
//         if (response) {
//           setPropertyDetails(response.data);
//           setBookings(response.data?.bookings);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const ToogleBooking = async () => {
//     try {
//       const response = await toggleBookingStatus({
//         property_id: propertyDetails?.property_id,
//         user_id: propertyData?.host_id,
//       });
//       if (response.success) {
//         toast.success(response.message);
//         getPropertBookingList();
//       } else {
//         toast.error("status not changed");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getPropertBookingList();
//   }, []);

//   const formatDayLabel = (dayStr) => {
//     try {
//       const parsedDate = parse(dayStr, "MMM d", new Date());
//       return format(parsedDate, "d - EEE");
//     } catch (error) {
//       console.error("Invalid date:", dayStr);
//       return dayStr;
//     }
//   };

//   function formatReview(value) {
//     const num = Number(value);

//     if (isNaN(num)) return ""; // handle invalid inputs
//     return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
//   }

//   return (
//     <>
//       <main>
//         <Container
//           fluid
//           className="my-place-mobile-container" // Add this class
//           style={{
//             padding: "20px",
//             background: "#F8F9FA",
//             backgroundColor: "white",
//             backgroundImage:
//               "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
//             backgroundSize: "20px 20px",
//             // border: "5px solid red"
//           }}
//         >
//           {isMobileWidth ? (
//             <>
//               {/* 1. Back Button and Calendar First */}
//               <Row className="mb-3">
//                 <Col xs={12}>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="mob-search-filter-in">
//                       <div className="mob-search-bar-back">
//                         <Link to="/">
//                           <i className="fa-regular fa-arrow-left" style={{ textAlign: 'center', fontSize: '20px' }}></i>
//                         </Link>
//                       </div>
//                     </div>

//                     <div
//                       style={{ position: "relative", display: "inline-block" }}
//                       ref={calendarRef}
//                     >
//                       <InputGroup
//                         onClick={() => setShowCalendar(!showCalendar)}
//                         style={{
//                           border: "1px solid #ccc",
//                           borderRadius: "30px",
//                           padding: "8px 15px",
//                           background: "#fff",
//                           cursor: "pointer",
//                           minWidth: "250px",
//                           alignItems: "center",
//                           display: "flex",
//                         }}
//                       >
//                         <img
//                           src="/images/Host/date-range-host.svg"
//                           loading="lazy" alt="Calendar icon"
//                           width={20}
//                           style={{ marginRight: "10px" }}
//                         />
//                         <Form.Control
//                           type="text"
//                           readOnly
//                           value={`${format(startDate, "MMM d")} - ${format(
//                             endDate,
//                             "MMM d yyyy"
//                           )} (EST)`}
//                           style={{
//                             fontSize: "16px",
//                             fontWeight: "500",
//                             color: "#252849",
//                             background: "none",
//                             border: "none",
//                             boxShadow: "none",
//                             cursor: "pointer",
//                           }}
//                         />
//                         <span
//                           style={{
//                             marginLeft: "auto",
//                             fontSize: "14px",
//                             color: "#252849",
//                           }}
//                         >
//                           <img
//                             src="/images/Host/date-down-icon.svg"
//                             loading="lazy" alt="down arrow"
//                             width={15}
//                             style={{ marginRight: "10px" }} />
//                         </span>
//                       </InputGroup>

//                       {showCalendar && (
//                         <div
//                           className="my-place-date-range"
//                           style={{
//                             position: "fixed", // Changed from absolute to fixed
//                             top: "44%", // Center vertically
//                             left: "50%", // Center horizontally
//                             transform: "translate(3%, -58%)", // Center the calendar
//                             zIndex: "1000",
//                             background: "#fff",
//                             padding: "15px",
//                             borderRadius: "10px",
//                             border: "3px solid #3A4B4C",
//                             width: "90vw", // Use viewport width
//                             maxWidth: "365px", // Maximum width
//                             maxHeight: "80vh", // Maximum height
//                             overflow: "auto", // Enable scrolling if needed
//                             boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
//                           }}
//                         >
//                           <DatePicker
//                             selected={startDate}
//                             onChange={handleDateChange}
//                             startDate={startDate}
//                             endDate={endDate}
//                             selectsRange
//                             inline
//                             calendarClassName="responsive-calendar" // Add custom class for additional styling
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </Col>
//               </Row>

//               {/* 2. Property Card (Col md={3}) in Horizontal Layout */}
//               <Row className="mb-3">
//                 <Col xs={12}>
//                   <Card
//                     className="my-place-mobile-card"
//                     style={{
//                       borderRadius: "12px",
//                       overflow: "hidden",
//                       boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//                       padding: "15px",
//                       backgroundColor: "#fff",
//                     }}
//                   >
//                     <div className="d-flex">
//                       <div style={{ flex: "0 0 120px", marginRight: "15px" }}>
//                         <Card.Img
//                           variant="top"
//                           src={imageBase + propertyDetails?.property_image}
//                           loading="lazy" alt="Property Image"
//                           style={{
//                             height: "100px",
//                             width: "100%",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                           }}
//                         />
//                       </div>
//                       <div style={{ flex: "1" }}>
//                         <Card.Title
//                           style={{
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             marginBottom: "5px",
//                           }}
//                         >
//                           {propertyData?.title}
//                         </Card.Title>

//                         <Card.Text
//                           style={{
//                             fontSize: "14px",
//                             color: "#666",
//                             marginBottom: "5px",
//                           }}
//                         >
//                           <FaStar style={{ color: "#FFD700", marginRight: "5px" }} />
//                           <span style={{ fontWeight: "500", color: "#333" }}>
//                             {formatReview(propertyData?.property_rating)}
//                           </span>
//                           <span style={{ color: "#999", marginRight: "5px" }}>
//                             {" "}
//                             ({propertyData?.property_review_count})
//                           </span>
//                         </Card.Text>

//                         <Card.Text
//                           style={{
//                             fontSize: "14px",
//                             color: "#999",
//                             marginBottom: "5px",
//                           }}
//                         >
//                           <i className="fa-solid fa-clock"></i> $
//                           {parseFloat(propertyData?.hourly_rate)} / h
//                         </Card.Text>

//                         <Card.Text
//                           style={{
//                             fontSize: "14px",
//                             color: "#999",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <img
//                             src="/images/locations-grid/location-icon.svg"
//                             loading="lazy" alt="Location"
//                             style={{ width: "14px", marginRight: "8px" }}
//                           />
//                           {propertyDetails?.distance_miles} miles away
//                         </Card.Text>


//                       </div>
//                     </div>
//                     <div className="d-flex" style={{ gap: "10px" }}>
//                       <Button
//                         onClick={() => ToogleBooking()}
//                         variant="dark"
//                         style={{
//                           flex: "1",
//                           borderRadius: "8px",
//                           fontWeight: "500",
//                           backgroundColor: "#2E3A35",
//                           border: "none",
//                           padding: "6px 12px",
//                           fontSize: "14px"
//                         }}
//                       >
//                         {propertyDetails?.property_status == "active"
//                           ? "Pause"
//                           : "Activate"}
//                       </Button>

//                       <Button
//                         variant="outline-dark"
//                         onClick={() => setAddPropertyShow(true)}
//                         style={{
//                           flex: "1",
//                           borderRadius: "8px",
//                           fontWeight: "500",
//                           border: "1px solid #333",
//                           padding: "6px 12px",
//                           fontSize: "14px"
//                         }}
//                       >
//                         Edit
//                       </Button>
//                     </div>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* 3. Booking History Table */}
//               <Row>
//                 <Col xs={12}>
//                   <div
//                     style={{
//                       width: "100%",
//                       maxHeight: "60vh",
//                       display: "flex",
//                       flexDirection: "column",
//                       borderRadius: "12px",
//                     }}
//                   >
//                     <div style={{ overflowX: "auto" }}>
//                       <table
//                         className="my-place-history-table"
//                         style={{
//                           width: "max-content",
//                           minWidth: "100%",
//                           borderCollapse: "separate",
//                           borderSpacing: "6px",
//                         }}
//                       >
//                         {/* Table content remains the same */}
//                         <thead>
//                           <tr>
//                             <th style={{ width: 80, background: "transparent" }}></th>
//                             {days.map((day, index) => (
//                               <th
//                                 key={index}
//                                 style={{
//                                   minWidth: 120,
//                                   height: 50,
//                                   backgroundColor: "white",
//                                   fontSize: 14,
//                                   color: "#333",
//                                   textAlign: "center",
//                                   fontWeight: "600",
//                                   position: "sticky",
//                                   top: 0,
//                                   zIndex: 5,
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     height: 50,
//                                     borderRadius: 12,
//                                     backgroundColor: "#EFF2F5",
//                                     padding: 8,
//                                   }}
//                                 >
//                                   {formatDayLabel(day)}
//                                 </div>
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {times.map((timeSlotLabel, rowIndex) => (
//                             <tr key={rowIndex}>
//                               <td
//                                 style={{
//                                   fontWeight: "bold",
//                                   background: "transparent",
//                                   textAlign: "center",
//                                   position: "sticky",
//                                   left: 0,
//                                   zIndex: 10,
//                                   border: "1px solid #ddd",
//                                   width: 80,
//                                   borderRadius: 12,
//                                   backgroundColor:'black'
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     height: 80,
//                                     borderRadius: 12,
//                                     backgroundColor: "#EFF2F5",
//                                     padding: "0 18px",
//                                   }}
//                                 >
//                                   {timeSlotLabel}
//                                 </div>
//                               </td>
//                               {days.map((day, colIndex) => {
//                                 const bookingsForDay = bookings.filter(
//                                   (b) => formatDateToDay(b.booking_date) === day
//                                 );

//                                 let bookingToDisplay = null;
//                                 let showName = false;

//                                 let [slotHourStr, slotMinuteStr] = timeSlotLabel
//                                   .split(" ")[0]
//                                   .split(":");
//                                   let slotHour = parseInt(slotHourStr);
//                                   const slotMeridian = timeSlotLabel.split(" ")[1];

//                                 if (slotMeridian === "PM" && slotHour !== 12) {
//                                   slotHour += 12;
//                                 } else if (slotMeridian === "AM" && slotHour === 12) {
//                                   slotHour = 0; // 12 AM (midnight) corresponds to hour 0
//                                 }

//                                 const currentSlotStart = new Date(
//                                   `2000-01-01T${slotHour
//                                     .toString()
//                                     .padStart(2, "0")}:${slotMinuteStr}:00`
//                                 );
//                                 const currentSlotEnd = new Date(currentSlotStart);
//                                 currentSlotEnd.setHours(currentSlotEnd.getHours() + 1);

//                                 for (const booking of bookingsForDay) {
//                                   const [bookingStart24, bookingEnd24] =
//                                     booking.booking_start_end.split(" - ");

//                                   const bookingStartDate = new Date(
//                                     `2000-01-01T${bookingStart24}:00`
//                                   );
//                                   const bookingEndDate = new Date(
//                                     `2000-01-01T${bookingEnd24}:00`
//                                   );

//                                   if (
//                                     bookingStartDate < currentSlotEnd &&
//                                     bookingEndDate > currentSlotStart
//                                   ) {
//                                     bookingToDisplay = booking;
//                                     showName = true; // Set to true if any booking overlaps
//                                     break;
//                                   }
//                                 }

//                                 if (bookingToDisplay) {
//                                   return (
//                                     <td
//                                       key={colIndex}
//                                       style={{
//                                         padding: 8,
//                                         borderRadius: 12,
//                                         border: "1px solid #ddd",
//                                         fontSize: "12px", // Smaller font for multiple lines
//                                         lineHeight: "1.3", // Adjust line height for readability
//                                       }}
//                                     >
//                                       {showName && (
//                                         <>
//                                           <div
//                                             className="booking-item-mobile"
//                                             style={{
//                                               border: "1px solid #e0e0e0",
//                                               borderRadius: "16px",
//                                               padding: "12px",
//                                               margin: "8px 0",
//                                               display: "flex",
//                                               flexDirection: "column",
//                                               justifyContent: "flex-start",
//                                               fontFamily: "sans-serif",
//                                               position: "relative",
//                                               boxShadow: "0 0 4px rgba(0,0,0,0.05)",
//                                             }}
//                                           >
//                                             <div
//                                               style={{
//                                                 position: "absolute",
//                                                 top: 0,
//                                                 bottom: 0,
//                                                 left: 0,
//                                                 width: "5px",
//                                                 backgroundColor:
//                                                   bookingToDisplay.booking_status ===
//                                                     "finished"
//                                                     ? "#3EF2B1"
//                                                     : bookingToDisplay.booking_status ===
//                                                       "confirmed"
//                                                       ? "#85D6FF"
//                                                       : bookingToDisplay.booking_status ===
//                                                         "waiting-payment"
//                                                         ? "#F5A43D"
//                                                         : "#ccc",
//                                                 // borderTopLeftRadius: "20px",
//                                                 // borderBottomLeftRadius: "20px",

//                                               }}
//                                             />

//                                             <div
//                                               className="guest-name"
//                                               style={{
//                                                 fontWeight: "600",
//                                                 fontSize: "15px",
//                                               }}
//                                             >
//                                               {bookingToDisplay.guest_name}
//                                             </div>

//                                             <div
//                                               style={{
//                                                 color:
//                                                   bookingToDisplay.booking_status ===
//                                                     "finished"
//                                                     ? "#3EF2B1"
//                                                     : bookingToDisplay.booking_status ===
//                                                       "confirmed"
//                                                       ? "#2196F3"
//                                                       : bookingToDisplay.booking_status ===
//                                                         "waiting-payment"
//                                                         ? "#F5A43D"
//                                                         : "#ccc",
//                                                 fontSize: "14px",
//                                                 fontWeight: "500",
//                                               }}
//                                             >
//                                               {bookingToDisplay.booking_status}
//                                             </div>

//                                             <div
//                                               style={{
//                                                 fontSize: "13px",
//                                                 color: "#000",
//                                                 marginTop: "4px",
//                                               }}
//                                             >
//                                               {bookingToDisplay.booking_start_end}
//                                             </div>
//                                           </div>
//                                         </>
//                                       )}
//                                     </td>
//                                   );
//                                 }

//                                 return (
//                                   <td
//                                     key={colIndex}
//                                     style={{
//                                       border: "1px solid #eee",
//                                       height: 80,
//                                       padding: 8,
//                                       textAlign: "center",
//                                     }}
//                                   />
//                                 );
//                               })}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//             </>

//           ) : (
//             <Row className="my-place-mobile-reorder"> {/* Add this class */}
//               <Col
//                 md={9}
//                 style={{
//                   background: "transparent",
//                   padding: "20px",
//                   borderRadius: "10px",
//                   boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <div
//                     style={{ position: "relative", display: "inline-block",marginLeft:'22px' }}
//                     ref={calendarRef}
//                   >
//                     <InputGroup
//                       onClick={() => setShowCalendar(!showCalendar)}
//                       style={{
//                         border: "1px solid #ccc",
//                         borderRadius: "30px",
//                         padding: "8px 15px",
//                         background: "#fff",
//                         cursor: "pointer",
//                         minWidth: "350px",
//                         alignItems: "center",
//                         display: "flex",
//                       }}
//                     >
//                       <img
//                         src="/images/Host/date-range-host.svg" // Ensure this path is correct
//                         loading="lazy" alt="Calendar icon"
//                         width={20}
//                         style={{ marginRight: "10px" }}
//                       />
//                       <Form.Control
//                         type="text"
//                         readOnly
//                         value={`${format(startDate, "MMM d")} - ${format(
//                           endDate,
//                           "MMM d yyyy"
//                         )} (EST)`}
//                         style={{
//                           fontSize: "16px",
//                           fontWeight: "500",
//                           color: "#252849",
//                           background: "none",
//                           border: "none",
//                           boxShadow: "none",
//                           cursor: "pointer",
//                           marginLeft:'-11px'
//                         }}
//                       />
//                       <span
//                         style={{
//                           marginLeft: "auto",
//                           fontSize: "14px",
//                           color: "#252849",
//                         }}
//                       >
//                         {/* ▼ */}
//                         <img
//                           src="/images/Host/date-down-icon.svg" // Ensure this path is correct
//                           loading="lazy" alt="down arrow"
//                           width={15}
//                           style={{ marginRight: "10px" }} />
//                       </span>
//                     </InputGroup>

//                     {showCalendar && (
//                       <div className="my-place-date-range"
//                         style={{
//                           position: "absolute",
//                           top: "110%",
//                           left: "0",
//                           zIndex: "1000",
//                           background: "#fff",
//                           padding: "0",
//                           borderRadius: "10px",
//                           border: "3px solid #3A4B4C",
//                         }}
//                       >
//                         <DatePicker
//                           selected={startDate}
//                           onChange={handleDateChange}
//                           startDate={startDate}
//                           endDate={endDate}
//                           selectsRange
//                           inline // Display calendar directly within the popover
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div
//                     className="my-place-filter" // Add this class
//                     style={{
//                       display: "none",
//                       justifyContent: "space-around",
//                       alignItems: "center",
//                       paddingLeft: "10px",
//                       paddingRight: "10px",
//                       border: "1px solid #ddd",
//                       borderRadius: "30px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <SlidersHorizontal
//                       size={20}
//                       color="black"
//                       fontWeight={"500"}
//                     />
//                     <Button
//                       style={{
//                         background: "none",
//                         border: "none",
//                         fontSize: "16px",
//                         color: "#333",
//                         fontWeight: "500",
//                       }}
//                     >
//                       Filter
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Booking History Table */}
//                 <div
//                   style={{
//                     width: "100%",
//                     maxHeight: "80vh", // Limits table height, enabling vertical scroll
//                     display: "flex",
//                     flexDirection: "column",
//                     borderRadius: "12px",
//                   }}
//                 >
//                   <div style={{ overflowX: "auto" }}>
//                     <table
//                       className="my-place-history-table"
//                       style={{
//                         width: "max-content", // Allows table to expand if content is wider
//                         minWidth: "100%", // Ensures table takes at least 100% width
//                         borderCollapse: "separate", // Removes double borders between cells
//                         borderSpacing: "6px", // Adds space between borders for better readability
//                         padding:'0px 0px'
//                       }}
//                     >
//                       <thead>
//                         <tr>
//                           <th style={{ width: 80, background: "transparent" }} ></th>{" "}
//                           {days.map((day, index) => (
//                             <th key={index}
//                               style={{
//                                 minWidth: 120,
//                                 height: 50,
//                                 backgroundColor: "white",
//                                 fontSize: 14,
//                                 color: "#333",
//                                 textAlign: "center",
//                                 fontWeight: "600",
//                                 position: "sticky", // Sticky header for horizontal scroll
//                                 top: 0,
//                                 zIndex: 5,
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   height: 50,
//                                   borderRadius: 12,
//                                   backgroundColor: "#EFF2F5",
//                                   padding: 8,
//                                   fontSize:"15px",
//                                   fontWeight:'400',
//                                   color:'black'
//                                 }}
//                               >
//                                 {formatDayLabel(day)}
//                               </div>
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {times.map((timeSlotLabel, rowIndex) => (
//                           <tr key={rowIndex}>
//                             <td
//                               style={{
//                                 fontWeight: "bold",
//                                 background: "transparent",
//                                 textAlign: "center",
//                                 position: "sticky", // Sticky time column for vertical scroll
//                                 left: 0,
//                                 zIndex: 10,
//                                 border: "1px solid #ddd",
//                                 width: 80,
//                                 borderRadius: 12,
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   height: 80,
//                                   borderRadius: "20px",
//                                   backgroundColor: "#EFF2F5",
//                                   padding: "0 18px",
//                                   fontWeight:'400',
//                                   color:'black',
//                                   fontSize:'15px'

//                                 }}
//                               >
//                                 {timeSlotLabel}
//                               </div>
//                             </td>
//                             {days.map((day, colIndex) => {
//                               const bookingsForDay = bookings.filter(
//                                 (b) => formatDateToDay(b.booking_date) === day
//                               );

//                               let bookingToDisplay = null;
//                               let showName = false;

//                               let [slotHourStr, slotMinuteStr] = timeSlotLabel
//                                 .split(" ")[0]
//                                 .split(":");
//                               let slotHour = parseInt(slotHourStr);
//                               const slotMeridian = timeSlotLabel.split(" ")[1];

//                               if (slotMeridian === "PM" && slotHour !== 12) {
//                                 slotHour += 12;
//                               } else if (
//                                 slotMeridian === "AM" &&
//                                 slotHour === 12
//                               ) {
//                                 slotHour = 0; // 12 AM (midnight) corresponds to hour 0
//                               }

//                               const currentSlotStart = new Date(
//                                 `2000-01-01T${slotHour
//                                   .toString()
//                                   .padStart(2, "0")}:${slotMinuteStr}:00`
//                               );
//                               const currentSlotEnd = new Date(currentSlotStart);
//                               currentSlotEnd.setHours(
//                                 currentSlotEnd.getHours() + 1
//                               );

//                               for (const booking of bookingsForDay) {
//                                 const [bookingStart24, bookingEnd24] =
//                                   booking.booking_start_end.split(" - ");

//                                 const bookingStartDate = new Date(
//                                   `2000-01-01T${bookingStart24}:00`
//                                 );
//                                 const bookingEndDate = new Date(
//                                   `2000-01-01T${bookingEnd24}:00`
//                                 );

//                                 if (
//                                   bookingStartDate < currentSlotEnd &&
//                                   bookingEndDate > currentSlotStart
//                                 ) {
//                                   bookingToDisplay = booking;
//                                   showName = true; // Set to true if any booking overlaps
//                                   break;
//                                 }
//                               }

//                               if (bookingToDisplay) {
//                                 return (
//                                   <td
//                                     key={colIndex}
//                                     style={{
//                                       padding: 0,
//                                       borderRadius: 12,
//                                       border: "none",
//                                       fontSize: "12px", // Smaller font for multiple lines
//                                       lineHeight: "1.3", // Adjust line height for readability
//                                       borderLeftColor: bookingToDisplay.booking_status ===
//                                         "finished" ? "#4AEAB1"
//                                         : bookingToDisplay.booking_status === "confirmed" 
//                                           ? "#85D6FF" : bookingToDisplay.booking_status ===
//                                           "waiting_payment" ? "#F5A43D" : "#ccc",
//                                           // borderTopColor:'black'
                                        
//                                     }}
//                                     // style={{
//                                     //   padding: 8,
//                                     //   borderRadius: 12,
//                                     //   border: "1px solid #ddd",
//                                     //   fontSize: "12px", // Smaller font for multiple lines
//                                     //   lineHeight: "1.3", // Adjust line height for readability
//                                     //   borderLeftColor: bookingToDisplay.booking_status ===
//                                     //     "finished" ? "#4AEAB1"
//                                     //     : bookingToDisplay.booking_status === "confirmed" 
//                                     //       ? "#85D6FF" : bookingToDisplay.booking_status ===
//                                     //       "waiting_payment" ? "#F5A43D" : "#ccc",
//                                     // }}
                                    
//                                   >
//                                     {showName && (
//                                       <>
//                                         <div
//                                           className="booking-item-mobile" // Add this class
//                                           style={{
//                                             border: "1px solid #e0e0e0",
//                                             borderRadius: "16px",
//                                             padding: "12px",
//                                             margin: "0",
//                                             // margin: "8px 0",
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             justifyContent: "flex-start",
//                                             fontFamily: "sans-serif",
//                                             position: "relative",
//                                             boxShadow: "0 0 4px rgba(0,0,0,0.05)",
//                                             borderLeft: bookingToDisplay.booking_status === "finished"
//                                              ? "2px solid #4AEAB1"
//                                              : bookingToDisplay.booking_status === "confirmed"
//                                              ? "2px solid #85D6FF"
//                                              : bookingToDisplay.booking_status === "waiting_payment"
//                                              ? "2px solid #F5A43D"
//                                              : "2px solid #ccc",
//                                           }}
//                                         >
//                                           {/* <div
//                                             style={{
//                                               position: "absolute",
//                                               top: 0,
//                                               bottom: 0,
//                                               left: 0,
//                                               width: "5px",
//                                               backgroundColor:
//                                                 bookingToDisplay.booking_status ===
//                                                   "finished"
//                                                   ? "#4AEAB1"
//                                                   : bookingToDisplay.booking_status ===
//                                                     "confirmed"
//                                                     ? "#85D6FF"
//                                                     : bookingToDisplay.booking_status ===
//                                                       "waiting_payment"
//                                                       ? "#F5A43D"
//                                                       : "#ccc",
//                                               borderTopLeftRadius: "16px",
//                                               borderBottomLeftRadius: "16px",
//                                             }}
//                                           /> */}

//                                           <div
//                                             className="guest-name" // Add this class
//                                             style={{
//                                               fontWeight: "600",
//                                               fontSize: "15px",
//                                             }}
//                                           >
//                                             {bookingToDisplay.guest_name}
//                                           </div>

//                                           <div
//                                             style={{
//                                               color:
//                                                 bookingToDisplay.booking_status ===
//                                                   "finished"
//                                                   ? "#4AEAB1"
//                                                   : bookingToDisplay.booking_status ===
//                                                     "confirmed"
//                                                     ? "#85D6FF"
//                                                     : bookingToDisplay.booking_status ===
//                                                       "waiting_payment"
//                                                       ? "#F5A43D"
//                                                       : "#ccc",
//                                               fontSize: "14px",
//                                               fontWeight: "500",
//                                             }}
//                                           >
//                                             { bookingToDisplay?.booking_status=="waiting_payment"?"Waiting payment":
//                                                bookingToDisplay?.booking_status?.charAt(0)?.toUpperCase() + bookingToDisplay?.booking_status?.slice(1)}
//                                           </div>

//                                           <div
//                                             style={{
//                                               fontSize: "13px",
//                                               color: "#000",
//                                               marginTop: "4px",
//                                             }}
//                                           >
//                                             {bookingToDisplay.booking_start_end}
//                                           </div>
//                                         </div>
//                                       </>
//                                     )}
//                                   </td>
//                                 );
//                               }

//                               return (
//                                 // <td key={colIndex}
//                                 //   style={{
//                                 //     border: "1px solid #eee",
//                                 //     height: 80,
//                                 //     padding: 8,
//                                 //     textAlign: "center",
//                                 //   }}
//                                 // />
//                                 <td 
//                                     style={{
//                                       padding: 0,
//                                       borderRadius: 12,
//                                       border: "1px solid #eee",
//                                       fontSize: "12px", // Smaller font for multiple lines
//                                       lineHeight: "1.3", // Adjust line height for readability
//                                     }}
//                                   ></td>
//                               );
//                             })}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </Col>

//               <Col md={3}>
//                 <Card
//                   className="my-place-mobile-card" // Add this class
//                   style={{
//                     borderRadius: "12px",
//                     overflow: "hidden",
//                     boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//                     padding: "25px",
//                     backgroundColor: "#fff",
//                     height: "100%", // Limits height for scrolling
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between"
//                   }}
//                 >


//                   <Card.Img
//                     variant="top"
//                     src={imageBase + propertyDetails?.property_image}
//                     loading="lazy" alt="Property Image"
//                     style={{
//                       height: "350px",
//                       objectFit: "cover",
//                       borderRadius: "12px",
//                     }}
//                   />


//                   <Card.Body style={{ padding: "0px" }}>
//                     <Card.Title
//                       style={{
//                         fontSize: "18px",
//                         fontWeight: "500",
//                         marginBottom: "5px",
//                         marginTop: "10px",
//                         color:'black'
//                       }}
//                     >
//                       {propertyData?.title}
//                     </Card.Title>

//                     <Card.Text
//                       style={{
//                         fontSize: "16px",
//                         color: "#666",
//                         marginBottom: "5px",
//                       }}
//                     >
//                       <FaStar style={{ color: "#FCA800", marginRight: "5px" }} />
//                       <span style={{ fontWeight: "400", color: "#FCA800" }}>
//                         {formatReview(propertyData?.property_rating)}
//                       </span>
//                       <span style={{ color: "#A4A4A4", marginRight: "5px",fontSize:'400' }}>
//                         {" "}
//                         ({propertyData?.property_review_count})
//                       </span>

//                       <span
//                         style={{
//                           fontWeight: "500",
                         
//                           marginLeft: "10px",
//                         }}
//                       >
//                         <i className="fa-solid fa-clock" style={{ color: "#3A4B4C",}}></i> <span style={{ whiteSpace: 'nowrap', padding: 0, margin: 0,color:'black' }}>
//                          {'$'+ parseFloat(propertyData?.hourly_rate)+'/h'}
//                       </span>
//                       </span>
//                     </Card.Text>

//                     <Card.Text
//                       style={{
//                         fontSize: "16px",
//                         color: "#999",
//                         marginBottom: "5px",
//                       }}
//                     >
//                       <img
//                         src="/images/locations-grid/location-icon.svg"
//                         loading="lazy" alt="Location"
//                         style={{ width: "16px", marginRight: "5px" }}
//                       />
//                       {propertyData?.distance_miles} miles away
//                     </Card.Text>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "center",
//                         width: "100%",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "100%",
//                           height: "1px",
//                           backgroundColor: "#ccc",
//                           position: "relative",
//                           margin: "15px",
//                         }}
//                       ></div>
//                     </div>
//                     <div
//                       style={{
//                         width: "100%",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Button
//                         onClick={() => ToogleBooking()}
//                         variant="dark"
//                         style={{
//                           width: "100%",
//                           marginBottom: "10px",
//                           borderRadius: "8px",
//                           fontWeight: "400",
//                           backgroundColor: "#2E3A35",
//                           border: "none",
//                           padding: '10px'
//                         }}
//                       >
//                         {propertyDetails?.property_status == "active"
//                           ? "Pause Bookings"
//                           : "Resume Bookings"}
//                       </Button>

//                       <Button
//                         variant="outline-dark"
//                         onClick={() => setAddPropertyShow(true)}
//                         style={{
//                           width: "100%",
//                           borderRadius: "8px",
//                           fontWeight: "400",
//                           border: "1px solid #333",
//                         }}
//                       >
//                         Edit Place
//                       </Button>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           )}

//         </Container>
//       </main>

//       <AddPropertyModal
//         show={addProperyShow}
//         onHide={() => {
//           setAddPropertyShow(false);
//           getPropertBookingList();
//         }}
//         property_id={propertyData?.property_id} // Pass property ID if needed for editing
//       />

//     </>
//   );
// };

// export default MyPlaceHistory;
