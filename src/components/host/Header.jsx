import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserType, clearUser } from "../../store/slices/userSlice";
import Constant, { imageBase, KEYS } from "../../config/Constant";
import { Client as ConversationsClient } from "@twilio/conversations";
import useChat from "../../hooks/host/useChat";
import useProfile from "../../hooks/useProfile";
import useCommon from "../../hooks/useCommon";
import MobFooter from "../MobFooter";
import LanguageModal from "../../pages/LanguageModal";
import { toast } from "react-toastify";

const Header = () => {
      const {userInfo} = useSelector(({user})=>user)
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { hostUnReadBookings, hostMarkBookings, isLoading } = useCommon();
  const { getTwilioToken } = useChat();
  const { getUserProfile } = useProfile();
  const profileData = useSelector((state) => state.profile);
  const [switchToGuest, setSwitchToGuest] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [getList, setGetList] = useState({ unread_booking_count: 0 });
  const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO))||JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userType = localStorage.getItem("USER_TYPE");
  const userId = userInfo?.user_id ? String(userInfo?.user_id) : null||localSaved?.user_id ? String(localSaved?.user_id) : null;

  const [unreadCountChat, setUnreadCountChat] = useState(0);

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

  const [lastReadCount, setLastReadCount] = useState(0);
  const fetchBookingList = async () => {
    try {
      const response = await hostUnReadBookings({ user_id: userId });
      if (response?.data) {
        setGetList(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking list:", error);
    }
  };


  useEffect(() => {
    if (userId) {
      fetchBookingList();
    }
  }, [userId, location.pathname]);

 
  const newUnreadCount = Math.max(
    0,
    getList.unread_booking_count - lastReadCount
  );
  const showBadge = newUnreadCount > 0;

  const markBookingsAsRead = async () => {
    try {
      await hostMarkBookings({ user_id: userId });


      setLastReadCount(getList.unread_booking_count);
    } catch (error) {
      console.error("Error marking bookings as read:", error);
    }
  };

  useEffect(() => {
    const fetchTwilioInfo = async () => {
      const userId = userInfo?.user_id||localSaved?.user_id;

      if (
        !userId ||
        (typeof userId !== "string" && typeof userId !== "number")
      ) {
        console.error("Invalid user_id:", userId);
        return;
      }

      const response = await getTwilioToken({
        user_id: String(userId),
        role: "host",
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

  const navItems = [
    {
      icon: "/images/Host/home-icon-hostsvg.svg",
      link: "/homeHost",
      badgeCount: null,
    },
    {
      icon: "/images/nav-section/bookings.svg",
      link: "/booking",
      badgeCount: newUnreadCount == 0 ? null : newUnreadCount,
    },
    {
      icon: "/images/nav-section/chat.svg",
      link: "/chat",
      badgeCount: unreadCountChat == 0 ? null : unreadCountChat,
    },
  ];

  const dropdownItems = [
    { label: "Payment History", to: "/payment-host" },
    { label: "Language", dataTarget: "#language-popup", dataToggle: "modal" },
    { label: "Notifications", to: "/notifications", state: { type: "guest" } },
    { label: "Help Center", to: "/helpCenter", state: { type: "host" } },
    { label: "Settings", to: "/profile" },
    { label: "About Us", to: "/aboutUs" },
    { label: "Feedback", to: "/feedback" },

   
  ];

  useEffect(() => {
    if (switchToGuest) {
      dispatch(setUserType("guest"));
      Constant.selectedFlow = "guest";
      localStorage.setItem(KEYS.USER_TYPE, "guest");
      navigate("/homeGuest");
    }
  }, [switchToGuest, dispatch, navigate]);


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

  const handleSwitch = (e) => {
    e.preventDefault();
    setSwitchToGuest(true);
    setDropdownOpen(false); 
  };

  const handleLogout = () => {
    // Clear Redux user state
    dispatch(clearUser());
    toast.success("Logout Successfully.")
    localStorage.setItem(KEYS.USER_TYPE, "guest");

    // Then do UI cleanup
    window.location.href = "/";
    setShowLogoutModal(false);
    setDropdownOpen(false); 
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setDropdownOpen(false); 
  };

  return (
    <header>
      {/* Desktop Navigation */}
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
        {/* Logo */}
        <div style={{ fontSize: "1.5rem", margin: "0 15px" }}>
          <Link to="/">
            <img src="/images/logo.svg" loading="lazy" alt="Logo" style={{ height: "45px" }} />
          </Link>
        </div>

        {/* Navigation Items */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {navItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "5px",
                position: "relative",
                marginRight: "15px",
              }}
            >
              <Link
                to={item.link}
                style={{
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ position: "relative" }}
                  onClick={() => {
                    item.link == "/booking" &&
                      item?.badgeCount >= 1 &&
                      markBookingsAsRead();
                  }}
                >
                  <img
                    src={item.icon}
                    loading="lazy" alt="Nav icon"
                    style={{
                      height: "25px",
                      filter:
                        "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                    }}
                  />
                  {item.badgeCount && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
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
                      {item.badgeCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}

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
                      : `${imageBase + profileData?.profileData?.profile_image}`
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
                    Switch to Guest
                  </button>
                </div>

                {dropdownItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "5px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      // border: "1px solid black",
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
            zIndex: 9999,
           
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
                  onClick={() => {
                    setShowLogoutModal(false);
                  }}
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

      {/* Mobile Navigation */}
      <div
        style={{
          borderTop: "1px solid #dee2e6",
          borderBottom: "1px solid #dee2e6",
          display: "none" /* Hidden by default, shown with media query */,
        }}
      >
        <div style={{ padding: "0 15px" }}>
          <ul
            style={{
              display: "flex",
              justifyContent: "space-around",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li>
              <a
                href="My-places.html"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0",
                  textDecoration: "none",
                  color: "#333",
                }}
              >
                <img
                  src="images/Host/properties-mobile-icon.png"
                  loading="lazy" alt="Properties"
                  style={{ height: "24px", marginBottom: "5px" }}
                />
                Properties
              </a>
            </li>
            <li>
              <a
                href="chat.html"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0",
                  textDecoration: "none",
                  color: "#333",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "15px",
                    backgroundColor: "#2CD5A4",
                    color: "black",
                    borderRadius: "50%",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 5px",
                    minWidth: "15px",
                    minHeight: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  2
                </span>
                <img
                  src="images/mobile/nav/2.svg"
                  loading="lazy" alt="Inbox"
                  style={{ height: "24px", marginBottom: "5px" }}
                />
                Inbox
              </a>
            </li>
            <li>
              <a
                href="bookings-host.html"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0",
                  textDecoration: "none",
                  color: "#333",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "15px",
                    backgroundColor: "#2CD5A4",
                    color: "black",
                    borderRadius: "50%",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 5px",
                    minWidth: "15px",
                    minHeight: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  1
                </span>
                <img
                  src="images/mobile/nav/3.svg"
                  loading="lazy" alt="Bookings"
                  style={{ height: "24px", marginBottom: "5px" }}
                />
                Bookings
              </a>
            </li>
            <li>
              <a
                href="profile-host.html"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0",
                  textDecoration: "none",
                  color: "#333",
                }}
              >
                <img
                  src="images/mobile/nav/5.svg"
                  loading="lazy" alt="Profile"
                  style={{ height: "24px", marginBottom: "5px" }}
                />
                Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
      <MobFooter />
      <LanguageModal />
    </header>
  );
};

export default React.memo(Header);
