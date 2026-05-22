import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserType } from "../../store/slices/userSlice";
import { clearUser } from "../../store/slices/userSlice";
import Constant, { imageBase, KEYS } from "../../config/Constant";
import { toast } from "react-toastify";
import useChat from "../../hooks/host/useChat";
import { Client as ConversationsClient } from "@twilio/conversations";
import useCommon from "../../hooks/useCommon";
import useProfile from "../../hooks/useProfile";
import MobFooter from "../MobFooter";
import RegisterModal from "./authModalGuest/RegisterModal";
import LanguageModal from "../../pages/LanguageModal";

const Header = () => {
    const {userInfo} = useSelector(({user})=>user)
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getTwilioToken } = useChat();
  const { guestUnReadBookings, guestMarkBookings, isLoading } = useCommon();

  const { getUserProfile } = useProfile();
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))||JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  
  const userId =  userInfo?.user_id ? String(userInfo?.user_id) : null|| userData?.user_id ? String(userData?.user_id) : null;
  const [unreadCountChat, setUnreadCountChat] = useState(0);

  const profileData = useSelector((state) => state.profile);
  const [switchToHost, setSwitchToHost] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [getList, setGetList] = useState({ unread_booking_count: 0 });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalToggleValue, setModalToggleValue] = useState(false);


  useEffect(() => {
    const handleGetProfile = async () => {
      try {
        const res = await getUserProfile({ user_id: userId });
      } catch (error) {
        console.error(error);
      }
    };
    if(userId){
      handleGetProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (switchToHost) {
      dispatch(setUserType("host"));
      Constant.selectedFlow = "host";
      localStorage.setItem(KEYS.USER_TYPE, "host");
      navigate("/");
    }
  }, [switchToHost, dispatch, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSwitch = () => {
    setSwitchToHost(true);
    setDropdownOpen(false); 
  };

  const handleLogout = () => {  
    dispatch(clearUser());
    toast.success("Logout Successfully.")
    navigate("/");
    setShowLogoutModal(false);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (userData||userInfo) {
      setDropdownOpen(!dropdownOpen);
    } else {
      toast.error("Please login...");
      navigate("/");
    }
  };

  const menuItems = [

    { label: "Language", dataTarget: "#language-popup", dataToggle: "modal" },
    { label: "Notifications", to: "/notifications", state: { type: "guest" } },
    { label: "Help Center", to: "/helpCenter", state: { type: "guest" } },
    { label: "Settings", to: "/profile" },
    { label: "About Us", to: "/aboutUs" },
    { label: "Feedback", to: "/feedback" },
    // { label: "Logout", action: () => setShowLogoutModal(true) },
  ];

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setDropdownOpen(false); // Close dropdown after selection
  };

  const [lastReadCount, setLastReadCount] = useState(0);
  const fetchBookingList = async () => {
    try {
      const response = await guestUnReadBookings({ user_id: userId });
      if (response?.data) {
        setGetList(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking list:", error);
    }
  };

  // Re-fetch when component mounts or route changes
  useEffect(() => {
    if (userId) {
      fetchBookingList();
    }
  }, [userId, location.pathname]);

  // Mark bookings as read

  // Only show count of new unread bookings (after last read)
  const newUnreadCount = Math.max(
    0,
    getList.unread_booking_count - lastReadCount
  );
  const showBadge = newUnreadCount > 0;

  const markBookingsAsRead = async () => {
    try {
      await guestMarkBookings({ user_id: userId });

      setLastReadCount(getList.unread_booking_count);
    } catch (error) {
      console.error("Error marking bookings as read:", error);
    }
  };

  const handleModalToggle = (modalType, state) => {
    if (modalType === "register") setIsRegisterModalOpen(state);
    if (modalType === "login") setIsLoginModalOpen(state);
  };

  useEffect(() => {
    const fetchTwilioInfo = async () => {
      const userId = userData?.user_id;

      if (
        !userId ||
        (typeof userId !== "string" && typeof userId !== "number")
      ) {
        console.error("Invalid user_id:", userId);
        return;
      }

      const response = await getTwilioToken({
        user_id: String(userId),
        role: "guest",
      });

      if (!response?.data?.token) {
        console.error("Twilio token not received");
        return;
      }

      const client = await ConversationsClient.create(response.data.token);
      const paginator = await client.getSubscribedConversations();

      let totalUnread = 0;
      for (const convo of paginator.items) {
        const count = await convo.getUnreadMessagesCount();
        totalUnread += count || 0;
      }
      setUnreadCountChat(totalUnread);
    };

    fetchTwilioInfo();
  }, []);

  return (
    <header>
      <nav
        className="web-navbar"
        style={{
          position: "relative",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          padding: "15px 20px",
          zIndex: 1000,
          width: "100%",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <div style={{ fontSize: "1.5rem", margin: "0 15px" }}>
          <Link to="/">
            <img src="/images/logo.svg" loading="lazy" alt="Logo" style={{ height: "40px" }} />
          </Link>
        </div>

        {/* NAV ITEMS */}

        {!userId ? (
          <div
            className="nav-inner-right position-static ms-auto"
            style={{ marginRight: "15px" }}
          >
            <ul
              className="list-unstyled d-flex mb-0 gap-3"
              // style={{ padding: "10px" }}
            >
              {location.pathname === "/aboutUs" ? (
                <li>
                  <button
                    type="button"
                    onClick={() => handleModalToggle("register", true)}
                    className="list-unstyled d-flex mb-0"
                    style={{
                      border: "none",
                      borderRadius: "30px",
                      backgroundColor: "#4AEAB1",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      color: "black",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "14px",
                      width: "120%",
                      textAlign: "center",
                      fontSize: "18px",
                    }}
                  >
                    Register
                  </button>
                </li>
              ) : (
                <>
                  <li className="me-3">
                    <Link
                      to="/aboutUs"
                      className="active text-decoration-none"
                      style={{
                        border: "1px solid #4AEAB1",
                        height: "100%",
                        borderRadius: "30px",
                        backgroundColor: "#fff",
                        color: "black",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "14px",
                        width: "115%",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleModalToggle("register", true)}
                      className="list-unstyled d-flex mb-0"
                      style={{
                        border: "none",
                        borderRadius: "30px",
                        backgroundColor: "#4AEAB1",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        color: "black",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "14px",
                        width: "120%",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                    >
                      Register
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Bookings Icon */}
            <div
              style={{
                position: "relative",
                padding: "5px",
                marginRight: "10px",
              }}
            >
              <Link
                to="/booking"
                style={{ display: "flex", alignItems: "center" }}
                onClick={markBookingsAsRead}
              >
                {showBadge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "10px",
                      backgroundColor: "#2CD5A4",
                      color: "black",
                      borderRadius: "50%",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "4px 6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "18px",
                      minHeight: "18px",
                      lineHeight: "1",
                      zIndex: 10,
                    }}
                  >
                    {newUnreadCount}
                  </span>
                )}
                <img
                  src="/images/nav-section/bookings.svg"
                  loading="lazy" alt="Bookings"
                  style={{
                    height: "25px",
                    marginRight: "10px",
                    filter:
                      "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                  }}
                />
              </Link>
            </div>

            {/* Chat Icon */}
            <div
              style={{
                position: "relative",
                padding: "5px",
                marginRight: "10px",
              }}
            >
              <Link
                to="/chat"
                style={{ display: "flex", alignItems: "center" }}
              >
                {unreadCountChat > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "10px",
                      backgroundColor: "#2CD5A4",
                      color: "black",
                      borderRadius: "50%",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "4px 6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "18px",
                      minHeight: "18px",
                      lineHeight: "1",
                      zIndex: 10,
                    }}
                  >
                    {unreadCountChat}
                  </span>
                )}
                <img
                  src="/images/nav-section/chat.svg"
                  loading="lazy" alt="Chat"
                  style={{
                    height: "25px",
                    marginRight: "10px",
                    filter:
                      "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                  }}
                />
              </Link>
            </div>

            {/* Wishlist Icon */}
            <div style={{ padding: "5px", marginRight: "10px" }}>
              <Link
                to="/wishlist"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src="/images/nav-section/wishlist.svg"
                  loading="lazy" alt="Wishlist"
                  style={{
                    height: "25px",
                    marginRight: "10px",
                    filter:
                      "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                  }}
                />
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <div
                onClick={toggleDropdown}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
            <img
                  src={
                    profileData?.profileData?.profile_image
                      ? typeof profileData?.profileData?.profile_image ===
                        "object"
                        ? `${
                            imageBase +
                            profileData?.profileData?.profile_image
                              ?.profile_image_url
                          }`
                        : `${
                            imageBase + profileData?.profileData?.profile_image
                          }`
                      : "/images/nav-section/user-profile1.png"
                  }
                  loading="lazy" alt="User Profile"
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #CCC",
                    padding: "2px",
                  }}
                />
              </div>

              {dropdownOpen && (
                <div className="switch-guest-dropdown"
                style={{
                  position: "absolute",
                  right: 0,
                  minWidth: "190px",
                  height: "auto",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 14px 0px #0000001A",
                  backgroundColor: "white",
                  zIndex: 1001,
                  padding: "5px",
                  marginTop: "5px",
                  color: "black",
                }}
              >
                  <div
                    style={{
                      padding: "3px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.boxShadow =
                      "inset 0px 0px 10px rgba(0, 0, 0, 0.0)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  >
                    <button
                      onClick={handleSwitch}
                      style={{
                        border: "1.4px solid black",
                        background: "none",
                        width: "100%",
                        borderRadius: "10px",
                        padding: "8px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      Switch to Host
                    </button>
                  </div>

                  {menuItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "5px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                      data-bs-target={item.dataTarget}
                      data-bs-toggle={item.dataToggle}
                      onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.boxShadow =
                        "inset 0px 0px 10px rgba(0, 0, 0, 0.0)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.to ? (
                        <Link
                          to={item.to}
                          state={item.state}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                          }}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        item.label
                      )}
                    </div>
                  ))}

                  <hr style={{ marginBottom: "0", marginTop: "0px" }} />
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    style={{
                      background: "none",
                      width: "100%",
                      textAlign: "left",
                      borderRadius: "10px",
                      padding: "5px",
                      cursor: "pointer",
                      border: "none",
                      marginTop: "0px",
                      marginLeft: "5px",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
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
            zIndex: 99999,
          
          }}
        >
          <div
            style={{
              width: "70%",
              borderRadius: "13px",
              backgroundColor: "white",
              padding: "20px",
              maxWidth: "350px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
            <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  background: "#3A4B4C",
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
                &times;

              </button>
            </div>

            <div style={{ textAlign: "center", padding: "0 20px" }}>
              <h3
                style={{
                  fontWeight: "400",
                  fontSize: "28px",
                  color: "#000000",
                  marginBottom: "10px",
                  fontFamily: "sans-serif poppins",
                }}
              >
                Logout
              </h3>

              <div style={{ margin: "20px 0" }}>
                <img
                  src="/images/popups/logout.svg"
                  loading="lazy" alt="Logout"
                  style={{
                    width: "90px",
                    height: "90px",
                    marginBottom: "20px",
                  }}
                />
              </div>

              <p style={{ marginBottom: "30px" }}>
                Are you sure you want to logout?
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "10px 50px",
                    borderRadius: "50px",
                    border: "none",
                    backgroundColor: "#4AEAB1",
                    color: "#000",
                    cursor: "pointer",
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    padding: "10px 37px",
                    border: "1px solid #4AEAB1",
                    borderRadius: "50px",
                    backgroundColor: "#fff",
                    color: "#000",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <MobFooter />

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
      <LanguageModal/>
    </header>
  );
};

export default Header;

