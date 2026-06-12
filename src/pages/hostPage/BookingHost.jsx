import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Image,
  Dropdown,
  FormControl,
  InputGroup,
  Container,
  Modal,
} from "react-bootstrap";
import { MdOutlineMyLocation } from "react-icons/md";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaStar } from "react-icons/fa";
import useBook from "../../hooks/host/useBook";
import { imageBase, KEYS } from "../../config/Constant";
import LocationReviewStars from "../../components/guest/LocationReviewStars";
import ReportBookingModal from "../../components/host/ReportBookingModal";
import { data, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOneToOneChatData } from "../../store/slices/hostuserSlice";
import ShareModal from "../../components/guest/bookingDetailsModal/ShareModal";
import ReviewBookingPopup from "../../components/host/ReviewBookingPopup";
import { toast } from "react-toastify";
import AddToWishlistModal from "../../components/guest/wishlistModals/AddToWishlistModal";
import useCommon from "../../hooks/useCommon";
import MessageHost from "../../components/guest/bookingDetailsModal/MessageHost";
import Map from "../../components/guest/Map";
import CancelPopup from "../../components/guest/bookingDetailsModal/CancelPopup";
import Loader2 from "../../components/Loader2";
import LocationImagesModal from "../../components/guest/LocationImagesModal";
import MobFooter from "../../components/MobFooter";
import locationImg from "../../assets/locationImg.png";
import { IoSearch } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";

