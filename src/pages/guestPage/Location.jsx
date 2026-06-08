import { useState, useEffect, useRef } from "react";
import AuthModal from "../../components/guest/authModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useCommon from "../../hooks/useCommon";
import LocationImagesModal from "../../components/guest/LocationImagesModal";
import { KEYS, imageBase } from "../../config/Constant";
import LocationReviewStars from "../../components/guest/LocationReviewStars";
import CircularSlider from "@fseehawer/react-circular-slider";
import { DayPicker } from "react-day-picker";
import main from "../.././assets/gallery/Group (2).png";
import dotted from "../.././assets/gallery/vector_4.png";
import { Tab } from "bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./customecalendar.css";

import "react-day-picker/style.css";
import Accordion from "react-bootstrap/Accordion";
import Map from "../../components/guest/Map";
import TimeRangePicker from "../../components/guest/custom/TimeRangPicker";
import AddToWishlistModal from "../../components/guest/wishlistModals/AddToWishlistModal";
import { useDispatch, useSelector } from "react-redux";
import { setBookingDetailsData } from "../../store/slices/userSlice";
import ShareModal from "../../components/guest/bookingDetailsModal/ShareModal";
import RegisterModal from "../../components/guest/authModalGuest/RegisterModal";
import loactionImg from "../../assets/locationImg.png";
// import { now } from "moment";

