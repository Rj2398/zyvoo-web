import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  Image,
} from "react-bootstrap";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLogoApple } from "react-icons/io5";
import { CgColorPicker } from "react-icons/cg";
import "bootstrap/dist/css/bootstrap.min.css";
import CheckOutForm from "./CheckoutForm";
import visa from "../../../src/assets/gallery/visa.svg";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { KEYS, baseURL, imageBase } from "../../config/Constant";
import moment from "moment";
import useCommon from "../../hooks/useCommon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
import SavedCardsDropdown from "./SavedCardsDropdown";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";


const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${year}-${month}-${day} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};
const Checkout = ({ setExtendedTime }) => {
  const token = JSON.parse(
    sessionStorage.getItem(KEYS.USER_INFO)
  )?.access_token;

  const user_id = JSON.parse(sessionStorage.getItem(KEYS.USER_INFO))?.user_id;
  console.log(user_id, "test *********");

  const { userInfo } = useSelector(({ user }) => user);
  const { gatewayApple } = useSelector(({ user }) => user);
  // console.log(gatewayApple, "*****1123*****");
  const navigate = useNavigate();
  const location = useLocation();
  const [isApplePaySupported, setIsApplePaySupported] = useState(false); ////apple pay rajan
  const propertyDetails = location.state?.propertyDetails;
  const checkoutData = location.state?.objectTobeNavigated || {};
  const id = checkoutData?.property_id;

  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || userData?.user_id
      ? String(userData?.user_id)
      : null;

  useEffect(() => {
    if (!id) {
      navigate("/");
    }
  }, [id]);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const { bookHostProverty, check_host_property_availability, isLoading } =
    useCommon();
  //apple pay rajan
  // useEffect(() => {
  //   // 1. Apple Pay ONLY runs in Safari. This checks if the browser/device supports it.
  //   if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
  //     setIsApplePaySupported(true);
  //   }
  // }, []);

  const [selected, setSelected] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [customer_id, setCustomerId] = useState("");
  const [card_id, setCardId] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [startTime, setStartTime] = useState(
    checkoutData?.startTime?.split(":")[0] || "12"
  );
  const [startMinute, setStartMinute] = useState(
    checkoutData?.startTime?.split(":")[1]?.split(" ")[0] || "00"
  );
  const [startMeridian, setStartMeridian] = useState(
    checkoutData?.startTime?.split(":")[1]?.split(" ")[1] || "PM"
  );

  const [endTime, setEndTime] = useState(
    checkoutData?.endTime?.split(":")[0] || "12"
  );
  const [endMinute, setEndMinute] = useState(
    checkoutData?.endTime?.split(":")[1]?.split(" ")[0] || "00"
  );
  const [endMeridian, setEndMeridian] = useState(
    checkoutData?.endTime?.split(":")[1]?.split(" ")[1] || "PM"
  );

  // apple pay rajan

  // const initiateApplePaySession = () => {
  //   // 🚀 TURN THIS FALSE so we can try to launch the real Apple Pay sheet on Safari!
  //   const isMockTestingMode = false;

  //   if (isMockTestingMode) {
  //     console.log(
  //       "Development Mode: Bypassing browser Apple Pay engine restriction."
  //     );
  //     alert("Apple Pay Sheet Simulated!");
  //     return;
  //   }

  //   // --- NATIVE APPLE PAY ENGINE ---
  //   const paymentRequest = {
  //     countryCode: "US",
  //     currencyCode: "USD",
  //     supportedNetworks: ["visa", "mastercard", "amex", "discover"],
  //     merchantCapabilities: ["supports3DS"],
  //     total: {
  //       label: "Zyvo Booking Test",
  //       amount: "10.00",
  //     },
  //   };

  //   try {
  //     // This creates the native Apple window object
  //     const session = new window.ApplePaySession(3, paymentRequest);

  //     // We mock the merchant validation block internally so you don't need the backend API yet!
  //     session.onvalidatemerchant = (event) => {
  //       console.log("Apple Pay requested validation URL:", event.validationURL);

  //       const dummyMerchantSession = {
  //         epochTimestamp: Date.now(),
  //         expiresAt: Date.now() + 3600000,
  //         merchantSessionIdentifier: "mock_session_id",
  //         nonce: "mock_nonce",
  //         merchantIdentifier: "merchant.com.testvsao",
  //         domainName: "zyvo-4.vercel.app",
  //         displayName: "Zyvo Test",
  //         signature: "mock_signature",
  //       };

  //       // Force Safari to pass validation and show your wallet cards
  //       session.completeMerchantValidation(dummyMerchantSession);
  //     };

  //     session.onpaymentauthorized = (event) => {
  //       console.log("Mock Payment Authorized:", event.payment);
  //       session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
  //       alert("Mock Apple Pay Transaction Complete!");
  //     };

  //     // This launches the sheet
  //     session.begin();
  //   } catch (error) {
  //     console.error("Native browser session initialization failed:", error);
  //     alert(
  //       "Apple Pay Engine could not start. Make sure you are on HTTPS (Vercel) and not Localhost!"
  //     );
  //   }
  // };
  // If the user isn't using Safari or doesn't have an Apple device, hide the button completely
  // if (!isApplePaySupported) {
  //   return null;
  // }

  useEffect(() => {
    if (checkoutData?.hoursValue) {
      updateEndTime();
    }
  }, [startTime, startMinute, startMeridian]);

  const updateEndTime = () => {
    const hoursToAdd = parseInt(checkoutData?.hoursValue || "0", 10);

    // Convert start time to 24-hour format
    let hour = parseInt(startTime, 10);
    const minute = parseInt(startMinute, 10);
    const isPM = startMeridian === "PM";

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    // Create a new date with today's date
    const startDate = new Date();
    startDate.setHours(hour);
    startDate.setMinutes(minute);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    const endDate = new Date(startDate.getTime());
    endDate.setHours(endDate.getHours() + hoursToAdd);

    let endHour = endDate.getHours();
    const endMinuteStr = endDate.getMinutes().toString().padStart(2, "0");
    const endMeridianStr = endHour >= 12 ? "PM" : "AM";

    endHour = endHour % 12;
    if (endHour === 0) endHour = 12;
    const endHourStr = endHour.toString().padStart(2, "0");

    setEndTime(endHourStr);
    setEndMinute(endMinuteStr);
    setEndMeridian(endMeridianStr);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownTime, setShowDropdownTime] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState(
    checkoutData?.add_ons || []
  );
  const [selectedAddonsPrice, setSelectedAddonsPrice] = useState(
    checkoutData?.addOnprice || 0
  );

  const toggleAddon = (item) => {
    setSelectedAddons((prev) => {
      let updatedAddons;

      const exists = prev.find((addon) => addon.name === item.name);
      if (exists) {
        updatedAddons = prev.filter((addon) => addon.name !== item.name);
      } else {
        updatedAddons = [...prev, item];
      }

      const newTotalPrice = updatedAddons.reduce(
        (sum, addon) => sum + parseFloat(addon.price),
        0
      );
      setSelectedAddonsPrice(newTotalPrice);

      return updatedAddons;
    });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleDropdown2 = () => {
    setShowDropdownTime(!showDropdownTime);
  };

  const [bookingDate, setBookingDate] = useState(
    checkoutData?.dateSelected
      ? moment(checkoutData.dateSelected).format("YYYY-MM-DD")
      : ""
  );

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [isEditing, setIsEditing] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const today = new Date();
    const selectedMonthIndex = months.indexOf(selectedMonth);
    const currentMonthIndex = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    const totalDaysInMonth = getDaysInMonth(selectedMonth, selectedYear);

    let validDays = [];

    if (
      selectedYear === currentYear &&
      selectedMonthIndex === currentMonthIndex
    ) {
      validDays = Array.from(
        { length: totalDaysInMonth - currentDay + 1 },
        (_, i) => i + currentDay
      );

      if (selectedDay < currentDay || selectedDay > totalDaysInMonth) {
        setSelectedDay(currentDay);
      }
    } else {
      validDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

      if (selectedDay > totalDaysInMonth) {
        setSelectedDay(1);
      }
    }

    setDaysInMonth(validDays);

    if (
      selectedYear === currentYear &&
      selectedMonthIndex < currentMonthIndex
    ) {
      setSelectedMonth(months[currentMonthIndex]);
    }

    if (
      selectedYear === currentYear &&
      selectedMonthIndex < currentMonthIndex
    ) {
      setSelectedMonth(months[currentMonthIndex]);
    }
  }, [selectedMonth, selectedYear]);

  const getDaysInMonth = (month, year) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  );

  useEffect(() => {
    if (bookingDate) {
      const dateObj = new Date(bookingDate);
      setSelectedDay(dateObj.getDate());
      setSelectedMonth(months[dateObj.getMonth()]);
      setSelectedYear(dateObj.getFullYear());
    }
  }, [bookingDate]);

  const handleIconClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const formattedMonth = monthIndex.toString().padStart(2, "0");
    const formattedDay = selectedDay.toString().padStart(2, "0");

    const fullDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;

    setBookingDate(fullDate);

    if (checkoutData) {
      checkoutData.dateSelected = fullDate;
    }
    setIsEditing(false);
  };

  const { getAllSavedCard, setPrefferCard, deleteSavedCard } = useCommon();

  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [stripe_customer_id, setStripe_customer_id] = useState("");
  const [showDropdown2, setShowDropdown2] = useState(false);

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

  const handleSave2 = () => {
    const newStartTime = `${startTime}:${startMinute} ${startMeridian}`;
    const newEndTime = `${endTime}:${endMinute} ${endMeridian}`;

    checkoutData.startTime = newStartTime;
    checkoutData.endTime = newEndTime;

    setShowDropdownTime(false);
  };

  const [open, setOpen] = useState(null);
  const [open2, setOpen2] = useState(null);

  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };

  const toggleAccordion2 = (id) => {
    setOpen2(open2 === id ? null : id);
  };

  const booking_amount = Number(checkoutData?.totalPrice);
  const service_fee = checkoutData?.service_fee?.toFixed(2);
  const tax = Number(checkoutData?.tax);
  const discount_amount = Number(checkoutData?.bulk_discount_rate);
  const addONs = Number(selectedAddonsPrice);
  const cleaningFee = Number(parseInt(checkoutData?.cleaning_fee));

  const totalAmnt =
    Number(booking_amount || 0) +
    Number(cleaningFee || 0) +
    Number(service_fee || 0) +
    Number(tax || 0) +
    Number(addONs || 0) -
    Number(discount_amount || 0);

  const formatedTotalAmount = totalAmnt.toFixed(2);
  const numericTotalAmount = Number(formatedTotalAmount);

  const handleDateChange = (e) => {
    const formattedDate = moment(e.target.value).format("YYYY-MM-DD");
    setBookingDate(formattedDate);
  };

  const [visibleCount, setVisibleCount] = useState(4);

  const showMore = () => {
    const newCount = visibleCount + 4;
    if (newCount >= propertyDetails?.add_ons?.length) {
      setVisibleCount(propertyDetails.add_ons.length);
    } else {
      setVisibleCount(newCount);
    }
  };
  function getFormattedBookingTimes({
    booking_date,
    booking_start,
    booking_end,
  }) {
    const formattedStartTime = formatTo24Hour(booking_start);
    const formattedEndTime = formatTo24Hour(booking_end);

    const startDateTime = `${booking_date}T${formattedStartTime}`;
    const endDateTime = `${booking_date}T${formattedEndTime}`;

    const adjustedTimes = adjustEndTimeIfNeeded(startDateTime, endDateTime);
    return adjustedTimes;
  }
  const initiateApplePaySession = () => {
    // 2. Define payment details
    const paymentRequest = {
      countryCode: "US",
      currencyCode: "USD",
      supportedNetworks: ["visa", "mastercard", "amex", "discover"],
      merchantCapabilities: ["supports3DS"],
      total: {
        label: "Zyvo App Checkout",
        amount: totalAmnt.toFixed(2), // This automatically forces a two-decimal string format like "25.00"
      },
    };

    // 3. Start the native Apple Pay Session (using API version 3)
    const session = new window.ApplePaySession(3, paymentRequest);

    // 4. STEP A: Triggers automatically. Send Apple's URL to your backend team's endpoint.
    session.onvalidatemerchant = async (event) => {
      try {
        // Point this to your backend team's live endpoint
        const response = await fetch(`${baseURL}apple-pay/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            validationUrl: event.validationURL,
          }),
        });

        const merchantSessionDetails = await response.json();

        // Complete validation handshake to display native credit cards list
        session.completeMerchantValidation(merchantSessionDetails);
      } catch (err) {
        console.error("Merchant validation failed:", err);
        session.abort();
      }
    };

    // 5. STEP B: Triggers when the user authorizes payment with FaceID / TouchID
    session.onpaymentauthorized = async (event) => {
      const paymentToken = event.payment.token;

      const { start_time, end_time } = getFormattedBookingTimes({
        booking_date: bookingDate,
        booking_start: checkoutData?.startTime,
        booking_end: checkoutData?.endTime,
      });

      try {
        // Send this payment token to your backend processing endpoint
        const response = await fetch(`${baseURL}apple-pay/charge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: paymentToken,
            amount: Math.round(totalAmnt * 100),
            user_id: user_id,
            property_id: checkoutData?.property_id,
            booking_date: bookingDate,
            booking_start: start_time,
            booking_end: end_time,
            booking_amount: checkoutData?.totalPrice.toString(),
            total_amount: totalAmnt,
            service_fee: checkoutData?.service_fee.toString(),
            tax: checkoutData?.tax.toString(),
            discount_amount: checkoutData?.bulk_discount_hour.toString(),
            addons: selectedAddons,
          }),
        });

         const { start_time, end_time } = getFormattedBookingTimes({
        booking_date: bookingDate,
        booking_start: checkoutData?.startTime,
        booking_end: checkoutData?.endTime,
      });

        const paymentResult = await response.json();
        console.log(paymentResult?.booking_details, "paymetn resupt***");
        if (paymentResult && paymentResult.success) {
          // Tell Safari the payment went through perfectly!
          session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
          toast.success("Booked successfully.");

          if (typeof onPaymentSuccess === "function") {
            onPaymentSuccess(paymentResult);
          }
          // onPaymentSuccess(paymentResult);

          // navigate("/booking-details", {
          //   state: {
          //     ...response?.data,
          //     bookingDate,
          //     startTime: startTime,
          //     endTime: endTime,
          //     checkoutData,
          //   },
          // });
          const bookingDetails=paymentResult?.booking_details
          navigate("/booking-details", {
            state: {
              booking: {
                ...bookingDetails,
                 booking_start: formatDateTime(bookingDetails.booking_start),
                    booking_end: formatDateTime(bookingDetails.booking_end),
              },

              bookingDate,
              startTime: start_time,
              endTime: end_time,
              checkoutData,
            },
          });
        } else {
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
        }
      } catch (err) {
        session.completePayment(window.ApplePaySession.STATUS_FAILURE);
      }
    };

    // Open the native Apple Pay popup sheet from the browser
    session.begin();
  };

  const showLess = () => {
    setVisibleCount(4);
  };

  function formatTo24Hour(timeStr) {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  }

  function adjustEndTimeIfNeeded(start_time, end_time) {
    const start = new Date(start_time);
    let end = new Date(end_time);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const formatDateTime = (dt) => {
      const pad = (n) => n.toString().padStart(2, "0");
      return (
        `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ` +
        `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`
      );
    };
    return {
      start_time: formatDateTime(start),
      end_time: formatDateTime(end),
    };
  }

  // -----------------------------------
  const handleBooking = async () => {
    try {
      const { start_time, end_time } = getFormattedBookingTimes({
        booking_date: bookingDate,
        booking_start: checkoutData?.startTime,
        booking_end: checkoutData?.endTime,
      });

      const checkAvailability = await check_host_property_availability({
        property_id: checkoutData?.property_id,
        start_time,
        end_time,
      });

      if (checkAvailability?.data?.is_available) {
        const payload = {
          user_id: userId,
          property_id: checkoutData?.property_id,
          booking_date: bookingDate,
          booking_start: start_time,
          booking_end: end_time,
          booking_amount: checkoutData?.totalPrice.toString(),
          total_amount: totalAmnt,
          customer_id: customer_id,
          card_id: card_id,
          service_fee: checkoutData?.service_fee.toString(),
          tax: checkoutData?.tax.toString(),
          discount_amount: checkoutData?.bulk_discount_hour.toString(),
          addons: selectedAddons,
        };

        const response = await bookHostProverty(payload);

        if (response) {
          toast.success("Booked successfully.");

          navigate("/booking-details", {
            state: {
              ...response?.data,
              bookingDate,
              startTime: start_time,
              endTime: end_time,
              checkoutData,
            },
          });

          setExtendedTime(true);
        }
      } else {
        toast.error(checkAvailability?.data?.message);
      }
    } catch (error) {
      setExtendedTime(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  function formatCurrency(value) {
    const number = parseFloat(value);

    if (isNaN(number)) return "0";

    return number % 1 === 0 ? number.toString() : number.toFixed(2);
  }

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
                  <Link to={`/location/${id}`}>
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
                Chekout and Pay
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
          // margin: "5%",

          marginTop: isMobileWidth ? 0 : "3%",
          marginLeft: isMobileWidth ? 0 : "2%",
        }}
      >
        <Loader visible={isLoading} />
        <Container fluid className="px-md-5 px-3 py-md-4 py-3">
          <Row>
            {/* Left Column - Main Content */}
            <Col lg={8} className="pe-lg-4">
              {!isMobileWidth && (
                <div>
                  <div>
                    <Link to={`/location/${id}`}>
                      <button
                        style={{
                          border: "none",
                          fontSize: "25px",
                          color: "#000000",
                          background: "none",
                          marginBottom: "16px",
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
                        Chekout and Pay
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
                        loading="lazy"
                        alt="Host"
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
                        loading="lazy"
                        alt="Verified"
                        style={{
                          width: "clamp(14px, 2vw, 16px)",
                          height: "clamp(14px, 2vw, 16px)",
                        }}
                      />

                      {checkoutData?.is_star_host && (
                        <Image
                          src="/images/locations-grid/profile/batch.svg"
                          loading="lazy"
                          alt="Batch"
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
                      loading="lazy"
                      alt="Response time"
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
                              loading="lazy"
                              alt="images"
                            />
                          </div>
                          <div className="chat-right-bottom-in-text">
                            <h1>{checkoutData?.property_title}</h1>
                            <p>
                              <img
                                src="/images/locations-grid/star-icon.svg"
                                loading="lazy"
                                alt="star"
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
                                loading="lazy"
                                alt=""
                              />{" "}
                              {checkoutData?.distance_miles} miles away
                            </p>
                          </div>
                        </div>

                        <ul style={{ padding: "2%" }}>
                          <li>
                            {checkoutData?.hoursValue} hours
                            <span>
                              ${formatCurrency(checkoutData?.totalPrice) || 0}
                            </span>
                          </li>
                          {checkoutData?.cleaning_fee > 0 && (
                            <li>
                              Cleaning Fee
                              <span>
                                $
                                {formatCurrency(checkoutData?.cleaning_fee) ||
                                  0}
                              </span>
                            </li>
                          )}
                          <li>
                            Zyvo Service Fee
                            <span>
                              ${formatCurrency(checkoutData?.service_fee) || 0}
                            </span>
                          </li>
                          <li>
                            Taxes{" "}
                            <span>
                              ${formatCurrency(checkoutData?.tax) || 0}
                            </span>
                          </li>
                          {selectedAddonsPrice > 0 && (
                            <li>
                              Add-on{" "}
                              <span>
                                ${formatCurrency(selectedAddonsPrice) || 0}
                              </span>
                            </li>
                          )}
                          {discount_amount > 0 && (
                            <li>
                              Discount{" "}
                              <span>
                                - ${formatCurrency(discount_amount) || 0}
                              </span>
                            </li>
                          )}
                          <li className="total-cost">
                            Total{" "}
                            <span>
                              ${formatCurrency(numericTotalAmount) || 0}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Col>
              )}

              {/* Booking Details */}
              <h5
                style={{
                  display: "inline-block",
                  color: "black",
                  fontWeight: "400",
                  marginTop: "15px",
                }}
              >
                Boooking Details{" "}
              </h5>
              <div
                className="d-flex flex-wrap mt-2"
                style={{
                  justifyContent: "flex-start",
                  gap: "21px",
                  marginBottom: "21px",
                }}
              >
                {/* Hours Selection */}

                {!isMobileWidth && (
                  <div
                    className="badge bg-light text-dark  rounded-pill d-flex align-items-center border"
                    style={{
                      width: "fit-content",
                      fontSize: "clamp(14px, 2vw, 18px)",
                    }}
                  >
                    {/* <FaClock className="me-2" /> */}
                    <div
                      className="d-flex align-items-center flex-grow-1  rounded"
                      style={{
                        border: "none",
                        fontSize: "15px",
                        fontWeight: "400",
                        color: "#000000",
                      }}
                    >
                      <FaRegClock className="me-2" fontSize={20} />
                      {checkoutData?.hoursValue} hours
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                <div
                  className="badge bg-light text-dark  rounded-pill d-flex align-items-center border "
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "fit-content",
                    position: "relative",
                    // fontWeight: "lighter",
                    fontWeight: "400",
                    fontSize: "15px",
                    marginLeft: isMobileWidth ? "0px" : "10px",
                  }}
                >
                  {/* <FaRegCalendarAlt className="me-2" fontSize={20} /> */}
                  <img
                    src="/images/checkout/checkcalendar.png"
                    loading="lazy"
                    alt="calendarImg"
                    width={20}
                    style={{ marginRight: "10px" }}
                  />

                  <span style={{ cursor: "pointer", color: "#000000" }}>
                    {selectedMonth} {selectedDay}, {selectedYear}
                  </span>

                  <span
                    style={{
                      width: "32px",
                      height: "32px",
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
                    <i className="fa-solid fa-pen"></i>
                  </span>

                  {isEditing && (
                    <div
                      style={{
                        position: "absolute",
                        top: "55px",
                        left: "0",
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "250px",
                        zIndex: "2",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        <select
                          value={selectedDay}
                          onChange={(e) =>
                            setSelectedDay(Number(e.target.value))
                          }
                          style={{
                            padding: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            width: "50px",
                          }}
                        >
                          {daysInMonth.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>

                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          style={{
                            padding: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            flexGrow: 1,
                          }}
                        >
                          {months.map((month, index) => {
                            const isDisabled =
                              selectedYear === new Date().getFullYear() &&
                              index < new Date().getMonth();

                            return (
                              <option
                                key={month}
                                value={month}
                                disabled={isDisabled}
                              >
                                {month}
                              </option>
                            );
                          })}
                        </select>

                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            const newYear = Number(e.target.value);
                            const today = new Date();
                            const currentYear = today.getFullYear();

                            setSelectedYear(newYear);

                            if (newYear === currentYear) {
                              const currentMonthIndex = today.getMonth();
                              const selectedMonthIndex =
                                months.indexOf(selectedMonth);
                              if (selectedMonthIndex < currentMonthIndex) {
                                setSelectedMonth(months[currentMonthIndex]);
                              }
                            }
                          }}
                          style={{
                            padding: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            width: "70px",
                          }}
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleSave}
                        style={{
                          padding: "8px 15px",
                          background: "#2F3E46",
                          color: "white",
                          borderRadius: "5px",
                          border: "none",
                          width: "100%",
                          fontWeight: "bold",
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {isMobileWidth && (
                  <div
                    className="badge bg-light text-dark  rounded-pill d-flex align-items-center border"
                    style={{
                      width: "fit-content",
                      fontSize: "clamp(14px, 2vw, 18px)",
                    }}
                  >
                    {/* <FaClock className="me-2" /> */}
                    <div
                      className="d-flex align-items-center flex-grow-1  rounded"
                      style={{
                        border: "none",
                        fontSize: "15px",
                        fontWeight: "300",
                        color: "#000000",
                      }}
                    >
                      <FaRegClock className="me-2" fontSize={20} />
                      {checkoutData?.hoursValue} hours
                    </div>
                  </div>
                )}
                {/* Time Range Selection */}
                <div
                  className="badge bg-light text-dark p-1 rounded-pill d-flex align-items-center border "
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "fit-content",
                    position: "relative",
                    fontWeight: "300",
                    fontSize: "15px",
                    marginLeft: isMobileWidth ? "0px" : "10px",
                    minHeight: "50px",
                  }}
                >
                  {/* Time Display */}
                  <div className="rounded-pill d-flex align-items-center ">
                    <FaRegClock fontSize={20} style={{ marginLeft: "10px" }} />

                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "400",
                        marginLeft: "10px",
                        color: "#000000",
                      }}
                    >
                      {`From ${startTime}:${startMinute} ${startMeridian} to ${endTime}:${endMinute} ${endMeridian}`}
                    </span>

                    {/* Color Picker Button */}
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        backgroundColor: " #4AEAB1",
                        textAlign: "center",
                        padding: "8px",
                        borderRadius: "100%",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={toggleDropdown2}
                    >
                      {/* <CgColorPicker style={{ fontSize: "15px" }} /> */}
                      <i className="fa-solid fa-pen"></i>
                    </span>
                  </div>

                  {/* Dropdown Menu */}
                  {showDropdownTime && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0%",
                        background: "white",
                        padding: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        marginTop: "5px",
                        zIndex: 10,
                        width: "100%",
                      }}
                    >
                      {/* Time Selection */}
                      <div>
                        <div className="d-flex justify-content-between">
                          <span style={{ width: "25%" }}>From</span>
                          <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border p-1 rounded"
                            style={{
                              width: "20%",
                              fontSize: "15px",
                              fontWeight: "400",
                            }}
                          >
                            {[...Array(12).keys()].map((h) => (
                              <option key={h + 1} style={{ fontSize: "15px" }}>
                                {(h + 1).toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <select
                            value={startMinute}
                            onChange={(e) => setStartMinute(e.target.value)}
                            className="border p-1 rounded"
                            style={{
                              width: "20%",
                              fontSize: "15px",
                              fontWeight: "400",
                            }}
                          >
                            {[...Array(59).keys()].map((m) => (
                              <option key={m}>
                                {(m + 1).toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <select
                            value={startMeridian}
                            onChange={(e) => setStartMeridian(e.target.value)}
                            className="border p-1 rounded"
                            style={{
                              width: "25%",
                              fontSize: "15px",
                              fontWeight: "400",
                            }}
                          >
                            <option>AM</option>
                            <option>PM</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginTop: "10px" }}>
                        <div className="d-flex justify-content-between">
                          <span style={{ width: "25%" }}>To</span>
                          <select
                            value={endTime}
                            disabled
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border p-1 rounded"
                            style={{ width: "20%", fontSize: "15px" }}
                          >
                            {[...Array(12).keys()].map((h) => (
                              <option key={h + 1}>
                                {(h + 1).toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <select
                            disabled
                            value={endMinute}
                            onChange={(e) => setEndMinute(e.target.value)}
                            className="border p-1 rounded"
                            style={{ width: "20%", fontSize: "15px" }}
                          >
                            {/* {["00","05","10", "15", "20", "25", "30", "35", "40", "45","50","55"].map((m) => (
                            <option key={m}>{m}</option>
                          ))} */}
                            {[...Array(59).keys()].map((m) => (
                              <option key={m}>
                                {(m + 1).toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <select
                            disabled
                            value={endMeridian}
                            onChange={(e) => setEndMeridian(e.target.value)}
                            className="border p-1 rounded"
                            style={{ width: "25%", fontSize: "15px" }}
                          >
                            <option>AM</option>
                            <option>PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Save Button */}
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
                </div>
              </div>

              <hr />

              {/* Add-ons Section */}
              <div className="mb-4">
                <h5
                  style={{
                    color: "black",
                    fontWeight: "400",
                    marginTop: "22px",
                  }}
                >
                  Add-ons from the host
                </h5>
                <p className="" style={{ color: "black", marginTop: "10px" }}>
                  Host provided services, items, or options. Available at
                  checkout.
                </p>
                <Row className="g-3" style={{ marginTop: "22px" }}>
                  {propertyDetails?.add_ons?.length == 0 && (
                    <Col
                      xs={12}
                      sm={6}
                      style={{
                        color: "gray",
                        margin: "0 auto",
                        paddingTop: "10px",
                      }}
                    >
                      {" "}
                      No Add-ons Item Found{" "}
                    </Col>
                  )}
                  {propertyDetails?.add_ons
                    ?.slice(0, visibleCount)
                    .map((item) => {
                      const isSelected = selectedAddons.some(
                        (addon) => addon.name === item.name
                      );

                      return (
                        <Col
                          key={item.id}
                          xs={12}
                          sm={6}
                          onClick={() => toggleAddon(item)}
                        >
                          <Card
                            className="h-100 w-100"
                            style={{ width: "70%" }}
                          >
                            <Card.Body
                              className="d-flex align-items-center"
                              style={{
                                border: isSelected
                                  ? "1px solid #4aeab1"
                                  : "#cdc7c7",
                                cursor: "pointer",
                              }}
                            >
                              {/* <img src={item?.img || "/images/location/add-ons/1.svg"} alt={item?.name}
                          className="me-3" style={{ width: "32px", height: "32px", opacity: "0.6", }} /> */}
                              <div>
                                <Card.Title
                                  className="mb-0 fs-6"
                                  style={{ color: "black" }}
                                >
                                  {item?.name}
                                </Card.Title>
                                <Card.Text className=" small">
                                  $ {item?.price} / Item
                                </Card.Text>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>

                {visibleCount < propertyDetails?.add_ons?.length && (
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      textDecoration: "underline",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                    onClick={showMore}
                    className="mt-4 text-blue-500 text-sm"
                  >
                    Show More
                  </button>
                )}

                {/* Show Less Button */}
                {visibleCount >= propertyDetails?.add_ons?.length &&
                  propertyDetails?.add_ons?.length > 4 && (
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        textDecoration: "underline",
                      }}
                      onClick={showLess}
                      className="mt-4 text-blue-500 text-sm"
                    >
                      Show Less
                    </button>
                  )}
              </div>

              <hr />

              {/* Payment Method */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {isMobileWidth ? (
                    <h6 style={{ color: "black", fontWeight: "400" }}>
                      Payment method
                    </h6>
                  ) : (
                    <h5 style={{ color: "black", fontWeight: "400" }}>
                      Payment method
                    </h5>
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
                      // onClick={() => {}}
                      onClick={initiateApplePaySession}
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
                        color: "black",
                      }}
                    >
                      -OR-
                    </div>{" "}
                  </>
                )}

                <Button
                  variant="light"
                  className="w-100 rounded-pill d-flex justify-content-between align-items-center px-3 py-2 border"
                  onClick={() => {
                    setSelected((prev) => !prev);
                    setShowDropdown2(true);
                  }}
                  style={{
                    fontWeight: 400,
                    backgroundColor: "white",
                    borderColor: "#E5E5E5",
                    fontSize: "16px",
                    color: "black",
                  }}
                >
                  Credit or Debit Card
                  <span style={{ fontSize: "0.8rem" }}>
                    {selected ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </Button>

                {/* Dropdown section */}
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
                            maxHeight: "190px",
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
                                    loading="lazy"
                                    alt="Visa"
                                    style={{ width: "32px", height: "22px" }}
                                  />
                                  <span
                                    style={{
                                      fontWeight: "400",
                                      color: "black",
                                    }}
                                  >
                                    •••• {card.last4}
                                  </span>
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
                              ? "60%"
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
                    {selected2 &&
                      (isMobileWidth ? (
                        <div
                          style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1050,
                          }}
                        >
                          <div
                            style={{
                              width: "95%",
                              maxWidth: "400px",
                              borderRadius: "13px",
                              backgroundColor: "white",
                              padding: "20px",
                              maxHeight: "90vh",
                              overflowY: "auto",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                onClick={() => setSelected2(false)}
                                style={{
                                  background: "black",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "25px",
                                  height: "25px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                x
                              </button>
                            </div>
                            <CheckOutForm
                              getStripId={(txt) => setCustomerId(txt)}
                              getcard_id={(txt) => setCardId(txt)}
                              selected={selected2}
                              setSelected={setSelected}
                              setSelected2={setSelected2}
                              setRefresh={setRefresh}
                              refresh={refresh}
                            />
                          </div>
                        </div>
                      ) : (
                        <CheckOutForm
                          getStripId={(txt) => setCustomerId(txt)}
                          getcard_id={(txt) => setCardId(txt)}
                          selected={selected2}
                          setSelected={setSelected}
                          setSelected2={setSelected2}
                          setRefresh={setRefresh}
                          refresh={refresh}
                        />
                      ))}
                  </div>
                )}
              </div>

              <hr />

              {/* About the Space */}
              <div className="mb-4">
                <h5 style={{ color: "black", fontWeight: "400" }}>
                  {" "}
                  {isMobileWidth ? "Refund Policies" : "About the Space"}
                </h5>
                <p style={{ fontSize: "15px" }}>
                  {isExpanded ||
                    (checkoutData?.property_description?.length || 0) <= 200
                    ? checkoutData?.property_description
                    : `${checkoutData?.property_description?.slice(0, 200)}...`}
                </p>

                {checkoutData?.property_description?.length > 200 && (
                  <Button
                    variant="link"
                    className="p-0 text-decoration"
                    style={{ color: "#4AEAB1" }}
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
                  <h5
                    className="mb-3"
                    style={{ color: "black", fontWeight: "400" }}
                  >
                    {!isMobileWidth ? "Rules" : "Included in your booking"}
                  </h5>
                  <div className="accordion" id="accordionExample">
                    {/* Parking Rule */}
                    <div>
                      <div className="accordion-item border rounded mb-2">
                        <h2 className="accordion-header" id="headingOne">
                          <button
                            className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${open === "collapseOne" ? "" : " "
                              }`}
                            type="button"
                            onClick={() => toggleAccordion("collapseOne")}
                            style={{ padding: "12px" }}
                          >
                            <img
                              src="/images/location/included/1.svg"
                              loading="lazy"
                              alt="Host Rules Icon"
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
                              color: "black",
                              fontSize: "15px",
                            }}
                          >
                            {checkoutData.parking_rules ||
                              "This section describes the parking rules in detail."}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Host Rules */}
                    <div className="accordion-item border rounded mb-2">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${open === "collapseTwo" ? "" : "collapsed"
                            }`}
                          type="button"
                          onClick={() => toggleAccordion2("collapseTwo")}
                          style={{ padding: "12px" }}
                        >
                          <img
                            src="/images/location/included/7.svg"
                            loading="lazy"
                            alt="Host Rules Icon"
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
                            color: "black",
                            fontSize: "15px",
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
              {/* <hr /> */}
              <Button
                // variant="primary"
                className="text-black "
                style={{
                  backgroundColor: "#4AEAB1",
                  border: "none",
                  borderRadius: "25px",
                  maxWidth: isMobileWidth ? "250px" : "266px",
                  margin: "16px 0",
                  fontSize: isMobileWidth ? "15px" : "17px",
                  padding: "10px 25px 10px 25px",
                  fontWeight: "500",
                }}
                onClick={handleBooking}
              >
                Confirm &amp; pay
              </Button>
            </Col>

            {/* Right Column - Summary */}
            {!isMobileWidth && (
              <Col lg={4} className="ps-lg-4">
                <div>
                  <div style={{ padding: "10px", marginTop: "-20px" }}>
                    <div
                      className="chat-right-bottom bg-white"
                      style={{ minWidth: "320px " }}
                    >
                      <div className="chat-right-bottom-in">
                        <div className="chat-right-bottom-in-image ">
                          <img
                            src={imageBase + checkoutData?.images?.[0]}
                            loading="lazy"
                            alt="images"
                          />
                        </div>
                        <div className="chat-right-bottom-in-text">
                          <h1>{checkoutData?.property_title}</h1>
                          <p>
                            <img
                              src="/images/locations-grid/star-icon.svg"
                              loading="lazy"
                              alt="star"
                            />{" "}
                            <span>
                              {" "}
                              {formatReview(checkoutData?.reviews_total_rating)}
                            </span>
                            ( {checkoutData?.reviews_total_count}{" "}
                            {checkoutData?.reviews_total_count > 1000 && "k+"})
                          </p>
                          <p>
                            <img
                              src="/images/locations-grid/location-icon.svg"
                              loading="lazy"
                              alt=""
                            />{" "}
                            {checkoutData?.distance_miles} miles away
                          </p>
                        </div>
                      </div>
                      <hr />
                      <ul>
                        <li>
                          {checkoutData?.hoursValue} hours
                          <span>
                            ${formatCurrency(checkoutData?.totalPrice) || 0}
                          </span>
                        </li>
                        {checkoutData?.cleaning_fee > 0 && (
                          <li>
                            Cleaning Fee
                            <span>
                              ${formatCurrency(checkoutData?.cleaning_fee) || 0}
                            </span>
                          </li>
                        )}
                        <li>
                          Zyvo Service Fee
                          <span>
                            ${formatCurrency(checkoutData?.service_fee) || 0}
                          </span>
                        </li>
                        <li>
                          Taxes{" "}
                          <span>${formatCurrency(checkoutData?.tax) || 0}</span>
                        </li>
                        {selectedAddonsPrice > 0 && (
                          <li>
                            Add-on{" "}
                            <span>
                              ${formatCurrency(selectedAddonsPrice) || 0}
                            </span>
                          </li>
                        )}
                        {discount_amount > 0 && (
                          <li>
                            Discount{" "}
                            <span>
                              - ${formatCurrency(discount_amount) || 0}
                            </span>
                          </li>
                        )}
                        <li className="total-cost">
                          Total{" "}
                          <span>
                            ${formatCurrency(numericTotalAmount) || 0}
                          </span>
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
                    // padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                    maxWidth: "370px", //
                    marginLeft: "9px",
                  }}
                >
                  {/* First Section - ZYVO Shield */}
                  <div
                    className="location-right-shield w-96"
                    style={{ alignItems: "center" }}
                  >
                    <span className="info-wrap">
                      <img
                        src="/images/create-profile/info.svg"
                        loading="lazy"
                        alt=""
                        style={{
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                      <span className="info-in" style={{ width: "1000%" }}>
                        Your safety and peace of mind are our top priorities.
                        ZYVO is proud to provide comprehensive liability
                        insurance coverage for all bookings
                      </span>
                    </span>
                    <h2>
                      <img
                        src="/images/location/zyvo-shield.svg"
                        loading="lazy"
                        alt=""
                      />
                      ZYVO Shield
                    </h2>
                    <p>
                      Our Commitment to Your Safety and <br /> Protection on
                      Zyvo.
                    </p>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Checkout;

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