const BookingHost = () => {
  const { userInfo } = useSelector(({ user }) => user);
  const {
    getBookingHost,
    updateBookingStatus,
    getBookingGuest,
    getBookingDetails,
    getGuestBookingDetails,
    FilterPropertyReview,
    hostReportViolation,
    fetchGuestReview,
    isLoading,
  } = useBook();
  const { guestWishlistData, removeItemFromWishlist } = useCommon();
  const dispatch = useDispatch();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [getList, setGetList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [showDiv, setShowDiv] = useState(false);
  const [isMessageClick, setIsMessageClick] = useState(false);
  const [showPropertyImages, setShowPropertyImages] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddWishlistModal, setShowAddWishlistModal] = useState(false);
  const [wishlistArr, setWishlistArr] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDetails, setViewDetails] = useState();

  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userType = localStorage.getItem(KEYS.USER_TYPE);
  const userId = userInfo?.user_id || userData?.user_id;
  const access_token = userInfo?.token || userData?.access_token;

  const [open, setOpen] = useState(null);
  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };

  const [reviews, setReviews] = useState([]);
  const [reviewPagination, setReviewPagination] = useState([]);
  const [page, setPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState("highest_review");
  const [propertyId, setPropertyId] = useState(null);
  const [count, setCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [guestReview, setGuestReview] = useState(null);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      const w = window.innerWidth;
      // mobile if width is >= 320px and <= 780px
      setIsMobileWidth(w >= 320 && w <= 780);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const filterLabel = {
    recent_review: "Recent Reviews",
    highest_review: "Highest Review",
    lowest_review: "Lowest Review",
  };

  const guestReviewDetail = async (data) => {
    const response = await fetchGuestReview({ user_id: data?.user_id });
    if (response?.success) {
      setGuestReview(response?.data?.total_rating);
    }
  };

  useEffect(() => {
    if (page != 1) {
      const fetchPropertyReviews = async () => {
        const reviewsResp = await FilterPropertyReview({
          property_id: propertyId,
          filter: reviewFilter,
          page,
        });
        if (reviewsResp?.data?.length == 0) {
          setShowMoreBtn(false);
        }
        const updatedReviews = reviews.concat(reviewsResp.data);
        setReviews(updatedReviews);
        setReviewPagination(reviewsResp?.pagination);
      };
      fetchPropertyReviews();
    }
  }, [page]);

  const handleOpenModal = () => setShowCancelModal(true);
  const handleCancel = () => setShowCancelModal(false);

  useEffect(() => {
    if (count > 0) {
      setPage(1);
      const fetchPropertyReviews = async () => {
        const reviewsResp = await FilterPropertyReview({
          property_id: propertyId,
          filter: reviewFilter,
          page,
        });
        setReviews(reviewsResp.data);
        setReviewPagination(reviewsResp?.pagination);
        setPage(1);
      };
      fetchPropertyReviews();
    }
  }, [reviewFilter]);

  const handleWishlistClick = async () => {
    if (userId && access_token) {
      if (viewDetails?.is_in_wishlist || viewDetails?.wishlist) {
        await removeItemFromWishlist({
          user_id: userId,
          property_id: propertyId,
        });
      } else {
        setShowAddWishlistModal(true);
      }
      setRefresh((prev) => prev + 1);
      getWishlist();
      setPropertyId(propertyId);
      // fetchDetailsData(viewDetails);
      userType == "host"
        ? fetchDetailsData(selectedBooking)
        : fetchGuestDetailsData(selectedBooking);
    }
  };

  useEffect(() => {
    fetchBookingList();
  }, [userType, userId]);

  useEffect(() => {
    getWishlist();
  }, []);

  const fetchBookingList = async () => {
    try {
      const response = await (userType == "host"
        ? getBookingHost({ user_id: userId })
        : getBookingGuest({ user_id: userId }));
      if (response) {
        setGetList(response?.data);
      }
    } catch (error) {
      console.error("Error fetching booking list:", error);
    }
  };

  const getWishlist = async () => {
    const wishlistData = await guestWishlistData({ user_id: userId });
    setWishlistArr(wishlistData?.data);
  };

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
  }, [currentLocation.latitude, currentLocation.longitude]);

  const filteredBookings = useMemo(() => {
    return userType == "host"
      ? getList?.filter((booking) => {
        const matchesName = booking?.guest_name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase());
        const matchesStatus = selectedStatus
          ? booking?.booking_status == selectedStatus
          : true;
        return matchesName && matchesStatus;
      })
      : getList?.filter((booking) => {
        const matchesName = booking?.property_name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase());
        const matchesStatus = selectedStatus
          ? booking?.booking_status == selectedStatus
          : true;
        return matchesName && matchesStatus;
      });
  }, [getList, searchQuery, selectedStatus, userType]);

  const fetchDetailsData = async (bookingData) => {
    try {
      const response = await getBookingDetails({
        booking_id: bookingData?.booking_id,
        ...(bookingData?.extension_id && {
          extension_id: bookingData.extension_id,
        }),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      if (response) {
        let view_details = response?.data;
        let property_id = view_details?.property_id;
        setViewDetails(view_details);
        setPropertyId(property_id);
        const reviewsResp = await FilterPropertyReview({
          property_id,
          filter: reviewFilter,
          page: 1,
        });

        setReviews(reviewsResp.data);
        setReviewPagination(reviewsResp?.pagination);
        setPage(1);
      }
    } catch (error) {
      console.error(error, "error response");
    }
  };

  const fetchGuestDetailsData = async (bookingData) => {
    try {
      const response = await getGuestBookingDetails({
        booking_id: selectedBooking?.booking_id,
        user_id: userId,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      if (!response) return;

      const view_details = response?.data;
      const property_id = view_details?.property_id;

      setViewDetails(view_details);
      setPropertyId(property_id);

      const reviewsResp = await FilterPropertyReview({
        property_id,
        filter: reviewFilter,
        page: 1,
      });

      setReviews(reviewsResp.data);
      setReviewPagination(reviewsResp?.pagination);
      setPage(1);
    } catch (error) {
      console.error(error, "error response");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBooking) return;
      if (userType == "host") {
        fetchDetailsData(selectedBooking);
        guestReviewDetail(selectedBooking);
      } else {
        fetchGuestDetailsData(selectedBooking);
        //   const response = await getGuestBookingDetails({
        //     booking_id: selectedBooking?.booking_id, user_id: userId,
        //     latitude: currentLocation.latitude, longitude: currentLocation.longitude,
        //   });

        //   if (!response) return;

        //   const view_details = response?.data;
        //   const property_id = view_details?.property_id;

        //   setViewDetails(view_details);
        //   setPropertyId(property_id);

        //   const reviewsResp = await FilterPropertyReview({
        //     property_id,
        //     filter: reviewFilter,
        //     page: 1,
        //   });

        //   setReviews(reviewsResp.data);
        //   setReviewPagination(reviewsResp?.pagination)
        //   setPage(1);
        // }
      }
    };

    fetchData();
  }, [selectedBooking]);

  useEffect(() => {
    if (bookingId && getList) {
      const filteredBooking = getList.find(
        (item) => item.booking_id == bookingId
      );
      setSelectedBooking(filteredBooking);
    }
  }, [bookingId, getList]);

  function formatCurrency(value) {
    const number = parseFloat(value);

    if (isNaN(number)) return "0";
    return number % 1 === 0
      ? number.toLocaleString("en-IN", { maximumFractionDigits: 0 }) // Integer
      : number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }); // Decimal
  }

  function formatReview(value) {
    const num = Number(value);
    if (isNaN(num)) return ""; // handle invalid inputs
    // return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
    num.toFixed(1);
  }

  const [approveDeclineModal, setApproveDeclineModal] = useState({
    show: false,
    status: null,
    data: null,
  });

  const openApproveDeclineModal = (status, booking) => {
    setApproveDeclineModal({ show: true, status: status, data: booking });
  };

  const closeApproveDeclineModal = () => {
    setApproveDeclineModal({ show: false, status: null, data: null });
  };

  const handleStatusUpdate = async ({ data, status, message }) => {
    try {
      const response = await updateBookingStatus({
        booking_id: data.booking_id,
        extension_id: data?.extension_id,
        status: status,
        message: message,
      });

      if (response) {
        fetchBookingList(); // Refresh after update
        closeApproveDeclineModal();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const truncateText = (text, limit) =>
    text?.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <>
      <Loader2 visible={isLoading} />
      <div
        className="container-fluid d-flex justify-content-center"
        style={{ padding: isMobileWidth ? "0px" : "" }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "25px",
            marginTop: isMobileWidth ? "2px" : "16px",
          }}
        >
          {/* First Row */}
          <div
            className="mb-4 booking-left-sid-box"
          // style={{
          //   width: "100%",
          //   minWidth: "300px",
          //   boxSizing: "border-box",
          //   overflowY: !isMobileWidth &&"auto",
          //   padding: isMobileWidth ? "0px" : "10px",
          //   maxWidth: isMobileWidth ? undefined : "380px",
          //   maxHeight: isMobileWidth ? undefined : "calc(110vh)",
          //   marginBottom: isMobileWidth ? "0px" : "20px",
          //   flex: isMobileWidth ? "1 0 100%" : "1 0 400px",
          //   }}
          >
            {!isMobileWidth && (
              <>
                {!showSearch ? (
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ minWidth: "100%", padding: "0 13px" }}
                  >
                    <div
                      className="d-flex align-items-center gap-1"
                      style={{ color: "#000000", cursor: "pointer" }}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <div>All Bookings</div>
                      <img
                        src={"/images/dropdown.svg"}
                        style={{
                          cursor: "pointer",
                          marginLeft: 5,
                          width: "12px",
                        }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      />
                      {/* <RiArrowDropDownLine style={{ fontSize:"30px" }}  /> */}
                    </div>
                    <IoSearch
                      onClick={() => setShowSearch(true)}
                      style={{ marginRight: 5, fontSize: "20px" }}
                    />
                    {showDropdown && (
                      <Dropdown.Menu
                        show
                        style={{ top: "140px", zIndex: 1000 }}
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedStatus("");
                            setShowDropdown(false);
                            setViewDetails(null);
                            setSelectedBooking(null);
                          }}
                          style={{ margin: isMobileWidth && "10px" }}
                        >
                          All Bookings
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            setSelectedStatus("Confirmed");
                            setShowDropdown(false);
                            setViewDetails(null);
                            setSelectedBooking(null);
                          }}
                          style={{ margin: isMobileWidth && "10px" }}
                        >
                          Confirmed
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            setSelectedStatus("Pending");
                            setShowDropdown(false);
                            setViewDetails(null);
                            setSelectedBooking(null);
                          }}
                          style={{ margin: isMobileWidth && "10px" }}
                        >
                          Pending
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            setSelectedStatus("Finished");
                            setShowDropdown(false);
                            setViewDetails(null);
                            setSelectedBooking(null);
                          }}
                          style={{ margin: isMobileWidth && "10px" }}
                        >
                          Finished
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            setSelectedStatus("Cancelled");
                            setShowDropdown(false);
                            setViewDetails(null);
                            setSelectedBooking(null);
                          }}
                          style={{ margin: isMobileWidth && "10px" }}
                        >
                          Cancelled
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  </div>
                ) : (
                  <InputGroup style={{ width: "100%" }}>
                    <FormControl
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      style={{
                        outline: "none",
                        boxShadow: "none",
                        borderColor: "#e4e4e4",
                        borderRightColor: "#6c757d",
                      }}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowSearch(false)}
                    >
                      {" "}
                      X{" "}
                    </Button>
                  </InputGroup>
                )}
              </>
            )}

            {isMobileWidth && (
              <div
                className="d-flex align-items-center justify-content-end"
                style={{
                  minWidth: "100%",
                  borderTop: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                  padding: " 20px 20px 20px 0px",
                  marginTop: "0px",
                  position: "sticky",
                  top: "0px",
                  zIndex: "1000",
                  backgroundColor: "#fff",
                }}
              >
                {/* <div className="mob-search-filter-in"> */}
                {userType === "host" ? (
                  <div className="mob-search-bar-back">
                    <form action="" onSubmit={(e) => e.preventDefault()}>
                      <label>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                          <i className="fa-regular fa-magnifying-glass"></i>
                        </button>
                      </label>
                    </form>

                    <img
                      src="/images/mobile/filters/filter.svg"
                      onClick={() => setShowDropdown(!showDropdown)}
                      alt="Filter"
                      loading="lazy"
                      // style={{ cursor: "pointer", border: '1px solid #ccc', borderRadius: "50%",padding: "10px" }}
                      style={{ height: "18px", width: "18px" }}
                    />
                  </div>
                ) : (
                  <img
                    src="/images/mobile/filters/filter.svg"
                    onClick={() => setShowDropdown(!showDropdown)}
                    loading="lazy"
                    alt="Filter"
                    style={{
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      borderRadius: "50%",
                      padding: "10px",
                    }}
                  />
                )}

                {/* </div> */}

                {showDropdown && (
                  <Dropdown.Menu
                    show
                    style={{ top: 60, right: 5, zIndex: 1000 }}
                  >
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedStatus("");
                        setShowDropdown(false);
                        setViewDetails(null);
                        setSelectedBooking(null);
                      }}
                    >
                      All Bookings
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => {
                        setSelectedStatus("Confirmed");
                        setShowDropdown(false);
                        setViewDetails(null);
                        setSelectedBooking(null);
                      }}
                    >
                      Confirmed
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => {
                        setSelectedStatus("Pending");
                        setShowDropdown(false);
                        setViewDetails(null);
                        setSelectedBooking(null);
                      }}
                    >
                      {userType == "guest" ? "Pending" : "Booking Request"}
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => {
                        setSelectedStatus("Finished");
                        setShowDropdown(false);
                        setViewDetails(null);
                        setSelectedBooking(null);
                      }}
                    >
                      Finished
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => {
                        setSelectedStatus("Cancelled");
                        setShowDropdown(false);
                        setViewDetails(null);
                        setSelectedBooking(null);
                      }}
                    >
                      Cancelled
                    </Dropdown.Item>

                    {userType == "host" && (
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedStatus("Awaiting Payment");
                          setShowDropdown(false);
                          setViewDetails(null);
                          setSelectedBooking(null);
                        }}
                      >
                        Awaiting Payment
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                )}
              </div>
            )}
            {filteredBookings?.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <div
                  className="chat-list"
                  id="v-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                  key={index}
                  style={{
                    minWidth: "150px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "0 10px",
                  }}
                >
                  <button
                    style={{
                      borderRadius: "15px",
                      border: "2px solid ",
                      boxSizing: "border-box",
                      backgroundColor:
                        selectedBooking?.booking_id === booking.booking_id &&
                          selectedBooking?.extension_id == booking?.extension_id
                          ? "#f0f0f0"
                          : "white",
                      borderColor:
                        selectedBooking?.booking_id === booking.booking_id &&
                          selectedBooking?.extension_id == booking?.extension_id
                          ? "#3A4B4C"
                          : "#E4E4E4",
                    }}
                    className={`chat-list-in nav-link2 ${selectedBooking?.booking_id === booking.booking_id &&
                      selectedBooking?.extension_id == booking?.extension_id
                      ? "active"
                      : ""
                      }`}
                    id={`v-pills-${index}-tab`}
                    data-bs-toggle="pill"
                    type="button"
                    role="tab"
                    data-bs-target={`#v-pills-${index}`}
                    aria-controls={`v-pills-${index}`}
                    aria-selected={
                      selectedBooking?.booking_id === booking.booking_id &&
                      selectedBooking?.extension_id == booking?.extension_id
                    }
                    onClick={() => {
                      setShowDiv(true);
                      setSelectedBooking(booking);
                      dispatch(setOneToOneChatData(booking));
                    }}
                  >
                    <span
                      style={{
                        padding: isMobileWidth ? "6px 4px 4px 6px" : 0,
                        display: "flex",
                        flexWrap: "nowrap",
                        borderRadius: "10px",
                        maxWidth: "600px",
                        // marginBottom: "10px",
                      }}
                    >
                      <div
                        className="chat-list-in-image p-0 border-0 rounded-1"
                        style={{
                          overflow: "hidden",
                          width: isMobileWidth ? "90px" : "110px",
                          height: isMobileWidth ? "80px" : "100px",
                        }}
                      >
                        <div className="h-100 p-0 border-0 rounded-1">
                          <img
                            src={
                              userType === "host"
                                ? booking.guest_avatar
                                  ? `${imageBase}${booking.guest_avatar}`
                                  : "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg"
                                : booking?.property_image
                                  ? `${imageBase}${booking.property_image}`
                                  : "https://he.cecollaboratory.com/public/layouts/images/community-default-logo.png"
                            }
                            style={{
                              border: isMobileWidth
                                ? userType == "host"
                                  ? "2px solid #ccc"
                                  : "none"
                                : "",
                              padding: isMobileWidth
                                ? userType == "host"
                                  ? "3px"
                                  : "0px"
                                : "3px",
                              borderRadius: isMobileWidth
                                ? userType == "host"
                                  ? "50%"
                                  : "15px"
                                : "20px",
                              width: isMobileWidth ? "70px" : "",
                              height: isMobileWidth ? "70px" : "",
                            }}
                            alt={
                              userType === "host"
                                ? booking.guest_name
                                : booking?.property_name
                            }
                          />

                          {booking?.extension_id && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "0px",
                                right: "0px",
                                width: "max-content",
                                height: "max-content",
                                borderRadius: "50%",
                                backgroundColor: "#4AEAB1",
                                padding: "5px",
                                fontSize: "12px",
                              }}
                            >
                              BTE
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="chat-list-in-content">
                        <h1
                          style={{
                            fontSize: isMobileWidth ? "14px" : "18px",
                            marginBottom: "5px",
                            wordBreak: "break-word",
                            paddingTop: "5px",
                            // whiteSpace: "normal",
                            // overflow: "visible",
                            // textOverflow: "unset",
                            // fontWeight: "400",
                            // color: "#000000",
                          }}
                        >
                          {userType === "host"
                            ? truncateText(booking.guest_name?.trim(), 15) ||
                            "No Name"
                            : truncateText(
                              booking?.property_name?.trim(),
                              15
                            ) || "No Name"}
                        </h1>
                        <h2
                          style={
                            {
                              // fontSize: "16px", color: "#A4A4A4", marginBottom: "15px", fontWeight: "400px"
                            }
                          }
                        >
                          {!isMobileWidth && (
                            <span>{booking.booking_date}</span>
                          )}
                        </h2>
                        {userType == "host" &&
                          booking.booking_status == "Pending" ? (
                          <div style={{ display: "flex", gap: "3px" }}>
                            {/* {booking.is_approve && ( */}
                            <button
                              // className="btn btn-sm btn-success "
                              style={{
                                borderRadius: "25px",
                                fontWeight: "500",
                                padding: "5px 15px",
                                border: "1px solid #00BF7B",
                                color: "#00BF7B",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openApproveDeclineModal("approve", booking);
                              }}
                            >
                              Approve
                            </button>
                            {/* )} */}

                            <button
                              // className="btn btn-sm btn-danger"
                              style={{
                                border: "1px solid #FF1A00",
                                color: "#FF1A00",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                                borderRadius: "25px",
                                padding: "5px 15px",
                                fontWeight: "400",
                                fontSize: "14px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openApproveDeclineModal("decline", booking);
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span
                            className="booking-tag"
                            style={{
                              backgroundColor:
                                booking.booking_status?.toLowerCase() ===
                                  "confirmed"
                                  ? "#85D6FF"
                                  : booking.booking_status?.toLowerCase() ===
                                    "pending"
                                    ? "#ffc107"
                                    : booking.booking_status?.toLowerCase() ===
                                      "finished"
                                      ? "#4AEAB1"
                                      : booking.booking_status?.toLowerCase() ===
                                        "awaiting payment"
                                        ? "#FFF178"
                                        : "#F5F6F6",
                              fontSize: isMobileWidth ? "12px" : "16px",
                              // padding: "5px 15px",
                              // borderRadius: "20px",
                              // fontWeight: "500",
                              // color: "#3A4B4C",
                              // width: "fit-content",
                            }}
                          >
                            {booking.booking_status}
                          </span>
                        )}

                        {isMobileWidth && (
                          <>
                            {" "}
                            <br />
                            <span
                              style={{
                                fontSize: "12px",
                                appearance: "none",
                                WebkitAppearance: "none",
                                color: "black",
                              }}
                            >
                              {booking.booking_date}
                            </span>
                          </>
                        )}
                      </div>
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center mt-4">
                <p className="text-muted">No bookings found</p>
              </div>
            )}
          </div>

          <style>
            {`
              @media (max-width: 576px) {
                .mobile-popup {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 9999;
                  background: #fff;
                  overflow-y: auto;
                  padding: 0 !important;
                  margin: 0 !important;
                }
              }
            `}
          </style>
          {/* Second Row */}

          {viewDetails && showDiv ? (
            // <div className="w-100 mb-4" style={{ flex: "1 0 400px", overflowY: "auto", maxHeight: "calc(110vh)"}} >

            <div
              className="w-100 mb-4 mobile-popup"
              style={{
                flex: "1 0 400px",
                overflowY: "auto",
                maxHeight: "calc(110vh)",
              }}
            >
              <div className="mob-search-filter border-start-0 border-end-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mob-search-filter-in">
                        <div className="mob-search-bar-back">
                          <Link onClick={() => setShowDiv(false)}>
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

              <Container
                fluid
                className="border border-2 "
                style={{
                  minWidth: "200px",
                  borderRadius: isMobileWidth ? "0" : "20px",
                  padding: isMobileWidth ? "0" : "0",
                }}
              >
                {isMobileWidth && (
                  <div
                    className="col-lg-3 col-md-6"
                    style={{ padding: isMobileWidth ? "10px 16px" : "16px" }}
                  >
                    <div className="chat-right">
                      <div
                        className="chat-right-top"
                        style={{
                          borderBottom: "2px solid #ccc",
                          padding: isMobileWidth ? "2px 0" : "10px 0 10px 0",
                          width: "100%",
                          marginLeft: "0px",
                        }}
                      >
                        {/* <h3>{userType === "host" ? "Guest by" : "Hosted by"}</h3> */}

                        <div
                          className="chat-right-top-profile d-flex align-items-center"
                          style={{ marginLeft: isMobileWidth ? "7%" : 0 }}
                        >
                          <img
                            className="chat-right-top-profile-image img-fluid"
                            src={
                              userType === "host"
                                ? selectedBooking?.guest_avatar
                                  ? `${imageBase}${selectedBooking?.guest_avatar}`
                                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                                : selectedBooking?.host_image
                                  ? `${imageBase}${selectedBooking?.host_image}`
                                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                            }
                            loading="lazy"
                            alt="Profile"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <h2
                            style={{
                              marginLeft: "10px",
                              fontSize: "1rem",
                              wordWrap: "break-word",
                            }}
                          >
                            {userType === "host"
                              ? selectedBooking?.guest_name
                                ?.trim()
                                .split(" ")[0] + ".." || "No Name"
                              : selectedBooking?.host_name
                                ?.trim()
                                .split(" ")[0] + ".."}
                          </h2>

                          {userType === "host" ? (
                            <>
                              <img
                                className="chat-right-top-batch-image"
                                loading="lazy"
                                alt="verified"
                                src=" /images/locations-grid/star-icon.svg"
                                style={{ width: "20px" }}
                              />{" "}
                              <span style={{ color: "#FFC107" }}>
                                {reviewPagination?.average_review_rating}
                              </span>
                            </>
                          ) : (
                            <>
                              {/* {selectedBooking?.is_star_host && ( */}
                              <img
                                className="chat-right-top-batch-image"
                                loading="lazy"
                                alt="verified"
                                src="/images/bookings/verify-star.svg"
                                style={{ width: "20px" }}
                              />
                              {/* )} */}
                            </>
                          )}
                        </div>

                        {userType === "guest" && (
                          <>
                            <hr />
                            <Link to="/helpCenter" style={{ border: "none" }}>
                              <span>
                                <img
                                  src="/images/create-profile/info.svg"
                                  style={{
                                    filter: " grayscale(100%) invert(1.8)",
                                  }}
                                  loading="lazy"
                                  alt="info"
                                  className="px-2"
                                />
                                I need help
                              </span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          marginTop: "18px",
                          justifyContent: "space-around",
                          height: isMessageClick ? "270px" : "",
                        }}
                      >
                        {userType === "host" &&
                          (isMobileWidth ? (
                            <a
                              className="review-btn"
                              style={{
                                width: "fit-content",
                                marginBottom: "10px",
                                padding: "4px !important",
                                display: "block",
                              }}
                            >
                              <ReviewBookingPopup
                                booking_id={selectedBooking?.booking_id}
                                property_id={propertyId}
                              />
                            </a>
                          ) : (
                            (selectedBooking?.booking_status ===
                              "Awaiting Payment" ||
                              selectedBooking?.booking_status ===
                              "finished") && (
                              <a
                                className="review-btn"
                                style={{
                                  marginBottom: "10px",
                                  width: "fit-content",
                                  // padding: "10px", display: "block",
                                }}
                              >
                                <ReviewBookingPopup
                                  booking_id={selectedBooking?.booking_id}
                                  property_id={propertyId}
                                />
                              </a>
                            )
                          ))}

                        {userType == "guest" &&
                          (selectedBooking?.booking_status == "Finished" ? (
                            <a
                              className="review-btn"
                              style={{
                                marginBottom: "10px",
                                display: "flex",
                                justifyContent: "space-around", // padding: "10px",
                              }}
                            >
                              <ReviewBookingPopup
                                booking_id={selectedBooking?.booking_id}
                                property_id={propertyId}
                              />
                            </a>
                          ) : (
                            (viewDetails.status
                              ? viewDetails.status
                              : selectedBooking?.booking_status) !=
                            "Cancelled" && (
                              <button
                                style={{
                                  width: "auto",
                                  padding: "10px 15px",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  backgroundColor: "white",
                                  marginBottom: "10px",
                                  cursor: "pointer",
                                  height: "fit-content",
                                  // marginTop: "3px",
                                }}
                                onClick={handleOpenModal}
                              >
                                Cancel Booking
                              </button>
                            )
                          ))}

                        {selectedBooking?.booking_status === "Cancelled" &&
                          userType != "host" ? (
                          <button
                            style={{
                              // width: "70%",
                              padding: "10px 42px",
                              borderRadius: "10px",
                              border: "1px solid black",
                              backgroundColor: "white",
                              marginBottom: "10px",
                              cursor: "pointer",
                              height: "fit-content",
                            }}
                          // disabled
                          >
                            Cancelled
                          </button>
                        ) : (
                          ""
                        )}

                        <MessageHost
                          type={userType === "host" ? "guest" : "host"}
                          data={{
                            sender_detail: selectedBooking,
                            property_id: selectedBooking?.booking_id,
                          }}
                          isMobileWidth={isMobileWidth}
                          handleMsgClick={() =>
                            setIsMessageClick(!isMessageClick)
                          }
                        />

                        <CancelPopup
                          isOpen={showCancelModal}
                          userId={userId}
                          onCancel={handleCancel}
                          booking_Id={viewDetails?.booking_id}
                          amount={viewDetails?.booking_total_amount}
                          onClose={() => {
                            handleCancel();
                          }}
                          onConfirm={() => {
                            fetchBookingList();
                            fetchGuestDetailsData();
                            handleCancel();
                          }}
                        />
                      </div>

                      {userType === "host" && (
                        <>
                          <div
                            style={{ textAlign: "center", marginTop: "10px" }}
                          >
                            <a
                              href="#"
                              onClick={() => {
                                propertyId
                                  ? setShowReportModal(true)
                                  : toast.error(
                                    "Please select a booking first"
                                  );
                              }}
                              style={{
                                width: "120%",
                                borderRadius: "10px",
                                border: "1px solid black",
                                backgroundColor: "white",
                                color: "black",
                                marginBottom: "10px",
                                cursor: "pointer",
                                listStyle: "none",
                                padding: "10px 30px",
                                marginTop: "10px",
                                fontSize: isMobileWidth ? "14px" : "",
                              }}
                            >
                              {isMobileWidth
                                ? "Report an issue"
                                : "Report Violation"}
                            </a>
                          </div>

                          {showReportModal && (
                            <ReportBookingModal // style={{ margin: "10px" }}
                              onClose={() => setShowReportModal(false)}
                            />
                          )}
                        </>
                      )}

                      <div
                        className="chat-right-bottom bg-white"
                        style={{ marginBottom: "18px" }}
                      >
                        <div className="chat-right-bottom-in d-flex flex-wrap">
                          <div
                            className="chat-right-bottom-in-image "
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                            }}
                          >
                            <img
                              src={
                                userType == "host"
                                  ? viewDetails?.images?.[0]
                                    ? imageBase + viewDetails?.images?.[0]
                                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                                  : viewDetails?.first_property_image
                                    ? imageBase +
                                    viewDetails?.first_property_image
                                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                              }
                              loading="lazy"
                              alt="property"
                              className="img-fluid"
                              style={{
                                // width: "60px", height: "70px",
                                borderRadius: "10px",
                              }}
                            />
                          </div>
                          <div className="chat-right-bottom-in-text">
                            <h1
                              style={{
                                fontSize: "1.1rem",
                                wordWrap: "break-word",
                              }}
                            >
                              {userType == "host"
                                ? viewDetails?.property_title ||
                                "Cabin in Peshastin"
                                : viewDetails?.property_name ||
                                "Cabin in Peshastin"}
                            </h1>
                            <p>
                              <FaStar
                                className="text-warning"
                                style={{ marginTop: "-2px" }}
                              />
                              {
                                reviewPagination?.average_review_rating
                                // formatReview(reviewPagination?.average_review_rating )
                              }{" "}
                              ({reviewPagination?.total}){" "}
                            </p>
                            <p>
                              <MdOutlineMyLocation className="text-secondary" />
                              {viewDetails?.distance_miles} miles away
                            </p>
                          </div>
                        </div>

                        {userType == "host" ? (
                          <ul style={{ padding: "10px" }}>
                            <li>
                              {viewDetails?.booking_hour} hours
                              <span>
                                {" "}
                                ${formatCurrency(
                                  viewDetails?.booking_amount
                                )}{" "}
                              </span>
                            </li>
                            {viewDetails?.cleaning_fee > 0 && (
                              <li>
                                {" "}
                                Cleaning Fee
                                <span>
                                  {" "}
                                  ${formatCurrency(
                                    viewDetails?.cleaning_fee
                                  )}{" "}
                                </span>
                              </li>
                            )}

                            {viewDetails?.service_fee > 0 && (
                              <li>
                                Zyvo Service Fee
                                <span>
                                  {" "}
                                  ${formatCurrency(
                                    viewDetails?.service_fee
                                  )}{" "}
                                </span>
                              </li>
                            )}

                            {viewDetails?.tax > 0 && (
                              <li>
                                Taxes{" "}
                                <span>${formatCurrency(viewDetails?.tax)}</span>
                              </li>
                            )}

                            {viewDetails?.add_on_total > 0 && (
                              <li>
                                Add-on
                                <span>
                                  {" "}
                                  ${formatCurrency(
                                    viewDetails?.add_on_total
                                  )}{" "}
                                </span>
                              </li>
                            )}

                            {/* {viewDetails?.discount > 0 && (
                              <li>
                                discount
                                <span>
                                  {" "}
                                  -${formatCurrency(viewDetails?.discount)}{" "}
                                </span>
                              </li>
                            )} */}

                            {viewDetails?.charges?.booking_hours > 2 && viewDetails?.charges?.discount > 0 && (

                              <li>
                                discount
                                <span>
                                  -$
                                  {formatCurrency(
                                    viewDetails?.charges?.discount || 0
                                  )}
                                </span>
                              </li>
                            )}

                            <li className="total-cost">
                              Total
                              <span>
                                {" "}
                                ${" "}
                                {formatCurrency(
                                  viewDetails?.booking_total_amount
                                )}{" "}
                              </span>
                            </li>
                          </ul>
                        ) : (
                          <ul style={{ paddingTop: "7px" }}>
                            <li>
                              {viewDetails?.charges?.booking_hours} hours
                              <span>
                                $
                                {formatCurrency(
                                  viewDetails?.charges?.booking_amount
                                )}
                              </span>
                            </li>
                            {viewDetails?.charges?.cleaning_fee > 0 && (
                              <li>
                                Cleaning Fee
                                <span>
                                  $
                                  {formatCurrency(
                                    viewDetails?.charges?.cleaning_fee
                                  )}
                                </span>
                              </li>
                            )}

                            {viewDetails?.charges?.zyvo_service_fee > 0 && (
                              <li>
                                Zyvo Service Fee
                                <span>
                                  $
                                  {formatCurrency(
                                    viewDetails?.charges?.zyvo_service_fee
                                  )}
                                </span>
                              </li>
                            )}

                            {/* {viewDetails?.charges?.taxes > 0 && ( */}
                            <li>
                              Taxes{" "}
                              <span>
                                $
                                {formatCurrency(viewDetails?.charges?.taxes) ||
                                  0}{" "}
                              </span>
                            </li>
                            {/* )} */}

                            {/* {viewDetails?.charges?.add_on_price > 0 && ( */}
                            <li>
                              Add-on
                              <span>
                                ${" "}
                                {formatCurrency(
                                  viewDetails?.charges?.add_on_price || 0
                                )}
                              </span>
                            </li>
                            {/* )} */}
                            {/* {viewDetails?.charges?.discount > 0 && ( */}




                            {viewDetails?.charges?.booking_hours > 2 && viewDetails?.charges?.discount > 0 && (

                              <li>
                                discount
                                <span>
                                  -$
                                  {formatCurrency(
                                    viewDetails?.charges?.discount || 0
                                  )}
                                </span>
                              </li>
                            )}
                            {/* )} */}

                            <li className="total-cost">
                              Total
                              <span>
                                ${formatCurrency(viewDetails?.charges?.total)}
                              </span>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="booking-mid-top location-top px-3 pt-3">
                  <h2>
                    {userType == "host"
                      ? viewDetails?.property_title
                      : viewDetails?.property_name}
                    <div
                      className="booking-tag finished"
                      style={{
                        padding: "5px 15px",
                        backgroundColor:
                          (userType == "host"
                            ? viewDetails?.booking_status
                            : viewDetails?.status) == "Confirmed"
                            ? "#85D6FF"
                            : (userType == "host"
                              ? viewDetails?.booking_status
                              : viewDetails?.status) == "Pending"
                              ? "#ffc107"
                              : (userType == "host"
                                ? viewDetails?.booking_status
                                : viewDetails?.status) == "Finished"
                                ? "#4AEAB1"
                                : (userType == "host"
                                  ? viewDetails?.booking_status
                                  : viewDetails?.status) == "Waiting_payment"
                                  ? "#FFF178"
                                  : "#ebe1e1",
                        color: "black",
                      }}
                    >
                      {userType == "host"
                        ? viewDetails?.booking_status
                        : viewDetails?.status}
                    </div>
                  </h2>

                  {userType == "guest" && (
                    <ul>
                      <li
                        style={{
                          cursor: "pointer",
                          color: "#007BFF",
                          display: "block",
                        }}
                      >
                        <Link
                          href="#"
                          onClick={() => setShowModal(true)}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <i className="fa-solid fa-share-nodes me-1 light-gray "></i>{" "}
                          Share
                        </Link>
                      </li>
                      <li>
                        <Link to="#" onClick={handleWishlistClick}>
                          <i
                            className={`fa-solid fa-heart me-1 ${userType == "host"
                              ? viewDetails?.wishlist
                              : viewDetails?.is_in_wishlist
                                ? "text-danger"
                                : "light-gray"
                              }`}
                          ></i>
                          Favorite
                        </Link>
                      </li>
                    </ul>
                  )}
                  {showModal && (
                    <ShareModal onClose={() => setShowModal(false)} />
                  )}
                </div>
                {/* <div className={`top-grid-bookinghost-h top-grid-images-${viewDetails?.images?.length <5 ? 5 : viewDetails?.images?.length || viewDetails?.property_images?.length >5 ? 5 : viewDetails?.property_images?.length}`}> */}
                <div
                  className={`top-grid-bookinghost-h px-3 top-grid-images-${userType === "host"
                    ? viewDetails?.images?.length < 3 &&
                      viewDetails?.images?.length < 3
                      ? viewDetails?.images?.length
                      : 3
                    : viewDetails?.property_images?.length &&
                      viewDetails?.property_images?.length < 3
                      ? viewDetails?.property_images?.length
                      : 3
                    }`}
                  onClick={() => setShowPropertyImages(true)}
                >
                  <div className="top-grid-images-left">
                    {(viewDetails?.images?.[0] ||
                      viewDetails?.first_property_image?.[0]) && (
                        <img
                          src={
                            userType == "host"
                              ? Array.isArray(viewDetails?.images) &&
                              imageBase + viewDetails?.images[0] &&
                              imageBase + viewDetails?.images?.[0]
                              : imageBase + viewDetails?.first_property_image
                          }
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
                    {userType == "host"
                      ? viewDetails?.images
                        ?.slice(1, 3)
                        .map((item, index) => (
                          <img
                            key={index}
                            src={`https://zyvo.tgastaging.com/${item}`}
                            loading="lazy"
                            alt="Main Property"
                          />
                        ))
                      : viewDetails?.property_images
                        ?.slice(1, 3)
                        .map((item, index) => (
                          <img
                            src={imageBase + item}
                            key={index}
                            loading="lazy"
                            alt="Main Property"
                          />
                        ))}
                  </div>
                </div>
                {(viewDetails?.property_images?.length >= 3 ||
                  viewDetails?.images?.length >= 3) && (
                    <div
                      className=" px-3 "
                      style={{ textAlign: "right", cursor: "pointer" }}
                      onClick={() => setShowPropertyImages(true)}
                    >
                      See more
                    </div>
                  )}

                <hr className="property-modal-hr" />

                <Container
                  className="px-sm-2 pt-2 px-lg-3 "
                  style={{
                    fontSize: "13px",
                    paddingLeft: "0px !important",
                    margin: "32px 0px",
                  }}
                >
                  <h5 className="mb-3">Booking Details</h5>
                  <div className="nw-bookingdtl-list-wrp">
                    <div
                      className="nw-bookingdtl-list"
                      style={{
                        width: "100%",
                        flexWrap: isMobileWidth ? "wrap" : "nowrap",
                      }}
                    >
                      {[
                        [
                          "calendar-icon.svg",
                          userType == "host"
                            ? viewDetails?.booking_date
                            : viewDetails?.booking_detail?.date || "date",
                        ],
                        [
                          "time.svg",
                          userType == "host"
                            ? `${Number(viewDetails?.original_booking_hour) ||
                            "no data"
                            } hours `
                            : `${viewDetails?.booking_detail?.time || "no data"
                            }  `,
                        ],
                        [
                          "time.svg",
                          userType == "host"
                            ? ` From ${viewDetails?.booking_start_time || "start time"
                            } to ${viewDetails?.booking_end_time || "end time"
                            }`
                            : `
                          ${(!isMobileWidth &&
                              viewDetails?.booking_detail?.time) ||
                            " "
                            } ${!isMobileWidth ? "|" : ""}
                          ${viewDetails?.booking_detail?.start_end_time ||
                            "start time"
                            }`,
                        ],
                        [
                          "price.svg",
                          userType == "host"
                            ? parseFloat(viewDetails?.original_booking_amount)
                            : parseFloat(viewDetails?.charges?.booking_amount),
                        ],
                      ].map(
                        ([icon, text], i) =>
                          ((isMobileWidth && i !== 3) ||
                            (!isMobileWidth && i !== 1)) && (
                            <div
                              key={i}
                              style={{ whiteSpace: "nowrap" }}
                              className="d-flex align-items-center gap-2 p-2 border rounded-pill "
                            >
                              <Image
                                src={`/images/filters/${icon}`}
                                loading="lazy"
                                alt=""
                                width="20"
                              />
                              <span style={{ color: "#000000" }}>{text}</span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </Container>
                {isMobileWidth && <hr />}

                {viewDetails?.extension_details && (
                  <Container
                    className="px-2 px-md-3 pb-2 mt-3"
                    style={{ fontSize: "13px" }}
                  >
                    <h5 className="mb-3">Booking Time Extension (BTE)</h5>
                    {isMobileWidth ? (
                      <div className="overflow-auto pb-2">
                        <div
                          className="d-inline-flex gap-2 "
                          style={{
                            width: "100%",
                            flexWrap: isMobileWidth ? "wrap" : "nowrap",
                          }}
                        >
                          {[
                            [
                              "calendar-icon.svg",
                              viewDetails?.extension_details?.extension_date ||
                              "date",
                            ],
                            [
                              "time.svg",
                              `${viewDetails?.extension_details
                                ?.extension_hours || "no data"
                              } hours`,
                            ],
                            [
                              "time.svg",
                              `From ${viewDetails?.extension_details
                                ?.extension_start_time || "start time"
                              } to ${viewDetails?.extension_details
                                ?.extension_end_time || "end time"
                              }`,
                            ],
                            [
                              "price.svg",
                              parseFloat(
                                viewDetails?.extension_details
                                  ?.extension_booking_amount
                              ),
                            ],
                          ].map(([icon, text], i) => (
                            <div
                              key={i}
                              className="d-flex align-items-center gap-2 p-2 border rounded-pill"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Image
                                src={`/images/filters/${icon}`}
                                loading="lazy"
                                alt=""
                                width="20"
                              />
                              <span>{text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-auto pb-2">
                        <div
                          className="d-inline-flex gap-2 "
                          style={{
                            width: "100%",
                            flexWrap: isMobileWidth ? "wrap" : "nowrap",
                          }}
                        >
                          {[
                            [
                              "calendar-icon.svg",
                              viewDetails?.extension_details?.extension_date ||
                              "date",
                            ],
                            [
                              "time.svg",
                              `${viewDetails?.extension_details
                                ?.extension_hours || "no data"
                              } hours | From ${viewDetails?.extension_details
                                ?.extension_start_time || "start time"
                              } to ${viewDetails?.extension_details
                                ?.extension_end_time || "end time"
                              }`,
                            ],
                            [
                              "price.svg",
                              parseFloat(
                                viewDetails?.extension_details
                                  ?.extension_booking_amount
                              ),
                            ],
                          ].map(([icon, text], i) => (
                            <div
                              key={i}
                              className="d-flex align-items-center gap-2 p-2 border rounded-pill"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Image
                                src={`/images/filters/${icon}`}
                                loading="lazy"
                                alt=""
                                width="20"
                              />
                              <span>{text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Container>
                )}

                {!isMobileWidth && <hr className="property-modal-hr" />}

                <Container className=" bg-white rounded  px-3 ">
                  <h5 className="mb-3">Included in your booking</h5>
                  <Row>
                    {viewDetails?.amenities?.map((amenity, index) => (
                      <Col
                        key={index}
                        md="auto"
                        className="mb-3"
                        style={{
                          width: isMobileWidth ? "33%" : "",
                          minHeight: isMobileWidth ? "60px" : "",
                        }}
                      >
                        <Card
                          className="d-flex align-items-center p-1 bg-white"
                          style={{
                            border: "1px solid rgba(0, 0, 0, .2)",
                            borderRadius: "10px",
                            minHeight: isMobileWidth ? "60px" : "",
                          }}
                        >
                          <Card.Body
                            className="d-flex align-items-center p-1 p-lg-2"
                            style={{
                              wordBreak: "break-word",
                              fontSize: isMobileWidth ? "12px" : "",
                            }}
                          >
                            <span className="text-black">{amenity}</span>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Container>
                <hr className="property-modal-hr" />

                <div
                  className="accordion px-3 "
                  id="rulesAccordion"
                  style={{
                    marginTop: isMobileWidth ? "2%" : "6%",
                    marginBottom: isMobileWidth ? "2%" : "6%",
                  }}
                >
                  <div className="container">
                    <h5 className="mb-3">Rules</h5>
                    {[
                      {
                        id: "collapseOne",
                        label: "Parking",
                        icon: "1.svg",
                        content:
                          viewDetails?.parking_rules ||
                          "This section describes the parking rules in detail.",
                      },
                      {
                        id: "collapseTwo",
                        label: "Host rules",
                        icon: "7.svg",
                        content:
                          viewDetails?.host_rules ||
                          "This section describes the host rules in detail.",
                      },
                    ].map(({ id, label, icon, content }) => (
                      <div
                        className="accordion-item border rounded mb-2"
                        key={id}
                      >
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${open === id ? "" : "collapsed"
                              }`}
                            type="button"
                            onClick={() => toggleAccordion(id)}
                            style={{ padding: "12px" }}
                          >
                            <img
                              src={`/images/location/included/${icon}`}
                              alt={`${label} Icon`}
                              className="me-2"
                              style={{ width: "20px", height: "20px" }}
                            />
                            <span className="flex-grow-1">{label}</span>
                            <img
                              src={`/images/dropdown.svg`}
                              alt={`Dropdown Icon`}
                              className="ms-auto"
                              style={{ width: "12px" }}
                            />
                          </button>
                        </h2>
                        {open === id && (
                          <div
                            className="shadow rounded mt-2"
                            style={{ border: "1px solid #ccc" }}
                          >
                            {[...Array(1)].map((_, i) => (
                              <div
                                key={i}
                                className="accordion-body bg-light m-2 p-2 rounded"
                              >
                                {content}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="property-modal-hr" />

                <Row className=" px-3 ">
                  <Col xs={12} style={{ marginTop: !isMobileWidth && "10px" }}>
                    <h5>Address & Location </h5>
                    <p>{/* <u>{viewDetails?.address}</u> */}</p>
                    <Map
                      lat={viewDetails?.latitude}
                      lng={viewDetails?.longitude}
                      bookingData={"address"}
                      locationImg={locationImg}
                    />
                  </Col>
                </Row>
                <hr className="property-modal-hr" />

                <Row
                  className="px-3"
                  style={{
                    paddingBottom: isMobileWidth ? "50px" : "0",
                    margin: isMobileWidth ? "-17px" : "0px",
                  }}
                >
                  <Col
                    xs={12}
                    className="location-reviews mt-4"
                    style={{ marginTop: isMobileWidth ? "64px " : "0px" }}
                  >
                    <h5>
                      {" "}
                      Reviews{" "}
                      {isMobileWidth && (
                        <span>({reviewPagination?.total})</span>
                      )}
                    </h5>
                    <div
                      className="location-reviews-top d-flex flex-wrap align-items-center"
                      style={{ gap: isMobileWidth ? "0px" : "" }}
                    >
                      <h6 className="me-auto">
                        <img src="/images/locations-grid/star-icon.svg" />
                        <span style={{ color: "#FCA800" }}>
                          {" "}
                          {reviewPagination?.average_review_rating}
                        </span>{" "}
                        {!isMobileWidth && reviewPagination?.total_reviews}{" "}
                        reviews
                      </h6>
                      <p
                        className="mb-0 "
                        style={{ marginEnd: isMobileWidth ? "0" : "32px" }}
                      >
                        Sort by:
                      </p>
                      <Dropdown
                        className="chat-left-top-dropdown"
                        onSelect={(eventKey) => {
                          setReviewFilter(eventKey);
                          setCount((prev) => prev + 1);
                        }}
                      >
                        <Dropdown.Toggle
                          variant="light"
                          className="dropdown-toggle"
                          style={{ marginTop: "-4px" }}
                        >
                          {filterLabel[reviewFilter]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="chat-left-top-dropdown-list">
                          <Dropdown.Item eventKey="highest_review">
                            {" "}
                            Highest Review{" "}
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="lowest_review">
                            {" "}
                            Lowest Review{" "}
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="recent_review">
                            {" "}
                            Recent Reviews{" "}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    {/* {
                    isMobileWidth
                  } */}

                    {reviews.map((review, index) => (
                      <>
                        <Row
                          key={index}
                          className=" align-items-center mt-3"
                          style={{ padding: isMobileWidth ? "4px" : "" }}
                        >
                          <Col
                            xs={12}
                            md={8}
                            className="d-flex align-items-center"
                          >
                            <Image
                              src={`${imageBase}${review?.profile_image}`}
                              roundedCircle
                              style={{
                                padding: "2px",
                                border: "2px solid #E4E4E4",
                                marginRight: "15px",
                              }}
                              width="50"
                              height="50" // className="me-3"
                            />
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontWeight: "600", color: "#3F3D56" }}
                              >
                                {!isMobileWidth ? (
                                  review?.reviewer_name
                                ) : (
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      fontSize: "13px",
                                      width: "100%",
                                    }}
                                  >
                                    {/* Left: Reviewer name */}
                                    <span style={{ fontWeight: 500 }}>
                                      {review?.reviewer_name}
                                    </span>

                                    {/* Middle: Stars */}
                                    <span
                                      style={{
                                        marginLeft: "20px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <LocationReviewStars
                                        rating={review?.review_rating}
                                      />
                                    </span>

                                    {/* Right: Date */}
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#666",
                                      }}
                                    >
                                      {review?.review_date}
                                    </span>
                                  </span>
                                )}
                              </h6>

                              <p
                                className="mb-0 text-muted"
                                style={{ fontSize: "14px" }}
                              >
                                {review?.review_message}
                              </p>
                            </div>
                          </Col>

                          {!isMobileWidth && (
                            <Col
                              xs={12}
                              md={4}
                              className="text-md-end mt-2 mt-md-0"
                              style={{ display: isMobileWidth ? "flex" : "" }}
                            >
                              <LocationReviewStars
                                rating={review?.review_rating}
                              />{" "}
                              {review?.review_date}
                            </Col>
                          )}
                        </Row>
                        <hr />
                      </>
                    ))}

                    {reviews?.length == 0 ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        No Review Found
                      </div>
                    ) : (
                      <div className="text-center mt-3">
                        {reviews.length > 3 && showMoreBtn && (
                          <button
                            className="location-reviews-btn"
                            type="button"
                            onClick={() => setPage((prev) => prev + 1)}
                          >
                            Show More Reviews
                          </button>
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>
          ) : (
            !isMobileWidth && (
              <div
                className="w-100 mb-4"
                style={{
                  flex: "1 0 400px",
                  overflowY: "auto",
                  height: "100vh",
                }}
              >
                <Container
                  fluid
                  className="border border-2 p-lg-3"
                  style={{ minWidth: "250px", height: "100vh" }}
                >
                  <div className="h-100 d-flex justify-content-center align-items-center text-center">
                    Please select a booking to view details.
                  </div>
                </Container>
              </div>
            )
          )}

          {/* Third Row */}
          {viewDetails && !isMobileWidth ? (
            <div className="col-lg-3 col-12">
              <div className="chat-right">
                <div className="chat-right-top">
                  <h3 style={{ color: "#808080" }}>
                    {userType === "host" ? "Guest by" : "Hosted by"}
                  </h3>

                  <div className="chat-right-top-profile d-flex align-items-center">
                    <img
                      className="chat-right-top-profile-image img-fluid"
                      src={
                        userType === "host"
                          ? selectedBooking?.guest_avatar
                            ? `${imageBase}${selectedBooking?.guest_avatar}`
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                          : selectedBooking?.host_image
                            ? `${imageBase}${selectedBooking?.host_image}`
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                      }
                      loading="lazy"
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <h2
                      style={{
                        marginLeft: "10px",
                        fontSize: "20px",
                        fontWeight: "400",
                        wordWrap: "break-word",
                      }}
                    >
                      {userType === "host"
                        ? selectedBooking?.guest_name?.trim() || "No Name"
                        : selectedBooking?.host_name?.trim() || "John Doe"}
                    </h2>

                    {userType === "host" ? (
                      <>
                        <img
                          className="chat-right-top-batch-image"
                          src=" /images/locations-grid/star-icon.svg"
                          loading="lazy"
                          alt="verified"
                          style={{ width: "20px", color: "#FCA800" }}
                        />{" "}
                        <span style={{ color: "#FCA800" }}>
                          {guestReview || "0.0"}{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        {selectedBooking?.is_star_host && (
                          <img
                            className="chat-right-top-batch-image"
                            src="/images/bookings/verify-star.svg"
                            loading="lazy"
                            alt="verified"
                            style={{ width: "20px" }}
                          />
                        )}
                      </>
                    )}
                  </div>

                  <hr style={{ height: "auto" }} />
                  {userType === "host" &&
                    (selectedBooking?.booking_status === "Awaiting Payment" ||
                      selectedBooking?.booking_status === "finished") && (
                      <a
                        className="review-btn"
                        style={{
                          padding: "10px",
                          marginBottom: "10px",
                          display: "block",
                          height: "fit-content",
                        }}
                      >
                        <ReviewBookingPopup
                          booking_id={selectedBooking?.booking_id}
                          property_id={propertyId}
                        />
                      </a>
                    )}

                  {userType == "guest" &&
                    (selectedBooking?.booking_status == "Finished" ? (
                      <a
                        className="review-btn"
                        style={{
                          padding: "0",
                          marginBottom: "10px",
                          display: "block",
                          height: "fit-content",
                        }}
                      >
                        <ReviewBookingPopup
                          booking_id={selectedBooking?.booking_id}
                          property_id={propertyId}
                        />
                      </a>
                    ) : (
                      (viewDetails.status
                        ? viewDetails.status
                        : selectedBooking?.booking_status) != "Cancelled" && (
                        <button
                          style={{
                            width: "100%",
                            padding: "clamp(8px, 1.5vw, 10px)",
                            borderRadius: "5px",
                            border: "1px solid black",
                            marginTop: "3px",
                            backgroundColor: "white",
                            marginBottom: "10px",
                            cursor: "pointer",
                          }}
                          onClick={handleOpenModal}
                        >
                          Cancel Booking
                        </button>
                      )
                    ))}

                  <MessageHost
                    type={userType === "host" ? "guest" : "host"}
                    data={{
                      sender_detail: selectedBooking,
                      property_id: selectedBooking?.booking_id,
                    }}
                  />

                  <a
                    href="#"
                    onClick={() => {
                      propertyId
                        ? setShowReportModal(true)
                        : toast.error("Please select a booking first");
                    }}
                    style={{ display: "block", marginBottom: "10px" }}
                  >
                    Report Violation
                  </a>

                  {showReportModal && (
                    <ReportBookingModal
                      style={{ margin: "10px" }}
                      onClose={() => setShowReportModal(false)}
                    />
                  )}
                  <CancelPopup
                    isOpen={showCancelModal}
                    userId={userId}
                    booking_Id={viewDetails?.booking_id}
                    amount={viewDetails?.booking_total_amount}
                    onCancel={handleCancel}
                    onClose={() => {
                      handleCancel();
                    }}
                    onConfirm={() => {
                      fetchBookingList();
                      fetchGuestDetailsData();
                      handleCancel();
                    }}
                  />
                </div>

                <div className="chat-right-bottom bg-white">
                  <div className="chat-right-bottom-in d-flex flex-wrap">
                    <div
                      className="chat-right-bottom-in-image "
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                      }}
                    >
                      <img
                        src={
                          userType == "host"
                            ? viewDetails?.images?.[0]
                              ? imageBase + viewDetails?.images?.[0]
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                            : viewDetails?.first_property_image
                              ? imageBase + viewDetails?.first_property_image
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                        }
                        loading="lazy"
                        alt="property"
                        className="img-fluid"
                        style={{
                          // width: "60px",
                          // height: "70px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                    <div className="chat-right-bottom-in-text">
                      <h1
                        style={{ fontSize: "1.1rem", wordWrap: "break-word" }}
                      >
                        {userType == "host"
                          ? viewDetails?.property_title || "Cabin in Peshastin"
                          : viewDetails?.property_name || "Cabin in Peshastin"}
                      </h1>
                      <p>
                        <FaStar
                          className="text-warning"
                          style={{ marginTop: "-2px" }}
                        />
                        {`${reviewPagination?.average_review_rating} `}(
                        {reviewPagination?.total}){" "}
                      </p>
                      <p>
                        {/* <MdOutlineMyLocation className="text-secondary" /> */}
                        <img src="/images/location.svg" />
                        {viewDetails?.distance_miles} miles away
                      </p>
                    </div>
                  </div>

                  <hr className="property-modal-hr" />
                  {userType == "host" ? (
                    <ul>
                      <li>
                        {viewDetails?.booking_hour} hours
                        <span>
                          ${formatCurrency(viewDetails?.booking_amount)}
                        </span>
                      </li>
                      {viewDetails?.cleaning_fee > 0 && (
                        <li>
                          Cleaning Fee
                          <span>
                            ${formatCurrency(viewDetails?.cleaning_fee)}
                          </span>
                        </li>
                      )}

                      {viewDetails?.service_fee > 0 && (
                        <li>
                          Zyvo Service Fee
                          <span>
                            ${formatCurrency(viewDetails?.service_fee)}
                          </span>
                        </li>
                      )}

                      {viewDetails?.tax > 0 && (
                        <li>
                          Taxes <span>${formatCurrency(viewDetails?.tax)}</span>
                        </li>
                      )}

                      {viewDetails?.add_on_total > 0 && (
                        <li>
                          Add-on
                          <span>
                            ${formatCurrency(viewDetails?.add_on_total)}
                          </span>
                        </li>
                      )}

                      {viewDetails?.discount > 0 && (
                        <li>
                          discount
                          <span>-${formatCurrency(viewDetails?.discount)}</span>
                        </li>
                      )}

                      <li className="total-cost">
                        Total
                        <span>
                          ${formatCurrency(viewDetails?.booking_total_amount)}
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        {viewDetails?.charges?.booking_hours} hours
                        <span>
                          $
                          {formatCurrency(viewDetails?.charges?.booking_amount)}
                        </span>
                      </li>
                      {viewDetails?.charges?.cleaning_fee > 0 && (
                        <li>
                          Cleaning Fee
                          <span>
                            $
                            {formatCurrency(viewDetails?.charges?.cleaning_fee)}
                          </span>
                        </li>
                      )}

                      {viewDetails?.charges?.zyvo_service_fee > 0 && (
                        <li>
                          Zyvo Service Fee
                          <span>
                            $
                            {formatCurrency(
                              viewDetails?.charges?.zyvo_service_fee
                            )}
                          </span>
                        </li>
                      )}

                      {viewDetails?.charges?.taxes > 0 && (
                        <li>
                          Taxes{" "}
                          <span>
                            ${formatCurrency(viewDetails?.charges?.taxes)}
                          </span>
                        </li>
                      )}

                      {viewDetails?.charges?.add_on_price > 0 && (
                        <li>
                          Add-on
                          <span>
                            $
                            {formatCurrency(viewDetails?.charges?.add_on_price)}
                          </span>
                        </li>
                      )}
                      {viewDetails?.charges?.discount > 0 && (
                        <li>
                          discount
                          <span>
                            -${formatCurrency(viewDetails?.charges?.discount)}
                          </span>
                        </li>
                      )}

                      <li className="total-cost">
                        Total
                        <span>
                          ${formatCurrency(viewDetails?.charges?.total)}
                        </span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-lg-3 col-md-6">
              <div className="chat-right"> </div>
            </div>
          )}
        </div>

        <MobFooter />
      </div>

      <ReportBookingModal
        show={showReportModal}
        handleClose={() => setShowReportModal(false)}
        user_id={userId}
        booking_id={selectedBooking?.booking_id}
        property_id={propertyId}
      />
      {
        viewDetails?.property_images.lenght > 3 || viewDetails?.images > 3
        && (
          <LocationImagesModal
            show={showPropertyImages}
            handleClose={() => setShowPropertyImages(false)}
            images={viewDetails?.property_images || viewDetails?.images}
          />
        )
      }


      <AddToWishlistModal
        wishlistArr={wishlistArr}
        showAddWishlistModal={showAddWishlistModal}
        propertyId={selectedBooking?.property_id}
        userId={userId}
        handleClose={() => {
          // fetchDetailsData(viewDetails);
          userType == "host"
            ? fetchDetailsData(selectedBooking)
            : fetchGuestDetailsData(selectedBooking);
          setShowAddWishlistModal(false);
        }}
      />

      <ApproveDeclineModal
        show={approveDeclineModal.show}
        status={approveDeclineModal.status}
        data={approveDeclineModal.data}
        onClose={closeApproveDeclineModal}
        onSubmit={handleStatusUpdate}
      />
    </>
  );
};

export default BookingHost;

const ApproveDeclineModal = ({ show, status, data, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [error, setshowError] = useState("");

  const reasons = ["I'm overbooked", "Maintenance day", "Other reason"];

  const handleSubmit = () => {
    if (status === "decline" && !selectedReason) {
      setshowError("dropdown");
      return;
    }

    if (message.trim() === "") {
      setshowError("message");
      return;
    }

    const finalMessage =
      status === "approve"
        ? message
        : `${selectedReason}${message ? `: ${message}` : ""}`;

    onSubmit({ data, status, message: finalMessage });
    handleClose();
  };

  const handleClose = () => {
    setshowError("");
    setSelectedReason("");
    setMessage("");
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {status === "approve" ? "Approve Booking" : "Decline Booking"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status === "decline" && (
          <>
            <div className="mb-3">
              <div>
                <strong>Select a reason:</strong>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`btn ${selectedReason === reason
                      ? "primary-color"
                      : "btn-outline-secondary"
                      }`}
                    onClick={() =>
                      setSelectedReason(selectedReason === reason ? "" : reason)
                    }
                  >
                    {reason}
                  </button>
                ))}
              </div>
              {error === "dropdown" && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  Please select a reason for declining
                </div>
              )}
            </div>
          </>
        )}

        <textarea
          placeholder="Share a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="form-control"
        />
        {error === "message" && (
          <div style={{ color: "red", marginTop: "5px" }}>
            Message is Required
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          style={{
            width: "100%",
            color: "white",
            backgroundColor: "#3A4B4C",
            border: "none",
            borderRadius: "10px",
          }}
        >
          {status === "approve" ? "Approve Request" : "Decline Request"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
// import { useEffect, useMemo, useState } from "react";
// import { Card, Button, Image, Dropdown, FormControl, InputGroup, Container, Modal, } from "react-bootstrap";
// import { MdOutlineMyLocation } from "react-icons/md";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import { FaSearch, FaCaretDown, FaStar } from "react-icons/fa";
// import useBook from "../../hooks/host/useBook";
// import { imageBase, KEYS } from "../../config/Constant";
// import LocationReviewStars from "../../components/guest/LocationReviewStars";
// import ReportBookingModal from "../../components/host/ReportBookingModal";
// import { data, Link, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setOneToOneChatData } from "../../store/slices/hostuserSlice";
// import ShareModal from "../../components/guest/bookingDetailsModal/ShareModal";
// import ReviewBookingPopup from "../../components/host/ReviewBookingPopup";
// import { toast } from "react-toastify";
// import AddToWishlistModal from "../../components/guest/wishlistModals/AddToWishlistModal";
// import useCommon from "../../hooks/useCommon";
// import MessageHost from "../../components/guest/bookingDetailsModal/MessageHost";
// import Map from "../../components/guest/Map";
// import CancelPopup from "../../components/guest/bookingDetailsModal/CancelPopup";
// import Loader2 from "../../components/Loader2";

// const BookingHost = () => {
//   const {getBookingHost, updateBookingStatus, getBookingGuest, getBookingDetails, getGuestBookingDetails, FilterPropertyReview, hostReportViolation, fetchGuestReview, isLoading, } = useBook();
//   const { guestWishlistData, removeItemFromWishlist } = useCommon();
//   const location = useLocation();
//   const bookingId = location.state?.bookingId;

//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [getList, setGetList] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [refresh, setRefresh] = useState(0);
//   const [currentLocation, setCurrentLocation] = useState({
//     latitude: 0,
//     longitude: 0,
//   });
//   const [showDiv, setShowDiv] = useState(false);

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showAddWishlistModal, setShowAddWishlistModal] = useState(false);
//   const [wishlistArr, setWishlistArr] = useState([]);

//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [viewDetails, setViewDetails] = useState();
//   const dispatch = useDispatch();

//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userType = localStorage.getItem(KEYS.USER_TYPE);
//   const userId = userData?.user_id ? String(userData?.user_id) : null;
//   const access_token = userData?.access_token;

//   const [open, setOpen] = useState(null);

//   const toggleAccordion = (id) => {
//     setOpen(open === id ? null : id);
//   };

//   const [reviews, setReviews] = useState([]);
//   const [reviewPagination, setReviewPagination] = useState([]);
//   const [page, setPage] = useState(1);
//   const [reviewFilter, setReviewFilter] = useState("highest_review");
//   const [propertyId, setPropertyId] = useState(null);
//   const [count, setCount] = useState(0);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [guestReview, setGuestReview] = useState(null);
//   const [showMoreBtn, setShowMoreBtn] = useState(true);
//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth(); // run on mount
//     window.addEventListener("resize", checkWindowWidth);

//     return () => window.removeEventListener("resize", checkWindowWidth);
//   }, []);

//   const filterLabel = {
//     recent_review: "Recent Reviews",
//     highest_review: "Highest Review",
//     lowest_review: "Lowest Review",
//   };

//   const guestReviewDetail = async (data) => {
//     const response = await fetchGuestReview({ user_id: data?.user_id });
//     if (response?.success) {
//       setGuestReview(response?.data?.total_rating);
//     }
//   };

//   useEffect(() => {
//     if (page != 1) {
//       const fetchPropertyReviews = async () => {
//         const reviewsResp = await FilterPropertyReview({
//           property_id: propertyId,
//           filter: reviewFilter,
//           page,
//         });
//         if (reviewsResp?.data?.length == 0) {
//           setShowMoreBtn(false);
//         }
//         const updatedReviews = reviews.concat(reviewsResp.data);
//         setReviews(updatedReviews);
//         setReviewPagination(reviewsResp?.pagination);
//       };
//       fetchPropertyReviews();
//     }
//   }, [page]);

//   const handleOpenModal = () => setShowCancelModal(true);
//   const handleCancel = () => setShowCancelModal(false);

//   useEffect(() => {
//     if (count > 0) {
//       setPage(1);
//       const fetchPropertyReviews = async () => {
//         const reviewsResp = await FilterPropertyReview({
//           property_id: propertyId,
//           filter: reviewFilter,
//           page,
//         });
//         setReviews(reviewsResp.data);
//         setReviewPagination(reviewsResp?.pagination);
//         setPage(1);
//       };
//       fetchPropertyReviews();
//     }
//   }, [reviewFilter]);

//   const handleWishlistClick = async () => {
//     if (userId && access_token) {
//       if (viewDetails?.is_in_wishlist || viewDetails?.wishlist) {
//         await removeItemFromWishlist({
//           user_id: userId,
//           property_id: propertyId,
//         });
//       } else {
//         setShowAddWishlistModal(true);
//       }
//       setRefresh((prev) => prev + 1);
//       getWishlist();
//       setPropertyId(propertyId);
//       // fetchDetailsData(viewDetails);
//       userType == "host"
//         ? fetchDetailsData(selectedBooking)
//         : fetchGuestDetailsData(selectedBooking);
//     }
//   };

//   useEffect(() => {
//     fetchBookingList();
//   }, [userType, userId]);

//   useEffect(() => {
//     getWishlist();
//   }, []);

//   const fetchBookingList = async () => {
//     try {
//       const response = await (userType == "host"
//         ? getBookingHost({ user_id: userId })
//         : getBookingGuest({ user_id: userId }));
//       if (response) {
//         setGetList(response?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching booking list:", error);
//     }
//   };

//   const getWishlist = async () => {
//     const wishlistData = await guestWishlistData({
//       user_id: userId,
//     });
//     setWishlistArr(wishlistData?.data);
//   };

//   useEffect(() => {
//     const getLocation = () => {
//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setCurrentLocation({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             });
//           },
//           (error) => {
//             console.error(error.message);
//           }
//         );
//       } else {
//         console.error("Geolocation is not supported by your browser.");
//       }
//     };
//     getLocation();
//   }, [currentLocation.latitude, currentLocation.longitude]);

//   const filteredBookings = useMemo(() => {
//     return userType == "host"
//       ? getList?.filter((booking) => {
//           const matchesName = booking?.guest_name
//             ?.toLowerCase()
//             .includes(searchQuery?.toLowerCase());
//           const matchesStatus = selectedStatus
//             ? booking?.booking_status == selectedStatus
//             : true;
//           return matchesName && matchesStatus;
//         })
//       : getList?.filter((booking) => {
//           const matchesName = booking?.property_name
//             ?.toLowerCase()
//             .includes(searchQuery?.toLowerCase());
//           const matchesStatus = selectedStatus
//             ? booking?.booking_status == selectedStatus
//             : true;
//           return matchesName && matchesStatus;
//         });
//   }, [getList, searchQuery, selectedStatus, userType]);

//   const fetchDetailsData = async (bookingData) => {
//     try {
//       const response = await getBookingDetails({
//         booking_id: bookingData?.booking_id,
//         ...(bookingData?.extension_id && {
//           extension_id: bookingData.extension_id,
//         }),
//         latitude: currentLocation.latitude,
//         longitude: currentLocation.longitude,
//       });
//       if (response) {
//         let view_details = response?.data;
//         let property_id = view_details?.property_id;
//         setViewDetails(view_details);
//         setPropertyId(property_id);
//         const reviewsResp = await FilterPropertyReview({
//           property_id,
//           filter: reviewFilter,
//           page: 1,
//         });

//         setReviews(reviewsResp.data);
//         setReviewPagination(reviewsResp?.pagination);
//         setPage(1);
//       }
//     } catch (error) {
//       console.error(error, "error response");
//     }
//   };

//   const fetchGuestDetailsData = async (bookingData) => {
//     try {
//       const response = await getGuestBookingDetails({
//         booking_id: selectedBooking?.booking_id,
//         user_id: userId,
//         latitude: currentLocation.latitude,
//         longitude: currentLocation.longitude,
//       });

//       if (!response) return;

//       const view_details = response?.data;
//       const property_id = view_details?.property_id;

//       setViewDetails(view_details);
//       setPropertyId(property_id);

//       const reviewsResp = await FilterPropertyReview({
//         property_id,
//         filter: reviewFilter,
//         page: 1,
//       });

//       setReviews(reviewsResp.data);
//       setReviewPagination(reviewsResp?.pagination);
//       setPage(1);
//     } catch (error) {
//       console.error(error, "error response");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!selectedBooking) return;
//       if (userType == "host") {
//         fetchDetailsData(selectedBooking);
//         guestReviewDetail(selectedBooking);
//       } else {
//         fetchGuestDetailsData(selectedBooking);
//         //   const response = await getGuestBookingDetails({
//         //     booking_id: selectedBooking?.booking_id,
//         //     user_id: userId,
//         //     latitude: currentLocation.latitude,
//         //     longitude: currentLocation.longitude,
//         //   });

//         //   if (!response) return;

//         //   const view_details = response?.data;
//         //   const property_id = view_details?.property_id;

//         //   setViewDetails(view_details);
//         //   setPropertyId(property_id);

//         //   const reviewsResp = await FilterPropertyReview({
//         //     property_id,
//         //     filter: reviewFilter,
//         //     page: 1,
//         //   });

//         //   setReviews(reviewsResp.data);
//         //   setReviewPagination(reviewsResp?.pagination)
//         //   setPage(1);
//         // }
//       }
//     };

//     fetchData();
//   }, [selectedBooking]);

//   useEffect(() => {
//     if (bookingId && getList) {
//       const filteredBooking = getList.find(
//         (item) => item.booking_id == bookingId
//       );
//       setSelectedBooking(filteredBooking);
//     }
//   }, [bookingId, getList]);

//   function formatCurrency(value) {
//     const number = parseFloat(value);

//     if (isNaN(number)) return "0";
//     return number % 1 === 0
//       ? number.toLocaleString("en-IN", { maximumFractionDigits: 0 }) // Integer
//       : number.toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }); // Decimal
//   }

//   function formatReview(value) {
//     const num = Number(value);
//     if (isNaN(num)) return ""; // handle invalid inputs
//     // return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
//     num.toFixed(1);
//   }

//   const [approveDeclineModal, setApproveDeclineModal] = useState({
//     show: false,
//     status: null,
//     data: null,
//   });

//   const openApproveDeclineModal = (status, booking) => {
//     setApproveDeclineModal({
//       show: true,
//       status: status,
//       data: booking,
//     });
//   };

//   const closeApproveDeclineModal = () => {
//     setApproveDeclineModal({
//       show: false,
//       status: null,
//       data: null,
//     });
//   };

//   const handleStatusUpdate = async ({ data, status, message }) => {
//     try {
//       const response = await updateBookingStatus({
//         booking_id: data.booking_id,
//         extension_id: data?.extension_id,
//         status: status,
//         message: message,
//       });

//       if (response) {
//         fetchBookingList(); // Refresh after update
//         closeApproveDeclineModal();
//       }
//     } catch (error) {
//       console.error("Error updating booking status:", error);
//     }
//   };

//   return (
//     <>
//       <Loader2 visible={isLoading} />
//       <div className="container-fluid  d-flex justify-content-center" style={{padding:isMobileWidth ? "0px" : ""}}>
//         <div
//           style={{
//             width: "100%",
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             gap: "16px",
//             marginTop: isMobileWidth ? "2px" : "16px",
//           }}
//         >
//           {/* First Row */}
//           <div
//             className="mb-4"
//             style={{
//               flex: "1 0 400px",
//               width: "100%",
//               minWidth: "300px",
//               overflowY: "auto",
//               boxSizing: "border-box",
//               maxWidth: isMobileWidth ? undefined : "380px",
//               maxHeight: isMobileWidth ? undefined : "calc(110vh)",
//               padding: isMobileWidth ? "0px" : "10px",
//               marginBottom: isMobileWidth ? "0px" : "20px",
//             }}
//           >
//             {!isMobileWidth && (
//               <>
//                 {!showSearch ? (
//                   <div
//                     className="d-flex align-items-center justify-content-between"
//                     style={{ minWidth: "100%" }}
//                   >
//                     <div className="d-flex align-items-center">
//                       <div>All Bookings</div>
//                       <FaCaretDown
//                         style={{ cursor: "pointer" }}
//                         onClick={() => setShowDropdown(!showDropdown)}
//                       />
//                     </div>
//                     <FaSearch
//                       onClick={() => setShowSearch(true)}
//                       style={{ marginRight: 20, marginLeft: 10 }}
//                     />
//                     {showDropdown && (
//                       <Dropdown.Menu
//                         show
//                         style={{ top: "140px", zIndex: 1000 }}
//                       >
//                         <Dropdown.Item
//                           onClick={() => {
//                             setSelectedStatus("");
//                             setShowDropdown(false);
//                             setViewDetails(null);
//                             setSelectedBooking(null);
//                           }}
//                         >
//                           All Bookings
//                         </Dropdown.Item>
//                         <Dropdown.Item
//                           onClick={() => {
//                             setSelectedStatus("Confirmed");
//                             setShowDropdown(false);
//                             setViewDetails(null);
//                             setSelectedBooking(null);
//                           }}
//                         >
//                           Confirmed
//                         </Dropdown.Item>
//                         <Dropdown.Item
//                           onClick={() => {
//                             setSelectedStatus("Pending");
//                             setShowDropdown(false);
//                             setViewDetails(null);
//                             setSelectedBooking(null);
//                           }}
//                         >
//                           Pending
//                         </Dropdown.Item>
//                         <Dropdown.Item
//                           onClick={() => {
//                             setSelectedStatus("Finished");
//                             setShowDropdown(false);
//                             setViewDetails(null);
//                             setSelectedBooking(null);
//                           }}
//                         >
//                           Finished
//                         </Dropdown.Item>
//                         <Dropdown.Item
//                           onClick={() => {
//                             setSelectedStatus("Cancelled");
//                             setShowDropdown(false);
//                             setViewDetails(null);
//                             setSelectedBooking(null);
//                           }}
//                         >
//                           Cancelled
//                         </Dropdown.Item>
//                       </Dropdown.Menu>
//                     )}
//                   </div>
//                 ) : (
//                   <InputGroup style={{ width: "100%" }}>
//                     <FormControl
//                       style={{
//                         outline: "none",
//                         boxShadow: "none",
//                         borderColor: "#e4e4e4",
//                         borderRightColor: "#6c757d",
//                       }}
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => setShowSearch(false)}
//                     >
//                       X
//                     </Button>
//                   </InputGroup>
//                 )}
//               </>
//             )}
//             {isMobileWidth && (
//               <div
//                 className="d-flex align-items-center justify-content-end"
//                 style={{
//                   minWidth: "100%",
//                   borderTop: "1px solid #ccc",
//                   borderBottom: "1px solid #ccc",
//                   padding: " 20px 20px 20px 0px",
//                   marginTop: "0px",
//                   position: "relative",
//                 }}
//               >
//                 {/* <div className="mob-search-filter-in"> */}
//                 {userType === "host" ? (
//                   <div className="mob-search-bar-back">
//                     <form action="" onSubmit={(e) => e.preventDefault()}>
//                       <label>
//                         <input
//                           type="text"
//                           placeholder="Search..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <button type="submit">
//                           <i className="fa-regular fa-magnifying-glass"></i>
//                         </button>
//                       </label>
//                     </form>

//                     <img
//                       src="/images/mobile/filters/filter.svg"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => setShowDropdown(!showDropdown)}
//                     />
//                   </div>
//                 ) : (
//                   <img
//                     src="/images/mobile/filters/filter.svg"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => setShowDropdown(!showDropdown)}
//                   />
//                 )}

//                 {/* </div> */}

//                 {showDropdown && (
//                   <Dropdown.Menu
//                     show
//                     style={{ top: 60, right: 5, zIndex: 1000 }}
//                   >
//                     <Dropdown.Item
//                       onClick={() => {
//                         setSelectedStatus("");
//                         setShowDropdown(false);
//                         setViewDetails(null);
//                         setSelectedBooking(null);
//                       }}
//                     >
//                       All Bookings
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => {
//                         setSelectedStatus("Confirmed");
//                         setShowDropdown(false);
//                         setViewDetails(null);
//                         setSelectedBooking(null);
//                       }}
//                     >
//                       Confirmed
//                     </Dropdown.Item>
//                     {userType == "host" &&<Dropdown.Item onClick={() => {
//                         setSelectedStatus("Awaiting Payment");
//                         setShowDropdown(false);
//                         setViewDetails(null);
//                         setSelectedBooking(null);
//                       }}>
//                       Awaiting Payment
//                     </Dropdown.Item>}
//                     <Dropdown.Item
//                       onClick={() => {
//                         setSelectedStatus("Pending");
//                         setShowDropdown(false);
//                         setViewDetails(null);
//                         setSelectedBooking(null);
//                       }}
//                     >
//                       {userType == "guest" ? "Pending" : "Booking Request"}
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => {
//                         setSelectedStatus("Finished");
//                         setShowDropdown(false);
//                         setViewDetails(null);
//                         setSelectedBooking(null);
//                       }}
//                     >
//                       Finished
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => {
//                         setSelectedStatus("Cancelled");
//                         setShowDropdown(false);
//                         setViewDetails(null);
//                         setSelectedBooking(null);
//                       }}
//                     >
//                       Cancelled
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 )}
//               </div>
//             )}
//             {filteredBookings?.length > 0 ? (
//               filteredBookings.map((booking, index) => (
//                 <div
//                   className="chat-list"
//                   id="v-pills-tab"
//                   role="tablist"
//                   aria-orientation="vertical"
//                   key={index}
//                   style={{
//                     minWidth: "150px",
//                     display: "flex",
//                     flexDirection: "row",
//                     padding: "0 10px",
//                   }}
//                 >
//                   <button
//                     style={{
//                       borderRadius: "15px",
//                       backgroundColor:
//                         selectedBooking?.booking_id === booking.booking_id &&
//                         selectedBooking?.extension_id == booking?.extension_id
//                           ? "#f0f0f0"
//                           : "white",
//                       border: "2px solid ",
//                       borderColor:
//                         selectedBooking?.booking_id === booking.booking_id &&
//                         selectedBooking?.extension_id == booking?.extension_id
//                           ? "black"
//                           : "#E4E4E4",
//                       boxSizing: "border-box",
//                     }}
//                     className={`chat-list-in nav-link ${
//                       selectedBooking?.booking_id === booking.booking_id &&
//                       selectedBooking?.extension_id == booking?.extension_id
//                         ? "active"
//                         : ""
//                     }`}
//                     id={`v-pills-${index}-tab`}
//                     data-bs-toggle="pill"
//                     data-bs-target={`#v-pills-${index}`}
//                     type="button"
//                     role="tab"
//                     aria-controls={`v-pills-${index}`}
//                     aria-selected={
//                       selectedBooking?.booking_id === booking.booking_id &&
//                       selectedBooking?.extension_id == booking?.extension_id
//                     }
//                     onClick={() => {
//                       setShowDiv(true);
//                       setSelectedBooking(booking);
//                       dispatch(setOneToOneChatData(booking));
//                     }}
//                   >
//                     <span
//                       style={{
//                         padding: "6px 4px 4px 6px",
//                         display: "flex",
//                         flexWrap: "nowrap",

//                         borderRadius: "10px",
//                         maxWidth: "600px",

//                         // marginBottom: "10px",
//                       }}
//                     >
//                       <div
//                         className="chat-list-in-image p-0 border-0 rounded-1"
//                         style={{
//                           overflow: "hidden",
//                           width: "80px",
//                           height: "80px",
//                         }}
//                       >
//                         <div className="h-100 p-0 border-0 rounded-1">
//                           <img
//                             src={
//                               userType === "host"
//                                 ? booking.guest_avatar
//                                   ? `${imageBase}${booking.guest_avatar}`
//                                   : "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg"
//                                 : booking?.property_image
//                                 ? `${imageBase}${booking.property_image}`
//                                 : "https://he.cecollaboratory.com/public/layouts/images/community-default-logo.png"
//                             }
//                             style={{
//                               border: isMobileWidth ? "none" : "2px solid #ccc",
//                               padding: isMobileWidth ? "0px" : "3px",
//                               borderRadius: isMobileWidth ? "20px" : "50%",
//                             }}
//                             alt={
//                               userType === "host"
//                                 ? booking.guest_name
//                                 : booking?.property_name
//                             }
//                           />
//                           {booking?.extension_id && (
//                             <div
//                               style={{
//                                 position: "absolute",
//                                 bottom: "0px",
//                                 right: "0px",
//                                 width: "max-content",
//                                 height: "max-content",
//                                 borderRadius: "50%",
//                                 backgroundColor: "#4AEAB1",
//                                 padding: "5px",
//                                 fontSize: "12px",
//                               }}
//                             >
//                               BTE
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div
//                         className="chat-list-in-content"
//                         // style={{ marginLeft: "20px" }}
//                       >
//                         <h1
//                           style={{
//                             fontSize: "18px",
//                             marginBottom: "5px",
//                             // whiteSpace: "normal",
//                             // overflow: "visible",
//                             // textOverflow: "unset",
//                             // fontWeight: "400",
//                             // color: "#000000",
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {userType === "host"
//                             ? booking.guest_name?.trim() || "No Name"
//                             : booking?.property_name?.trim() || "No Name"}
//                         </h1>
//                         <h2
//                           style={
//                             {
//                               // fontSize: "16px",
//                               // color: "#A4A4A4",
//                               // // marginBottom: "15px",
//                               // fontWeight: "400px",
//                             }
//                           }
//                         >
//                           {booking.booking_date}
//                         </h2>
//                         {userType == "host" &&
//                         booking.booking_status == "Pending" ? (
//                           <div style={{ display: "flex", gap: "3px" }}>
//                             {booking.is_approve && (
//                               <button
//                                 // className="btn btn-sm btn-success "
//                                 style={{
//                                   borderRadius: "25px",
//                                   fontWeight: "500",
//                                   padding: "5px 20px",
//                                   border: "1px solid #00BF7B",
//                                   color: "#00BF7B",
//                                   backgroundColor: "transparent",
//                                   cursor: "pointer",
//                                 }}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   openApproveDeclineModal("decline", booking);
//                                 }}
//                               >
//                                 Approve
//                               </button>
//                             )}

//                             <button
//                               // className="btn btn-sm btn-danger"
//                               style={{
//                                 border: "1px solid #FF1A00",
//                                 color: "#FF1A00",
//                                 backgroundColor: "transparent",
//                                 cursor: "pointer",
//                                 borderRadius: "25px",
//                                 padding: "5px 20px",
//                                 fontWeight: "400",
//                               }}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 openApproveDeclineModal("decline", booking);
//                               }}
//                             >
//                               Decline
//                             </button>
//                           </div>
//                         ) : (
//                           <span
//                             className="booking-tag"
//                             style={{
//                               backgroundColor:
//                                 booking.booking_status?.toLowerCase() ===
//                                 "confirmed"
//                                   ? "#85D6FF"
//                                   : booking.booking_status?.toLowerCase() ===
//                                     "pending"
//                                   ? "#ffc107"
//                                   : booking.booking_status?.toLowerCase() ===
//                                     "finished"
//                                   ? "#4AEAB1"
//                                   : booking.booking_status?.toLowerCase() ===
//                                     "awaiting payment"
//                                   ? "#FFF178"
//                                   : "#F5F6F6",
//                               // padding: "5px 15px",
//                               // borderRadius: "20px",
//                               fontSize: "16px",
//                               // fontWeight: "500",
//                               // color: "#3A4B4C",
//                               // width: "fit-content",
//                             }}
//                           >
//                             {booking.booking_status}
//                           </span>
//                         )}
//                       </div>
//                     </span>
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center mt-4">
//                 <p className="text-muted">No bookings found</p>
//               </div>
//             )}
//           </div>

//           <style>
//             {`
//       @media (max-width: 576px) {
//         .mobile-popup {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           z-index: 9999;
//           background: #fff;
//           overflow-y: auto;
//           padding: 0 !important;
//           margin: 0 !important;
//         }
//       }
//     `}
//           </style>
//           {/* Second Row */}
//           {viewDetails && showDiv ? (
//             // <div
//             //   className="w-100 mb-4"
//             //   style={{
//             //     flex: "1 0 400px",
//             //     overflowY: "auto",
//             //     maxHeight: "calc(110vh)",
//             //   }}
//             // >

//             <div
//               className="w-100 mb-4 mobile-popup"
//               style={{
//                 flex: "1 0 400px",
//                 overflowY: "auto",
//                 maxHeight: "calc(110vh)",
//               }}
//             >
//               <div className="mob-search-filter border-start-0 border-end-0">
//                 <div className="container-fluid">
//                   <div className="row">
//                     <div className="col-lg-12">
//                       <div className="mob-search-filter-in">
//                         <div className="mob-search-bar-back">
//                           <Link onClick={() => setShowDiv(false)}>
//                             <i
//                               className="fa-regular fa-arrow-left"
//                               style={{ textAlign: "center" }}
//                             ></i>
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <Container
//                 fluid
//                 className="border border-2 "
//                 style={{
//                   minWidth: "250px",
//                   borderRadius: isMobileWidth ? "0" : "20px",
//                   padding: isMobileWidth ? "" : "16px",
//                 }}
//               >
//                 {isMobileWidth && (
//                   <div
//                     className="col-lg-3 col-md-6"
//                     style={{ padding: isMobileWidth ? "10px 0px" : "16px" }}
//                   >
//                     <div className="chat-right">
//                       <div
//                         className="chat-right-top"
//                         style={{
//                           borderBottom: "2px solid #ccc",
//                           padding: "10px 0 10px 0",
//                           width: "100%",
//                           marginLeft: "0px",
//                         }}
//                       >
//                         {/* <h3>{userType === "host" ? "Guest by" : "Hosted by"}</h3> */}

//                         <div
//                           className="chat-right-top-profile d-flex align-items-center"
//                           // style={{ marginBottom: "10px" }}
//                         >
//                           <img
//                             className="chat-right-top-profile-image img-fluid"
//                             src={
//                               userType === "host"
//                                 ? selectedBooking?.guest_avatar
//                                   ? `${imageBase}${selectedBooking?.guest_avatar}`
//                                   : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                                 : selectedBooking?.host_image
//                                 ? `${imageBase}${selectedBooking?.host_image}`
//                                 : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                             }
//                             loading="lazy" alt="Profile"
//                             style={{
//                               width: "40px",
//                               height: "40px",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                             }}
//                           />
//                           <h2
//                             style={{
//                               marginLeft: "10px",
//                               fontSize: "1rem",
//                               wordWrap: "break-word",
//                             }}
//                           >
//                             {userType === "host"
//                               ? selectedBooking?.guest_name
//                                   ?.trim()
//                                   .split(" ")[0] + ".." || "No Name"
//                               : selectedBooking?.host_name
//                                   ?.trim()
//                                   .split(" ")[0] + ".."}
//                           </h2>

//                           {userType === "host" ? (
//                             <>
//                               <img
//                                 className="chat-right-top-batch-image"
//                                 src=" /images/locations-grid/star-icon.svg"
//                                 loading="lazy" alt="verified"
//                                 style={{ width: "20px" }}
//                               />{" "}
//                               {formatReview(guestReview)}
//                             </>
//                           ) : (
//                             <>
//                               {selectedBooking?.is_star_host && (
//                                 <img
//                                   className="chat-right-top-batch-image"
//                                   src="/images/bookings/verify-star.svg"
//                                   loading="lazy" alt="verified"
//                                   style={{ width: "20px" }}
//                                 />
//                               )}
//                             </>
//                           )}
//                         </div>

//                         <hr />

//                         <Link to="/helpCenter" style={{ border: "none" }}>
//                           <span>
//                             <img
//                               src="/images/create-profile/info.svg"
//                               loading="lazy" alt="info"
//                               className="px-2"
//                             />
//                             i need help
//                           </span>
//                         </Link>
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           marginTop: "18px",
//                           justifyContent: "space-around",
//                         }}
//                       >
//                         {userType === "host" &&
//                           (isMobileWidth ? (
//                             <a
//                               className="review-btn"
//                               style={{
//                                 // padding: "10px",
//                                 width: "fit-content",
//                                 marginBottom: "10px",
//                                 // display: "block",
//                               }}
//                             >
//                               <ReviewBookingPopup
//                                 booking_id={selectedBooking?.booking_id}
//                                 property_id={propertyId}
//                               />
//                             </a>
//                           ) : (
//                             (selectedBooking?.booking_status ===
//                               "Awaiting Payment" ||
//                               selectedBooking?.booking_status ===
//                                 "finished") && (
//                               <a
//                                 className="review-btn"
//                                 style={{
//                                   // padding: "10px",
//                                   marginBottom: "10px",
//                                   // display: "block",
//                                   width: "fit-content",
//                                 }}
//                               >
//                                 <ReviewBookingPopup
//                                   booking_id={selectedBooking?.booking_id}
//                                   property_id={propertyId}
//                                 />
//                               </a>
//                             )
//                           ))}

//                         {userType == "guest" &&
//                           (selectedBooking?.booking_status == "Finished" ? (
//                             <a
//                               className="review-btn"
//                               style={{
//                                 // padding: "10px",
//                                 marginBottom: "10px",
//                                 display: "flex",
//                                 justifyContent: "space-around",
//                               }}
//                             >
//                               <ReviewBookingPopup
//                                 booking_id={selectedBooking?.booking_id}
//                                 property_id={propertyId}
//                               />
//                             </a>
//                           ) : (
//                             (viewDetails.status
//                               ? viewDetails.status
//                               : selectedBooking?.booking_status) !=
//                               "Cancelled" && (
//                               <button
//                                 style={{
//                                   width: "auto",
//                                   padding: "10px 15px",
//                                   borderRadius: "10px",
//                                   border: "1px solid black",
//                                   // marginTop: "3px",
//                                   backgroundColor: "white",
//                                   marginBottom: "10px",
//                                   cursor: "pointer",
//                                   height: "fit-content",
//                                 }}
//                                 onClick={handleOpenModal}
//                               >
//                                 Cancel Booking
//                               </button>
//                             )
//                           ))}

//                         {selectedBooking?.booking_status === "Cancelled" &&
//                         userType != "host" ? (
//                           <button
//                             style={{
//                               // width: "70%",
//                               padding: "10px 42px",
//                               borderRadius: "10px",
//                               border: "1px solid black",
//                               backgroundColor: "white",
//                               marginBottom: "10px",
//                               cursor: "pointer",
//                               height:'fit-content'
//                             }}
//                             // disabled
//                           >
//                             Cancelled
//                           </button>
//                         ) : (
//                           ""
//                         )}

//                         <MessageHost
//                           type={userType === "host" ? "guest" : "host"}
//                           data={{
//                             sender_detail: selectedBooking,
//                             property_id: selectedBooking?.booking_id,
//                           }}
//                         />

//                         <CancelPopup
//                           isOpen={showCancelModal}
//                           userId={userId}
//                           booking_Id={viewDetails?.booking_id}
//                           amount={viewDetails?.booking_total_amount}
//                           onCancel={handleCancel}
//                           onClose={() => {
//                             handleCancel();
//                           }}
//                           onConfirm={() => {
//                             fetchBookingList();
//                             fetchGuestDetailsData();
//                             handleCancel();
//                           }}
//                         />
//                       </div>

//                       {userType === "host" && (
//                         <>
//                           <div
//                             style={{ textAlign: "center", marginTop: "10px" }}
//                           >
//                             <a
//                               href="#"
//                               onClick={() => {
//                                 propertyId
//                                   ? setShowReportModal(true)
//                                   : toast.error(
//                                       "Please select a booking first"
//                                     );
//                               }}
//                               style={{
//                                 width: "120%",
//                                 borderRadius: "10px",
//                                 border: "1px solid black",
//                                 backgroundColor: "white",
//                                 color: "black",
//                                 marginBottom: "10px",
//                                 cursor: "pointer",
//                                 listStyle: "none",
//                                 padding: "10px 30px",
//                                 marginTop: "10px",
//                               }}
//                             >
//                               {isMobileWidth
//                                 ? "Report an issue"
//                                 : "Report Violation"}
//                             </a>
//                           </div>

//                           {showReportModal && (
//                             <ReportBookingModal
//                               // style={{ margin: "10px" }}
//                               onClose={() => setShowReportModal(false)}
//                             />
//                           )}
//                         </>
//                       )}

//                       <div
//                         className="chat-right-bottom bg-white"
//                         style={{ marginBottom: "18px" }}
//                       >
//                         <div className="chat-right-bottom-in d-flex flex-wrap">
//                           <div
//                             className="chat-right-bottom-in-image "
//                             style={{
//                               display: "flex",
//                               flexDirection: "row",
//                               gap: "1rem",
//                             }}
//                           >
//                             <img
//                               src={
//                                 userType == "host"
//                                   ? viewDetails?.images?.[0]
//                                     ? imageBase + viewDetails?.images?.[0]
//                                     : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                                   : viewDetails?.first_property_image
//                                   ? imageBase +
//                                     viewDetails?.first_property_image
//                                   : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                               }
//                               loading="lazy" alt="property"
//                               className="img-fluid"
//                               style={{
//                                 // width: "60px",
//                                 // height: "70px",
//                                 borderRadius: "10px",
//                               }}
//                             />
//                           </div>
//                           <div className="chat-right-bottom-in-text">
//                             <h1
//                               style={{
//                                 fontSize: "1.1rem",
//                                 wordWrap: "break-word",
//                               }}
//                             >
//                               {userType == "host"
//                                 ? viewDetails?.property_title ||
//                                   "Cabin in Peshastin"
//                                 : viewDetails?.property_name ||
//                                   "Cabin in Peshastin"}
//                             </h1>
//                             <p>
//                               <FaStar
//                                 className="text-warning"
//                                 style={{ marginTop: "-2px" }}
//                               />
//                               {formatReview(
//                                 reviewPagination?.average_review_rating
//                               )}{" "}
//                               ({reviewPagination?.total}){" "}
//                             </p>
//                             <p>
//                               <MdOutlineMyLocation className="text-secondary" />
//                               {viewDetails?.distance_miles} miles away
//                             </p>
//                           </div>
//                         </div>

//                         {userType == "host" ? (
//                           <ul style={{ padding: "10px" }}>
//                             <li>
//                               {viewDetails?.booking_hour} hours
//                               <span>
//                                 ${formatCurrency(viewDetails?.booking_amount)}
//                               </span>
//                             </li>
//                             {viewDetails?.cleaning_fee > 0 && (
//                               <li>
//                                 Cleaning Fee
//                                 <span>
//                                   ${formatCurrency(viewDetails?.cleaning_fee)}
//                                 </span>
//                               </li>
//                             )}

//                             {viewDetails?.service_fee > 0 && (
//                               <li>
//                                 Zyvo Service Fee
//                                 <span>
//                                   ${formatCurrency(viewDetails?.service_fee)}
//                                 </span>
//                               </li>
//                             )}

//                             {viewDetails?.tax > 0 && (
//                               <li>
//                                 Taxes{" "}
//                                 <span>${formatCurrency(viewDetails?.tax)}</span>
//                               </li>
//                             )}

//                             {viewDetails?.add_on_total > 0 && (
//                               <li>
//                                 Add-on
//                                 <span>
//                                   ${formatCurrency(viewDetails?.add_on_total)}
//                                 </span>
//                               </li>
//                             )}

//                             {viewDetails?.discount > 0 && (
//                               <li>
//                                 discount
//                                 <span>
//                                   -${formatCurrency(viewDetails?.discount)}
//                                 </span>
//                               </li>
//                             )}

//                             <li className="total-cost">
//                               Total
//                               <span>
//                                 $
//                                 {formatCurrency(
//                                   viewDetails?.booking_total_amount
//                                 )}
//                               </span>
//                             </li>
//                           </ul>
//                         ) : (
//                           <ul style={{ paddingTop: "7px" }}>
//                             <li>
//                               {viewDetails?.charges?.booking_hours} hours
//                               <span>
//                                 $
//                                 {formatCurrency(
//                                   viewDetails?.charges?.booking_amount
//                                 )}
//                               </span>
//                             </li>
//                             {viewDetails?.charges?.cleaning_fee > 0 && (
//                               <li>
//                                 Cleaning Fee
//                                 <span>
//                                   $
//                                   {formatCurrency(
//                                     viewDetails?.charges?.cleaning_fee
//                                   )}
//                                 </span>
//                               </li>
//                             )}

//                             {viewDetails?.charges?.zyvo_service_fee > 0 && (
//                               <li>
//                                 Zyvo Service Fee
//                                 <span>
//                                   $
//                                   {formatCurrency(
//                                     viewDetails?.charges?.zyvo_service_fee
//                                   )}
//                                 </span>
//                               </li>
//                             )}

//                             {viewDetails?.charges?.taxes > 0 && (
//                               <li>
//                                 Taxes{" "}
//                                 <span>
//                                   ${formatCurrency(viewDetails?.charges?.taxes)}
//                                 </span>
//                               </li>
//                             )}

//                             {viewDetails?.charges?.add_on_price > 0 && (
//                               <li>
//                                 Add-on
//                                 <span>
//                                   $
//                                   {formatCurrency(
//                                     viewDetails?.charges?.add_on_price
//                                   )}
//                                 </span>
//                               </li>
//                             )}
//                             {viewDetails?.charges?.discount > 0 && (
//                               <li>
//                                 discount
//                                 <span>
//                                   -$
//                                   {formatCurrency(
//                                     viewDetails?.charges?.discount
//                                   )}
//                                 </span>
//                               </li>
//                             )}

//                             <li className="total-cost">
//                               Total
//                               <span>
//                                 ${formatCurrency(viewDetails?.charges?.total)}
//                               </span>
//                             </li>
//                           </ul>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="booking-mid-top location-top">
//                   <h2>
//                     {userType == "host"
//                       ? viewDetails?.property_title
//                       : viewDetails?.property_name}
//                     <div
//                       className="booking-tag finished"
//                       style={{
//                         backgroundColor:
//                           (userType == "host"
//                             ? viewDetails?.booking_status
//                             : viewDetails?.status) == "Confirmed"
//                             ? "#85D6FF"
//                             : (userType == "host"
//                                 ? viewDetails?.booking_status
//                                 : viewDetails?.status) == "Pending"
//                             ? "#ffc107"
//                             : (userType == "host"
//                                 ? viewDetails?.booking_status
//                                 : viewDetails?.status) == "Finished"
//                             ? "#4AEAB1"
//                             : (userType == "host"
//                                 ? viewDetails?.booking_status
//                                 : viewDetails?.status) == "Waiting_payment"
//                             ? "#FFF178"
//                             : "#ebe1e1",
//                         padding: "5px 15px",
//                       }}
//                     >
//                       {userType == "host"
//                         ? viewDetails?.booking_status
//                         : viewDetails?.status}
//                     </div>
//                   </h2>

//                   {userType == "guest" && (
//                     <ul>
//                       <li
//                         style={{
//                           cursor: "pointer",
//                           color: "#007BFF",
//                           display: "block",
//                         }}
//                       >
//                         <Link
//                           href="#"
//                           onClick={() => setShowModal(true)}
//                           style={{ textDecoration: "none", color: "black" }}
//                         >
//                           <i className="fa-solid fa-share-nodes me-1 light-gray "></i>
//                           Share
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#" onClick={handleWishlistClick}>
//                           <i
//                             className={`fa-solid fa-heart me-1 ${
//                               userType == "host"
//                                 ? viewDetails?.wishlist
//                                 : viewDetails?.is_in_wishlist
//                                 ? "text-danger"
//                                 : "light-gray"
//                             }`}
//                           ></i>
//                           favorite
//                         </Link>
//                       </li>
//                     </ul>
//                   )}
//                   {showModal && (
//                     <ShareModal onClose={() => setShowModal(false)} />
//                   )}
//                 </div>
//                 {/* <div className={`top-grid-bookinghost-h top-grid-images-${viewDetails?.images?.length <5 ? 5 : viewDetails?.images?.length || viewDetails?.property_images?.length >5 ? 5 : viewDetails?.property_images?.length}`}> */}
//                 <div className={`top-grid-bookinghost-h top-grid-images-${
//                     userType === "host"
//                       ? viewDetails?.images?.length && viewDetails?.images?.length < 5
//                         ? viewDetails?.images?.length : 5
//                       : viewDetails?.property_images?.length && viewDetails?.property_images?.length < 5
//                       ? viewDetails?.property_images?.length : 5
//                   }`}
//                 >
//                   <div className="top-grid-images-left">
//                     {(viewDetails?.images?.[0] ||
//                       viewDetails?.first_property_image?.[0]) && (
//                       <img src={ userType == "host"
//                             ? Array.isArray(viewDetails?.images) &&
//                               imageBase + viewDetails?.images[0] &&
//                               imageBase + viewDetails?.images?.[0]
//                             : imageBase + viewDetails?.first_property_image
//                         }
//                         loading="lazy" alt="Main Property"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           display: "block",
//                         }}
//                       />
//                     )}
//                   </div>

//                   <div className="top-grid-images-right">
//                     {userType == "host"
//                       ? viewDetails?.images?.slice(1, 5).map((item, index) => (
//                             <img key={index} src={`https://zyvo.tgastaging.com/${item}`}
//                               loading="lazy" alt="Main Property"
//                             />
//                           ))
//                       : viewDetails?.property_images?.slice(1, 5).map((item, index) => (
//                             <img src={imageBase + item} key={index} loading="lazy" alt="Main Property" />
//                           ))}
//                   </div>
//                 </div>

//                 <hr />

//                 <Container className="px-2 pt-2" style={{ fontSize: "13px" }} >
//                   <h5 className="mb-3">Booking Details</h5>
//                   <div className="nw-bookingdtl-list-wrp">
//                     <div
//                       className="nw-bookingdtl-list"
//                       style={{
//                         width: "100%",
//                         flexWrap: isMobileWidth ? "wrap" : "nowrap",
//                       }}
//                     >
//                       {[
//                         [
//                           "calendar-icon.svg",
//                           userType == "host"
//                             ? viewDetails?.booking_date
//                             : viewDetails?.booking_detail?.date || "date",
//                         ],
//                         [
//                           "time.svg",

//                           userType == "host"
//                             ? `${
//                                 Number(viewDetails?.original_booking_hour) ||
//                                 "no data"
//                               } hours
//                             `
//                             : `${
//                                 viewDetails?.booking_detail?.time || "no data"
//                               }  `,
//                         ],
//                         [
//                           "time.svg",

//                           userType == "host"
//                             ? ` From ${
//                                 viewDetails?.booking_start_time || "start time"
//                               } to ${
//                                 viewDetails?.booking_end_time || "end time"
//                               }`
//                             : `${
//                                 viewDetails?.booking_detail?.time || "no data"
//                               }  |  ${
//                                 viewDetails?.booking_detail?.start_end_time ||
//                                 "start time"
//                               }`,
//                         ],

//                         [
//                           "price.svg",
//                           userType == "host"
//                             ? parseFloat(viewDetails?.original_booking_amount)
//                             : parseFloat(viewDetails?.charges?.booking_amount),
//                         ],
//                       ].map(
//                         ([icon, text], i) =>
//                           ((isMobileWidth && i !== 3) ||
//                             (!isMobileWidth && i !== 1)) && (
//                             <div
//                               key={i}
//                               className="d-flex align-items-center gap-2 p-2 border rounded-pill "
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               <Image
//                                 src={`/images/filters/${icon}`}
//                                 loading="lazy" alt=""
//                                 width="20"
//                               />
//                               <span>{text}</span>
//                             </div>
//                           )
//                       )}
//                     </div>
//                   </div>
//                 </Container>
//                 {/* <Container className="px-2 px-md-3 pt-2" style={{ fontSize: "13px" }}>
//   <div className="location-left">
//     <h2>Booking Details</h2>
//     <div className="booking-details">
//       <ul>
//         {[
//           [
//             "calendar-icon.svg",
//             userType === "host"
//               ? viewDetails?.booking_date
//               : viewDetails?.booking_detail?.date || "date",
//           ],
//           [
//             "time.svg",
//             userType === "host"
//               ? `${
//                   Number(viewDetails?.original_booking_hour) || "no data"
//                 } hours | From ${
//                   viewDetails?.booking_start_time || "start time"
//                 } to ${viewDetails?.booking_end_time || "end time"}`
//               : `${
//                   viewDetails?.booking_detail?.time || "no data"
//                 }  |  ${
//                   viewDetails?.booking_detail?.start_end_time || "start time"
//                 }`,
//           ],
//           [
//             "price.svg",
//             userType === "host"
//               ? `$${parseFloat(viewDetails?.original_booking_amount)}`
//               : `$${parseFloat(viewDetails?.charges?.booking_amount)}`,
//           ],
//         ].map(([icon, text], i) => (
//           <li key={i}>
//             <img src={`/images/filters/${icon}`} loading="lazy" alt="" /> {text}
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// </Container> */}

//                 {isMobileWidth && <hr />}

//                 {viewDetails?.extension_details && (
//                   <Container
//                     className="px-2 px-md-3 pb-2 mt-3"
//                     style={{ fontSize: "13px" }}
//                   >
//                     <h5 className="mb-3">Booking Time Extension (BTE)</h5>
//                     {isMobileWidth ? (
//                       <div className="overflow-auto pb-2">
//                         <div
//                           className="d-inline-flex gap-2 "
//                           style={{
//                             width: "100%",
//                             flexWrap: isMobileWidth ? "wrap" : "nowrap",
//                           }}
//                         >
//                           {[
//                             [
//                               "calendar-icon.svg",
//                               viewDetails?.extension_details?.extension_date ||
//                                 "date",
//                             ],
//                             [
//                               "time.svg",
//                               `${
//                                 viewDetails?.extension_details
//                                   ?.extension_hours || "no data"
//                               } hours`,
//                             ],
//                             [
//                               "time.svg",
//                               `From ${
//                                 viewDetails?.extension_details
//                                   ?.extension_start_time || "start time"
//                               } to ${
//                                 viewDetails?.extension_details
//                                   ?.extension_end_time || "end time"
//                               }`,
//                             ],
//                             [
//                               "price.svg",
//                               parseFloat(
//                                 viewDetails?.extension_details
//                                   ?.extension_booking_amount
//                               ),
//                             ],
//                           ].map(([icon, text], i) => (
//                             <div
//                               key={i}
//                               className="d-flex align-items-center gap-2 p-2 border rounded-pill"
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               <Image
//                                 src={`/images/filters/${icon}`}
//                                 loading="lazy" alt=""
//                                 width="20"
//                               />
//                               <span>{text}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="overflow-auto pb-2">
//                         <div
//                           className="d-inline-flex gap-2 "
//                           style={{
//                             width: "100%",
//                             flexWrap: isMobileWidth ? "wrap" : "nowrap",
//                           }}
//                         >
//                           {[
//                             [
//                               "calendar-icon.svg",
//                               viewDetails?.extension_details?.extension_date ||
//                                 "date",
//                             ],
//                             [
//                               "time.svg",
//                               `${
//                                 viewDetails?.extension_details
//                                   ?.extension_hours || "no data"
//                               } hours | From ${
//                                 viewDetails?.extension_details
//                                   ?.extension_start_time || "start time"
//                               } to ${
//                                 viewDetails?.extension_details
//                                   ?.extension_end_time || "end time"
//                               }`,
//                             ],
//                             [
//                               "price.svg",
//                               parseFloat(
//                                 viewDetails?.extension_details
//                                   ?.extension_booking_amount
//                               ),
//                             ],
//                           ].map(([icon, text], i) => (
//                             <div
//                               key={i}
//                               className="d-flex align-items-center gap-2 p-2 border rounded-pill"
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               <Image
//                                 src={`/images/filters/${icon}`}
//                                 loading="lazy" alt=""
//                                 width="20"
//                               />
//                               <span>{text}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </Container>

//                   // <Container className="px-2 px-md-3 pt-2" style={{fontSize: "13px"}} >
//                   //   <div className="location-left">
//                   //     <h2>Booking Time Extension (BTE)</h2>
//                   //     <div className="booking-details" >
//                   //       <ul>
//                   //         {[
//                   //           [
//                   //             "calendar-icon.svg",
//                   //             viewDetails?.extension_details?.extension_date || "date",
//                   //           ],
//                   //           [
//                   //             "time.svg",
//                   //             `${viewDetails?.extension_details?.extension_hours || "no data"
//                   //             } hours | From ${viewDetails?.extension_details?.extension_start_time || "start time"
//                   //             } to ${viewDetails?.extension_details?.extension_end_time || "end time"
//                   //             }`,
//                   //           ],
//                   //           [
//                   //             "price.svg",
//                   //             `${parseFloat(viewDetails?.extension_details?.extension_booking_amount)}`,
//                   //           ],
//                   //         ].map(([icon, text], i) => (
//                   //           <li key={i}>
//                   //             <img src={`/images/filters/${icon}`} loading="lazy" alt="" /> {text}
//                   //           </li>
//                   //         ))}
//                   //       </ul>
//                   //     </div>
//                   //   </div>
//                   // </Container>
//                 )}

//                 <hr />

//                 <Container
//                   className=" bg-white rounded shadow-sm"
//                   style={{ padding: isMobileWidth ? "0px" : "16px" }}
//                 >
//                   <h5 className="mb-3">Included in your booking</h5>
//                   <Row>
//                     {viewDetails?.amenities?.map((amenity, index) => (
//                       <Col
//                         key={index}
//                         md="auto"
//                         className="mb-3"
//                         style={{ width: isMobileWidth ? "33%" : "" }}
//                       >
//                         <Card
//                           style={{
//                             border: "1px solid rgba(0, 0, 0, .2)",
//                             borderRadius: "10px",
//                           }}
//                           className="d-flex align-items-center p-1 bg-white"
//                         >
//                           <Card.Body
//                             className="d-flex align-items-center p-1 p-lg-2"
//                             style={{
//                               wordBreak: "break-word",
//                               fontSize: isMobileWidth ? "12px" : "",
//                             }}
//                           >
//                             <span className="text-black">{amenity}</span>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                 </Container>

//                 <hr />

//                 <div className="accordion mt-3" id="rulesAccordion">
//                   <div className="container">
//                     <h5 className="mb-3">Rules</h5>
//                     {[
//                       {
//                         id: "collapseOne",
//                         label: "Parking",
//                         icon: "1.svg",
//                         content:
//                           viewDetails?.parking_rules ||
//                           "This section describes the parking rules in detail.",
//                       },
//                       {
//                         id: "collapseTwo",
//                         label: "Host rules",
//                         icon: "7.svg",
//                         content:
//                           viewDetails?.host_rules ||
//                           "This section describes the host rules in detail.",
//                       },
//                     ].map(({ id, label, icon, content }) => (
//                       <div
//                         className="accordion-item border rounded mb-2"
//                         key={id}
//                       >
//                         <h2 className="accordion-header">
//                           <button
//                             className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
//                               open === id ? "" : "collapsed"
//                             }`}
//                             type="button"
//                             onClick={() => toggleAccordion(id)}
//                             style={{ padding: "12px" }}
//                           >
//                             <img
//                               src={`/images/location/included/${icon}`}
//                               alt={`${label} Icon`}
//                               className="me-2"
//                               style={{ width: "20px", height: "20px" }}
//                             />
//                             <span className="flex-grow-1">{label}</span>
//                             <img
//                               src={`/images/dropdown.svg`}
//                               alt={`Dropdown Icon`}
//                               className="ms-auto"
//                               style={{ width: "12px" }}
//                             />
//                           </button>
//                         </h2>
//                         {open === id && (
//                           <div className="shadow rounded mt-2">
//                             {[...Array(1)].map((_, i) => (
//                               <div
//                                 key={i}
//                                 className="accordion-body bg-light m-2 p-2 rounded"
//                               >
//                                 {content}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <hr />

//                 <Row>
//                   <Col xs={12}>
//                     <h5>Address & Location </h5>
//                     <p>{/* <u>{viewDetails?.address}</u> */}</p>
//                     <Map
//                       lat={viewDetails?.latitude}
//                       lng={viewDetails?.longitude}
//                     />
//                   </Col>
//                 </Row>
//                 <hr />

//                 <Row>
//                   <Col
//                     xs={12}
//                     className="location-reviews mt-4"
//                     style={{ marginTop: isMobileWidth ? "0px " : "64px" }}
//                   >
//                     <h5>
//                       {" "}
//                       Reviews{" "}
//                       {isMobileWidth
//                         ? reviewPagination?.total ?? reviewPagination?.total
//                         : ""}
//                     </h5>
//                     <div
//                       className="location-reviews-top d-flex flex-wrap align-items-center"
//                       style={{ gap: isMobileWidth ? "0px" : "" }}
//                     >
//                       <h6 className="me-auto">
//                         <img src="/images/locations-grid/star-icon.svg" />
//                         {reviewPagination?.average_review_rating} rating
//                       </h6>
//                       <p
//                         className="mb-0 "
//                         style={{ marginEnd: isMobileWidth ? "0" : "32px" }}
//                       >
//                         Sort by:
//                       </p>
//                       <Dropdown
//                         onSelect={(eventKey) => {
//                           setReviewFilter(eventKey);
//                           setCount((prev) => prev + 1);
//                         }}
//                         className="chat-left-top-dropdown"
//                       >
//                         <Dropdown.Toggle
//                           variant="light"
//                           className="dropdown-toggle"
//                           style={{ marginTop: "-4px" }}
//                         >
//                           {filterLabel[reviewFilter]}
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu className="chat-left-top-dropdown-list">
//                           <Dropdown.Item eventKey="highest_review">
//                             Highest Review
//                           </Dropdown.Item>
//                           <Dropdown.Item eventKey="lowest_review">
//                             Lowest Review
//                           </Dropdown.Item>
//                           <Dropdown.Item eventKey="recent_review">
//                             Recent Reviews
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </div>

//                     {/* {
//                     isMobileWidth
//                   } */}

//                     {reviews.map((review, index) => (
//                       <Row
//                         key={index}
//                         className="border p-3 rounded align-items-center mt-3"
//                       >
//                         <Col
//                           xs={12}
//                           md={8}
//                           className="d-flex align-items-center"
//                         >
//                           <Image
//                             src={`${imageBase}${review?.profile_image}`}
//                             roundedCircle
//                             style={{
//                               padding: "2px",
//                               border: "2px solid #E4E4E4",
//                               marginRight: "15px",
//                             }}
//                             width="70"
//                             height="70"
//                             // className="me-3"
//                           />
//                           <div>
//                             <h6
//                               className="mb-1"
//                               style={{ fontWeight: "600", color: "#3F3D56" }}
//                             >
//                               {review?.reviewer_name}
//                             </h6>
//                             <p
//                               className="mb-0 text-muted"
//                               style={{ fontSize: "14px" }}
//                             >
//                               {review?.review_message}
//                             </p>
//                           </div>
//                         </Col>
//                         <Col
//                           xs={12}
//                           md={4}
//                           className="text-md-end mt-2 mt-md-0"
//                         >
//                           <LocationReviewStars rating={review?.review_rating} />
//                           <small className="text-muted d-block">
//                             {review?.review_date}
//                           </small>
//                         </Col>
//                       </Row>
//                     ))}

//                     {reviews?.length == 0 ? (
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           padding: "10px",
//                         }}
//                       >
//                         No Review Found
//                       </div>
//                     ) : (
//                       <div className="text-center mt-3">
//                         {reviews.length > 3 && showMoreBtn && (
//                           <button
//                             className="location-reviews-btn"
//                             type="button"
//                             onClick={() => setPage((prev) => prev + 1)}
//                           >
//                             Show More Reviews
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </Col>
//                 </Row>
//               </Container>
//             </div>
//           ) : (
//             !isMobileWidth && (
//               <div
//                 className="w-100 mb-4"
//                 style={{
//                   flex: "1 0 400px",
//                   overflowY: "auto",
//                   height: "100vh",
//                 }}
//               >
//                 <Container
//                   fluid
//                   className="border border-2 p-lg-3"
//                   style={{ minWidth: "250px", height: "100vh" }}
//                 >
//                   <div className="h-100 d-flex justify-content-center align-items-center text-center">
//                     Please select a booking to view details.
//                   </div>
//                 </Container>
//               </div>
//             )
//           )}

//           {/* Third Row */}
//           {viewDetails && !isMobileWidth ? (
//             <div className="col-lg-3 col-md-6">
//               <div className="chat-right">
//                 <div className="chat-right-top">
//                   <h3>{userType === "host" ? "Guest by" : "Hosted by"}</h3>

//                   <div className="chat-right-top-profile d-flex align-items-center">
//                     <img
//                       className="chat-right-top-profile-image img-fluid"
//                       src={
//                         userType === "host"
//                           ? selectedBooking?.guest_avatar
//                             ? `${imageBase}${selectedBooking?.guest_avatar}`
//                             : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                           : selectedBooking?.host_image
//                           ? `${imageBase}${selectedBooking?.host_image}`
//                           : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                       }
//                       loading="lazy" alt="Profile"
//                       style={{
//                         width: "50px",
//                         height: "50px",
//                         borderRadius: "50%",
//                         objectFit: "cover",
//                       }}
//                     />
//                     <h2
//                       style={{
//                         marginLeft: "10px",
//                         fontSize: "1rem",
//                         wordWrap: "break-word",
//                       }}
//                     >
//                       {userType === "host"
//                         ? selectedBooking?.guest_name?.trim() || "No Name"
//                         : selectedBooking?.host_name?.trim() || "John Doe"}
//                     </h2>

//                     {userType === "host" ? (
//                       <>
//                         <img
//                           className="chat-right-top-batch-image"
//                           src=" /images/locations-grid/star-icon.svg"
//                           loading="lazy" alt="verified"
//                           style={{ width: "20px" }}
//                         />{" "}
//                         {formatReview(guestReview)}
//                       </>
//                     ) : (
//                       <>
//                         {selectedBooking?.is_star_host && (
//                           <img
//                             className="chat-right-top-batch-image"
//                             src="/images/bookings/verify-star.svg"
//                             loading="lazy" alt="verified"
//                             style={{ width: "20px" }}
//                           />
//                         )}
//                       </>
//                     )}
//                   </div>

//                   <hr />
//                   {userType === "host" &&
//                     (selectedBooking?.booking_status === "Awaiting Payment" ||
//                       selectedBooking?.booking_status === "finished") && (
//                       <a
//                         className="review-btn"
//                         style={{
//                           padding: "10px",
//                           marginBottom: "10px",
//                           display: "block",
//                           height:'fit-content'
//                         }}
//                       >
//                         <ReviewBookingPopup
//                           booking_id={selectedBooking?.booking_id}
//                           property_id={propertyId}
//                         />
//                       </a>
//                     )}

//                   {userType == "guest" &&
//                     (selectedBooking?.booking_status == "Finished" ? (
//                       <a
//                         className="review-btn"
//                         style={{
//                           padding: "10px",
//                           marginBottom: "10px",
//                           display: "block",
//                           height:'fit-content'
//                         }}
//                       >
//                         <ReviewBookingPopup
//                           booking_id={selectedBooking?.booking_id}
//                           property_id={propertyId}
//                         />
//                       </a>
//                     ) : (
//                       (viewDetails.status
//                         ? viewDetails.status
//                         : selectedBooking?.booking_status) != "Cancelled" && (
//                         <button
//                           style={{
//                             width: "100%",
//                             padding: "clamp(8px, 1.5vw, 10px)",
//                             borderRadius: "5px",
//                             border: "1px solid black",
//                             marginTop: "3px",
//                             backgroundColor: "white",
//                             marginBottom: "10px",
//                             cursor: "pointer",
//                           }}
//                           onClick={handleOpenModal}
//                         >
//                           Cancel Booking
//                         </button>
//                       )
//                     ))}

//                   <MessageHost
//                     type={userType === "host" ? "guest" : "host"}
//                     data={{
//                       sender_detail: selectedBooking,
//                       property_id: selectedBooking?.booking_id,
//                     }}
//                   />

//                   <a
//                     href="#"
//                     onClick={() => {
//                       propertyId
//                         ? setShowReportModal(true)
//                         : toast.error("Please select a booking first");
//                     }}
//                     style={{ display: "block", marginBottom: "10px" }}
//                   >
//                     Report Violation
//                   </a>

//                   {showReportModal && (
//                     <ReportBookingModal
//                       style={{ margin: "10px" }}
//                       onClose={() => setShowReportModal(false)}
//                     />
//                   )}
//                   <CancelPopup
//                     isOpen={showCancelModal}
//                     userId={userId}
//                     booking_Id={viewDetails?.booking_id}
//                     amount={viewDetails?.booking_total_amount}
//                     onCancel={handleCancel}
//                     onClose={() => {
//                       handleCancel();
//                     }}
//                     onConfirm={() => {
//                       fetchBookingList();
//                       fetchGuestDetailsData();
//                       handleCancel();
//                     }}
//                   />
//                 </div>

//                 <div className="chat-right-bottom bg-white">
//                   <div className="chat-right-bottom-in d-flex flex-wrap">
//                     <div
//                       className="chat-right-bottom-in-image "
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: "1rem",
//                       }}
//                     >
//                       <img
//                         src={
//                           userType == "host"
//                             ? viewDetails?.images?.[0]
//                               ? imageBase + viewDetails?.images?.[0]
//                               : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                             : viewDetails?.first_property_image
//                             ? imageBase + viewDetails?.first_property_image
//                             : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                         }
//                         loading="lazy" alt="property"
//                         className="img-fluid"
//                         style={{
//                           // width: "60px",
//                           // height: "70px",
//                           borderRadius: "10px",
//                         }}
//                       />
//                     </div>
//                     <div className="chat-right-bottom-in-text">
//                       <h1
//                         style={{ fontSize: "1.1rem", wordWrap: "break-word" }}
//                       >
//                         {userType == "host"
//                           ? viewDetails?.property_title || "Cabin in Peshastin"
//                           : viewDetails?.property_name || "Cabin in Peshastin"}
//                       </h1>
//                       <p>
//                         <FaStar
//                           className="text-warning"
//                           style={{ marginTop: "-2px" }}
//                         />
//                         {formatReview(reviewPagination?.average_review_rating)}{" "}
//                         ({reviewPagination?.total}){" "}
//                       </p>
//                       <p>
//                         <MdOutlineMyLocation className="text-secondary" />
//                         {viewDetails?.distance_miles} miles away
//                       </p>
//                     </div>
//                   </div>

//                   <hr />
//                   {userType == "host" ? (
//                     <ul>
//                       <li>
//                         {viewDetails?.booking_hour} hours
//                         <span>
//                           ${formatCurrency(viewDetails?.booking_amount)}
//                         </span>
//                       </li>
//                       {viewDetails?.cleaning_fee > 0 && (
//                         <li>
//                           Cleaning Fee
//                           <span>
//                             ${formatCurrency(viewDetails?.cleaning_fee)}
//                           </span>
//                         </li>
//                       )}

//                       {viewDetails?.service_fee > 0 && (
//                         <li>
//                           Zyvo Service Fee
//                           <span>
//                             ${formatCurrency(viewDetails?.service_fee)}
//                           </span>
//                         </li>
//                       )}

//                       {viewDetails?.tax > 0 && (
//                         <li>
//                           Taxes <span>${formatCurrency(viewDetails?.tax)}</span>
//                         </li>
//                       )}

//                       {viewDetails?.add_on_total > 0 && (
//                         <li>
//                           Add-on
//                           <span>
//                             ${formatCurrency(viewDetails?.add_on_total)}
//                           </span>
//                         </li>
//                       )}

//                       {viewDetails?.discount > 0 && (
//                         <li>
//                           discount
//                           <span>-${formatCurrency(viewDetails?.discount)}</span>
//                         </li>
//                       )}

//                       <li className="total-cost">
//                         Total
//                         <span>
//                           ${formatCurrency(viewDetails?.booking_total_amount)}
//                         </span>
//                       </li>
//                     </ul>
//                   ) : (
//                     <ul>
//                       <li>
//                         {viewDetails?.charges?.booking_hours} hours
//                         <span>
//                           $
//                           {formatCurrency(viewDetails?.charges?.booking_amount)}
//                         </span>
//                       </li>
//                       {viewDetails?.charges?.cleaning_fee > 0 && (
//                         <li>
//                           Cleaning Fee
//                           <span>
//                             $
//                             {formatCurrency(viewDetails?.charges?.cleaning_fee)}
//                           </span>
//                         </li>
//                       )}

//                       {viewDetails?.charges?.zyvo_service_fee > 0 && (
//                         <li>
//                           Zyvo Service Fee
//                           <span>
//                             $
//                             {formatCurrency(
//                               viewDetails?.charges?.zyvo_service_fee
//                             )}
//                           </span>
//                         </li>
//                       )}

//                       {viewDetails?.charges?.taxes > 0 && (
//                         <li>
//                           Taxes{" "}
//                           <span>
//                             ${formatCurrency(viewDetails?.charges?.taxes)}
//                           </span>
//                         </li>
//                       )}

//                       {viewDetails?.charges?.add_on_price > 0 && (
//                         <li>
//                           Add-on
//                           <span>
//                             $
//                             {formatCurrency(viewDetails?.charges?.add_on_price)}
//                           </span>
//                         </li>
//                       )}
//                       {viewDetails?.charges?.discount > 0 && (
//                         <li>
//                           discount
//                           <span>
//                             -${formatCurrency(viewDetails?.charges?.discount)}
//                           </span>
//                         </li>
//                       )}

//                       <li className="total-cost">
//                         Total
//                         <span>
//                           ${formatCurrency(viewDetails?.charges?.total)}
//                         </span>
//                       </li>
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="col-lg-3 col-md-6">
//               <div className="chat-right"> </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <ReportBookingModal
//         show={showReportModal}
//         handleClose={() => setShowReportModal(false)}
//         user_id={userId}
//         booking_id={selectedBooking?.booking_id}
//         property_id={propertyId}
//       />
//       <AddToWishlistModal
//         wishlistArr={wishlistArr}
//         showAddWishlistModal={showAddWishlistModal}
//         propertyId={selectedBooking?.property_id}
//         userId={userId}
//         handleClose={() => {
//           // fetchDetailsData(viewDetails);
//           userType == "host"
//             ? fetchDetailsData(selectedBooking)
//             : fetchGuestDetailsData(selectedBooking);
//           setShowAddWishlistModal(false);
//         }}
//       />
//       <ApproveDeclineModal
//         show={approveDeclineModal.show}
//         status={approveDeclineModal.status}
//         data={approveDeclineModal.data}
//         onClose={closeApproveDeclineModal}
//         onSubmit={handleStatusUpdate}
//       />
//     </>
//   );
// };

// export default BookingHost;

// const ApproveDeclineModal = ({ show, status, data, onClose, onSubmit }) => {
//   const [message, setMessage] = useState("");
//   const [selectedReason, setSelectedReason] = useState("");
//   const [error, setshowError] = useState("");

//   const reasons = ["I'm overbooked", "Maintenance day", "Other reason"];

//   const handleSubmit = () => {
//     if (status === "decline" && !selectedReason) {
//       setshowError("dropdown");
//       return;
//     }

//     if (message.trim() === "") {
//       setshowError("message");
//       return;
//     }

//     const finalMessage =
//       status === "approve"
//         ? message
//         : `${selectedReason}${message ? `: ${message}` : ""}`;

//     onSubmit({ data, status, message: finalMessage });
//     handleClose();
//   };

//   const handleClose = () => {
//     setshowError("");
//     setSelectedReason("");
//     setMessage("");
//     onClose();
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {status === "approve" ? "Approve Booking" : "Decline Booking"}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {status === "decline" && (
//           <>
//             <div className="mb-3">
//               <div>
//                 <strong>Select a reason:</strong>
//               </div>
//               <div className="d-flex flex-wrap gap-2 mt-2">
//                 {reasons.map((reason) => (
//                   <button
//                     key={reason}
//                     type="button"
//                     className={`btn ${
//                       selectedReason === reason
//                         ? "btn-primary"
//                         : "btn-outline-secondary"
//                     }`}
//                     onClick={() =>
//                       setSelectedReason(selectedReason === reason ? "" : reason)
//                     }
//                   >
//                     {reason}
//                   </button>
//                 ))}
//               </div>
//               {error === "dropdown" && (
//                 <div style={{ color: "red", marginTop: "5px" }}>
//                   Please select a reason for declining
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         <textarea
//           placeholder="Share a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           rows={3}
//           className="form-control"
//         />
//         {error === "message" && (
//           <div style={{ color: "red", marginTop: "5px" }}>
//             Message is Required
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button
//           onClick={handleSubmit}
//           style={{
//             width: "100%",
//             color: "white",
//             backgroundColor: "#3A4B4C",
//             border: "none",
//             borderRadius: "10px",
//           }}
//         >
//           {status === "approve" ? "Approve Request" : "Decline Request"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };
