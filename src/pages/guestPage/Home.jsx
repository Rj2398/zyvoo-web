import React, { useEffect, useMemo, useState } from "react";
import HomeHeader from "../../components/guest/HomeHeader";
import Footer from "../../components/guest/Footer";

import { KEYS } from "../../config/Constant";
import useCommon from "../../hooks/useCommon";
import Header from "../../components/host/Header";
import Sorry from "../../components/NoResultsFound";

import Pagination from "../../components/guest/Pagination";
import ProductItem from "../../components/guest/ProductItem";

import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import BookingExtensionModal from "../../components/guest/bookingDetailsModal/BookingExtensionModal";
import MultipleMarkerMap from "../../components/guest/MultipleMarkerMap";

import Loader2 from "../../components/Loader2";
import useTimer from "../../hooks/useTimers";
import MobFooter from "../../components/MobFooter";
import { Link } from "react-router-dom";

const Home = () => {
  const { userInfo } = useSelector(({ user }) => user);
  const { guestHomeData, isLoading } = useCommon();
  const { getTimerDetails } = useTimer();
  const [showMap, setShowMap] = useState(false);

  const selectorData = useSelector((state) => state.common);
  const localSaved =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const login_id = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || localSaved?.user_id
    ? String(localSaved?.user_id)
    : null;
  const [useTypes, setUserTypes] = useState(
    localStorage.getItem(KEYS.USER_TYPE)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({});

  const itemsPerPage = 16;
  const [localHomeList, setLocalHomeList] = useState([]);
  const [locationClear, setLocationClear] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

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
    if (!currentLocation?.latitude) {
      getLocation();
    }
  }, [currentLocation?.latitude, currentLocation]);

  //   useEffect(() => {
  //   if (!("geolocation" in navigator)) return;

  //   const watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       setCurrentLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     },
  //     (error) => console.error(error.message),
  //     {
  //       enableHighAccuracy: true,
  //       maximumAge: 0,
  //     }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);

  const fetchList = async () => {
    console.log(locationClear, "locationClearlocationClear");
    try {
      const res = await guestHomeData({
        user_id: login_id || "",
        latitude: locationClear ? null : currentLocation?.latitude,
        longitude: locationClear ? null : currentLocation?.longitude,
      });
    } catch (error) {
      console.error("Error fetching guest home data:", error);
    }
  };

  // const fetchList = async () => {
  //   try {

  //     locationClear= true // then send null lat long
  //     // Check if we have valid coordinates
  //     const hasLocation =
  //       currentLocation?.latitude && currentLocation?.longitude;

  //     const res = await guestHomeData({
  //       user_id: login_id || "",
  //       // If location exists, send it. Otherwise, send null.
  //       latitude: hasLocation ? currentLocation.latitude : null,
  //       longitude: hasLocation ? currentLocation.longitude : null,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching guest home data:", error);
  //   }
  // };

  useEffect(() => {
    // set data in userType & listshowMap
    const handleStorageChange = () => {
      setUserTypes(localStorage.getItem(KEYS.USER_TYPE));
    };

    fetchList();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentLocation?.latitude, currentLocation?.longitude, currentLocation]);

  useEffect(() => {
    if (selectorData?.guestHomeData && selectorData.guestHomeData.length > 0) {
      setLocalHomeList(selectorData.guestHomeData);
    } else {
      setLocalHomeList([]); // 💡 Clear the local state if global data is empty or missing
    }
  }, [
    selectorData?.guestHomeData,
    currentLocation?.latitude,
    currentLocation?.longitude,
  ]);
  // useEffect(() => {
  //   if (selectorData?.guestHomeData) {
  //     setLocalHomeList(selectorData?.guestHomeData);
  //   }
  // }, [selectorData, currentLocation?.latitude, currentLocation, localHomeList]);

  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const totalPages = Math.ceil(localHomeList.length / itemsPerPage);
  const [onGoingTime, setOngoingTime] = useState(null);
  const [RemainTime, setRemainTime] = useState(); // Initially undefined
  const [timeDifference, setTimeDifference] = useState(null);
  const [initialTime, setInitialTime] = useState(0);
  const [originalDifference, setOriginalDifference] = useState(null); // NEW

  const [datePart1 = "", timePart1 = ""] = onGoingTime
    ? onGoingTime.split(" ")
    : []; // Safely split onGoingTime
  const [datePart = "", timePart = ""] = RemainTime
    ? RemainTime.split(" ")
    : []; // Safely split RemainTime (handles undefined/null cases)

  // Calculate time difference whenever onGoingTime or RemainTime changes
  useEffect(() => {
    if (datePart1 && timePart1 && datePart && timePart) {
      if (datePart1 === datePart) {
        // Convert time strings (HH:MM:SS) into total seconds
        const getTimeInSeconds = (timeStr) => {
          const [hours = 0, minutes = 0, seconds = 0] = timeStr
            .split(":")
            .map(Number);
          return hours * 3600 + minutes * 60 + seconds;
        };

        const time1InSeconds = getTimeInSeconds(timePart1);
        const time2InSeconds = getTimeInSeconds(timePart);

        const differenceInSeconds = time1InSeconds - time2InSeconds;

        if (differenceInSeconds === 18) {
          setShowModal(true);
        }

        setTimeDifference(differenceInSeconds);
        setOriginalDifference(differenceInSeconds); // NEW
        setInitialTime(Math.abs(differenceInSeconds));
      } else {
        setTimeDifference("time is not available");
        setInitialTime(0);
      }
    }
  }, [onGoingTime, RemainTime]);

  // Timer logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [angle, setAngle] = useState(-90);
  const radius = 150;

  useEffect(() => {
    if (initialTime < 0) return;
    // Initialize timeLeft with the full duration
    setTimeLeft({
      hours: Math.floor(initialTime / 3600),
      minutes: Math.floor((initialTime % 3600) / 60),
      seconds: initialTime % 60,
    });

    let totalSeconds = initialTime;
    let timer;

    if (totalSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const totalRemainingSeconds =
            prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds;
          if (totalRemainingSeconds <= 0) {
            clearInterval(timer);
            return { hours: 0, minutes: 0, seconds: 0 };
          }

          const newAngle =
            -90 + (1 - totalRemainingSeconds / totalSeconds) * 90;
          setAngle(newAngle);

          const newSeconds = (totalRemainingSeconds - 1) % 60;
          const newMinutes = Math.floor((totalRemainingSeconds - 1) / 60) % 60;
          const newHours = Math.floor((totalRemainingSeconds - 1) / 3600);

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [initialTime]);

  useEffect(() => {
    if (originalDifference !== null) {
      const currentTotalSeconds =
        timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;

      if (currentTotalSeconds === originalDifference - 20) {
        setShowModal(true); // Show modal at 20 seconds left
      }
    }
  }, [timeLeft, originalDifference]);

  // Convert angle to radians for smooth movement
  const radians = (angle * Math.PI) / 180;
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);

  // const paginatedData =isMobileWidth?localHomeList: localHomeList.slice((currentPage - 1) * itemsPerPage,currentPage * itemsPerPage);
  const paginatedData = useMemo(() => {
    if (isMobileWidth) return localHomeList;
    return localHomeList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [localHomeList, currentPage, isMobileWidth]);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  //get provided time formate
  useEffect(() => {
    if (!login_id) return;

    const getDetails = async () => {
      try {
        const currentDate = new Date(); // Get current local date and time
        const formatted = formatDateToMySQL(currentDate);
        const booking_date = currentDate.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
        setRemainTime(formatted);

        const response = await getTimerDetails({
          user_id: login_id,
          booking_date,
          booking_start: formatted,
        });

        if (response?.data) {
          const { bookings } = response.data;

          if (Array.isArray(bookings) && bookings.length > 0) {
            const bookingEnd = bookings[0].booking_end;
            setOngoingTime(bookingEnd);
          }

          setBookingDetails(response.data);
        } else {
          console.warn("No data found in timer response");
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An unknown error occurred";
        console.error("Error from getTimerDetails:", errorMessage);
      }
    };
    getDetails();
  }, [login_id]);

  function formatDateToMySQL(datetime) {
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, "0");
    const day = String(datetime.getDate()).padStart(2, "0");
    const hours = String(datetime.getHours()).padStart(2, "0");
    const minutes = String(datetime.getMinutes()).padStart(2, "0");
    const seconds = String(datetime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
        backgroundSize: "20px 20px",
        position: "relative",
      }}
    >
      {useTypes === "guest" || !login_id ? (
        <HomeHeader
          showMap={showMap}
          setShowMap={setShowMap}
          callback={(txt) => setLocationClear(txt)}
        />
      ) : (
        <Header />
      )}

      <main className="home-main">
        <div className="mob-show-map animate__animated animate__backInUp animate__delay-1s">
          <Link to="#" onClick={() => setShowMap(!showMap)}>
            <img
              src="/images/filters/show-map.svg"
              loading="lazy"
              alt="Show Map"
            />
            {showMap ? "Show list" : "Show Map"}
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Container fluid>
            <Row>
              {/* <Loader2 visible={isLoading} /> */}
              {/* {(!paginatedData || paginatedData.length === 0) && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "250px" }}><Sorry /></div>} */}
              {isLoading ? (
                <Loader2 />
              ) : !paginatedData || paginatedData.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "250px",
                  }}
                >
                  <Sorry />
                </div>
              ) : null}
              {isMobileWidth && showMap ? (
                <></>
              ) : (
                <Col lg={showMap ? 7 : 12} md={showMap ? 8 : 12} sm={12}>
                  <Row
                    style={{
                      margin: "0 -12px",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {paginatedData?.map((item) => (
                      <Col
                        key={item?.property_id}
                        xl={showMap ? 6 : 3}
                        lg={showMap ? 6 : 4}
                        md={6}
                        sm={12}
                        style={{
                          padding: "12px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "400px",
                            borderRadius: "18px",
                            overflow: "hidden",
                            background: "#fff",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.001)",
                          }}
                        >
                          <ProductItem
                            hourly_rate={item?.hourly_rate}
                            distance_miles={item?.distance_miles}
                            images={item?.images}
                            is_in_wishlist={item?.is_in_wishlist}
                            is_instant_book={item?.is_instant_book}
                            property_id={item?.property_id}
                            rating={item?.rating}
                            title={item?.title}
                            reviewCount={item?.review_count}
                            hosted_by={item?.host_name}
                            hostImg={item?.host_profile_image}
                            address={item?.host_address}
                            award={item?.is_star_host}
                            currentLocation={
                              currentLocation?.latitude && currentLocation
                            }
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              )}
              {showMap && (
                <Col
                  lg={5}
                  md={4}
                  sm={12}
                  style={{
                    position: "sticky",
                    top: 0,
                    height: "80vh",
                    borderRadius: "500px",
                  }}
                >
                  <MultipleMarkerMap
                    locations={localHomeList}
                    currentLocation={currentLocation}
                    isMobileWidth={isMobileWidth}
                  />
                </Col>
              )}
            </Row>
          </Container>
        </div>

        {isMobileWidth && showMap ? (
          <></>
        ) : (
          <div className="home-pagination-wrap">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="time-and-pagination">
                    {bookingDetails &&
                      Object.keys(bookingDetails).length > 0 && (
                        <div
                          className="time-countdown"
                          style={{ position: "relative" }}
                        >
                          <button type="button" className="need-more-time-btn">
                            <div className="time-countdown-inner desktop-tablet-countdown">
                              <div className="time-countdown-data">
                                <h2>Time Left</h2>
                                <div className="countdown" id="countdown1">
                                  <div className="time-section">
                                    <div className="hours1">
                                      {String(timeLeft.hours).padStart(2, "0")}
                                    </div>
                                    <div className="label">Hour</div>
                                  </div>
                                  <div className="time-section">
                                    <div className="minutes1">
                                      {String(timeLeft.minutes).padStart(
                                        2,
                                        "0"
                                      )}
                                    </div>
                                    <div className="label">Min</div>
                                  </div>
                                  <div className="time-section">
                                    <div className="seconds1">
                                      {String(timeLeft.seconds).padStart(
                                        2,
                                        "0"
                                      )}
                                    </div>
                                    <div className="label">Sec</div>
                                  </div>
                                </div>
                              </div>

                              {/* Circular Motion Icon */}
                              <div
                                id="icon-container"
                                style={{
                                  position: "relative",
                                  width: "100%",
                                  height: "100%",
                                }}
                              >
                                <img
                                  id="icon"
                                  src="/images/time-countdown/timer-logo.svg"
                                  loading="lazy"
                                  alt="Icon"
                                  style={{
                                    position: "absolute",
                                    width: "40px",
                                    height: "40px",
                                    top: `calc(50% + ${y}px - 100px)`,
                                    left: `calc(50% + ${x}px - 10px)`,
                                    zIndex: 10,
                                    transition: "top 1s linear, left 1s linear",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setShowModal(true)} // Open modal on click
                                />
                              </div>

                              <img
                                id="countdown-bg"
                                src="/images/time-countdown/timer.svg"
                                loading="lazy"
                                alt="countdown"
                              />
                            </div>
                          </button>

                          {showModal && (
                            <BookingExtensionModal
                              show={showModal}
                              handleClose={() => setShowModal(false)}
                              bookingDetails={bookingDetails}
                            />
                          )}
                        </div>
                      )}

                    {!isMobileWidth && (
                      <div className="home-pagination-wrap">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-lg-12">
                              {
                                <Pagination
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  onPageChange={setCurrentPage}
                                />
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isMobileWidth && showMap ? (
          <></>
        ) : (
          <button className="need-more-time-btn" type="button">
            {bookingDetails && Object.keys(bookingDetails).length > 0 && (
              <div className="time-countdown-inner mobile-countdown">
                <div className="time-countdown-data">
                  <h2>Time Left</h2>
                  <div className="countdown" id="countdown2">
                    <div className="time-section">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="time-section">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="time-section">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                  </div>
                </div>
                <div id="icon-container" onClick={() => setShowModal(true)}>
                  <img
                    id="icon"
                    src="/images/time-countdown/timer-logo.svg"
                    loading="lazy"
                    alt="Icon"
                  />
                </div>
                <img
                  id="countdown-bg"
                  src="/images/time-countdown/timer-mobile.svg"
                  loading="lazy"
                  alt="timer-mobile"
                />
              </div>
            )}
          </button>
        )}
      </main>
      <Footer />
      <MobFooter />
    </div>
  );
};

export default Home;
