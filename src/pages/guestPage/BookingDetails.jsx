import moment from "moment";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { KEYS, imageBase } from "../../config/Constant";
import { FaCalendarAlt, FaPlus, FaRegClock } from "react-icons/fa";
import MessageHost from "../../components/guest/bookingDetailsModal/MessageHost";
import NotificationPopup from "../../components/guest/bookingDetailsModal/NotificationPopup";
import Range from "../../components/guest/bookingDetailsModal/Range";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReportBookingModal from "../../components/host/ReportBookingModal";
import { toast } from "react-toastify";
import CancelPopup from "../../components/guest/bookingDetailsModal/CancelPopup";
import { Image } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import { PiClockCountdownFill } from "react-icons/pi";

const BookingDetails = () => {
      const {userInfo} = useSelector(({user})=>user)
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  const { checkoutData } = location.state || {};
  const booking = bookingData.booking;
  const { details } = useSelector(({ user }) => user);

  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId =userInfo?.user_id ? String(userInfo?.user_id) : null|| userData?.user_id ? String(userData?.user_id) : null;

  const bookingDetails = details ?? checkoutData;

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  // const formatTimeWithMeridian = (isoString) => {
  //   const date = new Date(isoString);
  //   let hours = date.getUTCHours();
  //   const minutes = date.getUTCMinutes();
  //   const meridian = hours >= 12 ? "PM" : "AM";
  //   hours = hours % 12 || 12;
  //   return `${hours.toString().padStart(2, "0")}:${minutes
  //     .toString()
  //     .padStart(2, "0")} ${meridian}`;
  // };

  //   const formatTimeWithMeridian = (isoString) => {
  //   const date = new Date(isoString);
  //   let hours = date.getHours(); // Local time
  //   const minutes = date.getMinutes(); // Local time
  //   const meridian = hours >= 12 ? "PM" : "AM";
  //   hours = hours % 12 || 12;
  //   return `${hours.toString().padStart(2, "0")}:${minutes
  //     .toString()
  //     .padStart(2, "0")} ${meridian}`;
  // };

  const startTime1 = booking?.booking_start.split(" ").slice(1).join(" ");

  const endTime1 = booking?.booking_end.split(" ").slice(1).join(" ");
  console.log(startTime1);
  // const startTime1 = formatTimeWithMeridian(booking?.booking_start); // → "02:00 AM"
  // const endTime1 = formatTimeWithMeridian(booking?.booking_end); // → "10:00 AM"

  const [isExpanded, setIsExpanded] = useState(false);

  const [rangeVisible, setRangeVisible] = useState(false);

  const [hours, setHours] = useState(bookingDetails?.hoursValue);
  const [totalPrice, setTotalPrice] = useState(bookingDetails?.totalPrice);
  const [totalHrs, setTotalHrs] = useState(bookingDetails?.hoursValue||0);

  const [startTime, setStartTime] = useState(startTime1);
  const [endTime, setEndTime] = useState(endTime1);

  const [showReportForm, setShowReportForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [bookingDate, setBookingDate] = useState(
    bookingData?.booking?.booking_date
      ? moment(bookingData?.booking?.booking_date).format("MMMM DD, YYYY")
      : ""
  );

  useEffect(() => {
    if (!bookingData.booking) {
      toast.error("Please book a property first");
      navigate("/");
    }
  }, [bookingData]);

  const handleOpenModal = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);

  function formatReview(value) {
    const num = Number(value);
    if (isNaN(num)) return ""; // handle invalid inputs
    return Number.isInteger(num) ? num.toString() : num.toFixed(1);
  }

  const handleCloseAll = () => {
    setShowNotification(false); // Close the notification popup
    setShowReportForm(false); // Ensure the report form is also closed
  };

  const isValidTime = (start, end) => {
    const startHour = parseInt(start.split(":")[0], 10);
    const startMin = parseInt(start.split(":")[1], 10);
    const endHour = parseInt(end.split(":")[0], 10);
    const endMin = parseInt(end.split(":")[1], 10);

    const startIsPM = startHour >= 12;
    const endIsPM = endHour >= 12;

    // Ensure different AM/PM periods
    if (startIsPM === endIsPM) {
      return false;
    }

    // Convert times to minutes for easier comparison
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    return endTotalMinutes > startTotalMinutes;
  };

  // Toggle functions
  const [open, setOpen] = useState(null);

  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };

  const [open2, setOpen2] = useState(null);

  const toggleAccordion2 = (id) => {
    setOpen2(open2 === id ? null : id);
  };

  // const booking_amount = bookingDetails?.totalPrice; // Assuming totalPrice is the booking amount
  const service_fee = bookingDetails?.service_fee?.toFixed(2);
  const tax = bookingDetails?.tax;
  const discount_amount = bookingDetails?.bulk_discount_rate;
  const addONs = bookingDetails?.addOnprice;
  const cleaningFee = parseInt(bookingDetails?.cleaning_fee);
  // const bookingId = bookingDetails?.booking_id;

  const totalAmount = parseFloat(bookingDetails?.ttlCalPrice).toFixed(2);

  function formatCurrency(value) {
    const number = parseFloat(value);

    if (isNaN(number)) return "0";

    return number % 1 === 0
      ? number.toString() // Whole number: no decimals
      : number.toFixed(2); // Decimal: round to 2 places
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
                  <Link to="/checkout">
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

      <div className="mob-search-filter border-start-0 border-end-0" >
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
                New Booking Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE */}

      <div
        style={{
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
          backgroundSize: "20px 20px",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            // margin: "5%",
            // marginTop: "3%",
            marginTop: isMobileWidth ? 0 : "3%",
            // marginLeft: isMobileWidth ? 0 : "2%",
            margin: isMobileWidth ? "0" : "0 2%",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            flexWrap: "wrap",
              padding:!isMobileWidth && "60px 50px "
          }}
        >
          <div
            className="container"
            style={{
              width: "100%",
              flex: "1 1 70%",
              minWidth: "300px",
              marginTop: isMobileWidth ? "0px" : "24px",
          
            }}
          >
            {!isMobileWidth && (
              <div>
                <Link to="/homeGuest">
                  <button
                    style={{
                     border: "none",
                          fontSize: "25px",
                          color: "#000000",
                          background: "none",
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
                            boxSizing: "content-box",  // Prevents padding from affecting borderRadius
                      }}
                    />
                    New Booking Confirmed
                  </button>
                </Link>

                <hr />
              </div>
            )}

            {isMobileWidth && (
              <div>
                {/* <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <span style={{ fontWeight: "600", fontSize: "clamp(14px, 2vw, 16px)" }} >
                  Hosted by
                </span>
              </div> */}

                <div
                  className="chat-right-bottom bg-white"
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
                      marginBottom: "15px",
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
                      src={imageBase + bookingDetails?.host_profile_image}
                      loading="lazy" alt="Host"
                      style={{
                        width: "clamp(50px, 7vw, 60px)",
                        height: "clamp(50px, 7vw, 60px)",
                        borderRadius: "50%",
                        // marginRight: "10px",
                      }}
                    />
                    <h2
                      style={{
                        fontSize: "clamp(14px, 2vw, 18px)",
                        margin: "0 5px 0 0",
                      }}
                    >
                      {bookingDetails?.hosted_by}
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

                    {bookingDetails?.is_star_host && (
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

                  <MessageHost
                    type={"Host"}
                    style={{ width: "100%", marginBottom: "10px" }}
                    data={{
                      sender_detail: bookingDetails,
                      property_id: booking?.id,
                    }}
                  />
                </div>
              </div>
            )}

            {isMobileWidth && (
              <div style={{ display: "flex", width: "100%", gap: "65px" }}>
                <button
                  onClick={handleOpenModal}
                  style={{
                    width: "40%",
                    padding: "clamp(8px, 1.5vw, 10px)",
                    borderRadius: "10px",
                    border: "1px solid black",
                    // marginTop: "10px",
                    backgroundColor: "white",
                    fontSize: "clamp(12px, 1.5vw, 14px)",
                    cursor: "pointer",
                  }}
                >
                  Cancel Booking
                </button>

                <CancelPopup
                  isOpen={showModal}
                  userId={userId}
                  booking_Id={bookingData?.booking?.id}
                  amount={totalAmount}
                  onCancel={handleCancel}
                  onClose={() => {
                    handleCancel();
                  }}
                  onConfirm={() => {
                    handleCancel();
                  }}
                />

                <button
                  onClick={() => setShowReportForm(true)}
                  style={{
                    width: "40%",
                    padding: "clamp(8px, 1.5vw, 10px)",
                    borderRadius: "10px",
                    border: "1px solid black",
                    // marginBottom: "10px",
                    backgroundColor: "white",
                    fontSize: "clamp(12px, 1.5vw, 14px)",
                    cursor: "pointer",
                  }}
                >
                  Report an Issue
                </button>

                <ReportBookingModal
                  show={showReportForm}
                  handleClose={() => setShowReportForm(false)}
                  user_id={userId}
                  booking_id={booking?.id}
                  property_id={bookingDetails?.property_id}
                />

                {showNotification && (
                  <div style={{ width: "100%", marginTop: "10px" }}>
                    <NotificationPopup onClose={handleCloseAll} />
                  </div>
                )}
              </div>
            )}

            {isMobileWidth && (
              <div
                className="chat-right-bottom bg-white"
                style={{ marginBottom: "20px" }}
              >
                <div
                  className="chat-right-bottom-in"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <div className="chat-right-bottom-in-image ">
                    <img
                      src={imageBase + bookingDetails?.images?.[0]}
                      loading="lazy" alt="image"
                    />
                  </div>
                  <div className="chat-right-bottom-in-text">
                    <h1> {bookingDetails?.property_title} </h1>
                    <p>
                      <img
                        src="/images/locations-grid/star-icon.svg"
                        loading="lazy" alt="Rating"
                      />
                      <span>
                        {" "}
                        {formatReview(bookingDetails?.reviews_total_rating)}
                      </span>
                      ({bookingDetails?.reviews_total_count}
                      {bookingDetails?.reviews_total_count > 1000 && "k+"})
                    </p>

                    <p
                      style={{
                        fontSize: "clamp(12px, 1.5vw, 14px)",
                        margin: "5px 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/images/locations-grid/location-icon.svg"
                        loading="lazy" alt="Location"
                      />
                      {bookingDetails?.distance_miles || "0"} miles away
                    </p>
                  </div>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: "clamp(12px, 1.5vw, 14px)",
                  }}
                >
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {totalHrs} hours
                    <span>${formatCurrency(bookingDetails?.totalPrice)}</span>
                  </li>
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Cleaning Fee <span>${formatCurrency(cleaningFee)}</span>
                  </li>
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Zyvo Service Fee <span>${formatCurrency(service_fee)}</span>
                  </li>
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Taxes <span>${formatCurrency(tax)}</span>
                  </li>
                  {addONs > 0 && (
                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Add-on <span>${formatCurrency(addONs)}</span>
                    </li>
                  )}
                  {/* <li style={{ display: "flex",  justifyContent: "space-between",}}                 >
                  Extra Time Charges
                  <span>$0</span>
                </li> */}

                  {discount_amount > 0 && (
                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      discount
                      <span>- ${formatCurrency(discount_amount)}</span>
                    </li>
                  )}
                  <li
                    className="total-cost"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "15px",
                      paddingTop: "10px",
                      borderTop: "1px solid #ccc",
                      fontWeight: "600",
                      fontSize: "clamp(14px, 2vw, 16px)",
                    }}
                  >
                    Total{" "}
                    <span>${formatCurrency(bookingDetails?.ttlCalPrice)}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Booking Details */}
            <div style={{ marginTop: "3%" }}>
              <h5
                style={{
                  display: "inline-block",
                  fontWeight: "500",
                  color: "black",
                  // fontSize: "clamp(16px, 2vw, 18px)",
                }}
              >
                Booking Details
              </h5>
              <div
                className="d-flex flex-wrap gap-2 mt-2"
                style={{ justifyContent: "flex-start" }}
              >
                {!isMobileWidth && (
                  <div
                    className="badge bg-light text-dark p-2 rounded-pill d-flex align-items-center border"
                    style={{
                      width: "fit-content",
                      fontSize: "clamp(14px, 2vw, 18px)",
                    }}
                  >
                    <FaRegClock
                      className="me-2"
                      style={{
                        fontSize: "clamp(14px, 2vw, 18px)",
                        fontWeight: "light",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "clamp(12px, 1.5vw, 15px)",
                        fontWeight: "400",
                        color: "black",
                      }}
                    >
                      {hours} Hours
                    </span>
                  </div>
                )}

                <div
                  className="badge bg-light text-dark p-2 rounded-pill d-flex align-items-center border"
                  style={{
                    width: "fit-content",
                    fontSize: "clamp(14px, 2vw, 18px)",
                  }}
                >
                      <img src="/images/checkout/checkcalendar.png" loading="lazy" alt="calendarImg" width={20}  style={{marginRight:'10px'}}/>
                  <span
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 15px)",
                      fontWeight: "400",
                      color: "black",
                    }}
                  >
                    {bookingDate}
                  </span>
                </div>

                {isMobileWidth && (
                  <div
                    className="badge bg-light text-dark p-2 rounded-pill d-flex align-items-center border"
                    style={{
                      width: "fit-content",
                      fontSize: "clamp(14px, 2vw, 18px)",
                    }}
                  >
                    <FaRegClock
                      className="me-2"
                      style={{
                        fontSize: "clamp(14px, 2vw, 18px)",
                        fontWeight: "light",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "clamp(12px, 1.5vw, 15px)",
                        fontWeight: "lighter",
                        color: "black",
                      }}
                    >
                      {hours} Hours
                    </span>
                  </div>
                )}

                <div
                  className="badge bg-light text-dark p-2 rounded-pill d-flex align-items-center border"
                  style={{
                    width: "fit-content",
                    fontSize: "clamp(14px, 2vw, 18px)",
                  }}
                >
                  <FaRegClock
                    className="me-2"
                    style={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      fontWeight: "light",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 15px)",
                      fontWeight: "400",
                      color: "black",
                    }}
                  >
                    From {startTime1} to {endTime1}
                  </span>
                </div>
                <br />

                {/* Add More Time Button - Full width on mobile */}
                <div
                  onClick={() => setRangeVisible((prev) => !prev)}
                  style={{
                    cursor: "pointer",
                    width: "fit-content",
                    maxWidth: "200px",
                    flex: "1 1 auto",
                  }}
                >
                  <div className="badge bg-light text-black p-2 rounded-pill d-flex align-items-center border">
                    <span
                      style={{
                        backgroundColor: "#5EE6A0",
                        textAlign: "center",
                        padding: "8px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        fontSize: "clamp(16px, 2vw, 30px)",
                      }}
                    >
                      <FaPlus style={{ fontSize: "clamp(8px, 1.5vw, 10px)" }} />
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(12px, 1.5vw, 15px)",
                        fontWeight: "lighter",
                      }}
                    >
                      Add more time
                    </span>
                    <FaRegClock
                      style={{
                        fontSize: "clamp(14px, 2vw, 18px)",
                        fontWeight: "light",
                        alignItems: "end",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ border: isMobileWidth ? "0.5px solid #ccc" : "" }} />

            <h5
              style={{
                display: "inline-block",
                fontWeight: "500",
                color: "black",
                // fontSize: "clamp(16px, 2vw, 18px)",
                marginTop:'10px'
              }}
            >
              Cancellation Policies
            </h5>

            <div
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                // padding: "10px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <p style={{ fontSize: "14px",color:'black' }}>
                  {`Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Incidunt expedita, quam voluptatibus rerum iste, quidem
                  quibusdam delectus impedit mollitia totam placeat. Tenetur
                  corporis laudantium dolorum nihil quae, adipisci et
                  exercitationem.`}
                  ,
                  {isExpanded &&
                    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, voluptate sunt dolor aperiam similique sit harum iste odio dicta. Accusamus cumque perferendis illum vitae tempore harum doloremque obcaecati suscipit quidem.
                  Eum, voluptas! Similique impedit harum amet tenetur ea autem quisquam facilis labore corporis nam! Modi optio hic dolores dolorem pariatur ea eligendi, corrupti blanditiis nam nostrum assumenda illo voluptas vitae.`}
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    color: "#4AEAB1",
                    border: "none",
                    cursor: "pointer",
                    background: "none",
                    fontSize: "clamp(14px, 1.5vw, 15px)",
                    textDecoration: "underline",
                  }}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              </div>
              {rangeVisible && (
                <div
                  style={
                    isMobileWidth
                      ? {
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          backgroundColor: "rgba(0, 0, 0, 0.3)", // ✅ full-page overlay with shadow effect
                          zIndex: 9998,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius:"10px"
                        }
                      : {
                          position: "absolute",
                          zIndex: 9999,
                          right: "31%",
                          top: "52%",
                        }
                  }
                >
                  <div style={{position:"relative"}}>
                    {/* Close Button */}

                    {isMobileWidth && (
                      <button
                        onClick={() => setRangeVisible(false)}
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          cursor: "pointer",
                          borderRadius: "50%",
                          width: "25px",
                          height: "25px",
                          fontSize: "16px",
                          backgroundColor: " rgb(55, 75, 72)",
                          color: "white",
                        }}
                      >
                        &times;
                      </button>
                    )}

                    {/* Your Range component */}
                    <Range
                      perHourRate={bookingDetails?.hourly_rate}
                      callbackTotalPrice={(val) => setTotalPrice(val)}
                      callbacTotalHrs={(val) => setTotalHrs(val)}
                      propertyIDD={bookingData?.booking?.id}
                    />
                  </div>
                </div>
              )}
            </div>
            <hr style={{ border: isMobileWidth ? "0.5px solid #ccc" : "" }} />
            <div
              className="accordion"
              id="rulesAccordion"
              style={{ marginTop: "3%" }}
            >
              <div className="container p-">
                <h5
                  style={{
                    display: "inline-block",
                    fontWeight: "500",
                    color: "black",
                    // fontSize: "clamp(16px, 2vw, 18px)",
                  }}
                >
                  {isMobileWidth ? "Included in your booking" : "Rules"}
                </h5>

                <div className="accordion" id="accordionExample">
                  <div>
                    <div className="accordion-item border rounded mb-2">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                            open === "collapseOne" ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => toggleAccordion("collapseOne")}
                          style={{
                            padding: "12px",
                            fontSize: "clamp(14px, 1.5vw, 16px)",
                          }}
                        >
                          <img
                            src="/images/location/included/1.svg"
                            loading="lazy" alt="Parking Icon"
                            className="me-2"
                            style={{
                              width: "25px",
                              height: "25px",
                              color: "#000",
                            }}
                          />
                          <span
                            style={{
                              display: "inline-block",
                              fontWeight: "400",
                              color: "black",
                              fontSize: "16px",
                            }}
                          >
                            Parking
                          </span>
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
                      <div className="shadow" style={{ borderRadius: "10px" }}>
                        <div
                          className="accordion-body"
                          style={{
                            borderRadius: "10px",
                          backgroundColor: "#F8F9FA",
                          margin: "10px",
                          padding: "10px",
                          fontSize: "14px",
                          color:'black'
                          }}
                        >
                          {bookingDetails?.parking_rules ||
                            "This section describes the parking rules in detail."}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="accordion-item border rounded mb-2">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                          open === "collapseTwo" ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion2("collapseTwo")}
                        style={{
                          padding: "12px",
                          fontSize: "clamp(14px, 1.5vw, 16px)",
                        }}
                      >
                        <img
                          src="/images/location/included/7.svg"
                          loading="lazy" alt="Host Rules Icon"
                          className="me-2"
                          style={{
                            width: "25px",
                            height: "25px",
                            color: "#000",
                          }}
                        />
                        <span
                          style={{
                            display: "inline-block",
                            fontWeight: "400",
                            color: "black",
                            fontSize: "16px",
                          }}
                        >
                          Host rules
                        </span>
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
                        className="accordion-body"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#F8F9FA",
                          margin: "10px",
                          padding: "10px",
                          fontSize: "14px",
                          color:'black'
                        }}
                      >
                        {bookingDetails?.host_rules ||
                          "This section describes the host rules in detail."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link to="/booking">
              <button
                className="text-black "
                style={{
                  backgroundColor: "#4AEAB1",
                  border: "none",
                  borderRadius: "20px",
                  // width: "100%",
                  maxWidth: "266px",
                  margin: "16px 0",
                  fontSize: "16px",
                  fontWeight: '500',
                  padding: "10px 25px 10px 25px",
                }}
              >
                My Bookings
              </button>
            </Link>
          </div>

          {!isMobileWidth && (
            <div
              style={{
                flex: "1 1 25%",
                minWidth: "300px",
                position: "sticky",
                top: "20px",
                height: "fit-content",
                alignSelf: "flex-start",
              }}
            >
              <div
                className="chat-right-bottom bg-white"
                style={{ marginBottom: "20px" }}
              >
                <div
                  className="chat-right-bottom-in"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <div className="chat-right-bottom-in-image ">
                    <img
                      src={imageBase + bookingDetails?.images?.[0]}
                      loading="lazy" alt="image"
                    />
                  </div>
                  <div className="chat-right-bottom-in-text">
                    <h1> {bookingDetails?.property_title} </h1>
                    <p>
                      <img
                        src="/images/locations-grid/star-icon.svg"
                        loading="lazy" alt="Rating"
                      />
                      <span>
                        {" "}
                        {formatReview(bookingDetails?.reviews_total_rating)}
                      </span>
                      ({bookingDetails?.reviews_total_count}
                      {bookingDetails?.reviews_total_count > 1000 && "k+"})
                    </p>

                    <p
                      style={{
                        fontSize: "clamp(12px, 1.5vw, 14px)",
                        margin: "5px 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/images/locations-grid/location-icon.svg"
                        loading="lazy" alt="Location"
                      />
                      {bookingDetails?.distance_miles || "0"} miles away
                    </p>
                  </div>
                </div>
                <hr style={{ margin: "15px 0" }} />
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: "clamp(12px, 1.5vw, 14px)",
                  }}
                >
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {totalHrs} hours
                    <span>${formatCurrency(bookingDetails?.totalPrice)}</span>
                  </li>
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Cleaning Fee <span>${formatCurrency(cleaningFee)}</span>
                  </li>
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Zyvo Service Fee <span>${formatCurrency(service_fee)}</span>
                  </li>
                  <li
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Taxes <span>${formatCurrency(tax)}</span>
                  </li>
                  {addONs > 0 && (
                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Add-on <span>${formatCurrency(addONs)}</span>
                    </li>
                  )}
                  {/* <li style={{ display: "flex",  justifyContent: "space-between",}}                 >
                  Extra Time Charges
                  <span>$0</span>
                </li> */}

                  {discount_amount > 0 && (
                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      discount
                      <span>- ${formatCurrency(discount_amount)}</span>
                    </li>
                  )}
                  <li
                    className="total-cost"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "15px",
                      paddingTop: "10px",
                      borderTop: "1px solid #eee",
                      fontWeight: "400",
                      fontSize: "17px",
                      color:'black'
                    }}
                  >
                    Total{" "}
                    <span>${formatCurrency(bookingDetails?.ttlCalPrice)}</span>
                  </li>
                </ul>
              </div>
              {!isMobileWidth && (
                <div style={{width:'100% !important'}}>
                  <div
                    className="location-right-shield"
                    style={{ display: "flex", flexDirection: "column",width:'102% !important'}}
                  >
                    <span
                      className="info-wrap"
                      style={{
                        display: "flex",
                        marginBottom: "15px",
                      
                      }}
                    >
                      <img
                        src="/images/create-profile/info.svg"
                        loading="lazy" alt="Info"
                        style={{
                          width: "clamp(14px, 2vw, 16px)",
                          marginRight: "8px",
                         
                        }}
                      />

                      <span
                        className="info-in"
                        style={{
                          fontSize: "clamp(12px, 1.5vw, 14px)",
                          textAlign: "left",
                        }}
                      >
                        Your safety and peace of mind are our top priorities.
                        ZYVO is proud to provide comprehensive liability
                        insurance coverage for all bookings
                      </span>
                    </span>
                    <h2
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "16px",
                        margin: "10px 0",
                         gap:'0px'
                      }}
                    >
                      <img
                        src="/images/location/zyvo-shield.svg"
                        loading="lazy" alt="ZYVO Shield"
                        style={{
                          width: "clamp(20px, 3vw, 24px)",
                          marginRight: "10px",
                         
                        }}
                      />
                      ZYVO Shield
                    </h2>

                    <p
                      style={{
                        fontSize: "clamp(12px, 1.5vw, 14px)",
                        margin: 0,
                      }}
                    >
                      Our Commitment to Your Safety and Protection on Zyvo.
                    </p>
                  </div>
                </div>
              )}
              {!isMobileWidth && (
                <div style={{background:'#FFFFFF',boxShadow:' 0 4px 12px rgba(0, 0, 0, -2.85)',border:'1px solid #E4E4E4',padding:'10px',borderRadius:'20px'}}>
                  <div style={{ textAlign: "center", marginBottom: "15px" }}>
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "22px",
                      }}
                    >
                      Hosted by
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "15px",
                      marginTop:'-15px'
                    }}
                  >
                    <div
                      className="chat-right-top-profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                       
                      }}
                    >
                      <img
                        className="chat-right-top-profile-image"
                        src={imageBase + bookingDetails?.host_profile_image}
                        loading="lazy" alt="Host"
                        style={{
                          width: "clamp(50px, 7vw, 60px)",
                          height: "clamp(50px, 7vw, 60px)",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      <h2
                        style={{
                          fontSize: "clamp(14px, 2vw, 18px)",
                          margin: "0 5px 0 0",
                        }}
                      >
                        {bookingDetails?.hosted_by}
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

                      {bookingDetails?.is_star_host && (
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
                   
                         <div style={{border:'1px solid #ccc',width:'98%',marginBottom:'15px'}}>
                          </div>
                    <MessageHost
                      type={"Host"}
                      style={{ width: "100%", marginBottom: "10px" }}
                      data={{
                        sender_detail: bookingDetails,
                        property_id: booking?.id,
                      }}
                    />

                    {/* <div
                      className="chat-right-top-mob-right"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "15px",
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
                          backgroundColor:'#e2dadaff'
                        }}
                      />
                      <p style={{ marginTop: "5px"}}>Typically respond within 1 hr</p>
                    </div> */}

                     <div className="d-flex justify-content-center mb-3">
                                      <PiClockCountdownFill size={24} color="#979797"/>
                                      <span className="fs-6 ms-2">Typically respond within 1 hr</span>
                                    </div>

                    <button
                      onClick={() => setShowReportForm(true)}
                      style={{
                        width: "100%",
                        padding: "clamp(8px, 1.5vw, 10px)",
                        borderRadius: "5px",
                        border: "1px solid black",
                        marginBottom: "10px",
                        backgroundColor: "white",
                        fontSize: "17px",
                        cursor: "pointer",
                        color:'black'
                      }}
                    >
                      Report an Issue
                    </button>

                    <ReportBookingModal
                      show={showReportForm}
                      handleClose={() => setShowReportForm(false)}
                      user_id={userId}
                      booking_id={booking?.id}
                      property_id={bookingDetails?.property_id}
                    />

                    {showNotification && (
                      <div style={{ width: "100%", marginTop: "10px" }}>
                        <NotificationPopup onClose={handleCloseAll} />
                      </div>
                    )}
                  </div>

              
                </div> 
              )}

               
      {
        !isMobileWidth && (
          <div  style={{textAlign:'center'}}>
               <button
                      onClick={handleOpenModal}
                      style={{
                        width: "80%",
                        padding: "clamp(8px, 1.5vw, 10px)",
                        borderRadius: "5px",
                        border: "1px solid black",
                        marginTop: "15px",
                        backgroundColor: "white",
                        fontSize: "17px",
                        cursor: "pointer",
                        color:'black'
                      }}
                    >
                      Cancel Booking
                    </button>

                    <CancelPopup
                      isOpen={showModal}
                      userId={userId}
                      booking_Id={bookingData?.booking?.id}
                      amount={totalAmount}
                      onCancel={handleCancel}
                      onClose={() => {
                        handleCancel();
                      }}
                      onConfirm={() => {
                        handleCancel();
                      }}
                    />
                    </div>)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingDetails;