function Location() {
  const { userInfo } = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const propertyId = id;
  const location = useLocation();
  const { distance } = location.state || {};
  const dayTabRef = useRef(null);
  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));

  const userId = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || userData?.user_id
    ? String(userData?.user_id)
    : null;
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const {
    getPropertyDetails,
    getPropertyReviews,
    guestWishlistData,
    check_host_property_availability,
  } = useCommon();

  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error(error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
      }
    };
    getLocation();
  }, [currentLocation?.latitude, currentLocation?.longitude]);
  useEffect(() => {
    if (!propertyId || propertyId == "undefined") {
      navigate("/");
    }
  }, [propertyId]);

  const [showPropertyImages, setShowPropertyImages] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [showShareModal, setShowShareModal] = useState();
  const [showAddWishlistModal, setShowAddWishlistModal] = useState(false);
  const [wishlistArr, setWishlistArr] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [reviewsArr, setReviewsArr] = useState([]);
  const [reviewFilter, setReviewFilter] = useState("highest_review");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedFilter, setSelectedFilter] = useState("Highest Review");
  const [filteredReviews, setFilteredReviews] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false); // NEW
  const [hoursValue, setHoursValue] = useState(1);
  const [dateSelected, setDateSelected] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [open, setOpen] = useState(null);

  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };
  const [showMore, setShowMore] = useState(false);
  const [addOnprice, setAddOnPrice] = useState(0);
  const [buttonText, setButtonText] = useState("Start Booking");
  const [showPropertyAddOns, setShowPropertyAddOns] = useState(false);

  const maxLines = 3;

  const fetchPropertyDetails = async () => {
    const result = await getPropertyDetails({
      user_id: userId,
      property_id: propertyId,
      longitude: currentLocation.longitude,
      latitude: currentLocation.latitude,
    });
    setPropertyDetails(result.data);
  };

  const fetchPropertyReviews = async (page) => {
    const result = await getPropertyReviews({
      property_id: propertyId,
      filter: reviewFilter,
      page,
    });
    if (page == 1) {
      setReviewsArr(result.data);
    } else {
      setReviewsArr(reviewsArr.concat(result.data));
    }
  };

  const getWishlist = async () => {
    const wishlistData = await guestWishlistData({
      user_id: userId,
    });
    setWishlistArr(wishlistData?.data);
  };

  const calculateTotalPrice = (hours, hourlyRate) => {
    const result = parseInt(hours) * parseInt(hourlyRate);
    setTotalPrice(result);
  };

  useEffect(() => {
    fetchPropertyDetails();
    fetchPropertyReviews(1);
    if (userId) {
      getWishlist();
    }
  }, [currentLocation.latitude]);

  useEffect(() => {
    if (currentPage != 1) {
      fetchPropertyReviews();
    }
  }, [currentPage]);

  const handleTimeRangeChange = (timeRange) => {
    setStartTime(timeRange.from);
    setEndTime(timeRange.to);
  };

  function getCancelMessage(cancellationTime) {
    if (cancellationTime <= 24) {
      return `Cancel for free within ${cancellationTime} hours`;
    } else {
      const days = Math.floor(cancellationTime / 24);
      const hours = cancellationTime % 24;
      return `Cancel for free within ${days} days${
        hours > 0 ? ` and ${hours} hour(s)` : ""
      }`;
    }
  }

  const handleSubmit = (e) => {
    navigate("/wishlist");
  };

  const handleAddonClick = (item) => {
    setSelectedAddons((prev) => {
      const isAlreadySelected = prev.some((addon) => addon.name === item.name);
      let updatedAddons;

      if (isAlreadySelected) {
        updatedAddons = prev.filter((addon) => addon.name !== item.name); // Deselect if already selected
      } else {
        updatedAddons = [...prev, item]; // Select new item
      }

      // Calculate total price from updated selected items
      const newTotalPrice = updatedAddons.reduce(
        (sum, addon) => sum + parseFloat(addon.price),
        0
      );
      setAddOnPrice(newTotalPrice);

      return updatedAddons;
    });
  };

  const booking_amount = totalPrice; // Assuming totalPrice is the booking amount
  const service_fee = (13 / 100) * totalPrice;
  const tax = (5 / 100) * totalPrice;
  const discount_amount =
    hoursValue > propertyDetails?.bulk_discount_hour
      ? (propertyDetails?.bulk_discount_rate / 100) * totalPrice
      : 0;
  const addONs = addOnprice;
  const cleaningFee = parseInt(propertyDetails?.cleaning_fee);

  const ttlCalPrice =
    booking_amount + cleaningFee + service_fee + tax + addONs - discount_amount;
  const objectTobeNavigated = {
    property_id: propertyId,
    host_id: propertyDetails?.host_id,
    property_title: propertyDetails?.property_title,
    min_booking_hours: propertyDetails?.min_booking_hours,
    property_size: propertyDetails?.property_size,
    is_in_wishlist: propertyDetails?.is_in_wishlist,
    is_star_host: propertyDetails?.is_star_host,
    hourly_rate: propertyDetails?.hourly_rate,
    bulk_discount_hour: propertyDetails?.bulk_discount_hour,
    bulk_discount_rate:
      hoursValue > propertyDetails?.bulk_discount_hour
        ? (propertyDetails?.bulk_discount_rate / 100) * totalPrice
        : 0,
    cleaning_fee: propertyDetails?.cleaning_fee,
    service_fee: (13 / 100) * totalPrice,
    tax: (5 / 100) * totalPrice,
    is_instant_book: propertyDetails?.is_instant_book,
    images: propertyDetails?.images,
    hosted_by: propertyDetails?.hosted_by,
    host_profile_image: propertyDetails?.host_profile_image,
    property_description: propertyDetails?.property_description,
    activities: propertyDetails?.activities,
    amenities: propertyDetails?.amenities,
    parking_rules: propertyDetails?.parking_rules,
    host_rules: propertyDetails?.host_rules,
    add_ons: selectedAddons,
    address: propertyDetails?.address,
    latitude: propertyDetails?.latitude,
    longitude: propertyDetails?.longitude,
    reviews_total_rating: propertyDetails?.reviews_total_rating,
    reviews_total_count: propertyDetails?.reviews_total_count,
    reviews: propertyDetails?.reviews,
    hoursValue: hoursValue,
    dateSelected: dateSelected,
    startTime: startTime,
    endTime: endTime,
    totalPrice: totalPrice,
    addOnprice: addOnprice,
    ttlCalPrice: ttlCalPrice,
    distance_miles: propertyDetails?.distance_miles,
  };

  const handleValidation = async () => {
    if (buttonText != "Proceed to Checkout") {
      if (dayTabRef.current) {
        const tab = new Tab(dayTabRef.current);
        tab.show();
        setButtonText("Proceed to Checkout");
        return;
      }
    }

    if (buttonText == "Proceed to Checkout") {
      if (!dateSelected) {
        toast.error("Please select a date.");
        return;
      }
    }

    if (!startTime) {
      toast.error("Please select a start time.");
      return;
    }

    if (!endTime) {
      toast.error("Please select an end time.");
      return;
    }

    if (
      hoursValue < parseFloat(propertyDetails?.min_booking_hours) ||
      hoursValue <= 0
    ) {
      toast.error(
        `Hours must be greater than ${parseFloat(
          propertyDetails?.min_booking_hours || 0
        )}.`
      );
      return;
    }

    if (ttlCalPrice == null) {
      toast.error("Please select the hour slider");
      return;
    }

    function convertTo24Hour(timeStr) {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    }

    function formatDateTime(dateStr, timeStr) {
      const { hours, minutes } = convertTo24Hour(timeStr);
      const date = new Date(dateStr);
      date.setHours(hours, minutes, 0, 0); // set to local time

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hr = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hr}:${min}:00`;
    }

    // Format both

    //     function convertTo24Hour(timeStr) {
    //   const [time, modifier] = timeStr.split(' ');
    //   let [hours, minutes] = time.split(':').map(Number);

    //   if (modifier === 'PM' && hours !== 12) hours += 12;
    //   if (modifier === 'AM' && hours === 12) hours = 0;

    //   return { hours, minutes };
    // }

    // function formatDateTime(dateStr, timeStr) {
    //   const { hours, minutes } = convertTo24Hour(timeStr);
    //   const date = new Date(dateStr);
    //   date.setHours(hours, minutes, 0, 0); // Set to local time

    //   const now = new Date();

    //   if (date < now) {
    //     toast.error("Selected date and time cannot be in the past.");
    //   }

    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');
    //   const hr = String(date.getHours()).padStart(2, '0');
    //   const min = String(date.getMinutes()).padStart(2, '0');

    //   return `${year}-${month}-${day} ${hr}:${min}:00`;
    // }

    const StartTime1 = formatDateTime(dateSelected, startTime);
    const EndTime1 = formatDateTime(dateSelected, endTime);

    // Debug logs
    console.log("Formatted Start Time:", StartTime1);
    console.log("Formatted End Time:", EndTime1);

    // Check in code before calling API
    // if (new Date(StartTime1) >= new Date(EndTime1)) {
    //   console.error(' End time is not after start time!');
    // }
    if (new Date(StartTime1) <= new Date()) {
      toast.error(" booking can not be  in past time");
    } else {
      // ✅ Safe to call API

      //         if (StartTime1 <= now) {

      //   toast.error("Start time or end time cannot be in the past.");
      //   return; // Stop further execution
      // }
      const checkAvailability = await check_host_property_availability({
        property_id: propertyId,
        start_time: StartTime1,
        end_time: EndTime1,
      });

      if (checkAvailability?.data?.is_available) {
        toast.success(checkAvailability?.data?.message);
        navigate("/checkoutPage", {
          state: { objectTobeNavigated, propertyDetails: propertyDetails },
        });
        dispatch(setBookingDetailsData(objectTobeNavigated));
      } else {
        toast.error(checkAvailability?.data?.message);
      }
    }

    // ✅ All validations passed — now perform actions
    setButtonText("Proceed to Checkout");
    // navigate("/checkoutPage", { state: {objectTobeNavigated, propertyDetails: propertyDetails} });
    // dispatch(setBookingDetailsData(objectTobeNavigated));
  };

  useEffect(() => {
    let sortedReviews = [...reviewsArr];

    if (selectedFilter === "Highest Review") {
      sortedReviews.sort((a, b) => b.review_rating - a.review_rating);
    } else if (selectedFilter === "Lowest Review") {
      sortedReviews.sort((a, b) => a.review_rating - b.review_rating);
    } else if (selectedFilter === "Recent Reviews") {
      sortedReviews.sort(
        (a, b) => new Date(b.review_date) - new Date(a.review_date)
      );
    }

    setFilteredReviews(sortedReviews);
  }, [selectedFilter, reviewsArr]);

  const [modalToggleValue, setModalToggleValue] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleModalToggle = (modalType, state) => {
    if (modalType === "register") setIsRegisterModalOpen(state);
    if (modalType === "login") setIsLoginModalOpen(state);
  };

  function formatReview(value) {
    const num = Number(value);

    if (isNaN(num)) return ""; // handle invalid inputs
    return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
  }

  return (
    <>
      <main className="mb-0">
        {/* <!-- MOBILE --> */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <a href="/">
                      <i className="fa-regular fa-arrow-left"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE --> */}

        <div
          className="location-wrap location-detail"
          style={{
            margin: isMobileWidth ? "0px" : "2% 5% 5% 5%",
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
            backgroundSize: "20px 20px",
            display: "flex",
            flexDirection: "row", // Ensures children are arranged in a row
            justifyContent: "space-between", // Adjust as needed
            alignItems: "flex-start",
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="location-top">
                  <h1>
                    {" "}
                    {propertyDetails?.property_title}
                    <ul>
                      <li>
                        <img
                          src="/images/locations-grid/star-icon.svg"
                          loading="lazy"
                          alt=""
                        />{" "}
                        <span>5.0</span> (30 reviews)
                      </li>
                    </ul>
                  </h1>
                  <ul>
                    <li>
                      <img
                        src="/images/locations-grid/star-icon.svg"
                        loading="lazy"
                        alt="reviews_total_rating"
                      />
                      <span>
                        {" "}
                        {formatReview(
                          propertyDetails?.reviews_total_rating
                        )}{" "}
                      </span>{" "}
                      ({propertyDetails?.reviews_total_count} reviews)
                    </li>
                    <li>
                      <img
                        src="/images/location/time.svg"
                        loading="lazy"
                        alt="min_booking_hours"
                      />
                      {parseFloat(propertyDetails?.min_booking_hours)} hr
                    </li>
                    <li>
                      <img
                        src="/images/location/size.svg"
                        loading="lazy"
                        alt="property_size"
                      />
                      {propertyDetails?.property_size} sqft
                    </li>

                    {(propertyDetails?.is_instant_book ||
                      propertyDetails?.is_instant_book != 0) && (
                      <li>
                        {" "}
                        <i className="fa-solid fa-bolt"></i> Instant book{" "}
                      </li>
                    )}

                    <li className="location-top-share">
                      <a
                        onClick={() => setShowShareModal((prev) => !prev)}
                        href="#"
                      >
                        <i
                          className="fa-solid fa-share-nodes "
                          style={{ color: "#ccc" }}
                        ></i>
                        Share
                      </a>
                    </li>

                    <li>
                      <a
                        onClick={() => {
                          if (userId) {
                            if (!propertyDetails?.is_in_wishlist) {
                              setShowAddWishlistModal(true);
                              setPropertyDetails((prev) => ({
                                ...prev,
                                is_in_wishlist: true, // ✅ Update wishlist state
                              }));
                            }
                          } else {
                            handleModalToggle("login", true);
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i
                          className="fa-solid fa-heart"
                          style={{
                            color: propertyDetails?.is_in_wishlist ? "red" : "",
                          }}
                        ></i>
                        Wishlist
                      </a>
                    </li>
                  </ul>
                </div>

                <div
                  className={`top-grid-images-${
                    propertyDetails?.images?.length > 5
                      ? 5
                      : propertyDetails?.images?.length
                  }`}
                  onClick={() => setShowPropertyImages(true)}
                  style={{ height: isMobileWidth ? "200px" : "450px" }}
                >
                  <div className="top-grid-images-left">
                    {propertyDetails?.images?.[0] && (
                      <img
                        src={`https://zyvo.tgastaging.com/${propertyDetails?.images?.[0]}`}
                        loading="lazy"
                        alt="Main Property"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="top-grid-images-right"
                    onClick={() => setShowPropertyImages(true)}
                  >
                    {propertyDetails?.images?.slice(1, 5).map((item, index) => (
                      <img
                        key={index}
                        src={`https://zyvo.tgastaging.com/${item}`}
                        loading="lazy"
                        alt="Main Property"
                      />
                    ))}
                  </div>
                </div>

                {propertyDetails?.images?.length > 5 && (
                  <div
                    style={{ textAlign: "right", cursor: "pointer" }}
                    onClick={() => setShowPropertyImages(true)}
                  >
                    see more
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="location-right">
                  <div className="location-right-top">
                    <h2>
                      ${parseFloat(propertyDetails?.hourly_rate)}/hr <br />{" "}
                      <span>
                        {" "}
                        {parseFloat(propertyDetails?.min_booking_hours)} hr
                        minimum{" "}
                      </span>
                    </h2>
                    <hr />
                    <div className="location-right-top-in">
                      <p>
                        {" "}
                        {parseFloat(propertyDetails?.bulk_discount_hour)}+ hour
                        discount{" "}
                        <span className="info-wrap">
                          <img
                            src="/images/create-profile/info.svg"
                            loading="lazy"
                            alt=""
                          />
                          <span className="info-in">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Earum quae iste voluptatem at labore fuga
                            commodi atque cum ut.
                          </span>
                        </span>
                      </p>
                      <p>
                        {parseFloat(propertyDetails?.bulk_discount_rate)}% off
                      </p>
                    </div>
                  </div>
                  <div
                    className="location-right-hour-day"
                    style={{
                      padding: isMobileWidth ? "5px" : "12px",
                      // height: isMobileWidth ? "auto" : "auto",
                    }}
                  >
                    <ul
                      className="nav nav-pills m-0"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="pills-hourly-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-hourly"
                          type="button"
                          role="tab"
                          aria-controls="pills-hourly"
                          aria-selected="false"
                        >
                          Choose Hours
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="pills-dates-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-dates"
                          type="button"
                          role="tab"
                          aria-controls="pills-dates"
                          aria-selected="false"
                          ref={dayTabRef}
                        >
                          Choose Day
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                      <div
                        className="tab-pane show active"
                        id="pills-hourly"
                        role="tabpanel"
                        aria-labelledby="pills-hourly-tab"
                        // style={{ height: isMobileWidth ? "510px" : "auto" }}
                      >
                        <div
                          className="hour-slider-wrap"
                          style={{
                            // height: isMobileWidth ? "450px" : "auto",
                            paddingTop: "30px",
                          }}
                        >
                          <div
                            className="hour-slider"
                            id="slider"
                            style={{
                              position: "relative",
                              // width: isMobileWidth ? "310px" : "283px",
                              // height: isMobileWidth ? "310px" : "283px",
                              width: isMobileWidth ? "85%" : "92%",
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
                              src={main}
                              loading="lazy"
                              alt="Main Background"
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: isMobileWidth ? "80%" : "88%",
                                height: isMobileWidth ? "80%" : "88%",
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
                                top: "auto",
                                left: "auto",
                                width: isMobileWidth ? "84%" : "86%",
                                height: isMobileWidth ? "84%" : "86%",
                              }}
                            />
                            {/* Centered Hours Value and Label */}
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
                                  fontSize: "4rem",
                                  color: "black",
                                  fontWeight: "500",
                                  lineHeight: "1",
                                }}
                              >
                                {hoursValue}
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
                              style={{ position: "relative", zIndex: 2 }}
                            >
                              <style>{`
    .hide-slider-pulse circle[style*="animation-name: pulse"] {
      fill-opacity: 0 !important;
      opacity: 0 !important;
      display: none !important;
    }
  `}</style>
                              <CircularSlider
                                width={isMobileWidth ? 310 : 283}
                                min={0}
                                max={23}
                                trackSize={isMobileWidth ? 60 : 45}
                                progressSize={isMobileWidth ? 60 : 45}
                                knobSize={isMobileWidth ? 78 : 59}
                                shadow={false}
                                knobShadow={false}
                                knobShadowColor="transparent"
                                knobColor="#fff"
                                trackColor="transparent"
                                progressColorFrom="#4aeab1"
                                progressColorTo="#4aeab1"
                                direction={1}
                                dataIndex={parseInt(
                                  propertyDetails?.min_booking_hours
                                )}
                                label=" " // Keep a non-empty label (space)
                                labelColor="transparent" // Make it invisible
                                valueColor="transparent" // Make the number invisible
                                valueFontSize="0rem" // Still needed internally
                                labelFontSize="1rem" // Still needed internally
                                onChange={(value) => {
                                  setHoursValue(value);
                                  calculateTotalPrice(
                                    value,
                                    parseFloat(propertyDetails?.hourly_rate)
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              width: "98%",
                              height: "1px",
                              backgroundColor: "#E2DCE2",
                              marginTop: "30px",
                            }}
                          />
                          <div className="hour-slider-in">
                            <p>
                              <img
                                src="/images/filters/time.svg"
                                loading="lazy"
                                alt=""
                              />
                              {hoursValue == 1
                                ? "1 hour"
                                : `${hoursValue} hours`}
                            </p>
                            <p>
                              <img
                                src="/images/location/price.svg"
                                loading="lazy"
                                alt=""
                              />
                              {isNaN(totalPrice) ? `$ ${0}` : `$ ${totalPrice}`}
                            </p>
                          </div>
                          {/* <button type="button" className="location-right-btn"
                            // onClick={handleValidation}
                            disabled={propertyDetails?.host_id === userId}
                            onClick={() => {
                              userId ? handleValidation() : handleModalToggle("login", true);
                            }} >
                            {buttonText}
                          </button> */}

                          <button
                            type="button"
                            className="location-right-btn "
                            style={{
                              opacity:
                                propertyDetails?.host_id === userId ? 0.1 : 1,
                              cursor:
                                propertyDetails?.host_id === userId
                                  ? "not-allowed"
                                  : "pointer",
                              backgroundColor:
                                propertyDetails?.host_id === userId
                                  ? "#ccc"
                                  : "",
                            }}
                            onClick={() => {
                              if (!userId) {
                                handleModalToggle("login", true);
                                return;
                              }

                              if (
                                Number(propertyDetails?.host_id) ===
                                Number(userId)
                              ) {
                                toast.error("You can’t book your own listing.");
                                return;
                              }

                              handleValidation();
                            }}
                            // disabled
                          >
                            {buttonText}
                          </button>
                        </div>
                      </div>
                      <div
                        className="tab-pane"
                        id="pills-dates"
                        role="tabpanel"
                        aria-labelledby="pills-dates-tab"
                      >
                        <div id="daypicker">
                          <DayPicker
                            mode="single"
                            selected={dateSelected}
                            onSelect={setDateSelected}
                            disabled={{ before: new Date() }}
                          />
                        </div>
                        <div
                          className="time-slot"
                          style={{ position: "relative" }}
                        >
                          <div style={{ width: "fit-content" }}>
                            {/* <img style={{ marginRight: "8px", width: "20px", height: "20px", }}
                                src="/images/filters/datepicker/time.svg" loading="lazy" alt="Time Icon" /> */}
                            <TimeRangePicker
                              timeSelected={hoursValue}
                              onChange={handleTimeRangeChange}
                            />
                          </div>
                        </div>
                        <>
                          <button
                            type="submit"
                            className="location-right-btn"
                            onClick={handleValidation}
                          >
                            {buttonText}
                          </button>
                        </>
                      </div>
                    </div>
                    <p className="location-right-btn-after">
                      {getCancelMessage(propertyDetails.cancellation_time)}
                    </p>
                  </div>
                  <div className="location-right-shield">
                    <span className="info-wrap">
                      <img
                        src="/images/create-profile/info.svg"
                        loading="lazy"
                        alt=""
                      />
                      <span className="info-in">
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
              </div>
              <div className="col-lg-8 col-md-6 order-md-first order-lg-first">
                <div className="location-left">
                  <div>
                    <h5
                      style={{
                        display: "inline-block",
                        fontWeight: "600",
                        fontSize: isMobileWidth ? "18px" : "",
                      }}
                    >
                      About the Space
                    </h5>
                    <p>
                      {(() => {
                        const words =
                          propertyDetails?.property_description?.split(/\s+/) ||
                          [];
                        return isExpanded || words.length <= 100
                          ? propertyDetails?.property_description
                          : words.slice(0, 100).join(" ") + "...";
                      })()}
                    </p>

                    {propertyDetails?.property_description?.split(/\s+/)
                      .length > 100 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                          background: "none",
                          color: "#5EE6A0",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          marginTop: "12px",
                        }}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  <hr />

                  <div className="location-left">
                    <h5 className="mb-4">Included in your booking</h5>
                    <div className="location-included">
                      <ul>
                        {propertyDetails?.amenities?.map((item, index) => (
                          <li key={index}>
                            {/* <img src={item.img} alt={item.text} />  */}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <hr />

                  <div
                    className="accordion"
                    id="rulesAccordion"
                    style={{ marginTop: isMobileWidth && "2%" }}
                  >
                    <div>
                      <h5
                        className="mb-3"
                        style={{ fontWeight: "500", color: "#000" }}
                      >
                        Rules
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
                                style={{ padding: "12px" }}
                              >
                                <img
                                  src="/images/location/included/1.svg"
                                  loading="lazy"
                                  alt="Parking Icon"
                                  className="me-2"
                                  style={{ width: "20px", height: "20px" }}
                                />
                                <span className="flex-grow-1">Parking</span>
                                <img
                                  src={`/images/dropdown.svg`}
                                  alt={`Dropdown Icon`}
                                  className="ms-auto"
                                  style={{
                                    width: "12px",
                                    transform:
                                      open === "collapseOne"
                                        ? ""
                                        : "rotate(0deg)",
                                  }}
                                />
                              </button>
                            </h2>
                          </div>
                          {open === "collapseOne" && (
                            <div
                              className="shadow"
                              style={{ borderRadius: "10px" }}
                            >
                              {" "}
                              <div
                                className="accordion-body"
                                style={{
                                  borderRadius: "10px",
                                  // backgroundColor: "#F8F9FA",
                                  margin: "10px",
                                  padding: "10px",
                                }}
                              >
                                {propertyDetails.parking_rules ||
                                  " this is parking rules "}
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
                              onClick={() => toggleAccordion("collapseTwo")}
                              style={{ padding: "12px" }}
                            >
                              <img
                                src="/images/location/included/7.svg"
                                loading="lazy"
                                alt="Host Rules Icon"
                                className="me-2"
                                style={{ width: "20px", height: "20px" }}
                              />
                              <span className="flex-grow-1">Host rules</span>
                              <img
                                src={`/images/dropdown.svg`}
                                alt={`Dropdown Icon`}
                                className="ms-auto"
                                style={{
                                  width: "12px",
                                  transform:
                                    open === "collapseTwo"
                                      ? ""
                                      : "rotate(0deg)",
                                }}
                              />
                            </button>
                          </h2>
                        </div>
                        {open === "collapseTwo" && (
                          <div
                            className="shadow"
                            style={{ borderRadius: "10px" }}
                          >
                            <div
                              className="accordion-body "
                              style={{
                                borderRadius: "10px",
                                // backgroundColor: "#F8F9FA",
                                margin: "10px",
                                padding: "10px",
                              }}
                            >
                              {propertyDetails.host_rules ||
                                "This section describes the host rules in detail."}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr />
                  <h5 style={{ fontSize: isMobileWidth ? "18px" : "" }}>
                    Add-ons from the host
                  </h5>
                  <div className="location-addons">
                    <p>
                      Host provided services, items or options. Available at
                      checkin.
                    </p>
                    <div className="location-addons-in">
                      {propertyDetails?.add_ons
                        ?.slice(
                          0,
                          showPropertyAddOns
                            ? propertyDetails.add_ons.length
                            : 3
                        )
                        .map((item, index) => {
                          // if (index <= 3) {
                          const isSelected = selectedAddons.some(
                            (addon) => addon.name === item.name
                          );

                          return (
                            <div
                              className="location-addons-item"
                              key={index}
                              onClick={() => handleAddonClick(item)}
                              style={{
                                border: isSelected
                                  ? "1px solid #4aeab1"
                                  : "0.5px solid #cdc7c7",
                                width: isMobileWidth ? "100%" : "48%",
                              }}
                            >
                              <h4>
                                {`${item.name}`} <br />
                                <span>
                                  {" "}
                                  ${`${parseFloat(item.price)}`} / Item{" "}
                                </span>
                              </h4>
                            </div>
                          );
                          // }}
                        })}
                    </div>

                    {propertyDetails?.add_ons?.length > 4 && (
                      <a
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => setShowPropertyAddOns((prev) => !prev)}
                      >
                        {showPropertyAddOns ? "Show less" : "Show More"}
                      </a>
                    )}
                    <hr />
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="address-location" style={{}}>
                  <div className="location-left">
                    <h5>Address & Location</h5>
                    {!isMobileWidth && (
                      <p>
                        {" "}
                        <u>{propertyDetails?.address}</u>{" "}
                      </p>
                    )}
                  </div>
                  {propertyDetails?.latitude && propertyDetails?.longitude && (
                    <div
                      className="address-location-map"
                      style={{ position: "relative" }}
                    >
                      <Map
                        lat={propertyDetails?.latitude}
                        lng={propertyDetails?.longitude}
                        locationImg={loactionImg}
                      />
                    </div>
                  )}
                </div>
                {isMobileWidth ? (
                  <div
                    className="location-reviews"
                    style={{ marginTop: "30%" }}
                  >
                    <div className="location-reviews-top">
                      <h1>Reviews ({propertyDetails?.reviews_total_count})</h1>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span style={{ alignContent: "start" }}>
                          <img
                            src="/images/locations-grid/star-icon.svg"
                            loading="lazy"
                            alt="star"
                          />
                          <b>{propertyDetails?.reviews_total_rating}</b> Rating
                        </span>
                        <div
                          className="chat-left-top-dropdown dropdown"
                          style={{ alignItems: "end" }}
                        >
                          <span
                            className="dropdown-toggle"
                            role="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}
                          >
                            Sort by: {selectedFilter}
                            <img
                              src="/images/dropdown.svg"
                              loading="lazy"
                              alt=""
                            />
                          </span>
                          {dropdownOpen && (
                            <div className="chat-left-top-dropdown-list dropdown-menu show">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedFilter("Highest Review");
                                      setDropdownOpen(false);
                                    }}
                                  >
                                    Highest Review
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedFilter("Lowest Review");
                                      setDropdownOpen(false);
                                    }}
                                  >
                                    Lowest Review
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedFilter("Recent Reviews");
                                      setDropdownOpen(false);
                                    }}
                                  >
                                    Recent Reviews
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {filteredReviews?.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        No Review Found
                      </div>
                    ) : (
                      (showMore
                        ? filteredReviews
                        : filteredReviews.slice(0, 2)
                      ).map((item, index) => (
                        <div
                          key={index}
                          className="location-reviews-list"
                          style={{ borderBottom: "1px solid black" }}
                        >
                          <div className="location-reviews-list-left">
                            <img
                              src={`${imageBase}${item?.profile_image}`}
                              loading="lazy"
                              alt="profile_image"
                            />
                            <h2>
                              {item?.reviewer_name} <br />
                              <span>{item?.review_message}</span>
                            </h2>
                          </div>
                          <div className="location-reviews-list-right location-reviews-list-right-mob">
                            <div className="location-reviews-list-right-star">
                              <LocationReviewStars
                                rating={item?.review_rating}
                              />
                            </div>
                            <p>{item?.review_date}</p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* ✅ Show More Button */}
                    {!showMore && filteredReviews.length > 2 && (
                      <button
                        className="location-reviews-btn"
                        type="button"
                        onClick={() => setShowMore(true)}
                      >
                        Show More Reviews
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="location-reviews" style={{ marginTop: "2%" }}>
                    <div className="location-reviews-top">
                      <h1>
                        Reviews ({propertyDetails?.reviews_total_count})
                        <span>
                          <img
                            src="/images/locations-grid/star-icon.svg"
                            loading="lazy"
                            alt=""
                          />
                          <b>{propertyDetails?.reviews_total_rating}</b> Rating
                        </span>
                      </h1>
                      <p className="ms-auto me-1">Sort by:</p>
                      <div className="chat-left-top-dropdown dropdown">
                        <span
                          className="dropdown-toggle"
                          role="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          aria-expanded={dropdownOpen}
                        >
                          {selectedFilter}
                          <img
                            src="/images/dropdown.svg"
                            loading="lazy"
                            alt=""
                          />
                        </span>
                        {dropdownOpen && (
                          <div className="chat-left-top-dropdown-list dropdown-menu show">
                            <ul>
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedFilter("Highest Review");
                                    setDropdownOpen(false);
                                  }}
                                >
                                  Highest Review
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedFilter("Lowest Review");
                                    setDropdownOpen(false);
                                  }}
                                >
                                  Lowest Review
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedFilter("Recent Reviews");
                                    setDropdownOpen(false);
                                  }}
                                >
                                  Recent Reviews
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {filteredReviews?.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        No Review Found
                      </div>
                    ) : (
                      (showMore
                        ? filteredReviews
                        : filteredReviews.slice(0, 2)
                      ).map((item, index) => (
                        <div key={index} className="location-reviews-list">
                          <div className="location-reviews-list-left">
                            <img
                              src={`${imageBase}${item?.profile_image}`}
                              loading="lazy"
                              alt="profile_image"
                            />
                            <h2>
                              {item?.reviewer_name} <br />
                              <span>{item?.review_message}</span>
                            </h2>
                          </div>
                          <div className="location-reviews-list-right location-reviews-list-right-mob">
                            <div className="location-reviews-list-right-star">
                              <LocationReviewStars
                                rating={item?.review_rating}
                              />
                            </div>
                            <p>{item?.review_date}</p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* ✅ Show More Button */}
                    {!showMore && filteredReviews.length > 2 && (
                      <button
                        className="location-reviews-btn"
                        type="button"
                        onClick={() => setShowMore(true)}
                      >
                        Show More Reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="modal fade"
        id="add-wishlist"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add to Wishlist</h2>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body px-4 py-4">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="explore-guides-articles-in">
                    <a>
                      <div className="explore-guides-articles-image">
                        <img
                          src="/images/locations-grid/1.svg"
                          loading="lazy"
                          alt=""
                        />
                      </div>
                      <h3>Sea view</h3>
                      <p>4 saved</p>
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="explore-guides-articles-in">
                    <a>
                      <div className="explore-guides-articles-image">
                        <img
                          src="/images/locations-grid/2.svg"
                          loading="lazy"
                          alt=""
                        />
                      </div>
                      <h3>Cabin in Peshastin</h3>
                      <p>4 saved</p>
                    </a>
                  </div>
                </div>
                <div className="explore-guides-articles-wrap-btn">
                  <a
                    href="#"
                    data-bs-dismiss="modal"
                    data-bs-target="#create-wishlist"
                    data-bs-toggle="modal"
                  >
                    Create Wishlist
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade custom-modal"
        id="create-wishlist"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Wishlist</h2>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body px-4 py-4">
              <form onSubmit={handleSubmit}>
                <p>Please Enter the name</p>
                <label>
                  <input type="text" className="ps-3" placeholder="Name" />
                </label>
                <textarea disabled value="Description" />
                <p>Max 50 characters</p>
                <div className="custom-modal-label d-flex gap-3">
                  <input type="submit" value="Create" data-bs-dismiss="modal" />
                  <input type="reset" className="cancel-btn" value="Clear" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AddToWishlistModal
        wishlistArr={wishlistArr}
        showAddWishlistModal={showAddWishlistModal}
        propertyId={propertyId}
        userId={userId}
        handleClose={() => {
          setShowAddWishlistModal(false);
        }}
      />

      <LocationImagesModal
        show={showPropertyImages}
        handleClose={() => setShowPropertyImages(false)}
        images={propertyDetails?.images}
      />

      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
      <AuthModal />

      <RegisterModal
        show={isRegisterModalOpen}
        onHide={() => handleModalToggle("register", false)}
        CallBack={(bool) => setIsRegisterModalOpen(bool)}
        loginModal={registerModal}
        ToggleVal={(bool) => setRegisterModal(bool)}
      />

      <RegisterModal
        show={isLoginModalOpen}
        onHide={() => handleModalToggle("login", false)}
        CallBack={(bool) => setIsLoginModalOpen(bool)}
        loginModal={modalToggleValue}
        ToggleVal={(bool) => setModalToggleValue(bool)}
      />
    </>
  );
}

export default Location;
