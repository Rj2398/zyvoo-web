import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Dropdown, Image } from "react-bootstrap";
import { FaRegClock, FaRegCalendar, FaCheck, FaRegCalendarAlt } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";

import "bootstrap/dist/css/bootstrap.min.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { KEYS, imageBase } from "../../config/Constant";
import moment from "moment";
import useCommon from "../../hooks/useCommon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
import SavedCardsDropdown from "./SavedCardsDropdown";
import { useSelector } from "react-redux";
import CheckOutForm from "./CheckoutForm";
import { CgColorPicker, CgProfile } from "react-icons/cg";
import { IoLogoApple } from "react-icons/io5";
import { MdArrowCircleLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import visa from "../../assets/gallery/visa.svg";
import ExtendedTimeModal from "./ExtendedTimeModal";
import MessageHost from "./bookingDetailsModal/MessageHost";
import { FiArrowLeft } from "react-icons/fi";

const BookingExtendedTime = () => {
  const stripePromise = loadStripe(
    "pk_test_51QnHZl2Nd862ZJtETiUKw9fMnacKnSy3u27rwJzDsDzGoKV7yFcHWW7Zy68KXflyGZqc5Cjm2ChdpWlaE72R0fp200DSuioFyd"
  );
  const { details } = useSelector(({ user }) => user);
  const { getAllSavedCard, setPrefferCard } = useCommon();
  const navigate = useNavigate();
  const location = useLocation();
  const TotalHourprice = location.state?.totalPrice;
  const toatlHours = location.state?.hoursValue;
  const perHour = location.state?.perHourRate;
  const propertyID = location.state?.propertyIDD;
  const direct = location?.state?.direct;
  const id = propertyID;

  const checkoutData = details ?? location?.state?.bookingData;

  useEffect(() => {
    if (!propertyID || !checkoutData) {
      toast.error("Please book a property first");
      navigate("/");
    }
  }, [propertyID || checkoutData]);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const { isLoading, get_booking_extension_time_amount } = useCommon();
  const [selected, setSelected] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [customer_id, setCustomerId] = useState("");
  const [card_id, setCardId] = useState("");
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [hour, setHour] = useState(toatlHours);
  const [booking_amount, setBookingAmount] = useState();

  const [selectedCardId, setSelectedCardId] = useState("");
  const [stripe_customer_id, setStripe_customer_id] = useState("");

  const [startTime, setStartTime] = useState(
    checkoutData?.startTime ||
      formatTo12Hour(checkoutData?.booking_start?.split(" ")[1])
  );
  const [endTime, setEndTime] = useState(
    checkoutData?.endTime ||
      formatTo12Hour(checkoutData?.booking_end?.split(" ")[1])
  );
  const [bookingDate, setBookingDate] = useState(
    checkoutData?.dateSelected || checkoutData?.booking_date
      ? moment(checkoutData?.dateSelected || checkoutData?.booking_date).format(
       "MMMM DD, YYYY"
        )
      : ""
  );

  function formatTo12Hour(timeString) {
    if (!timeString || !timeString.includes(":")) return "";
    const date = new Date(`1970-01-01T${timeString}`);
    if (isNaN(date)) return "";
    let hours = date.getHours();
    const minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  const [isEditing, setIsEditing] = useState(false);

  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedYear, setSelectedYear] = useState(2023);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    if (bookingDate) {
      const momentDate = moment(bookingDate, "DD-MM-YYYY");
      setSelectedDay(momentDate.date());
      setSelectedYear(momentDate.year());
    }
  }, [bookingDate]);

  const handleIconClick = () => {
    if (hour || hour == 0) {
      const amount = hour * perHour;
      setBookingAmount(amount);
      setExtendedVisible(true);
    } else {
      const amount = TotalHourprice;
      setBookingAmount(amount);
    }
  };

  const [extendedModalVisible, setExtendedVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(null);
  const [open2, setOpen2] = useState(null);

  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };

  const toggleAccordion2 = (id) => {
    setOpen2(open2 === id ? null : id);
  };

  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userData?.user_id;

  const service_fee = (13 / 100) * TotalHourprice;
  const tax = (5 / 100) * TotalHourprice;
  const discount_amount =
    toatlHours > checkoutData?.bulk_discount_hour
      ? (checkoutData?.bulk_discount_rate / 100) * TotalHourprice
      : 0;
  const addONs = 0;
  const cleaningFee = checkoutData?.cleaning_fee || 0;
  const host = checkoutData?.hosted_by;

  const totalAmnt =
    Number(booking_amount) +
    Number(cleaningFee) +
    Number(service_fee) +
    Number(tax) +
    Number(addONs) -
    Number(discount_amount);

  const formattedTotalAmnt = totalAmnt.toFixed(2);

  // const handleDateChange = (e) => {
  //   const formattedDate = moment(e.target.value).format("YYYY-MM-DD");
  //   setBookingDate(formattedDate);
  // };

  function formatCurrency(value) {
    const number = parseFloat(value);

    if (isNaN(number)) return "0";

    return number % 1 === 0 ? number.toString() : number.toFixed(2);
  }

  let params = {
    booking_id: Number(propertyID),
    user_id: userId,
    extension_time: Number(toatlHours),
    service_fee: Number(service_fee),
    tax: Number(tax),
    cleaning_fee: Number(cleaningFee),
    extension_booking_amount: Number(booking_amount),
    discount_amount: Number(discount_amount),
    extension_total_amount: Number(totalAmnt),
  };
  const handleBooking = async () => {
    try {
      const response = await get_booking_extension_time_amount(params);
      if (response) {
        toast.success("Booked successfully.");
        navigate("/booking");
      }
    } catch (error) {
      console.error("Error while booking:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const response = await getAllSavedCard({ user_id: userId });
        setSavedCards(response.data?.cards || []);

        setStripe_customer_id(response.data?.stripe_customer_id);
        setCustomerId(response.data?.stripe_customer_id || stripe_customer_id);

        let findCardID = response.data?.cards;

        if (findCardID && findCardID.length > 0) {
          const preferredCard = findCardID.find((card) => card.is_preferred);

          if (preferredCard) {
            setSelectedCardId(preferredCard.card_id);
            setCardId(preferredCard.card_id || selectedCardId);
          }
        }
      } catch (error) {
        console.error("Error fetching saved cards:", error);
      }
    };

    fetchSavedCards();
  }, [refresh, userId]);

  const handleSetPreferred = async (card) => {
    try {
      setSelected(false);
      await setPrefferCard({ user_id: userId, card_id: card.card_id });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error setting preferred card:", error);
    }
  };

  useEffect(() => {
    if (hour) {
      const amount = hour * perHour;
      setBookingAmount(amount);
    } else {
      const amount = TotalHourprice;
      setBookingAmount(amount);
    }
  }, [extendedModalVisible]);

  function formatReview(value) {
    const num = Number(value);
    if (isNaN(num)) return "";
    return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
  }

  return (
    <>
      {/* MOBILE */}
      <div className="mob-search-filter border-start-0 border-end-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <Link to={!direct ? `/location/${id}` : `/`}>
                    <i
                      className="fa-regular fa-arrow-left"
                      style={{ textAlign: "center" }}
                    ></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mob-search-filter border-start-0 border-end-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  {/* <Link to="/profile">
                              <i className="fa-regular fa-arrow-left" style={{textAlign:'center'}}></i>
                            </Link> */}
                </div>
              </div>
              <span
                style={{
                  marginTop: "4px",
                  marginBottom: "0px",
                  marginLeft: "5px",
                  fontSize: "20px",
                  color: "black",
                }}
              >
                Booking time extension screen
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE */}

      <div
        className="checkout-page"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
          backgroundSize: "20px 20px",

          marginTop: isMobileWidth ? 0 : "3%",
          marginLeft: isMobileWidth ? 0 : "2%",
        }}
      >
        <Loader visible={isLoading} />
        <Container fluid className="px-md-5 px-3 py-md-4 py-3"   >
          <Row>
            <Col lg={8} className="pe-lg-4">
              {!isMobileWidth && (
                <div>
                  <div>
                    <Link to={!direct ? `/location/${id}` : `/`}>
                      <button
                        style={{
                          border: "none",
                          fontSize: "25px",
                          color: "#000000",
                          background: "none",
                          marginBottom:'16px'
                        }}
                      >
                       <FiArrowLeft
                          style={{
                            fontWeight: "400",
                            border: "none",
                            fontSize: "16px",
                            marginRight: "10px",
                            backgroundColor: "black",
                            color: "white",
                            borderRadius: "50%",
                            padding: "8px", 
                            boxSizing: "content-box", 
                          }}
                        />
                        Booking Time Extension
                      </button>
                    </Link>
                  </div>

                  <hr />
                </div>
              )}

              {isMobileWidth && (
                <div
                  className="chat-right-bottom bg-white"
                  // style={{ minWidth: "320px " }}
                >
                  {/* <div style={{ textAlign: "center", marginBottom: "15px" }}>
                             <span style={{ fontWeight: "600", fontSize: "clamp(14px, 2vw, 16px)" }} >
                               Hosted by
                             </span>
                           </div> */}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      className="chat-right-top-profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        // marginBottom: "15px",
                        // borderBottom:'0.5px solid #ccc'
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          fontSize: "clamp(14px, 2vw, 16px)",
                        }}
                      >
                        Hosted by
                      </span>
                      <img
                        className="chat-right-top-profile-image"
                        src={imageBase + checkoutData?.host_profile_image}
                        loading="lazy" alt="Host"
                        style={{
                          width: "clamp(50px, 7vw, 60px)",
                          height: "clamp(50px, 7vw, 60px)",
                          borderRadius: "50%",
                          // marginRight: "8px",
                        }}
                      />
                      <h2
                        style={{
                          fontSize: "clamp(14px, 2vw, 18px)",
                          margin: "0 5px 0 0",
                        }}
                      >
                        {checkoutData.hosted_by}
                      </h2>
                      <img
                        className="chat-right-top-batch-image"
                        src="/images/bookings/verify-star.svg"
                        loading="lazy" alt="Verified"
                        style={{
                          width: "clamp(14px, 2vw, 16px)",
                          height: "clamp(14px, 2vw, 16px)",
                        }}
                      />

                      {checkoutData?.is_star_host && (
                        <Image
                          src="/images/locations-grid/profile/batch.svg"
                          loading="lazy" alt="Batch"
                          style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            bottom: "0",
                            width: "25px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <hr />

                  <div
                    className=""
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                      fontSize: "clamp(12px, 1.5vw, 14px)",
                    }}
                  >
                    <img
                      src="/images/guides-articles/time.svg"
                      loading="lazy" alt="Response time"
                      style={{
                        width: "clamp(14px, 2vw, 16px)",
                        height: "clamp(14px, 2vw, 16px)",
                        marginRight: "5px",
                        backgroundColor: "black",
                      }}
                    />
                    <p style={{ margin: 0 }}>respond within 1 hr</p>
                  </div>
                </div>
              )}

              {isMobileWidth && (
                <Col sm={12} className="">
                  <div>
                    <div style={{ marginTop: "0px" }}>
                      <div
                        className="chat-right-bottom bg-white"
                        style={{ minWidth: "320px " }}
                      >
                        <div className="chat-right-bottom-in">
                          <div className="chat-right-bottom-in-image ">
                            <img
                              src={imageBase + checkoutData?.images?.[0]}
                              loading="lazy" alt="images"
                            />
                          </div>
                          <div className="chat-right-bottom-in-text">
                            <h1>{checkoutData?.property_title}</h1>
                            <p>
                              <img
                                src="/images/locations-grid/star-icon.svg"
                                loading="lazy" alt="star"
                              />{" "}
                              <span>
                                {" "}
                                {formatReview(
                                  checkoutData?.reviews_total_rating
                                )}
                              </span>
                              ( {checkoutData?.reviews_total_count}{" "}
                              {checkoutData?.reviews_total_count > 1000 && "k+"}
                              )
                            </p>
                            <p>
                              <img
                                src="/images/locations-grid/location-icon.svg"
                                loading="lazy" alt=""
                              />{" "}
                              {checkoutData?.distance_miles} miles away
                            </p>
                          </div>
                        </div>

                        <ul style={{ padding: "2%" }}>
                          <li>
                            {hour} hours
                            <span>${formatCurrency(booking_amount)}</span>
                          </li>
                          <li>
                            Cleaning Fee{" "}
                            <span>${formatCurrency(cleaningFee)}</span>
                          </li>
                          <li>
                            Zyvo Service Fee{" "}
                            <span>${formatCurrency(service_fee)}</span>
                          </li>
                          {tax > 0 && (
                            <li>
                              Taxes <span>${formatCurrency(tax)}</span>
                            </li>
                          )}
                          {addONs > 0 && (
                            <li>
                              Add-on <span>${formatCurrency(addONs)}</span>
                            </li>
                          )}
                          {discount_amount > 0 && (
                            <li>
                              Discount{" "}
                              <span>- ${formatCurrency(discount_amount)}</span>
                            </li>
                          )}
                          <li className="total-cost">
                            Total{" "}
                            <span>${formatCurrency(formattedTotalAmnt)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Col>
              )}

              {/* Booking Details */}
              <h5 style={{ display: "inline-block", fontWeight:'400',color:'black',marginTop:'15px' }}>Booking Details </h5>
              <div className="d-flex flex-wrap gap-2 mt-2 " style={{marginBottom:'22px'}}>
                {/* Hours Selection */}
                <div
                  className="badge bg-light text-dark  rounded-pill d-flex align-items-center border "
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "fit-content",
                    position: "relative",
                    padding:'10px'
                  }}
                >
                  {/* <FaClock className="me-2" /> */}
                  <div
                    className="d-flex align-items-center flex-grow-1  rounded"
                    style={{
                      border: "none",
                      fontSize: "15px",
                      fontWeight: "400",
                      color: "black",
                    }}
                  >
                    <FaRegClock className="me-2" fontSize={20} />
                    {hour} hours
                  </div>

                  <span
                    style={{
                      backgroundColor: " #4AEAB1",
                      textAlign: "center",
                      padding: "8px",
                      borderRadius: "100%",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    onClick={handleIconClick}
                  >
                    {/* <CgColorPicker style={{ fontSize: "15px" }} /> */}
                    {isEditing ? (
                      <FaCheck style={{ fontSize: "15px" }} />
                    ) : (
                      // <CgColorPicker style={{ fontSize: "15px" }} />
                       <i className="fa-solid fa-pen"></i>
                    )}
                  </span>
                </div>

                {/* Date Selection */}
                <div
                  className="badge bg-light text-dark p-2 rounded-pill d-flex align-items-center border "
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "fit-content",
                    position: "relative",
                    fontWeight: "400",
                    fontSize: "15px",
                    marginLeft: "10px",
                    marginRight:'10px',
                    color:'black',
                    padding:'10px'
                  }}
                >
                  {/* <FaRegCalendarAlt className="me-2" fontSize={20} /> */}
                  <img src="/images/checkout/checkcalendar.png" loading="lazy" alt="calendarImg" width={20}  style={{marginRight:'10px'}}/>
                  

                  <span style={{ cursor:"pointer",color:'black',fontWeight:'400'}}>{bookingDate}</span>
                </div>
              </div>
              <hr />

              {/* Payment Method */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {isMobileWidth ? (
                    <h6>Payment method</h6>
                  ) : (
                    <h5  style={{color:'black',fontWeight:'400'}}>Payment method</h5>
                  )}
                  <SavedCardsDropdown
                    getStripId={(txt) => setCustomerId(txt)}
                    getcard_id={(txt) => setCardId(txt)}
                  />
                </div>

                {!isMobileWidth && (
                  <>
                    <Button
                      variant="primary"
                      className="w-100 mt-3 mb-3"
                      style={{
                        backgroundColor: " #4AEAB1",
                        borderColor: "#5EE6A0",
                        borderRadius: "50px",
                        padding: "10px 0",
                        fontSize: "20px",
                        color: "black",
                      }}
                      onClick={handleBooking}
                    >
                      <span role="img" aria-label="apple">
                        <IoLogoApple />
                      </span>{" "}
                      Pay
                    </Button>
                    <div
                      style={{
                          textAlign: "center",
                          marginBottom: "10px",
                          fontWeight: "500",
                          color:'black'
                      }}
                    >
                      -OR-
                    </div>{" "}
                  </>
                )}

                {/* <div
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                -OR-
              </div> */}

                <Button
                  variant="light"
                  className="w-100 rounded-pill d-flex justify-content-between align-items-center px-3 py-2 border"
                  onClick={() => {
                    setSelected((prev) => !prev);
                    setShowDropdown2(true);
                  }}
                  style={{  fontWeight: 400,backgroundColor:'white',borderColor:'#E5E5E5',fontSize:'16px',color:"black" }}
                >
                  Credit or Debit Card
                  <span style={{ fontSize: "0.8rem" }}>
                    {selected ? <IoIosArrowUp  style={{ width: "20px", height: "20px" }} /> : <IoIosArrowDown  style={{ width: "20px", height: "20px" }}/>}
                  </span>
                </Button>

                {selected && (
                  <div
                    className="mt-2 p-3 border rounded"
                    style={{ backgroundColor: "white" }}
                  >
                    <div>
                      <Dropdown
                        show={showDropdown2}
                        onToggle={(isOpen) => setShowDropdown2(isOpen)}
                      >
                        <Dropdown.Menu
                          className="p-0 border-0"
                          style={{
                            minWidth: "100%",
                            maxHeight: "250px",
                            overflowY: "auto",
                          }}
                        >
                          <Loader visible={isLoading} />
                          {savedCards.length === 0 && (
                            <div className="text-center py-3">
                              No saved cards found.
                            </div>
                          )}

                          {savedCards.map((card) => (
                            <Dropdown.Item
                              key={card.card_id}
                              className="p-0"
                              onClick={() => handleSetPreferred(card)}
                            >
                              <div
                                className="d-flex justify-content-between align-items-center mb-2 px-2 py-2"
                                style={{
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={visa}
                                    loading="lazy" alt="Visa"
                                    style={{ width: "32px", height: "22px" }}
                                  />
                                  <span style={{fontWeight:'400',color:'black'}}>•••• {card.last4}</span>
                                </div>
                                {card.is_preferred && (
                                  <span
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "400",
                                        color: "black",
                                    }}
                                  >
                                    Preferred
                                  </span>
                                )}
                              </div>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    {/* Add New Card Button */}
                    {selected && (
                      <div
                        className="text-center "
                        style={{
                          marginTop: isMobileWidth
                            ? showDropdown2
                              ? "80%"
                              : "0%"
                            : showDropdown2
                            ? "25%"
                            : "0%",
                        }}
                      >
                        <Button
                          variant="success"
                          className="rounded-pill px-4 py-2"
                          style={{
                            backgroundColor: "#4AEAB1",
                            border: "none",
                            color: "black",
                            fontWeight: 600,
                          }}
                          onClick={() => setSelected2((prev) => !prev)}
                        >
                          Add New Card
                        </Button>
                      </div>
                    )}

                    {/* Checkout Form */}
                    {/* {selected2 && (
                      <CheckOutForm
                        getStripId={(txt) => setCustomerId(txt)}
                        getcard_id={(txt) => setCardId(txt)}
                        selected={selected2}
                        setRefresh={setRefresh}
                        refresh={refresh}
                      />
                    )} */}
                  </div>
                )}
              </div>

              <hr />

              <div className="mb-4">
                <h5 style={{fontWeight:'400',color:'black'}}>{isMobileWidth ? "Refund Policies" : "About the Space"}</h5>
                <p style={{fontSize:'15px'}}>
                  {isExpanded ||
                  (checkoutData?.property_description?.length || 0) <= 200
                    ? checkoutData?.property_description
                    : `${checkoutData?.property_description?.slice(0, 200)}...`}
                </p>

                {checkoutData?.property_description?.length > 200 && (
                  <Button
                    variant="link"
                    className="p-0 text-decoration"
                    style={{color:'#4AEAB1'}}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </Button>
                )}
              </div>

              <hr />

              {/* Rules Section */}
              <div
                className="accordion"
                id="rulesAccordion"
                style={{ marginTop: "2%" }}
              >
                {/* Host Rules Section */}
                <div className="container p-">
                  <h5 className="fw-bold mb-3" style={{fontWeight:'400',color:'black'}}>
                    {" "}
                    {!isMobileWidth ? "Rules" : "Included in your booking"}
                  </h5>
                  <div className="accordion" id="accordionExample">
                    {/* Parking Rule */}
                    <div>
                      <div className="accordion-item border rounded mb-2">
                        <h2 className="accordion-header" id="headingOne">
                          <button
                            className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                              open === "collapseOne" ? "" : " "
                            }`}
                            type="button"
                            onClick={() => toggleAccordion("collapseOne")}
                            style={{ padding: "12px" }}
                          >
                            <img
                              src="/images/location/included/1.svg"
                              loading="lazy" alt="Parking Icon"
                              className="me-2"
                              style={{ width: "20px", height: "20px" }}
                            />
                            <span  style={{
                                display: "inline-block",
                                fontWeight: "400",
                                color: "black",
                                fontSize: "16px",
                              }}  >Parking</span>
                            <img
                              src={`/images/dropdown.svg`}
                              alt={`Dropdown Icon`}
                              className="ms-auto"
                              style={{ width: "12px" }}
                            />
                          </button>
                        </h2>
                      </div>
                      {open && (
                        <div
                          className="shadow"
                          style={{ borderRadius: "10px" }}
                        >
                          {" "}
                          <div
                            className="accordion-body"
                            style={{
                              borderRadius: "10px",
                              backgroundColor: "#F8F9FA",
                              margin: "10px",
                              padding: "10px",
                              color:'black',
                              fontSize:'15px',
                            }}
                          >
                            {checkoutData.parking_rules ||
                              "This section describes the host rules in detail."}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Host Rules */}
                    <div className="accordion-item border rounded mb-2">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                            open === "collapseTwo" ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => toggleAccordion2("collapseTwo")}
                          style={{ padding: "12px" }}
                        >
                          <img
                            src="/images/location/included/7.svg"
                            loading="lazy" alt="Host Rules Icon"
                            className="me-2"
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span style={{
                                display: "inline-block",
                                fontWeight: "400",
                                color: "black",
                                fontSize: "16px",
                              }}>Host rules</span>
                          <img
                            src={`/images/dropdown.svg`}
                            alt={`Dropdown Icon`}
                            className="ms-auto"
                            style={{ width: "12px" }}
                          />
                        </button>
                      </h2>
                    </div>
                    {open2 && (
                      <div className="shadow" style={{ borderRadius: "10px" }}>
                        <div
                          className="accordion-body "
                          style={{
                              borderRadius: "10px",
                              backgroundColor: "#F8F9FA",
                              margin: "10px",
                              padding: "10px",
                              color:'black',
                              fontSize:'15px',
                          }}
                        >
                          {checkoutData.host_rules ||
                            "This section describes the host rules in detail."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <Button
                variant="primary"
                className="w-40 mt-3 mb-5"
                style={{
                  backgroundColor: "#4AEAB1",
                  border: "none",
                  borderRadius: "25px",
                  maxWidth: isMobileWidth ? "250px" : "266px",
                  margin: "16px 0",
                  fontSize: isMobileWidth ? "15px" : "17px",
                  padding: "10px 25px 10px 25px",
                  color:'black'
                }}
                onClick={handleBooking}
              >
                Confirm &amp; pay
              </Button> */}

                 <Button
                              // variant="primary"
                              className="text-black "
                              style={{
                                backgroundColor: "#4AEAB1",
                                border: "none",
                                borderRadius: "25px",
                                maxWidth: isMobileWidth ? "250px" : "266px",
                                margin: "16px 0",
                                fontSize: isMobileWidth ? "15px !important" : "17px !important",
                                padding: "10px 25px 10px 25px",
                                fontWeight:'500'
                              }}
                              onClick={handleBooking}
                            >
                              Confirm &amp; pay  
                            </Button>
            </Col>

            {/* Right Column - Summary */}
            {!isMobileWidth && (
              <Col lg={4} className="ps-lg-4" >
                <div>
                  <div style={{ padding: "10px" ,marginTop:'-26px'}}>
                    <div
                      className="chat-right-bottom bg-white"
                      style={{ width: "350px " }}
                    >
                      <div className="chat-right-bottom-in">
                        <div className="chat-right-bottom-in-image ">
                          <img
                            src={imageBase + checkoutData?.images?.[0]}
                            loading="lazy" alt="checkout images"
                          />
                        </div>
                        <div className="chat-right-bottom-in-text">
                          <h1>{checkoutData?.property_title}</h1>
                          <p>
                            <img
                              src="/images/locations-grid/star-icon.svg"
                              loading="lazy" alt="star-icon"
                            />{" "}
                            <span>
                              {" "}
                              {formatReview(checkoutData?.reviews_total_rating)}
                            </span>
                            ( {checkoutData?.reviews_total_count}
                            {checkoutData?.reviews_total_count > 1000 && "k+"})
                          </p>
                          <p>
                            <img
                              src="/images/locations-grid/location-icon.svg"
                              loading="lazy" alt="location-icon"
                            />{" "}
                            {checkoutData?.distance_miles} miles away
                          </p>
                        </div>
                      </div>
                      <hr />
                      <ul>
                        <li>
                          {hour} hours
                          <span>${formatCurrency(booking_amount)}</span>
                        </li>
                        <li>
                          Cleaning Fee{" "}
                          <span>${formatCurrency(cleaningFee)}</span>
                        </li>
                        <li>
                          Zyvo Service Fee{" "}
                          <span>${formatCurrency(service_fee)}</span>
                        </li>
                        {tax > 0 && (
                          <li>
                            Taxes <span>${formatCurrency(tax)}</span>
                          </li>
                        )}
                        {addONs > 0 && (
                          <li>
                            Add-on <span>${formatCurrency(addONs)}</span>
                          </li>
                        )}
                        {discount_amount > 0 && (
                          <li>
                            Discount{" "}
                            <span>- ${formatCurrency(discount_amount)}</span>
                          </li>
                        )}
                        <li className="total-cost">
                          Total{" "}
                          <span>${formatCurrency(formattedTotalAmnt)}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ZYVO Shield */}
                <div
                  className="chat-right-top-mob-center"
                  style={{
                    backgroundColor: "white",
                    padding: "10px",
                    fontFamily: "sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                    width: "372px",
                    // marginLeft:'12px'
                  }}
                >
                  {/* First Section - ZYVO Shield */}
                  <div
                    className="location-right-shield  "
                    style={{ alignItems: "center" }}
                  >
                    <span className="info-wrap">
                      <img src="/images/create-profile/info.svg" loading="lazy" alt="info" />
                      <span className="info-in" style={{ width: "1000%" }}>
                        Your safety and peace of mind are our top priorities.
                        ZYVO is proud to provide comprehensive liability
                        insurance coverage for all bookings
                      </span>
                    </span>
                    <h2>
                      <img
                        src="/images/location/zyvo-shield.svg"
                        loading="lazy" alt="zyvo-shield"
                      />
                      ZYVO Shield
                    </h2>
                    <p>
                      Our Commitment to Your Safety and <br /> Protection on
                      Zyvo.
                    </p>
                  </div>
                </div>

                {/* Host Info */}
                {/* <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "100%",
                    marginTop: "20px",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "15px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                      Hosted by
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="chat-right-top-profile">
                      <img
                        className="chat-right-top-profile-image"
                        src={imageBase + checkoutData?.host_profile_image}
                        loading="lazy" alt="host profile image"
                      />
                      <h2>{checkoutData?.hosted_by}</h2>
                      <img
                        className="chat-right-top-batch-image"
                        src="/images/bookings/verify-star.svg"
                        loading="lazy" alt="verify-star"
                      />
                    </div>
                  </div>
             
                  <MessageHost
                    type={"Host"}
                    style={{ width: "100%", marginBottom: "10px" }}
                    data={{
                      sender_detail: checkoutData,
                      property_id: params?.booking_id,
                    }}
                  />
               

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                    }}
                  ></div>
                  <div
                    className="chat-right-top-mob-center"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/images/guides-articles/time.svg"
                      loading="lazy" alt="guide-articles"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "5px",
                        background: "black",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        margin: 0,
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      Typically respond within 1 hr
                    </p>
                  </div>
                </div> */}
              </Col>
            )}
          </Row>
        </Container>

        <ExtendedTimeModal
          show={extendedModalVisible}
          onHide={() => setExtendedVisible(false)}
          hourlyRate={perHour}
          initialValue={hour}
          setHour={setHour}
          isExtentionTime={true}
        />
      </div>
    </>
  );
};

export default React.memo(BookingExtendedTime);

<style jsx>{`
  .checkout-page {
    background-color: white;
    background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px);
    background-size: 20px 20px;
    min-height: 100vh;
  }

  @media (max-width: 992px) {
    .checkout-page {
      padding-top: 20px;
    }
  }

  @media (max-width: 768px) {
    .booking-details-badges {
      flex-direction: column;
      align-items: flex-start;
    }

    .booking-details-badges > div {
      margin-bottom: 10px;
      width: 100%;
    }
  }
`}</style>;
