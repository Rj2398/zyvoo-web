import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { Nav } from "react-bootstrap";
import "react-day-picker/style.css";
import Autocomplete from "react-google-autocomplete";
import { Client as ConversationsClient } from "@twilio/conversations";
import { GOOGLE_KEY, imageBase, KEYS } from "../../config/Constant";
import { clearUser, setUserType } from "../../store/slices/userSlice";
import Constant from "../../config/Constant";
import Home from "../../pages/guestPage/Home";
import {
  CloseButton,
  Col,
  Container,
  Row,
  Form,
  Button,
  Tabs,
  Tab,
  Modal,
  Dropdown,
  ToggleButtonGroup,
  ToggleButton,
  InputGroup,
  Image,
  FormControl,
} from "react-bootstrap";
import CircularSlider from "@fseehawer/react-circular-slider";
import { format } from "date-fns";
import { FaAngleDown, FaAngleUp, FaRedo, FaSearch } from "react-icons/fa";
import { Clock, Pencil, Section, X } from "lucide-react";
import { Range } from "react-range";
import useCommon from "../../hooks/useCommon";
import { useDispatch, useSelector } from "react-redux";
import RegisterModal from "./authModalGuest/RegisterModal";
import main from "../../assets/gallery/Group (2).png";
import dotted from "../../assets/gallery/vector_10.png";
import { toast } from "react-toastify";
import moment from "moment";
import useChat from "../../hooks/host/useChat";
import useProfile from "../../hooks/useProfile";
import LanguageModal from "../../pages/LanguageModal";
import { useForm } from "react-hook-form";
import MobFooter from "../MobFooter";
import MobSearch from "../MobSearch";
import { IoChevronDown } from "react-icons/io5";

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 48; i++) {
    let totalMinutes = i * 30;
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    let formattedHours = String(hours).padStart(2, "0");
    let formattedMinutes = String(minutes).padStart(2, "0");

    // Use numeric hours/minutes in moment, not the formatted strings
    times.push(moment({ hour: hours, minute: minutes }).format("hh:mm A"));
  }
  return times;
};

const HomeHeader = ({ showMap, setShowMap, callback, getSearchLocation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  const { userInfo } = useSelector(({ user }) => user);
  // const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [activeCloseIcons, setActiveCloseIcons] = useState({});
  // console.log(userInfo)
  const localSaved =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const login_id = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || localSaved?.user_id
    ? String(localSaved?.user_id)
    : null;

  // const access_token = localSaved?.access_token;
  const access_token = localSaved?.access_token;

  const { homeDataFilters, guestHomeData, isLoading } = useCommon();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [key, setKey] = useState("dates");
  const [fromTime, setFromTime] = useState("");
  const [isHovered1, setIsHovered1] = useState(false);
  const [toTime, setToTime] = useState("");
  const [hour, setHour] = useState("");
  const [sliderValue, setSliderValue] = useState(hour || 2);
  const [sliderKey, setSliderKey] = useState(0);
  useEffect(() => {
    setSliderValue(hour || 2);
  }, [hour]);
  const [show, setShow] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [newDate, setNewDate] = useState();
  const [flexibleDate, setFlexibleDate] = useState("");
  const [openInput, setOpenInput] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleToggleMobSearch = () => {
    setShowModal(!showModal);
  };

  const [modalToggleValue, setModalToggleValue] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  //guest header
  const { getTwilioToken } = useChat();
  const { guestUnReadBookings, guestMarkBookings, getPropertyPriceRange } =
    useCommon();

  const { getUserProfile } = useProfile();
  const userData =
    userInfo ||
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userType = localStorage.getItem(KEYS.USER_TYPE);
  const userId =
    userInfo?.user_id || userData?.user_id ? String(userData?.user_id) : null;
  const [unreadCountChat, setUnreadCountChat] = useState(0);

  const profileData = useSelector((state) => state.profile);
  const [switchToHost, setSwitchToHost] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [getList, setGetList] = useState({ unread_booking_count: 0 });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleModalToggle = (modalType, state) => {
    if (modalType === "register") {
      setIsRegisterModalOpen(state);
      if (state === true) {
        setRegisterModal(true); // reset to show register form
      }
    }
    if (modalType === "login") {
      setIsLoginModalOpen(state);
      if (state === true) {
        setModalToggleValue(true); // or false depending on your login modal logic
      }
    }
  };

  // useEffect(() => {
  //   const handleGetProfile = async () => {
  //     try {
  //       const res = await getUserProfile({ user_id: userId });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   if (userId) {
  //     handleGetProfile();
  //   }
  // }, [userId]);

  const handleGetProfile = useCallback(async () => {
    try {
      if (!userId) return;
      const res = await getUserProfile({ user_id: userId });
      // do something with res if needed
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    handleGetProfile();
  }, [handleGetProfile]);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      const isMobileOrTablet = window.innerWidth <= 991; // includes tablets
      setIsMobileWidth(isMobileOrTablet);
    };

    checkWindowWidth(); // Check immediately on mount
    window.addEventListener("resize", checkWindowWidth);
    return () => {
      window.removeEventListener("resize", checkWindowWidth);
    };
  }, []); // Don't put window.innerWidth in the deps

  useEffect(() => {
    if (switchToHost) {
      dispatch(setUserType("host"));
      Constant.selectedFlow = "host";
      localStorage.setItem(KEYS.USER_TYPE, "host");
      navigate("/", { replace: true });
      window.location.reload();
    }
  }, [switchToHost, dispatch, navigate]);

  const handleSwitch = () => {
    // e.preventDefault();s
    setSwitchToHost(true);
    setDropdownOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside
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

  const handleLogout = () => {
    dispatch(clearUser()); // Clear Redux user state
    toast.success("Logout Successfully."); // Then do UI cleanup
    navigate("/");
    setShowLogoutModal(false);
    setDropdownOpen(false); // Close dropdown after selection
    localStorage.removeItem("SocialLogin");
  };

  const toggleDropdown = () => {
    if (userData) {
      setDropdownOpen(!dropdownOpen);
    } else {
      // toast.error("Please login...");
      navigate("/");
    }
  };

  const menuItems = [
    // { label: "Payment History", to: "/payment-guest" },
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

  useEffect(() => {
    if (userId) {
      fetchBookingList(); // Re-fetch when component mounts or route changes
    }
  }, [userId]);

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
      // Set last read count to current unread count
      setLastReadCount(getList.unread_booking_count);
    } catch (error) {
      console.error("Error marking bookings as read:", error);
    }
  };

  useEffect(() => {
    const fetchTwilioInfo = async () => {
      const userId = userData?.user_id;
      if (
        !userId ||
        (typeof userId !== "string" && typeof userId !== "number")
      ) {
        // console.error("Invalid user_id:", userId);
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
  }, [navigator.geolocation]);

  const timeOptions = generateTimeOptions();

  // const activities = [
  //   "Stays",
  //   "Event Space",
  //   "Photo Shoot",
  //   "Music Video",
  //   "Party",
  //   "Wedding",
  //   "Meeting",
  //   "Baby Shower",
  //   "Pool",
  // ];

  const activities = [
    "Stays",
    "Event Space",
    "Photo Shoot",
    "Meeting",
    "Party",
    "Film Shoot",
    "Performance",
    "Workshop",
  ];

  // Search Query
  const handleSearchQuery = () => {};

  const [showMore, setShowMore] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [filterLocation, setFilterLocation] = useState("");
  const [preferences, setPreferences] = useState({
    people_count: "Any",
    property_size: "Any",
    bedroom: "Any",
    bathroom: "Any",
  });

  const [showOtherActivities, setShowOtherActivities] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [removeFilter, setRemoveFilter] = useState(false);

  const [selectedActivitiesFilter, setSelectedActivitiesFilter] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedValue, setSelectedValue] = useState("any_type");
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [values, setValues] = useState([]); // "Min" and Max values
  const [RangeValue, setRangeValue] = useState({
    min: null,
    max: null,
  });

  const [togglesBooking, setTogglesBooking] = useState([
    {
      title: "Instant Book",
      name: "instant_booking",
      description: "Listings you can book without waiting for host approval",
      toggle: false,
    },
    {
      title: "Self check-in",
      name: "self_check_in",
      description: "Easy access to the property once you arrive",
      toggle: false,
    },
    {
      title: "Allows pets",
      name: "allows_pets",
      description: "",
      toggle: false,
      info: true,
    },
  ]);

  const [finalDate, setFinalDate] = useState(null);

  const getPriceRange = async () => {
    try {
      const response = await getPropertyPriceRange();
      if (response.success && response.data) {
        const min = parseFloat(response.data.minimum_price);
        const max = parseFloat(response.data.maximum_price);
        setValues([min, max]);
        setRangeValue({ min: min, max: max });
        // setValues([0, 2000]);
        // setRangeValue({ min: 0, max: 2000 });
      }
    } catch (error) {
      setRangeValue({ min: 0, max: 2000 });
      console.error("Failed to fetch price range:", error);
    }
  };

  useEffect(() => {
    getPriceRange();
  }, []);

  const handleCleanAll = () => {
    setSelectedPlace("");
    setSelectedActivity("");
    getPriceRange();
    setFilterLocation("");
    setSelectedDuration(0);
    setHour("");
    setPreferences({
      people_count: "Any",
      property_size: "Any",
      bedroom: "Any",
      bathroom: "Any",
    });
    setFinalDate(null);
    setSelectedActivitiesFilter([]);
    setSelectedAmenities([]);
    setCoordinates({ lat: null, lng: null });

    setTogglesBooking([
      {
        title: "Instant Book",
        description: "Listings you can book without waiting for host approval",
        toggle: false,
      },
      {
        title: "Self check-in",
        description: "Easy access to the property once you arrive",
        toggle: false,
      },
      { title: "Allows pets", description: "", toggle: false, info: true },
    ]);
    setSelectedLanguages([]);
    setIsCleaned(true);
    // setSelectedValue(1);
    setSelectedValue("any_type");

    setTimeout(() => setIsCleaned(false), 1000);
  };

  const handleInputChangeMinMax = (index, event) => {
    let newValue = Number(event.target.value);
    if (index === 0) {
      newValue = Math.min(newValue, values[1] - 1); // Ensure min < max
    } else {
      newValue = Math.max(newValue, values[0] + 1); // Ensure max > min
    }
    setValues((prev) =>
      index === 0 ? [newValue, prev[1]] : [prev[0], newValue]
    );
  };

  const toggleActivity = (name) => {
    setSelectedActivitiesFilter((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(name);
      if (isAlreadySelected) {
        return prevSelected.filter((activity) => activity !== name); // Unselect if already selected
      } else {
        return [...prevSelected, name]; // Add to selected list
      }
    });
  };

  const handleToggleBooking = (index) => {
    setTogglesBooking((prevToggles) =>
      prevToggles.map((item, i) =>
        i === index ? { ...item, name: item.name, toggle: !item.toggle } : item
      )
    );
  };

  const handleSelection = (language) => {
    setSelectedLanguages(
      (prev) =>
        prev.includes(language)
          ? prev.filter((item) => item !== language) // Remove if already selected
          : [...prev, language] // Add if not selected
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(
      (prevSelected) =>
        prevSelected.includes(amenity)
          ? prevSelected.filter((item) => item !== amenity) // Unselect
          : [...prevSelected, amenity] // Select
    );
  };

  const basicAmenities = [
    "Free Parking",
    "Meal Included",
    "Elevator/Lift Access",
    "Wheelchair Accessible",
    "Smoking Allowed",
    "Non-Smoking Property",
    // "Wifi",
    // "Washer",
    // "Air conditioning",
    // "Free Parking",
    // "Elevator/Lift Access",
    // "Smoking Allowed",
  ];

  const moreAmenities = [
    "Security Cameras",
    "Concierge Service",
    "Airport Shuttle Service",
    "Bike Rental",
    "Business Centre",
    "Conference/Meeting Facilities",
    "Spa/Wellness Centre",
    "Outdoor Space (Garden Terrace)",
    "BBQ/Grill Area",
    "Games Room",
    "Ski-In/Ski-Out Access",
    "Waterfront Property",
    "Scenic Views",
    "Eco-Friendly/Green Certified",
    "Smart Home Technology",
    "Electric Vehicle Charging Station",
    "Yoga/Meditation Space",
    "On-Site Restaurant/Cafe",
    "Bar/Lounge Area",
    "Live Entertainment",
    "Pet Amenities (Pet Sitting Pet Spa)",
    "Sports Facilities (Tennis Court Golf Course)",
    "Cultural Experiences/Workshops",
    "Coffee/Tea Station",
    // "Kitchen",
    // "Dryer",
    // "Heating",
    // "Meal Included",
    // "Wheelchair Accessible",
    // "Non-Smoking Property",
  ];

  const availableLanguages = [
    "Albanian",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Bengali",
    "Bereber",
    "Catalan",
    "Danish",
    "Dari",
    "Dutch",
    "English",
    "Finnish",
    "French",
    "German",
    "Hindi",
    "Italian",
    "Japanese",
    "Maori",
    "Mandarin",
    "Pashto",
    "Portuguese",
    "Russian",
    "Spanish",
    "Swedish",
    "Urdu",
    "Vietnamese",
  ];

  const activities1 = [
    {
      name: "Stays",
      icon: "/images/filters/activities/1.svg",
    },
    {
      name: "Event Space",
      icon: "/images/filters/activities/2.svg",
    },
    {
      name: "Photo shoot",
      icon: "/images/filters/activities/3.svg",
    },
    {
      name: "Meeting",
      icon: "/images/filters/activities/4.svg",
    },
  ];

  const otherActivities = [
    {
      name: "Party",
      icon: "/images/filters/activities/5.svg",
    },
    {
      name: "Pool",
      icon: "/images/filters/activities/17.svg",
    },
    {
      name: "Film Shoot",
      icon: "/images/filters/activities/6.svg",
    },
    {
      name: "Performance",
      icon: "/images/filters/activities/7.svg",
    },
    {
      name: "Workshop",
      icon: "/images/filters/activities/8.svg",
    },
    {
      name: "Corporate Event",
      icon: "/images/filters/activities/9.svg",
    },
    {
      name: "Wedding",
      icon: "/images/filters/activities/10.svg",
    },
    {
      name: "Dinner",
      icon: "/images/filters/activities/11.svg",
    },
    {
      name: "Retreat",
      icon: "/images/filters/activities/12.svg",
    },
    {
      name: "Pop-up",
      icon: "/images/filters/activities/13.svg",
    },
    {
      name: "Networking",
      icon: "/images/filters/activities/14.svg",
    },
    {
      name: "Fitness Class",
      icon: "/images/filters/activities/15.svg",
    },
    {
      name: "Audio Recording",
      icon: "/images/filters/activities/16.svg",
    },
  ];

  const handleRemoveData = async (setValue) => {
    setCoordinates({ lat: null, lng: null });

    if (setValue === setFlexibleDate) {
      setNewDate("");
    }
    setValue("");

    try {
      const response = await guestHomeData({
        ...(login_id ? { user_id: login_id } : {}),
        latitude: null, // 💡 Explicitly passing null to clear backend filter
        longitude: null, // 💡 Explicitly passing null to clear backend filter
      });
      callback(true);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  // const handleRemoveData = async (setValue) => {
  //   if (setValue === setFlexibleDate) {
  //     setNewDate("");
  //   }
  //   setValue("");

  //   try {
  //     const response = await guestHomeData({
  //       ...(login_id ? { user_id: login_id } : {}),
  //       // latitude: currentLocation?.latitude || 0,
  //       // longitude: currentLocation?.longitude || 0,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching filtered data:", error);
  //   }
  // };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // console.log("Hello clicked");
    setShow(true);
    callback(true);
  };

  const handleDate = (e) => {
    setSelectedDate(e.toLocaleDateString());
    callback(true);
  };

  const handleTimeChange = (type, value) => {
    callback(true);
    let updatedFromTime = fromTime;
    let updatedToTime = toTime;

    if (type === "from") {
      updatedFromTime = value;
      setFromTime(value);

      // Automatically set `toTime` by adding `Hour`
      const fromMoment = moment(value, "hh:mm A");
      const newToMoment = fromMoment.clone().add(hour, "hours");
      const newToTime = newToMoment.format("hh:mm A");

      // If the new toTime is valid, set it
      if (timeOptions.includes(newToTime)) {
        updatedToTime = newToTime;
        setToTime(newToTime);
      } else {
        // If the time goes out of range
        updatedToTime = "";
        setToTime("");
      }
    } else {
      updatedToTime = value;
      setToTime(value);
    }

    // Ensure newDate is valid
    if (!newDate) {
      console.error("Error: newDate is undefined or invalid.");
      return;
    }

    let updatedDate = new Date(newDate); // Clone the base date

    // Handle date rollover (if toTime is before fromTime)
    if (
      updatedFromTime &&
      updatedToTime &&
      timeOptions.indexOf(updatedToTime) <= timeOptions.indexOf(updatedFromTime)
    ) {
      updatedDate.setDate(updatedDate.getDate() + 1); // move to next day
    }

    const formattedDate = format(updatedDate, "yyyy-MM-dd");

    const formattedStartTime = updatedFromTime
      ? `${updatedFromTime.padStart(5, "0")}`
      : null;

    const formattedEndTime = updatedToTime
      ? `${updatedToTime.padStart(5, "0")}`
      : null;

    // Update display value
    setFlexibleDate(
      `${formattedDate} | ${updatedFromTime || "Not Selected"} - ${
        updatedToTime || "Not Selected"
      }`
    );

    // Set backend values
    if (type === "from") {
      setStart_time(formattedStartTime);
    } else {
      setEnd_time(formattedEndTime);
    }
  };

  const handleFilterData = async () => {
    try {
      setShowModal(false);
      // if (!start_time || !end_time) {
      //   toast.error("Error: Start time or End time is missing.");
      //   return;
      // }
      const allFieldsEmpty =
        !selectedPlace &&
        !selectedDate &&
        !hour &&
        !start_time &&
        !end_time &&
        !selectedActivity &&
        !coordinates?.lat <= 0 &&
        !coordinates?.lng <= 0;

      if (allFieldsEmpty) {
        toast.error("Please select at least one filter to proceed.");
        return;
      }
      const response = await guestHomeData({
        location: selectedPlace,
        date: selectedDate,
        hour: hour,
        start_time: start_time,
        end_time: end_time,
        activity: selectedActivity,
        user_id: login_id ?? "",
        latitude: coordinates?.lat,
        longitude: coordinates?.lng,
        property_price: filterPrice,
      });

      if (!response?.data) {
        // console.log("Response is null or empty:", response?.data);
        navigate("*");
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSelectedPlace("");
    setSelectedDate("");
    setSelectedActivity("");
    setHour("");
    setFlexibleDate("");
    setOpenInput(false);
  };

  const handleHourChange = (value) => {
    let newHour = parseInt(value, 10);
    setHour(newHour);
  };

  const sections = [
    {
      title: isMobileWidth ? "No of people" : "Number of people",
      name: "people_count",
      options: ["Any", 1, 2, 3, 4, 5, 6, 7],
    },
    {
      title: "Property size (Sq ft)",
      name: "property_size",
      options: ["Any", 250, 350, 450, 550, 650, 750],
    },
    // {
    //   title: "Parking space capacity",
    //   name: "parking_space",
    //   options: ["Any", 1, 2, 3, 4, 5, 6, 7, "8+"],
    // },
    {
      title: "Bedrooms",
      name: "bedroom",
      options: ["Any", 1, 2, 3, 4, 5, 6, 7, "8+"],
    },
    {
      title: "Bathrooms",
      name: "bathroom",
      options: ["Any", 1, 2, 3, 4, 5, 6, 7, "8+"],
    },
  ];

  const handleSelect = (section, option) => {
    // if (option != "Any" && option != "") {
    //   setPreferences({
    //     ...preferences,
    //     [section]: option,
    //   });
    // }
    setPreferences({
      ...preferences,
      [section]: option,
    });
  };

  const handleInputChange = (section, value) => {
    if (value === "") {
      setPreferences({
        ...preferences,
        [section]: "Any", // reset logic
      });
      return;
    }

    const newValue = parseInt(value, 10);
    if (!isNaN(newValue)) {
      setPreferences({
        ...preferences,
        [section]: newValue,
      });
    }
  };

  const handleSearch = async () => {
    // const normalizedPreferences = Object.fromEntries(
    //   Object.entries(preferences).map(([key, value]) => [
    //     key, value === "Any" ? "" : value,
    //   ])
    // );
    const normalizedPreferences = Object.fromEntries(
      Object.entries(preferences).filter(([_, value]) => value !== "Any")
    );
    const payload = {
      // ...(selectedValue != "any_type" &&
      //   selectedValue != "" && { place_type: selectedValue }),
      // maximum_price: values[1],
      // ...(coordinates?.lat != null ? {latitude: coordinates?.lat} : {latitude: currentLocation?.latitude}),
      // ...(coordinates?.lng != null ? {longitude: coordinates?.lng} : {longitude: currentLocation?.longitude}),
      // ...(values[0] != RangeValue?.min && {minimum_price: values[0]}),
      // ...(values[1] != RangeValue?.max && {maximum_price: values[1]}),
      user_id: userId,
      ...(selectedValue != "any_type" &&
        selectedValue != "" &&
        selectedValue != 1 && {
          place_type: selectedValue == "any_type" ? "" : selectedValue,
        }),
      minimum_price: values[0],
      ...(values[1] != RangeValue?.max && { maximum_price: values[1] }),

      ...(filterLocation != "" && { location: filterLocation }),
      ...(coordinates?.lat != null && { latitude: coordinates?.lat }),
      ...(coordinates?.lng != null && { longitude: coordinates?.lng }),
      ...(selectedDuration && { time: selectedDuration }),
      ...normalizedPreferences,
      ...(togglesBooking?.[0]?.toggle != 0 && {
        instant_booking: togglesBooking?.[0]?.toggle ? 1 : 0,
      }),
      ...(togglesBooking?.[1]?.toggle != 0 && {
        self_check_in: togglesBooking?.[1]?.toggle ? 1 : 0,
      }),
      ...(togglesBooking?.[2]?.toggle != 0 && {
        allows_pets: togglesBooking?.[2]?.toggle ? 1 : 0,
      }),
      ...(finalDate != null && { date: finalDate }),
      ...(selectedActivitiesFilter?.length > 0 && {
        activities: selectedActivitiesFilter,
      }),
      ...(selectedAmenities?.length > 0 && { amenities: selectedAmenities }),
      ...(selectedLanguages?.length > 0 && { languages: selectedLanguages }),
    };

    const response = await homeDataFilters(payload);
    if (response?.success) {
      setFilterShow(false);
      setRemoveFilter(true);
    } else {
      navigate("*");
    }
  };

  const handleClearFilter = async () => {
    handleCleanAll();
    const response = await guestHomeData({
      user_id: login_id ?? "",
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
    });

    setRemoveFilter(false);
  };

  useEffect(() => {
    // Apply z-index fix for Google Autocomplete dropdown
    const style = document.createElement("style");
    style.innerHTML = `
        .pac-container {
          z-index: 100000000 !important; /* Higher than Bootstrap modal */
          position: absolute !important;
        }
      `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Move autocomplete dropdown inside modal
    const modalElement = document.getElementById("filter-modal");
    const pacContainers = document.querySelectorAll(".pac-container");
    pacContainers.forEach((container) => {
      if (modalElement) {
        modalElement.appendChild(container);
      }
    });
  }, []);

  const handleClick = (e) => {
    e.preventDefault(); // prevent default React Router navigation
    window.location.href = "/"; // force full page reload
  };
  const handleNavigation = () => {
    if (login_id && access_token != "undefined") {
      setFilterShow(true);
    } else {
      // setIsLoginModal(true);
      setFilterShow(true);
    }
  };

  // const GOOGLE_KEY = ""; // Replace with your actual key

  // Check if Google Maps script is loaded
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // const GOOGLE_KEY = ""; // Replace with your actual key

  // Check if Google Maps script is loaded
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [GOOGLE_KEY]);

  // Add this useEffect to clear bedrooms when activity is not "Stays"
  useEffect(() => {
    const isActivityStays =
      selectedActivitiesFilter.includes("Stays") ||
      selectedActivity === "Stays";

    if (!isActivityStays && preferences.bedroom !== "Any") {
      setPreferences((prev) => ({
        ...prev,
        bedroom: "Any",
      }));
    }
  }, [selectedActivitiesFilter, selectedActivity]);

  function formatDateToMMDDYYYY(date) {
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${mm}-${dd}-${yyyy}`;
  }

  return (
    <>
      <div
        className="mob-search-filter border-start-0 border-end-0"
        style={{
          position: "sticky",
          top: "0",
          zIndex: "1000",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-in">
                  <Form
                    className="d-flex align-items-center w-100 "
                    style={{ position: "relative" }}
                  >
                    {openInput && (
                      <div className="d-flex align-items-center w-100">
                        {/* Location Filter */}
                        {isMobileWidth ? (
                          <>
                            <input
                              onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                              }}
                              value={
                                selectedPlace
                                  ? selectedPlace?.length > 5
                                    ? selectedPlace?.slice(0, 5) + "."
                                    : selectedPlace
                                  : ""
                              }
                              readOnly
                              placeholder="Where"
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                cursor: "text",
                                outline: "none",
                                boxShadow: "none",
                                backgroundColor: "transparent",
                                fontWeight: "400",
                                textAlign: "center",
                              }}
                            />
                            <MobSearch
                              showMobSearch={showModal}
                              handleToggleMobSearch={handleToggleMobSearch}
                              selectedPlace={selectedPlace}
                              coordinates={coordinates}
                              selectedActivity={selectedActivity}
                              selectedDate={selectedDate}
                              toTime={toTime}
                              newDate={newDate}
                              flexibleDate={flexibleDate}
                              fromTime={fromTime}
                              start_time={start_time}
                              end_time={end_time}
                              hour={hour}
                              filterPrice={filterPrice}
                              setFilterPrice={setFilterPrice}
                              show={show}
                              key={key}
                              // Function props
                              setSelectedPlace={(val) => setSelectedPlace(val)}
                              setCoordinates={(val) => setCoordinates(val)}
                              onActivityChange={setSelectedActivity}
                              onDateChange={(val) => {
                                setNewDate(val);
                                setSelectedDate(val);
                              }}
                              onTimeChange={(type, value) => {
                                if (type === "from") setFromTime(value);
                                else setToTime(value);
                              }}
                              onHourChange={setHour}
                              onShowToggle={setShow}
                              onKeyChange={setKey}
                              onFlexibleDateChange={setFlexibleDate}
                              onStartTimeChange={setStart_time}
                              onEndTimeChange={setEnd_time}
                              onCleanAll={handleCleanAll}
                              onSearch={handleFilterData}
                              handleHourChange={handleHourChange}
                              timeOptions={timeOptions}
                              handleTimeChange={handleTimeChange}
                              handleDate={handleDate}
                            />
                          </>
                        ) : (
                          <Dropdown
                            style={{
                              width: "22%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                            }}
                          >
                            <Dropdown.Toggle
                              variant="light"
                              className="no-caret "
                              style={{
                                backgroundColor: "transparent",
                                overflow: "hidden",
                                border: "none",
                              }}
                            >
                              {selectedPlace || "Where"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 p-lg-2">
                              <Autocomplete
                                apiKey={GOOGLE_KEY}
                                onPlaceSelected={(place) => {
                                  if (
                                    place &&
                                    place.geometry &&
                                    place.geometry.location
                                  ) {
                                    const lat = place.geometry.location.lat();
                                    const lng = place.geometry.location.lng();
                                    setSelectedPlace(
                                      place.formatted_address || place.name
                                    );
                                    setCoordinates({ lat, lng });
                                    getSearchLocation({ lat, lng })
                                  } else {
                                    setSelectedPlace("");
                                    getSearchLocation(null)
                                  }
                                }}
                                options={{ types: ["(cities)"] }}
                                placeholder="Search for a place..."
                                className="google-autocomplete"
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        <div
                          style={{
                            height: "40px",
                            width: "1px",
                            backgroundColor: "#ccc",
                            margin: "0 10px 0 0",
                          }}
                        ></div>

                        {/* Time Filter */}
                        <div
                          style={{
                            width: "22%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "25px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                          }}
                        >
                          <Button
                            className="w-100"
                            as="div"
                            style={{
                              width: "100%",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              backgroundColor: "transparent",
                              color: "#000",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "0",
                              fontWeight: "400",
                            }}
                            onClick={handleToggleMobSearch}
                          >
                            {"Time"}
                          </Button>
                        </div>

                        <div
                          style={{
                            height: "40px",
                            width: "1px",
                            backgroundColor: "#ccc",
                            margin: "0 0 0 15px",
                          }}
                        ></div>

                        {/* Activity Filter */}
                        <Dropdown
                          className="w-100"
                          style={{
                            width: "32%",
                            marginRight: "50px",
                          }}
                        >
                          <Dropdown.Toggle
                            className="no-caret"
                            variant="light"
                            id="dropdown-activity"
                            style={{
                              border: "none",
                              padding: "8px 16px",
                              backgroundColor: "transparent",
                              width: "100%",
                              fontSize: "16px",
                              fontWeight: "400",
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            onClick={handleToggleMobSearch}
                          >
                            {selectedActivity || "Activity"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            style={{
                              padding: "8px",
                              minWidth: "250px",
                              width: "100%",
                            }}
                          >
                            {activities.map((act, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() => setSelectedActivity(act)}
                              >
                                {act}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}

                    {!openInput && (
                      <div className="w-100 d-flex align-items-center p-1">
                        <Form
                          className="w-100"
                          onSubmit={handleSearchQuery}
                          style={{
                            marginRight: "35px",
                          }}
                        >
                          <InputGroup
                            className="border p-1"
                            style={{
                              borderRadius: "40px",
                            }}
                          >
                            <FormControl
                              type="text"
                              placeholder="Search"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="border-0"
                              style={{
                                boxShadow: "none",
                                borderRadius: "40px",
                                padding: "8px 12px",
                              }}
                            />
                            <Button
                              variant="light"
                              className="border-0"
                              onClick={() => {
                                setSearchQuery("");
                                setOpenInput(true);
                              }}
                              style={{
                                background: "transparent",
                                boxShadow: "none",
                                marginRight: "5px",
                              }}
                            >
                              <X size={20} color="#999" />
                            </Button>
                          </InputGroup>
                        </Form>
                      </div>
                    )}

                    {/* Search Button */}

                    <Button
                      className="d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: "39px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#3A4B4C",
                        border: "none",
                        position: "absolute",
                        right: "5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={handleFilterData}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2f3d3e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3A4B4C")
                      }
                    >
                      <FaSearch color="#fff" size={16} />
                    </Button>
                  </Form>
                </div>
                <div
                  className="mob-filter-in"
                  onClick={() => handleNavigation()}
                >
                  <Link>
                    {" "}
                    <img
                      loading="lazy"
                      src="/images/mobile/filters/filter.svg"
                      alt=""
                    />{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header style={{}}>
        {/* <!-- NAV -->
        <!-- DESKTOP-&-TABLET --> */}
        <div
          className="nav-wrap"
          style={{ padding: login_id ? "0px 30px" : "0px 56px 0 30px" }}
        >
          <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/" onClick={handleClick}>
                <img
                  src="/images/logo.svg"
                  alt="Logo"
                  loading="lazy"
                  style={{ height: "40px" }}
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse "
                id="navbarSupportedContent"
              >
                <div className="nav-inner w-100 d-flex justify-content-center align-items-center ">
                  <div
                    className="nav-inner-mid"
                    style={{
                      border: openInput ? "1px solid #E5E5E5" : "0", // Adjust border style as needed
                      marginRight: "0px",
                      padding: "5px",
                    }}
                  >
                    <Form
                      className=" d-flex align-items-center "
                      style={{
                        height: "100%",
                        width: "100%",
                        content: "fit",
                      }}
                      onSubmit={handleFormSubmit}
                    >
                      <div
                        className="input-group"
                        style={{
                          width: "100%",
                          height: "100%",
                          // justifyContent: "space-evenly",
                          textAlign: "center",
                        }}
                      >
                        {openInput ? (
                          <div
                            className="d-flex align-items-center gap-3"
                            style={{
                              // justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {/* Location Filter */}
                            <div
                              style={{
                                width: "32%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "25px",
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                // boxShadow: "0px 0px 10px rgba(59, 55, 55, 0.1)",
                              }}
                            >
                              <Dropdown
                                className="w-100"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                }}
                              >
                                <Dropdown.Toggle
                                  className="no-caret"
                                  variant="light"
                                  id="dropdown-where"
                                  style={{
                                    border: "none",
                                    padding: "8px 16px",
                                    backgroundColor: "transparent",
                                    width: "100%",
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    textAlign: "center",
                                    justifyContent: "center",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <style>
                                    {`
                                   .no-caret::after {
                                     display: none !important;
                                     textAlign:center;
                                   }
                                     `}
                                  </style>

                                  {selectedPlace || "Where"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                  style={{
                                    padding: "8px",
                                    minWidth: "250px",
                                    width: "100%",
                                  }}
                                >
                                  <div style={{ padding: "8px" }}>
                                    <Autocomplete
                                      apiKey="AIzaSyAvdUxrhv49imo4xWac52D-E_PQvmHyqhs"
                                      onPlaceSelected={(place) => {
                                        if (
                                          place &&
                                          place.geometry &&
                                          place.geometry.location
                                        ) {
                                          const lat =
                                            place.geometry.location.lat();
                                          const lng =
                                            place.geometry.location.lng();

                                          setSelectedPlace(
                                            place.formatted_address ||
                                              place.name
                                          );

                                          setCoordinates({ lat, lng });
                                          getSearchLocation({ lat, lng });
                                        } else {
                                          console.warn(
                                            "No valid address or location found in the selected place."
                                          );

                                          setSelectedPlace("");
                                          getSearchLocation(null);
                                        }
                                      }}
                                      options={{ types: ["(cities)"] }}
                                      placeholder="Search for a place..."
                                      className="google-autocomplete"
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                            <div
                              style={{
                                height: "40px",
                                width: "1px",
                                backgroundColor: "#ccc",
                                margin: "0 10px 0 0",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "22%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "25px",
                                cursor: "pointer",
                                backgroundColor: "transparent", // Ensure full transparency
                              }}
                            >
                              <Button
                                className="w-100"
                                as="div"
                                style={{
                                  width: "100%",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  backgroundColor: "transparent", // Transparent background
                                  color: "#000", // Text color
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "0",
                                  fontWeight: "400",
                                }}
                                onClick={handleShow}
                                // onClick={(e) => e.currentTarget.nextSibling.classList.toggle("show"),} // Open dropdown on click
                              >
                                {"Time"}
                              </Button>
                            </div>
                            <div
                              style={{
                                height: "40px",
                                width: "1px",
                                backgroundColor: "#ccc",
                                margin: "0 0 0 15px",
                              }}
                            ></div>
                            {/* Activity Filter */}
                            <div
                              style={{
                                width: "32%",
                                marginRight: "50px",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "25px",
                                cursor: "pointer",
                                backgroundColor: "transparent", // Transparent background
                              }}
                            >
                              <Dropdown
                                className="w-100"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                }}
                              >
                                <Dropdown.Toggle
                                  className="no-caret"
                                  variant="light"
                                  id="dropdown-activity"
                                  style={{
                                    border: "none",
                                    padding: "8px 16px",
                                    backgroundColor: "transparent",
                                    width: "100%",
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    textAlign: "center", // ✅ centers text
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color: "black",
                                  }}
                                >
                                  <style>
                                    {`
                                      .no-caret::after {
                                        display: none !important;
                                        textAlign:center;
                                      }
                                    `}
                                  </style>

                                  {selectedActivity || "Activity"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                  style={{
                                    padding: "8px",
                                    minWidth: "250px",
                                    width: "100%",
                                  }}
                                >
                                  {activities.map((act, index) => (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() => setSelectedActivity(act)}
                                    >
                                      {act}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        ) : (
                          <div className="w-100 d-flex align-items-center p-1">
                            {openInput !== true && ( // Show input only if openInput is true
                              <Form
                                className="w-100"
                                onSubmit={handleSearchQuery}
                                style={{
                                  // borderRadius:'20px',
                                  marginRight: "35px",
                                }}
                              >
                                <InputGroup
                                  className="border p-1"
                                  style={{
                                    borderRadius: "40px",
                                  }}
                                >
                                  <FormControl
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                    className="border-0"
                                    style={{
                                      boxShadow: "none",
                                      borderRadius: "40px", // Adjust input field border-radius
                                      padding: "8px 12px",
                                    }}
                                  />
                                  <Button
                                    variant="light"
                                    className="border-0"
                                    onClick={() => {
                                      setSearchQuery(""); // Clears input
                                      setOpenInput(true); // Closes input box
                                    }}
                                    style={{
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginRight: "5px",
                                    }}
                                  >
                                    <X size={20} color="#999" />
                                  </Button>
                                </InputGroup>
                              </Form>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        // type="submit"
                        className="d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                          border: "0",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          right: "5px",
                          top: "50%",
                          backgroundColor: "#3A4B4C",
                          transform: "translateY(-50%)",
                        }}
                        onClick={() => handleFilterData()}
                      >
                        <FaSearch size={14} />
                      </Button>
                    </Form>
                  </div>
                  {/* Right Side Links */}
                  {!login_id ? (
                    <div
                      className="nav-inner-right position-static ms-auto"
                      style={{ margin: "0" }}
                    >
                      <ul
                        className="list-unstyled d-flex mb-0"
                        // style={{ padding: "10px" }}
                      >
                        <li className="me-3">
                          <Link
                            to="/aboutUs"
                            className="active text-decoration-none"
                            style={{
                              border: "1px solid #4AEAB1", // consolidated border styling
                              height: "100%",
                              borderRadius: "30px",
                              backgroundColor: "#fff",
                              color: "black",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center", // vertical center
                              justifyContent: "center", // horizontal center
                              padding: "14px",
                              width: "115%",
                              textAlign: "center", // optional for inline content
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
                              alignItems: "center", // vertical centering
                              justifyContent: "center", // horizontal centering ✅
                              padding: "14px",
                              width: "120%",
                              textAlign: "center", // helpful for text content
                              fontSize: "18px",
                            }}
                          >
                            Register
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    // <Nav
                    //   className="d-flex align-items-center"
                    //   style={{ marginLeft: "18%" }}
                    // >
                    //   {/* Bookings Icon */}
                    //   <Nav.Item>
                    //     <Nav.Link
                    //       as={Link}
                    //       to="/booking"
                    //       style={{ position: "relative", padding: "5px" }}
                    //     >
                    //       <span
                    //         style={{
                    //           position: "absolute",
                    //           top: "-5px",
                    //           right: "8px",
                    //           backgroundColor: "#2CD5A4",
                    //           color: "black",
                    //           borderRadius: "50%",
                    //           fontSize: "12px",
                    //           fontWeight: "bold",
                    //           padding: "4px 7px",
                    //           display: "flex",
                    //           alignItems: "center",
                    //           justifyContent: "center",
                    //           minWidth: "18px",
                    //           minHeight: "18px",
                    //           lineHeight: "1",
                    //         }}
                    //       >
                    //         2
                    //       </span>
                    //       <img
                    //         src="/images/nav-section/bookings.svg"
                    //         alt="Bookings"
                    //         style={{
                    //           marginRight: "10px",
                    //           height: "25px",
                    //           filter:
                    //             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                    //         }}
                    //       />
                    //     </Nav.Link>
                    //   </Nav.Item>

                    //   {/* Chat Icon */}
                    //   <Nav.Item>
                    //     <Nav.Link
                    //       as={Link}
                    //       to="/location"
                    //       style={{ position: "relative", padding: "5px" }}
                    //     >
                    //       <span
                    //         style={{
                    //           position: "absolute",
                    //           top: "-5px",
                    //           right: "10px",
                    //           backgroundColor: "#2CD5A4",
                    //           color: "black",
                    //           borderRadius: "50%",
                    //           fontSize: "12px",
                    //           fontWeight: "bold",
                    //           padding: "4px 7px",
                    //           display: "flex",
                    //           alignItems: "center",
                    //           justifyContent: "center",
                    //           minWidth: "18px",
                    //           minHeight: "18px",
                    //           lineHeight: "1",
                    //         }}
                    //       >
                    //         2
                    //       </span>
                    //       <img
                    //         src="/images/nav-section/chat.svg"
                    //         alt="Chat"
                    //         style={{
                    //           marginRight: "10px",
                    //           height: "25px",
                    //           filter:
                    //             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                    //         }}
                    //       />
                    //     </Nav.Link>
                    //   </Nav.Item>

                    //   {/* Wishlist Icon */}
                    //   <Nav.Item>
                    //     <Nav.Link
                    //       as={Link}
                    //       to="/wishlist"
                    //       style={{ padding: "5px" }}
                    //     >
                    //       <img
                    //         src="/images/nav-section/wishlist.svg"
                    //         alt="Wishlist"
                    //         style={{
                    //           marginRight: "10px",
                    //           height: "25px",
                    //           filter:
                    //             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                    //         }}
                    //       />
                    //     </Nav.Link>
                    //   </Nav.Item>
                    //   {/* Profile Dropdown */}
                    //   <Nav.Item>
                    //     <Dropdown>
                    //       <Dropdown.Toggle
                    //         as="div"
                    //         id="dropdown-profile"
                    //         className="nav-account-in-profile"
                    //         style={{ cursor: "pointer" }}
                    //       >
                    //         <img
                    //           src="/images/nav-section/user-profile.png"
                    //           alt="User Profile"
                    //           style={{
                    //             height: "40px",
                    //             width: "40px",
                    //             borderRadius: "50%",
                    //             objectFit: "cover",
                    //             border: "2px solid #D1D1D1",
                    //           }}
                    //         />
                    //       </Dropdown.Toggle>
                    //       <Dropdown.Menu
                    //         align="end"
                    //         style={{
                    //           minWidth: "200px",
                    //           borderRadius: "15px",
                    //           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    //           border: "none",
                    //           overflow: "hidden", // Prevents shadow overflow
                    //           padding: "5px", // Ensures internal spacing
                    //         }}
                    //       >
                    //         <Dropdown.Item
                    //           as="div"
                    //           style={{
                    //             padding: "3px",
                    //             borderRadius: "10px",
                    //             transition: "0.3s",
                    //           }}
                    //           onMouseEnter={(e) => {
                    //             e.currentTarget.style.backgroundColor =
                    //               "#8195b8";
                    //             e.currentTarget.style.boxShadow =
                    //               "inset 0px 0px 10px rgba(0, 0, 0, 0.1)";
                    //           }}
                    //           onMouseLeave={(e) => {
                    //             e.currentTarget.style.backgroundColor =
                    //               "transparent";
                    //             e.currentTarget.style.boxShadow = "none";
                    //           }}
                    //         >
                    //           <form onSubmit={handleSwitch}>
                    //             <button
                    //               type="submit"
                    //               className="dropdown-item"
                    //               style={{
                    //                 border: "none",
                    //                 background: "none",
                    //                 width: "100%",
                    //                 textAlign: "left",
                    //                 borderRadius: "10px",
                    //               }}
                    //             >
                    //               Switch to Host
                    //             </button>
                    //           </form>
                    //         </Dropdown.Item>
                    //         {[
                    //           {
                    //             label: "Payment History",
                    //             to: "/payment-history",
                    //           },
                    //           {
                    //             label: "Language",
                    //             dataTarget: "#language-popup",
                    //             dataToggle: "modal",
                    //           },
                    //           {
                    //             label: "Notifications",
                    //             to: "/notifications",
                    //             state: { type: "guest" },
                    //           },
                    //           {
                    //             label: "Help Center",
                    //             to: "/helpCenter",
                    //             state: { type: "guest" },
                    //           },
                    //           { label: "Settings", to: "/profile" },
                    //           { label: "About Us", to: "/aboutUs" },
                    //           {
                    //             label: "Logout",
                    //             to: "/",
                    //             dataTarget: "#logout-popup",
                    //             dataToggle: "modal",
                    //             action: () => navigate("/"),
                    //           },
                    //         ].map((item, index) => (
                    //           <Dropdown.Item
                    //             key={index}
                    //             as={item.to ? Link : "div"}
                    //             to={item.to}
                    //             state={item.state}
                    //             data-bs-target={item.dataTarget}
                    //             data-bs-toggle={item.dataToggle}
                    //             onClick={item.action}
                    //             style={{
                    //               padding: "8px",
                    //               borderRadius: "10px",
                    //               transition: "0.3s",
                    //               textDecoration: "none",
                    //             }}
                    //             onMouseEnter={(e) => {
                    //               e.currentTarget.style.backgroundColor =
                    //                 "#8195b8";
                    //               e.currentTarget.style.boxShadow =
                    //                 "inset 0px 0px 10px rgba(0, 0, 0, 0.1)";
                    //             }}
                    //             onMouseLeave={(e) => {
                    //               e.currentTarget.style.backgroundColor =
                    //                 "transparent";
                    //               e.currentTarget.style.boxShadow = "none";
                    //             }}
                    //           >
                    //             {item.label}
                    //           </Dropdown.Item>
                    //         ))}
                    //       </Dropdown.Menu>
                    //     </Dropdown>
                    //   </Nav.Item>
                    // </Nav>

                    <nav
                      className="web-navbar ms-auto"
                      style={{
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#ffffff",
                        padding: "15px 9px",
                        zIndex: 9,
                        // width: "100%",
                        // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "16%",
                      }}
                    >
                      {/* LOGO */}
                      {/* <div style={{ fontSize: "1.5rem", margin: "0 15px" }}>
                              <Link to="/">
                                <img src="/images/logo.svg" alt="Logo" style={{ height: "40px" }} />
                              </Link>
                            </div> */}

                      {/* NAV ITEMS */}
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
                              alt="Bookings"
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
                              alt="Chat"
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
                              alt="Wishlist"
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
                              // src={
                              //   profileData?.profileData?.profile_image
                              //     ? imageBase + profileData?.profileData?.profile_image ||
                              //       imageBase +
                              //         profileData?.profileData?.profile_image
                              //           ?.profile_image_url
                              //     : "/images/nav-section/user-profile1.png"
                              // }
                              src={
                                profileData?.profileData?.profile_image
                                  ? typeof profileData?.profileData
                                      ?.profile_image === "object"
                                    ? `${
                                        imageBase +
                                        profileData?.profileData?.profile_image
                                          ?.profile_image_url
                                      }`
                                    : `${
                                        imageBase +
                                        profileData?.profileData?.profile_image
                                      }`
                                  : "/images/nav-section/user-profile1.png"
                              }
                              alt="User Profile"
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
                            <div
                              className="head-pro-drop"
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
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                  e.currentTarget.style.boxShadow =
                                    "inset 0px 0px 10px rgba(0, 0, 0, 0.0)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                <button
                                  onClick={handleSwitch}
                                  style={{
                                    border: "1.4px solid black",
                                    background: "none",
                                    width: "100%",
                                    // textAlign: "left",
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
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                    e.currentTarget.style.boxShadow =
                                      "inset 0px 0px 10px rgba(0, 0, 0, 0.0)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
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

                              <hr
                                style={{ marginBottom: "0", marginTop: "0px" }}
                              />

                              {/* <div
  style={{
    width: "100%",
    height: "1px",
    background: "#e0e0e0",
    marginTop: "0px",
    marginBottom: "0px"
  }}
></div> */}

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
                  )}
                </div>
                {/* <MobFooter /> */}
              </div>
            </div>
          </nav>
        </div>

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
              zIndex: 1050,
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

                <div style={{ margin: "10px 0" }}>
                  <img
                    src="/images/popups/logout.svg"
                    alt="Logout"
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
        {/* <!-- DESKTOP-&-TABLET -->
    <!-- MOBILE --> */}

        {/* <div className="mob-nav border-start-0 border-end-0">
          <div className="container-fluid">
            <ul className="gap-5">
              <li>
                <Link to="/">
                  <img src="/images/mobile/nav/1.svg" alt="" />
                  Discover
                </Link>
              </li>

            
              <li>
                <Link to="/WishList">
                  <img src="/images/mobile/nav/4.svg" alt="" />
                  Wishlists
                </Link>
              </li>

         
              {login_id ? (
                <>
                  <li>
                    <Link
                      to="/chat"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img src="/images/nav-section/chat.svg" alt="Chat" />
                      Inbox
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/booking"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src="/images/nav-section/bookings.svg"
                        alt="Bookings"
                      />
                      Booking
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile">
                      <img src="/images/mobile/nav/5.svg" alt="Profile" />
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleModalToggle("login", true);
                    }}
                  >
                    <img src="/images/mobile/nav/5.svg" alt="Login" />
                    Login
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div> */}
        <MobFooter />
        {/* <!-- MOBILE -->
    <!-- NAV -->
    <!-- MAP-BUTTON --> */}
        <div
          className="mob-show-map animate__animated animate__backInUp animate__delay-1s"
          // onClick={handleShowMap}
        ></div>
        {/* <!-- MAP-BUTTON --> */}
      </header>
      {/* <RegisterModal
        show={regModl}
        onHide={() => setRegModl(false)}
        CallBack={(bool) => setRegModl(bool)}
        loginModal={true}
      /> */}
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

      {/* <div className="top-filter-wrap py-3 "> */}
      <div className="top-filter-wrap ">
        <Container fluid>
          <Row
            className="align-items-center flex-wrap"
            style={{ margin: "0px 30px  0px 60px", gap: "10px" }}
          >
            {/* Location Filter */}
            {selectedPlace && (
              <Col
                xs="auto"
                className="d-flex align-items-center bg-white rounded-pill shadow-sm border "
                style={{
                  padding:
                    selectedDate && flexibleDate && hour
                      ? "4px 8px"
                      : "8px 16px",
                  fontSize:
                    selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
                }}
              >
                <img
                  src="/images/filters/location.svg"
                  alt="Location"
                  className="me-2"
                  style={{ width: 20, height: 20 }}
                />
                <span className="fw-semibold">{selectedPlace}</span>
                <CloseButton
                  aria-label="Clear"
                  onClick={() => handleRemoveData(setSelectedPlace)}
                  className="ms-2"
                  style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    transform: "none",
                  }}
                />
              </Col>
            )}

            {/* Activity Filter */}
            {selectedActivity && (
              <Col
                xs="auto"
                className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
                style={{
                  padding:
                    selectedDate && flexibleDate && hour
                      ? "4px 8px"
                      : "8px 16px",
                  fontSize:
                    selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
                }}
              >
                <img
                  src="/images/filters/filters.svg"
                  alt="Activity"
                  className="me-2"
                  style={{ width: 20, height: 20 }}
                />
                <span className="fw-semibold">{selectedActivity}</span>
                <CloseButton
                  aria-label="Clear"
                  onClick={() => handleRemoveData(setSelectedActivity)}
                  className="ms-2"
                  style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    transform: "none",
                  }}
                />
              </Col>
            )}

            {/* Date Filter */}
            {selectedDate && !flexibleDate && (
              <Col
                xs="auto"
                className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
                style={{
                  padding:
                    selectedDate && flexibleDate && hour
                      ? "4px 8px"
                      : "8px 16px",
                  fontSize:
                    selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
                }}
              >
                <img
                  src="/images/filters/calendar-icon.svg"
                  alt="Calendar"
                  className="me-2"
                  style={{ width: 20, height: 20 }}
                />
                <span className="fw-semibold">
                  {format(selectedDate, "MM-dd-yyyy")}
                </span>
                <CloseButton
                  aria-label="Clear"
                  onClick={() => handleRemoveData(setSelectedDate)}
                  className="ms-2"
                  style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    transform: "none",
                  }}
                />
              </Col>
            )}

            {/* Flexible Date Filter */}
            {flexibleDate && (
              <Col
                xs="auto"
                className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
                style={{
                  padding:
                    selectedDate && flexibleDate && hour
                      ? "4px 8px"
                      : "8px 16px",
                  fontSize:
                    selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
                }}
              >
                <img
                  src="/images/filters/calendar-icon.svg"
                  alt="Flexible Date"
                  className="me-2"
                  style={{ width: 20, height: 20 }}
                />
                <span className="fw-semibold">
                  {moment(flexibleDate.split("|")[0].trim()).format(
                    "MM-DD-YYYY"
                  )}
                </span>{" "}
                | {flexibleDate.split("|")[1].trim()}
                <CloseButton
                  aria-label="Clear"
                  onClick={() => {
                    handleRemoveData(setFlexibleDate);
                    handleRemoveData(setSelectedDate);
                  }}
                  className="ms-2"
                  style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    transform: "none",
                  }}
                />
              </Col>
            )}

            {hour && (
              <Col
                xs="auto"
                className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
                style={{
                  padding:
                    selectedDate && flexibleDate && hour
                      ? "4px 8px"
                      : "8px 16px",
                  fontSize:
                    selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
                }}
              >
                <img
                  src="/images/filters/time.svg"
                  alt="Time"
                  className="me-2"
                  style={{ width: 20, height: 20 }}
                />
                <span className="fw-semibold">{hour} hours</span>
                <CloseButton
                  aria-label="Clear"
                  onClick={() => handleRemoveData(setHour)}
                  className="ms-2"
                  style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    transform: "none",
                  }}
                />
              </Col>
            )}

            <Col
              md="auto"
              className="ms-auto d-flex gap-lg-2"
              style={{ marginRight: "-5px" }}
            >
              {removeFilter && (
                <Button
                  onClick={handleClearFilter}
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                >
                  Clear Filter
                </Button>
              )}
              <Button
                onClick={() => handleNavigation()}
                variant="outline-secondary"
                className="d-flex align-items-center"
                style={{
                  border: "solid 1px #E5E5E5",
                  borderRadius: "30px",
                  color: "black",
                  padding: "15px",
                  fontSize: "18px",
                }}
              >
                <img
                  src="/images/filters/filters.svg"
                  alt="Filters"
                  className="me-2"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                Filters
              </Button>

              <Button
                style={{
                  backgroundColor: "#3A4B4C",
                  borderRadius: "30px",
                  border: "none",
                  padding: "15px",
                  fontSize: "18px",
                }}
                onClick={() => setShowMap((prev) => !prev)}
              >
                <img
                  src="/images/filters/show-map.svg"
                  alt="Show Map"
                  className="me-2"
                  style={{ width: 20, height: 20 }}
                />

                {showMap ? "Hide map" : "Show map"}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      {show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              // padding: "15px",
              width: "100%",
              maxWidth: "380px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              position: "relative",
              padding: "35px 15px 15px 15px",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "0",
                right: "8px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            {/* Custom Tab Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f0ecec",
                borderRadius: "40px",
                color: "black",
                padding: "6px",
                fontSize: "18px",
                fontWeight: "400px",
                width: "100%",
                height: "auto",
              }}
            >
              <button
                onClick={() => setKey("dates")}
                style={{
                  backgroundColor: key === "dates" ? "white" : "transparent",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "40px",
                  cursor: "pointer",
                  width: "100%",
                  height: "auto",
                  top: "29px",
                  left: "129px",
                }}
              >
                Dates
              </button>
              <button
                onClick={() => setKey("hourly")}
                style={{
                  backgroundColor: key === "hourly" ? "white" : "transparent",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "40px",
                  cursor: "pointer",
                  width: "100%",
                  height: "auto",
                  top: "29px",
                  left: "129px",
                }}
              >
                Hourly
              </button>
              <button
                onClick={() => setKey("flexible")}
                style={{
                  backgroundColor: key === "flexible" ? "white" : "transparent",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "40px",
                  cursor: "pointer",
                  width: "100%",
                  height: "auto",
                  top: "29px",
                  left: "129px",
                }}
              >
                Flexible
              </button>
            </div>

            <div style={{ marginTop: "20px" }} className="date-picker">
              {key === "dates" && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    disabled={{ before: new Date() }}
                    onSelect={(e) =>
                      setSelectedDate(e ? format(e, "yyyy-MM-dd") : "")
                    }
                    onChange={(e) => handleDate(e)}
                    footer={
                      selectedDate
                        ? `Selected: ${format(selectedDate, "MM-dd-yyyy")}`
                        : "Pick a day."
                    }
                  />
                </div>
              )}

              {key === "hourly" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div className="hour-slider-wrap">
                      <div
                        id="slider"
                        style={{
                          position: "relative",
                          width: "280px",
                          height: "280px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <img
                          src={main}
                          alt="Main Background"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "93%",
                            height: "93%",
                            zIndex: 3,
                            pointerEvents: "none",
                          }}
                        />
                        <img
                          src={dotted}
                          alt="Dotted Overlay"
                          style={{
                            position: "absolute",
                            top: "auto",
                            left: "auto",
                            width: "125%",
                            height: "102%",
                            zIndex: 1,
                          }}
                        />
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
                              fontSize: "70px",
                              color: "black",
                              fontWeight: "500",
                              lineHeight: "1",
                            }}
                          >
                            {hour || 2}
                          </div>
                          <div
                            style={{
                              fontSize: "24px",
                              color: "black",
                              marginTop: "0.2rem",
                            }}
                          >
                            Hours
                          </div>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            cursor: "pointer",
                            transform: "translate3d(0, 0, 0)",
                            backfaceVisibility: "hidden",
                          }}
                          className={`hide-slider-pulse ${
                            !hasChanged || hour === 0 ? "range-ss" : ""
                          }`}
                          onClick={(e) => {
                            if (
                              e.target.tagName === "circle" &&
                              e.target.getAttribute("fill") === "#fff"
                            ) {
                              return;
                            }

                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left - rect.width / 2;
                            const y = e.clientY - rect.top - rect.height / 2;

                            let angle = Math.atan2(x, -y) * (180 / Math.PI);
                            if (angle < 0) angle += 360;

                            const stepIndex =
                              Math.round((angle / 360) * 24) | 0;
                            const finalVal =
                              stepIndex >= 24 || stepIndex < 2 ? 2 : stepIndex;

                            setHasChanged(true);
                            setSliderValue(finalVal);
                            if (handleHourChange) {
                              handleHourChange(finalVal);
                            }
                          }}
                        >
                          <style>{`
                              .hide-slider-pulse circle[style*="animation-name: pulse"] {
                                fill-opacity: 0 !important;
                                opacity: 0 !important;
                                display: none !important;
                              }
                            `}</style>
                          <CircularSlider
                            key={sliderKey}
                            min={0}
                            max={24}
                            trackSize={40}
                            progressSize={40}
                            knobSize={55}
                            knobColor="#fff"
                            trackColor="transparent"
                            progressColorFrom="#4aeab1"
                            progressColorTo="#4aeab1"
                            direction={1}
                            dataIndex={sliderValue}
                            labelColor="transparent"
                            valueColor="transparent"
                            valueFontSize="0rem"
                            labelFontSize="1rem"
                            onChange={(value) => {
                              const rawVal = value | 0;
                              const clampedVal =
                                rawVal >= 24 || rawVal < 2 ? 2 : rawVal;

                              if (rawVal >= 24 || rawVal < 2) {
                                setSliderKey((prev) => prev + 1);
                              }

                              if ((hour | 0) !== clampedVal) {
                                setHasChanged(true);
                                setSliderValue(clampedVal);

                                const label = document.querySelector(
                                  '[aria-label="Hour"]'
                                );
                                if (label) {
                                  label.style.animation = "pulse 0.5s ease";
                                  setTimeout(() => {
                                    label.style.animation = "";
                                  }, 500);
                                }

                                if (handleHourChange) {
                                  handleHourChange(clampedVal);
                                }
                              }
                            }}
                          ></CircularSlider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <style>
                    {`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.15); }
                  100% { transform: scale(1); }
                }
              `}
                  </style>
                </div>
              )}

              {key === "flexible" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <DayPicker
                      mode="single"
                      selected={newDate}
                      disabled={{ before: new Date() }}
                      onSelect={(e) => {
                        setNewDate(e ? format(e, "yyyy-MM-dd") : "");
                        setSelectedDate(e ? format(e, "yyyy-MM-dd") : "");
                      }}
                    />
                  </div>
                  <div
                    className="time-slot d-flex mt-4"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <Form.Select
                      value={fromTime}
                      onChange={(e) => handleTimeChange("from", e.target.value)}
                      style={{
                        border: "1px solid black",
                        borderRadius: "20px",
                        width: "50%",
                      }}
                    >
                      {timeOptions.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      value={toTime}
                      onChange={(e) => handleTimeChange("to", e.target.value)}
                      style={{
                        border: "1px solid black",
                        borderRadius: "20px",
                        width: "50%",
                      }}
                    >
                      {timeOptions.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            ></div>
          </div>
        </div>
      )}

      {isMobileWidth && (
        <style>
          {`
      #filter-modal.custom-modal {
        margin: 0 !important;
        max-width: 100% !important;
      }

      #filter-modal.custom-modal .modal-content {
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        height: 100vh;
      }

      #filter-modal.custom-modal .modal-body {
        // padding: 0 !important;
        // margin: 0 !important;
        // height: 100%;
           background-color:white;
      }

      #filter-modal.modal-backdrop {
        display: none !important; /* Remove backdrop if you want it to feel like a page */
      }
    `}
        </style>
      )}

      <Modal
        show={filterShow}
        onHide={handleClose}
        centered
        rounded
        size="lg"
        id="filter-modal"
        dialogClassName="custom-modal"
        style={{ zIndex: 99999999, borderRadius: isMobileWidth ? "0" : "20px" }}
      >
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobileWidth ? "start" : "flex-end", // Aligns the close button to the right
              justifyContent: "right",
              borderBottom: isMobileWidth ? "1px solid #ccc" : "0px",
              marginBottom: "10px",
            }}
          >
            {isMobileWidth && (
              <>
                <div
                  className="modal-footer"
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    padding: "10px 0",
                    width: "100%",
                  }}
                >
                  {/* Clean All Button */}

                  <div
                    onClick={() => {
                      setFilterShow(false);
                      handleCleanAll();
                    }}
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      color: "black",
                      cursor: "pointer",
                      fontWeight: "500",
                      border: "1px solid #ccc",
                      padding: "17px",
                    }}
                  >
                    <i
                      className="fa-regular fa-arrow-left"
                      style={{ textAlign: "center" }}
                    ></i>
                  </div>

                  <button
                    onClick={handleCleanAll}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#fff",
                      border: "1px solid #E5E5E5",
                      borderRadius: "50px",
                      // padding: "5px 20px",
                      padding: "6px 5px 5px 12px",
                      cursor: "pointer",
                      fontWeight: isMobileWidth ? "400" : "500",
                      transition: "0.3s",
                      fontSize: "13px",
                      marginLeft: "10px",
                      color: "#000",
                      // visibility:'hidden'
                    }}
                  >
                    Clean All
                    <FaRedo
                      style={{
                        width: "25px",
                        height: "25px",
                        color: isCleaned ? "#2F3E46" : "#fff",
                        fontSize: "18px",
                        padding: "5px",
                        backgroundColor: "#3A4B4C",
                        borderRadius: "50%",
                        transform: "scaleX(-1)",
                      }}
                    />
                  </button>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    style={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#4AEAB1",
                      border: "none",
                      borderRadius: "30px",
                      padding: "4px 5px 4px 12px",
                      cursor: "pointer",
                      fontWeight: isMobileWidth ? "400" : "500",
                      color: "#000",
                      transition: "0.3s",
                      fontSize: "13px",
                      marginLeft: "10px",
                    }}
                  >
                    Search
                    <Container className="d-flex justify-content-end m-0 p-0">
                      <div
                        className="search-icon d-flex align-items-center justify-content-center"
                        style={{
                          width: "25px",
                          height: "25px",
                          backgroundColor: "#3A4B4C",
                          borderRadius: "50%",
                          color: "#fff",
                          fontSize: "16px", // Ensure visibility
                          marginLeft: "auto",
                        }}
                      >
                        <i
                          className="fa-regular fa-magnifying-glass"
                          style={{
                            color: "#FFFFFF",
                            fontSize: "14px",
                            borderRadius: "50%",
                          }}
                        ></i>
                      </div>
                    </Container>
                  </button>
                </div>
              </>
            )}

            {!isMobileWidth && (
              <div
                style={{
                  backgroundColor: "#3A4B4C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "24px",
                  width: "24px",
                  borderRadius: "50%",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() => {
                  setFilterShow(false);
                  handleCleanAll();
                }}
              >
                <X
                  size={14}
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
          </div>

          <div
            className="justify-content-between"
            style={{ padding: isMobileWidth ? "" : "0 1rem 1rem 1rem" }}
          >
            <div className="align-items-center">
              <h4
                style={{
                  fontSize: isMobileWidth ? "18px" : "",
                  color: "black",
                  marginTop: isMobileWidth && "20px",
                }}
              >
                Type of Place
              </h4>
              <p
                style={{
                  fontSize: isMobileWidth ? "15px" : "16px",
                  color: "black",
                  fontWeight: "400",
                }}
              >
                Search rooms, entire homes, or any type of place.
              </p>

              <ToggleButtonGroup
                type="radio"
                name="options"
                value={selectedValue}
                onChange={(val) => setSelectedValue(val)}
                className="d-flex w-100 rounded-pill"
                style={{ backgroundColor: "#D1D4D4", padding: "5px" }}
              >
                {[
                  { id: "tbg-btn-1", value: "any_type", label: "Any Type" },
                  { id: "tbg-btn-2", value: "room", label: "Room" },
                  {
                    id: "tbg-btn-3",
                    value: "entire_home",
                    label: "Entire Home",
                  },
                ].map((btn) => (
                  <ToggleButton
                    key={btn.id}
                    id={btn.id}
                    value={btn.value}
                    className="flex-grow-1 border-0"
                    style={{
                      backgroundColor:
                        selectedValue === btn.value ? "white" : "transparent",
                      color: selectedValue === btn.value ? "black" : "black",
                      fontWeight:
                        selectedValue === btn.value
                          ? isMobileWidth
                            ? "400"
                            : "500"
                          : "400",
                      fontSize: isMobileWidth && "13px",
                      padding: isMobileWidth ? "5px 7px" : "10px",
                      borderRadius: "50px",
                    }}
                  >
                    {btn.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>

            <hr className="homeHeader-modal-hr" />
            {/* <hr  style={{width :"108%", margin: "30px 0 30px -4%"}}/> */}

            <div className="align-items-center p-lg-2 mt-4">
              <h4 style={{ color: "black" }}>Price Range</h4>
              <p style={{ fontSize: isMobileWidth ? "15px" : undefined }}>
                Hourly prices before fees and taxes
              </p>

              <Container className="d-flex flex-column align-items-center w-100">
                <div
                  className="d-flex w-100 justify-content-center position-relative"
                  style={{ marginBottom: "-2px" }}
                >
                  <Image
                    src="/images/filters/price-range.svg"
                    alt="Price Range"
                    className="w-100"
                    fluid
                  />

                  {/* LEFT OVERLAY */}
                  <div
                    className="position-absolute top-0 start-0 h-100"
                    style={{
                      width: `${
                        ((values[0] - (RangeValue?.min ?? 0)) /
                          ((RangeValue?.max ?? 2000) -
                            (RangeValue?.min ?? 0))) *
                        100
                      }%`,
                      background: "#fff",
                      opacity: 0.8,
                      pointerEvents: "none",
                    }}
                  />

                  {/* RIGHT OVERLAY */}
                  <div
                    className="position-absolute top-0 end-0 h-100"
                    style={{
                      width: `${
                        (1 -
                          (values[1] - (RangeValue?.min ?? 0)) /
                            ((RangeValue?.max ?? 2000) -
                              (RangeValue?.min ?? 0))) *
                        100
                      }%`,
                      background: "#fff",
                      opacity: 0.8,
                      pointerEvents: "none",
                    }}
                  />
                </div>

                <div className="w-100">
                  <Range
                    step={1}
                    min={RangeValue?.min}
                    max={RangeValue?.max}
                    values={[
                      values[0] >= (RangeValue?.min ?? 0)
                        ? values[0]
                        : RangeValue?.min ?? 0,
                      values[1] <= (RangeValue?.max ?? 2000)
                        ? values[1]
                        : RangeValue?.max ?? 2000,
                    ]}
                    onChange={(newValues) => setValues(newValues)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "6px",
                          borderRadius: "3px",
                          background: `linear-gradient(to right,
                            #007bff ${
                              ((values[0] - (RangeValue?.min ?? 0)) /
                                ((RangeValue?.max ?? 2000) -
                                  (RangeValue?.min ?? 0))) *
                              100
                            }%,
                            #000 ${
                              ((values[0] - (RangeValue?.min ?? 0)) /
                                ((RangeValue?.max ?? 2000) -
                                  (RangeValue?.min ?? 0))) *
                              100
                            }%,
                            #000 ${
                              ((values[1] - (RangeValue?.min ?? 0)) /
                                ((RangeValue?.max ?? 2000) -
                                  (RangeValue?.min ?? 0))) *
                              100
                            }%,
                            #007bff ${
                              ((values[1] - (RangeValue?.min ?? 0)) /
                                ((RangeValue?.max ?? 2000) -
                                  (RangeValue?.min ?? 0))) *
                              100
                            }%
                          )`,
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: isMobileWidth ? "20px" : "30px",
                          width: isMobileWidth ? "20px" : "30px",
                          background: "#fff",
                          border: "2px solid #E2E2E2",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  />
                </div>
              </Container>

              {/* INPUTS */}
              <div
                className="d-flex justify-content-between align-items-center pt-4"
                style={{ gap: isMobileWidth && "10px" }}
              >
                <Form.Group className="w-50">
                  <div
                    style={{
                      border: "1px solid #B1B1B1",
                      borderRadius: "10px",
                      padding: "3px 10px",
                    }}
                  >
                    <Form.Label className="max-min-label">Minimum</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      value={`$${values[0]}`}
                      onChange={(e) => {
                        const val = Number(
                          e.target.value.replace(/[^0-9]/g, "")
                        );
                        setValues([
                          Math.max(
                            RangeValue?.min ?? 0,
                            Math.min(val, values[1])
                          ),
                          values[1],
                        ]);
                      }}
                      //style={{
                      //outline: "none",
                      //border: "none",
                      //padding: 0,
                      //boxShadow: "none",
                      //color: "black",
                      //fontSize: isMobileWidth && "15px",
                      //}}

                      style={{
                        outline: "none",
                        border: "none",
                        padding: 0,
                        boxShadow: "none",
                        color: "black",
                        backgroundColor: "white", // keep white background
                        opacity: 1, // remove faded look
                        cursor: "default",
                        fontSize: isMobileWidth ? "15px" : undefined,
                      }}
                    />
                  </div>
                </Form.Group>

                {!isMobileWidth && <Form.Group className="p-3">—</Form.Group>}

                <Form.Group className="w-50">
                  <div
                    style={{
                      border: "1px solid #B1B1B1",
                      borderRadius: "10px",
                      padding: "3px 10px",
                    }}
                  >
                    <Form.Label className="max-min-label">Maximum</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      value={`$${values[1]}`}
                      onChange={(e) => {
                        const val = Number(
                          e.target.value.replace(/[^0-9]/g, "")
                        );
                        setValues([
                          values[0],
                          Math.min(
                            RangeValue?.max ?? 2000,
                            Math.max(val, values[0])
                          ),
                        ]);
                      }}
                      // style={{
                      // outline: "none",
                      //  border: "none",
                      //   padding: 0,
                      //   boxShadow: "none",
                      //   color: "black",
                      //   fontSize: isMobileWidth && "15px",
                      // }}

                      style={{
                        outline: "none",
                        border: "none",
                        padding: 0,
                        boxShadow: "none",
                        color: "black",
                        backgroundColor: "white", // keep white background
                        opacity: 1, // remove faded look
                        cursor: "default",
                        fontSize: isMobileWidth ? "15px" : undefined,
                      }}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <hr className="homeHeader-modal-hr" />
            <div className="d-flex py-2 justify-content align-items-center w-100 flex-wrap">
              <div
                className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
                style={{
                  padding: isMobileWidth ? "7px 16px" : "12px 16px",
                  fontSize: "1.1rem",
                  // fontWeight: "500",
                  // font: "caption",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #ddd",
                  width: isMobileWidth ? "100%" : "22%",
                  marginBottom: isMobileWidth ? "10px" : "",
                }}
              >
                <img
                  src="/images/filters/location.svg"
                  alt="Location"
                  style={{ width: 20, height: 20 }}
                />
                <Autocomplete
                  apiKey={GOOGLE_KEY}
                  onPlaceSelected={(place) => {
                    setFilterLocation(place.formatted_address);
                    if (place.geometry?.location) {
                      const lat = place.geometry.location.lat();
                      const lng = place.geometry.location.lng();
                      setCoordinates({ lat, lng });
                    }
                  }}
                  options={{ types: ["(cities)"] }}
                  placeholder={filterLocation || "Location"}
                  className="google-autocomplete"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: isMobileWidth ? "13px" : "1.1rem",
                    fontWeight: "400",
                  }}
                />
              </div>

              <Dropdown className="p-lg-2">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
                  style={{
                    padding: isMobileWidth ? "7px 16px" : "12px 16px",
                    // fontSize: "1.1rem",
                    fontSize: isMobileWidth ? "13px" : "1.1rem",
                    fontWeight: "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src="/images/filters/calendar-icon.svg"
                    alt="calendar icon"
                    style={{ width: 20, height: 20 }}
                  />
                  {finalDate ? format(finalDate, "MM-dd-yyyy") : "Date"}
                  <IoChevronDown size={18} />
                </Dropdown.Toggle>

                <style>
                  {`
                     .dropdown-toggle::after {
                         display: none !important;
                      }

                    `}
                </style>

                <Dropdown.Menu
                  style={{
                    padding: isMobileWidth ? "7px 15px" : "15px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    border: "none",
                    minWidth: "240px",
                  }}
                >
                  <DayPicker
                    mode="single"
                    selected={finalDate}
                    disabled={{ before: new Date() }}
                    onSelect={(date) => {
                      setFinalDate(format(date || new Date(), "yyyy-MM-dd"));
                      setSelectedDate(false);
                    }}
                  />
                  {/* <div className="flex gap-3 justify-content-end float-end"> 
                    <button className="px-4 py-1 rounded-pill border-0" onClick={(e) => {setFinalDate(null); setSelectedDate(false)}}> Cancel </button>
                    <button className="px-4 py-1 rounded-pill border-0" onClick={() => setSelectedDate(false)}> OK </button>
                  </div> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {!isMobileWidth && <hr className="homeHeader-modal-hr" />}

            <div style={{ position: "relative", display: "inline-block" }}>
              <Form.Select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                style={{
                  appearance: "none",
                  padding: isMobileWidth ? "7px 16px 7px 40px" : "12px 16px",
                  paddingLeft: "40px", // space for icon
                  fontSize: isMobileWidth ? "13px" : "1.1rem",

                  borderRadius: "999px",
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  // backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "14px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  color: "#000",
                  minWidth: isMobileWidth ? "" : "174px",
                }}
              >
                <option value={0}>Time</option>
                {[
                  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                  19, 20, 21, 22, 23,
                ].map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} hours
                  </option>
                ))}
              </Form.Select>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "14px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#333",
                }}
              >
                <Clock size={18} />
              </div>
            </div>
            <hr className="homeHeader-modal-hr" />

            {/* <div className="my-2">
              {isMobileWidth ? <h4 className="text-dark fs-6"  style={{color:'black'}}> Availability </h4> : <h4 className="pb-3" style={{color:'black',fontWeight:'500'}}>Preferences</h4>}

              {sections.map((section, index) => (
                <div key={index} className="mb-4">
                  <p style={{fontSize:isMobileWidth?'14px':'' }}   >{section.title}</p>
                  <div className="d-flex align-items-center justify-content-between p-lg-2"
                    style={{
                      backgroundColor: "#D1D4D4",
                      borderRadius: "50px",
                      padding:isMobileWidth ?"2px 8px":"8px",
                    }}
                  >
                    <ToggleButtonGroup
                      style={{ width: "75%" }}
                      type="radio"
                      name={section.name}
                      value={""}
                      onChange={(value) => handleSelect(section.name, value)}
                      className="d-flex flex-wrap filter-radio-custum-text"
                    >
                      {section.options.map((option, idx) => (
                        <ToggleButton
                          key={idx}
                          id={`${section.name}-${idx}`}
                          value={option || ""}
                          variant="light"
                          className="border-0 rounded-pill px-lg-3 py-2"
                          style={{
                            backgroundColor: preferences[section.name] == option ? "white" : "transparent",
                            fontWeight: "400",
                            cursor: "pointer",
                          }}
                        >
                          {option}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>

                    <div
                      className="d-flex align-items-center justify-content-right ms-2 "
                      style={{ width: "24%" }}
                    >
                      <InputGroup // style={{ width: "180px", position: "relative" }}
                      >
                        <Form className="filter-radio-btn-group">
                          <Form.Control
                            type="number"
                            placeholder="Type..."
                            value={
                              preferences[section.name] === "Any"
                                ? ""
                                : preferences[section.name]
                            }
                            onChange={(e) =>
                              handleInputChange(section.name, e.target.value)
                            }
                            className="text-center border-0"
                            style={{
                              height:isMobileWidth?"":"40px",
                              paddingRight: "25px", // Ensures text doesn’t overlap the button
                              borderRadius: "50px",
                              border: "1px solid #D1D4D4",
                            }}
                          />
                        

                          <svg
                             className="position-absolute"
                             style={{
                                right: "5px",
                              top:isMobileWidth ? "30%" :"20%"
                             }}
                              width={isMobileWidth ? "15" : "30"}
                              height={isMobileWidth ? "15" : "30"}
                              viewBox="0 0 30 30"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="15" cy="15" r="15" fill="#50E3C2" />
                              <polyline
                                points="21 10 13 19 9 15"
                                fill="none"
                                stroke="black"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                          </svg>

                        </Form>
                      </InputGroup>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            <div className="my-2">
              {/* <h2 className="text-dark">Preferences</h2> */}
              {isMobileWidth ? (
                <h4 className="text-dark fs-6" style={{ color: "black" }}>
                  {" "}
                  Availability{" "}
                </h4>
              ) : (
                <h4
                  className="pb-3"
                  style={{ color: "black", fontWeight: "500" }}
                >
                  Preferences
                </h4>
              )}

              {sections.map((section, index) => {
                // Add this check - START
                const isBedroomsSection = section.name === "bedroom";
                const isActivityStays =
                  selectedActivitiesFilter.includes("Stays") ||
                  selectedActivity === "Stays";
                const isDisabled = isBedroomsSection && !isActivityStays;
                // Add this check - END

                return (
                  <div key={index} className="mb-4">
                    <p style={{ fontSize: isMobileWidth ? "14px" : "" }}>
                      {section.title}
                    </p>
                    <div
                      className="d-flex align-items-center justify-content-between p-lg-2"
                      style={{
                        backgroundColor: "#D1D4D4",
                        borderRadius: "50px",
                        padding: isMobileWidth ? "2px 8px" : "8px",
                        // Add these styles - START
                        opacity: isDisabled ? 0.6 : 1,
                        pointerEvents: isDisabled ? "none" : "auto",
                        // Add these styles - END
                      }}
                    >
                      <ToggleButtonGroup
                        style={{ width: "75%" }}
                        type="radio"
                        name={section.name}
                        value={""}
                        onChange={(value) => handleSelect(section.name, value)}
                        className="d-flex flex-wrap filter-radio-custum-text"
                        // Add this - START
                        disabled={isDisabled}
                        // Add this - END
                      >
                        {section.options.map((option, idx) => (
                          <ToggleButton
                            key={idx}
                            id={`${section.name}-${idx}`}
                            value={option || ""}
                            variant="light"
                            className="border-0 rounded-pill px-lg-3 py-2"
                            style={{
                              backgroundColor:
                                preferences[section.name] == option
                                  ? "white"
                                  : "transparent",
                              fontWeight: "400",
                              // Add this - START
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              opacity: isDisabled ? 0.6 : 1,
                              // Add this - END
                            }}
                            // Add this - START
                            disabled={isDisabled}
                            // Add this - END
                          >
                            {option}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>

                      <div
                        className="d-flex align-items-center justify-content-right ms-2 "
                        style={{ width: "24%" }}
                      >
                        {/* <InputGroup>
                          <Form className="filter-radio-btn-group">
                            <Form.Control
                              type="number"
                              placeholder="Type..."
                              value={
                                preferences[section.name] === "Any"
                                  ? ""
                                  : preferences[section.name]
                              }
                              onChange={(e) =>
                                handleInputChange(section.name, e.target.value)
                              }
                              className="text-center border-0"
                              style={{
                                height: isMobileWidth ? "" : "40px",
                                paddingRight: "25px",
                                borderRadius: "50px",
                                border: "1px solid #D1D4D4",
                                // Add these styles - START
                                cursor: isDisabled ? "not-allowed" : "text",
                                opacity: isDisabled ? 0.6 : 1,
                                // Add these styles - END
                              }}
                              // Add this - START
                              disabled={isDisabled}
                              // Add this - END
                            />
                            <svg
                              className="position-absolute"
                              style={{
                                right: "5px",
                                top: isMobileWidth ? "30%" : "20%",
                              }}
                              width={isMobileWidth ? "15" : "30"}
                              height={isMobileWidth ? "15" : "30"}
                              viewBox="0 0 30 30"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="15" cy="15" r="15" fill="#50E3C2" />
                              <polyline
                                points="21 10 13 19 9 15"
                                fill="none"
                                stroke="black"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Form>
                        </InputGroup> */}
                        <InputGroup>
                          <Form className="filter-radio-btn-group position-relative">
                            <Form.Control
                              type="number"
                              placeholder="Type..."
                              // value={
                              //   preferences[section.name] === "Any"
                              //     ? ""
                              //     : preferences[section.name]
                              // }

                              onChange={(e) =>
                                handleInputChange(section.name, e.target.value)
                              }
                              className="text-center border-0"
                              style={{
                                height: isMobileWidth ? "" : "40px",
                                paddingRight: "25px",
                                borderRadius: "50px",
                                border: "1px solid #D1D4D4",
                                cursor: isDisabled ? "not-allowed" : "text",
                                opacity: isDisabled ? 0.6 : 1,
                              }}
                              disabled={isDisabled}
                            />
                            <svg
                              className="position-absolute"
                              style={{
                                right: "5px",
                                top: isMobileWidth ? "30%" : "20%",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                zIndex: 10,
                              }}
                              width={isMobileWidth ? "15" : "30"}
                              height={isMobileWidth ? "15" : "30"}
                              viewBox="0 0 30 30"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => {
                                if (isDisabled) return;

                                // Check if THIS specific section has the close icon showing
                                const isShowingClose =
                                  activeCloseIcons[section.name] || false;

                                if (!isShowingClose) {
                                  // 1st Click: Turn ONLY this section's icon into a Cross
                                  setActiveCloseIcons((prev) => ({
                                    ...prev,
                                    [section.name]: true, // Set just this one to true
                                  }));
                                } else {
                                  // 2nd Click: Clear the field
                                  // Changed "Any" to "" right here:
                                  handleInputChange(section.name, "");

                                  // Revert ONLY this section's icon back to a Tick
                                  setActiveCloseIcons((prev) => ({
                                    ...prev,
                                    [section.name]: false, // Set just this one to false
                                  }));
                                }
                              }}
                            >
                              {activeCloseIcons[section.name] ? (
                                // --- CROSS ICON ---
                                <>
                                  <circle
                                    cx="15"
                                    cy="15"
                                    r="15"
                                    // fill="#50E3C2"
                                    fill="#E5E5E5"
                                  />
                                  <line
                                    x1="10"
                                    y1="10"
                                    x2="20"
                                    y2="20"
                                    stroke="black"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                  />
                                  <line
                                    x1="20"
                                    y1="10"
                                    x2="10"
                                    y2="20"
                                    stroke="black"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                  />
                                </>
                              ) : (
                                // --- TICK ICON ---
                                <>
                                  <circle
                                    cx="15"
                                    cy="15"
                                    r="15"
                                    // fill="#50E3C2"
                                    fill="#E5E5E5"
                                  />
                                  <polyline
                                    points="21 10 13 19 9 15"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </>
                              )}
                            </svg>
                          </Form>
                        </InputGroup>
                      </div>
                    </div>
                    {/* Add this message - START */}
                    {isBedroomsSection && !isActivityStays && (
                      <p
                        style={{
                          color: "#666",
                          fontSize: "12px",
                          marginTop: "5px",
                          fontStyle: "italic",
                        }}
                      >
                        Bedrooms selection is only available for "Stays"
                        activity
                      </p>
                    )}
                    {/* Add this message - END */}
                  </div>
                );
              })}
            </div>

            <hr className="homeHeader-modal-hr" />
            <div
              style={{
                padding: "10px 0",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <h4
                style={{
                  marginBottom: "20px",
                  fontSize: isMobileWidth ? "18px" : "",
                  color: "black",
                }}
              >
                Activities
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobileWidth
                    ? "repeat(auto-fill, minmax(65px, 1fr))"
                    : "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: isMobileWidth ? "10px" : "23px",
                  fontSize: isMobileWidth ? "11px" : "",
                  textAlign: "center",
                }}
              >
                {activities1.map((activity) => (
                  <div
                    key={activity.name}
                    onClick={() => toggleActivity(activity.name)}
                    style={{
                      padding: isMobileWidth ? "10px" : "20px",
                      backgroundColor: selectedActivitiesFilter.includes(
                        activity.name
                      )
                        ? isMobileWidth
                          ? "none"
                          : "#50E3C2"
                        : "white",
                      border:
                        selectedActivitiesFilter.includes(activity.name) &&
                        isMobileWidth
                          ? "1px solid blue"
                          : "1px solid #ccc",
                      borderRadius: "12px",
                      textAlign: "center",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "0.3s",
                      // display: "flex",
                      // flexDirection: "column",
                      // justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        marginBottom: "8px",
                        color: selectedActivitiesFilter.includes(activity.name)
                          ? isMobileWidth
                            ? "black"
                            : "white"
                          : "black",
                      }}
                    >
                      {/* <img src={activity.icon} loading="lazy" style={{width:isMobileWidth ? "20px" : ""}}/> */}
                      <Image
                        src={activity.icon}
                        alt={activity.name}
                        fluid
                        rounded
                        style={{
                          height: isMobileWidth ? "20px" : "40px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: selectedActivitiesFilter.includes(activity.name)
                          ? isMobileWidth
                            ? "black"
                            : "white"
                          : "black",
                        wordWrap: "break-word",
                      }}
                    >
                      {activity.name}
                    </span>
                  </div>
                ))}
              </div>

              <h6
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  fontWeight: isMobileWidth ? "400" : "500",
                  fontSize: isMobileWidth ? "14px" : "",
                }}
                onClick={() => setShowOtherActivities(!showOtherActivities)}
              >
                Other Activities{" "}
                {showOtherActivities ? <FaAngleUp /> : <FaAngleDown />}
              </h6>

              {showOtherActivities && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobileWidth
                      ? "repeat(auto-fill, minmax(65px, 1fr))"
                      : "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: isMobileWidth ? "10px" : "23px",
                    fontSize: isMobileWidth ? "10px" : "",
                    textAlign: "center",
                  }}
                >
                  {otherActivities.map((activity) => (
                    <div
                      key={activity.name}
                      onClick={() => toggleActivity(activity.name)}
                      style={{
                        backgroundColor: selectedActivitiesFilter.includes(
                          activity.name
                        )
                          ? isMobileWidth
                            ? " none"
                            : "#50E3C2"
                          : "white",
                        border:
                          selectedActivitiesFilter.includes(activity.name) &&
                          isMobileWidth
                            ? "1px solid blue"
                            : "1px solid #ccc",
                        padding: isMobileWidth ? "10px" : "20px",
                        borderRadius: "12px",
                        textAlign: "center",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                    >
                      <div
                        className="d-flex justify-content-center align-items-center p-lg-2 rounded"
                        style={{
                          fontSize: "24px",
                          marginBottom: "8px",
                          color: selectedActivitiesFilter.includes(
                            activity.name
                          )
                            ? isMobileWidth
                              ? "black"
                              : "white"
                            : "black",
                        }}
                      >
                        <Image
                          src={activity.icon}
                          alt={activity.name}
                          fluid
                          rounded
                          style={{
                            height: isMobileWidth ? "20px" : "40px",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <span
                        style={{
                          color: selectedActivitiesFilter.includes(
                            activity.name
                          )
                            ? isMobileWidth
                              ? "black"
                              : "white"
                            : "black",
                          wordWrap: "break-word",
                        }}
                      >
                        {activity.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="homeHeader-modal-hr" />
            <div
              className="nw-pop-amenities-wrp"
              style={{
                padding: "10px 0",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <h4
                style={{
                  marginBottom: "20px",
                  fontSize: isMobileWidth ? "18px" : "",
                  color: "black",
                }}
              >
                Amenities
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {(showMore
                  ? [...basicAmenities, ...moreAmenities]
                  : basicAmenities
                ).map((amenity) => (
                  <label
                    key={amenity}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      fontSize: isMobileWidth ? "14px" : "",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      style={{ marginRight: "8px" }}
                    />
                    {amenity}
                  </label>
                ))}
              </div>

              {/* {showMore && (
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {moreAmenities.map((amenity) => (
                      <label
                        key={amenity}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          style={{ marginRight: "8px" }}
                        />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>
              )} */}

              <p
                style={{
                  marginTop: "10px",
                  cursor: "pointer",
                  color: "#000",
                  textDecoration: "underline",
                  fontSize: isMobileWidth ? "14px" : "",
                }}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show Less" : "Show More"}
              </p>
            </div>
            <hr className="homeHeader-modal-hr" />
            <div
              style={{
                padding: "10px 0",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <h4
                style={{
                  marginBottom: "20px",
                  fontSize: isMobileWidth ? "18px" : "",
                  color: "black",
                }}
              >
                Booking
              </h4>

              {togglesBooking.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div style={{ maxWidth: "85%" }}>
                    <strong
                      style={{
                        fontWeight: "500",
                        color: "black",
                        fontSize: isMobileWidth ? "14px" : "",
                      }}
                    >
                      {item.title}
                    </strong>
                    {item.info && (
                      <span
                        className="info-wrap"
                        style={{
                          position: "relative",
                          display: "inline-block",
                          marginLeft: "8px",
                        }}
                      >
                        <span
                          onMouseEnter={() => setIsHovered1(true)}
                          onMouseLeave={() => setIsHovered1(false)}
                          style={{
                            display: "inline-block",
                            position: "relative",
                          }}
                        >
                          <img
                            src="/images/create-profile/info.svg"
                            alt=""
                            style={{ cursor: "pointer", marginLeft: 0 }}
                          />
                          {isHovered1 && (
                            <span
                              style={{
                                display: "block",
                                position: "absolute",
                                top: "-13px",
                                left: "22px",
                                backgroundColor: "#fff",
                                color: "#000",
                                padding: "15px 20px",
                                boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.2)",
                                borderRadius: "12px",
                                width: "410px",
                                zIndex: 10,
                                whiteSpace: "normal",
                                fontSize: isMobileWidth ? "12px" : "14px",
                                wordBreak: "break-word",
                                maxWidth: isMobileWidth ? "200px" : "none",
                              }}
                            >
                              Your safety and peace of mind are our top
                              priorities. ZYVO is proud to provide comprehensive
                              liability insurance coverage for all bookings
                            </span>
                          )}
                        </span>
                      </span>
                    )}
                    {item.description && (
                      <p
                        style={{
                          margin: "5px 0",
                          color: "black",
                          fontSize: isMobileWidth ? "12px" : "16px",
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div
                    onClick={() => handleToggleBooking(index)}
                    style={{
                      width: "60px",
                      height: "28px",
                      borderRadius: "20px",
                      backgroundColor: item.toggle ? "#4AEAB1" : "#B0B0B0",
                      display: "flex",
                      alignItems: "center",
                      padding: "3px",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: item.toggle ? "white" : "white",
                        transform: item.toggle
                          ? "translateX(31px)"
                          : "translateX(0px)",
                        transition: "0.3s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr className="homeHeader-modal-hr" />
            <div
              className="nw-pop-amenities-wrp"
              style={{
                padding: "10px 0",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <h4
                style={{
                  fontSize: isMobileWidth ? "18px" : "",
                  marginBottom: "20px",
                  color: "black",
                }}
              >
                Language
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {availableLanguages
                  .slice(0, showMoreLanguages ? availableLanguages.length : 4)
                  .map((language, index) => (
                    <label
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: isMobileWidth ? "14px" : "",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={() => handleSelection(language)}
                      />
                      {language}
                    </label>
                  ))}
              </div>

              <div
                onClick={() => setShowMoreLanguages(!showMoreLanguages)}
                style={{
                  marginTop: "10px",
                  cursor: "pointer",
                  color: "black",
                  textDecoration: "underline",
                  fontSize: isMobileWidth ? "14px" : "",
                }}
              >
                {showMoreLanguages ? "Show Less" : "See More"}
              </div>
            </div>
          </div>
        </Modal.Body>

        {!isMobileWidth && (
          <Modal.Footer style={{ padding: "4px", border: "none" }}>
            <div
              className="modal-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* Clean All Button */}
              <button
                onClick={handleCleanAll}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#fff",
                  border: "1px solid #E5E5E5",
                  borderRadius: "50px",
                  padding: "5px 5px 5px 15px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "0.3s",
                }}
              >
                Clean All
                <img
                  src={"/images/clean-all.svg"}
                  alt="clean"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
                {/* <FaRedo style={{
                    width: "30px",
                    height: "30px",
                    color: isCleaned ? "#2F3E46" : "#fff",
                    fontSize: "18px",
                    padding: "5px",
                    backgroundColor: "#3A4B4C",
                    borderRadius: "50%",
                    transform: "scaleX(-1)"
                  }}
                /> */}
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                style={{
                  width: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#4AEAB1",
                  border: "none",
                  borderRadius: "30px",
                  padding: "5px 5px 5px 15px",
                  cursor: "pointer",
                  fontWeight: "500",
                  color: "#000",
                  transition: "0.3s",
                }}
              >
                Search
                <Container className="d-flex justify-content-end m-0 p-0">
                  <div
                    className="search-icon d-flex align-items-center justify-content-center"
                    style={{
                      height: "35px",
                      width: "35px",
                      backgroundColor: "#3A4B4C",
                      borderRadius: "50%",
                      color: "#fff",
                      fontSize: "16px", // Ensure visibility
                      marginLeft: "auto",
                    }}
                  >
                    <i
                      className="fa-regular fa-magnifying-glass"
                      style={{
                        color: "#FFFFFF",
                        fontSize: "14px",
                        borderRadius: "50%",
                      }}
                    ></i>
                  </div>
                </Container>
              </button>
            </div>
          </Modal.Footer>
        )}
      </Modal>

      <LanguageModal />
    </>
  );
};

export default React.memo(HomeHeader);

// import React, { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { DayPicker } from "react-day-picker";
// import { Nav } from "react-bootstrap";
// import "react-day-picker/style.css";
// import Autocomplete from "react-google-autocomplete";
// import { Client as ConversationsClient } from "@twilio/conversations";
// import { GOOGLE_KEY, imageBase, KEYS } from "../../config/Constant";
// import { clearUser, setUserType } from "../../store/slices/userSlice";
// import Constant from "../../config/Constant";
// import Home from "../../pages/guestPage/Home";
// import { CloseButton, Col, Container, Row, Form, Button, Tabs, Tab, Modal, Dropdown, ToggleButtonGroup, ToggleButton, InputGroup, Image, FormControl, } from "react-bootstrap";
// import CircularSlider from "@fseehawer/react-circular-slider";
// import { format } from "date-fns";
// import { FaAngleDown, FaAngleUp, FaRedo, FaSearch } from "react-icons/fa";
// import { Clock, Pencil, Section, X } from "lucide-react";
// import { Range } from "react-range";
// import useCommon from "../../hooks/useCommon";
// import { useDispatch, useSelector } from "react-redux";
// import RegisterModal from "./authModalGuest/RegisterModal";
// import main from "../../assets/gallery/Group (2).png";
// import dotted from "../../assets/gallery/Vector (1).png";
// import { toast } from "react-toastify";
// import moment from "moment";
// import useChat from "../../hooks/host/useChat";
// import useProfile from "../../hooks/useProfile";
// import LanguageModal from "../../pages/LanguageModal";
// import { useForm } from "react-hook-form";
// import MobFooter from "../MobFooter";
// import MobSearch from "../MobSearch";

// const generateTimeOptions = () => {
//   const times = [];
//   for (let i = 0; i < 48; i++) {
//     let totalMinutes = i * 30;
//     let hours = Math.floor(totalMinutes / 60);
//     let minutes = totalMinutes % 60;

//     let formattedHours = String(hours).padStart(2, "0");
//     let formattedMinutes = String(minutes).padStart(2, "0");

//     // Use numeric hours/minutes in moment, not the formatted strings
//     times.push(moment({ hour: hours, minute: minutes }).format("hh:mm A"));
//   }
//   return times;
// };

// const HomeHeader = ({ showMap, setShowMap }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const login_id = localSaved?.user_id ? String(localSaved?.user_id) : null;

//   const access_token = localSaved?.access_token;
//   const { homeDataFilters, guestHomeData, isLoading } = useCommon();
//   const [currentLocation, setCurrentLocation] = useState({
//     latitude: 0,
//     longitude: 0,
//   });

//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedActivity, setSelectedActivity] = useState("");
//   const [key, setKey] = useState("dates");
//   const [fromTime, setFromTime] = useState("");
//   const [isHovered1, setIsHovered1] = useState(false);
//   const [toTime, setToTime] = useState("");
//   const [hour, setHour] = useState("");
//   const [show, setShow] = useState(false);
//   const [filterShow, setFilterShow] = useState(false);
//   const [newDate, setNewDate] = useState();
//   const [flexibleDate, setFlexibleDate] = useState("");
//   const [openInput, setOpenInput] = useState(true);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedPlace, setSelectedPlace] = useState("");
//   const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
//   const [start_time, setStart_time] = useState("");
//   const [end_time, setEnd_time] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const handleToggleMobSearch = () => {
//     setShowModal(!showModal);
//   };

//   const [modalToggleValue, setModalToggleValue] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [registerModal, setRegisterModal] = useState(true);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   //guest header
//   const { getTwilioToken } = useChat();
//   const { guestUnReadBookings, guestMarkBookings, getPropertyPriceRange } =
//     useCommon();

//   const { getUserProfile } = useProfile();
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userType = localStorage.getItem(KEYS.USER_TYPE);
//   const userId = userData?.user_id ? String(userData?.user_id) : null;
//   const [unreadCountChat, setUnreadCountChat] = useState(0);

//   const profileData = useSelector((state) => state.profile);
//   const [switchToHost, setSwitchToHost] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [getList, setGetList] = useState({ unread_booking_count: 0 });

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleModalToggle = (modalType, state) => {
//     if (modalType === "register") {
//       setIsRegisterModalOpen(state);
//       if (state === true) {
//         setRegisterModal(true); // reset to show register form
//       }
//     }
//     if (modalType === "login") {
//       setIsLoginModalOpen(state);
//       if (state === true) {
//         setModalToggleValue(true); // or false depending on your login modal logic
//       }
//     }
//   };

//   useEffect(() => {
//     const handleGetProfile = async () => {
//       try {
//         const res = await getUserProfile({ user_id: userId });
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     if (userId) {
//       handleGetProfile();
//     }
//   }, [userId]);

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       const isMobileOrTablet = window.innerWidth <= 991; // includes tablets
//       setIsMobileWidth(isMobileOrTablet);
//     };

//     checkWindowWidth(); // Check immediately on mount
//     window.addEventListener("resize", checkWindowWidth);
//     return () => {
//       window.removeEventListener("resize", checkWindowWidth);
//     };
//   }, []); // Don't put window.innerWidth in the deps

//   useEffect(() => {
//     if (switchToHost) {
//       dispatch(setUserType("host"));
//       Constant.selectedFlow = "host";
//       localStorage.setItem(KEYS.USER_TYPE, "host");
//       navigate("/", { replace: true });
//       window.location.reload();
//     }
//   }, [switchToHost, dispatch, navigate]);

//   const handleSwitch = () => {
//     // e.preventDefault();s
//     setSwitchToHost(true);
//     setDropdownOpen(false); // Close dropdown after selection
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   const handleLogout = () => {
//     dispatch(clearUser()); // Clear Redux user state
//     toast.success("Logout Successfully."); // Then do UI cleanup
//     navigate("/");
//     setShowLogoutModal(false);
//     setDropdownOpen(false); // Close dropdown after selection
//   };

//   const toggleDropdown = () => {
//     if (userData) {
//       setDropdownOpen(!dropdownOpen);
//     } else {
//       toast.error("Please login...");
//       navigate("/");
//     }
//   };

//   const menuItems = [
//     // { label: "Payment History", to: "/payment-guest" },
//     { label: "Language", dataTarget: "#language-popup", dataToggle: "modal" },
//     { label: "Notifications", to: "/notifications", state: { type: "guest" } },
//     { label: "Help Center", to: "/helpCenter", state: { type: "guest" } },
//     { label: "Settings", to: "/profile" },
//     { label: "About Us", to: "/aboutUs" },
//     { label: "Feedback", to: "/feedback" },
//     // { label: "Logout", action: () => setShowLogoutModal(true) },
//   ];

//   const handleMenuItemClick = (item) => {
//     if (item.action) {
//       item.action();
//     }
//     setDropdownOpen(false); // Close dropdown after selection
//   };

//   const [lastReadCount, setLastReadCount] = useState(0);
//   const fetchBookingList = async () => {
//     try {
//       const response = await guestUnReadBookings({ user_id: userId });
//       if (response?.data) {
//         setGetList(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching booking list:", error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchBookingList(); // Re-fetch when component mounts or route changes
//     }
//   }, [userId]);

//   // Mark bookings as read
//   // Only show count of new unread bookings (after last read)
//   const newUnreadCount = Math.max(
//     0,
//     getList.unread_booking_count - lastReadCount
//   );
//   const showBadge = newUnreadCount > 0;

//   const markBookingsAsRead = async () => {
//     try {
//       await guestMarkBookings({ user_id: userId });
//       // Set last read count to current unread count
//       setLastReadCount(getList.unread_booking_count);
//     } catch (error) {
//       console.error("Error marking bookings as read:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchTwilioInfo = async () => {
//       const userId = userData?.user_id;
//       if (
//         !userId ||
//         (typeof userId !== "string" && typeof userId !== "number")
//       ) {
//         // console.error("Invalid user_id:", userId);
//         return;
//       }

//       const response = await getTwilioToken({
//         user_id: String(userId),
//         role: "guest",
//       });

//       if (!response?.data?.token) {
//         console.error("Twilio token not received");
//         return;
//       }

//       const client = await ConversationsClient.create(response.data.token);
//       const paginator = await client.getSubscribedConversations();

//       let totalUnread = 0;
//       for (const convo of paginator.items) {
//         const count = await convo.getUnreadMessagesCount();
//         totalUnread += count || 0;
//       }
//       setUnreadCountChat(totalUnread);
//     };

//     fetchTwilioInfo();
//   }, []);

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
//   }, [navigator.geolocation]);

//   const timeOptions = generateTimeOptions();

//   const activities = [
//     "Stays",
//     "Event Space",
//     "Photo Shoot",
//     "Music Video",
//     "Birthday Party",
//     "Wedding",
//     "Meeting",
//     "Baby Shower",
//     "Pool",
//   ];

//   // Search Query
//   const handleSearchQuery = () => {};

//   const [showMore, setShowMore] = useState(false);
//   const [isCleaned, setIsCleaned] = useState(false);
//   const [filterLocation, setFilterLocation] = useState("");
//   const [preferences, setPreferences] = useState({
//     people_count: "Any",
//     property_size: "Any",
//     bedroom: "Any",
//     bathroom: "Any",
//   });

//   const [showOtherActivities, setShowOtherActivities] = useState(false);
//   const [selectedDuration, setSelectedDuration] = useState(null);
//   const [removeFilter, setRemoveFilter] = useState(false);

//   const [selectedActivitiesFilter, setSelectedActivitiesFilter] = useState([]);
//   const [selectedAmenities, setSelectedAmenities] = useState([]);
//   const [selectedLanguages, setSelectedLanguages] = useState([]);
//   const [selectedValue, setSelectedValue] = useState("any_type");
//   const [showMoreLanguages, setShowMoreLanguages] = useState(false);
//   const [values, setValues] = useState([]); // "Min" and Max values
//   const [RangeValue, setRangeValue] = useState({
//     min: null,
//     max: null,
//   });

//   const [togglesBooking, setTogglesBooking] = useState([
//     {
//       title: "Instant Book",
//       name: "instant_booking",
//       description: "Listings you can book without waiting for host approval",
//       toggle: false,
//     },
//     {
//       title: "Self check-in",
//       name: "self_check_in",
//       description: "Easy access to the property once you arrive",
//       toggle: false,
//     },
//     {
//       title: "Allows pets",
//       name: "allows_pets",
//       description: "",
//       toggle: false,
//       info: true,
//     },
//   ]);

//   const [finalDate, setFinalDate] = useState(null);

//   const getPriceRange = async () => {
//     try {
//       const response = await getPropertyPriceRange();
//       if (response.success && response.data) {
//         const min = parseFloat(response.data.minimum_price);
//         const max = parseFloat(response.data.maximum_price);
//         setValues([min, max]);
//         setRangeValue({ min: min, max: max });
//       }
//     } catch (error) {
//       console.error("Failed to fetch price range:", error);
//     }
//   };

//   useEffect(() => {
//     getPriceRange();
//   }, []);

//   const handleCleanAll = () => {
//     setSelectedPlace("");
//     setSelectedActivity("");
//     getPriceRange();
//     setFilterLocation("");
//     setSelectedDuration(0);
//     setPreferences({
//       people_count: "Any",
//       property_size: "Any",
//       bedroom: "Any",
//       bathroom: "Any",
//     });
//     setFinalDate(null);
//     setSelectedActivitiesFilter([]);
//     setSelectedAmenities([]);
//     setCoordinates({ lat: null, lng: null });

//     setTogglesBooking([
//       {
//         title: "Instant Book",
//         description: "Listings you can book without waiting for host approval",
//         toggle: false,
//       },
//       {
//         title: "Self check-in",
//         description: "Easy access to the property once you arrive",
//         toggle: false,
//       },
//       { title: "Allows pets", description: "", toggle: false, info: true },
//     ]);
//     setSelectedLanguages([]);
//     setIsCleaned(true);
//     setSelectedValue(1);

//     setTimeout(() => setIsCleaned(false), 1000);
//   };

//   const handleInputChangeMinMax = (index, event) => {
//     let newValue = Number(event.target.value);
//     if (index === 0) {
//       newValue = Math.min(newValue, values[1] - 1); // Ensure min < max
//     } else {
//       newValue = Math.max(newValue, values[0] + 1); // Ensure max > min
//     }
//     setValues((prev) =>
//       index === 0 ? [newValue, prev[1]] : [prev[0], newValue]
//     );
//   };

//   const toggleActivity = (name) => {
//     setSelectedActivitiesFilter((prevSelected) => {
//       const isAlreadySelected = prevSelected.includes(name);
//       if (isAlreadySelected) {
//         return prevSelected.filter((activity) => activity !== name); // Unselect if already selected
//       } else {
//         return [...prevSelected, name]; // Add to selected list
//       }
//     });
//   };

//   const handleToggleBooking = (index) => {
//     setTogglesBooking((prevToggles) =>
//       prevToggles.map((item, i) =>
//         i === index ? { ...item, name: item.name, toggle: !item.toggle } : item
//       )
//     );
//   };

//   const handleSelection = (language) => {
//     setSelectedLanguages(
//       (prev) =>
//         prev.includes(language)
//           ? prev.filter((item) => item !== language) // Remove if already selected
//           : [...prev, language] // Add if not selected
//     );
//   };

//   const toggleAmenity = (amenity) => {
//     setSelectedAmenities(
//       (prevSelected) =>
//         prevSelected.includes(amenity)
//           ? prevSelected.filter((item) => item !== amenity) // Unselect
//           : [...prevSelected, amenity] // Select
//     );
//   };

//   const basicAmenities = [
//     "Free Parking",
//     "Meal Included",
//     "Elevator/Lift Access",
//     "Wheelchair Accessible",
//     "Smoking Allowed",
//     "Non-Smoking Property",
//     // "Wifi",
//     // "Washer",
//     // "Air conditioning",
//     // "Free Parking",
//     // "Elevator/Lift Access",
//     // "Smoking Allowed",
//   ];

//   const moreAmenities = [
//     "Security Cameras",
//     "Concierge Service",
//     "Airport Shuttle Service",
//     "Bike Rental",
//     "Business Centre",
//     "Conference/Meeting Facilities",
//     "Spa/Wellness Centre",
//     "Outdoor Space (Garden Terrace)",
//     "BBQ/Grill Area",
//     "Games Room",
//     "Ski-In/Ski-Out Access",
//     "Waterfront Property",
//     "Scenic Views",
//     "Eco-Friendly/Green Certified",
//     "Smart Home Technology",
//     "Electric Vehicle Charging Station",
//     "Yoga/Meditation Space",
//     "On-Site Restaurant/Cafe",
//     "Bar/Lounge Area",
//     "Live Entertainment",
//     "Pet Amenities (Pet Sitting Pet Spa)",
//     "Sports Facilities (Tennis Court Golf Course)",
//     "Cultural Experiences/Workshops",
//     "Coffee/Tea Station",
//     // "Kitchen",
//     // "Dryer",
//     // "Heating",
//     // "Meal Included",
//     // "Wheelchair Accessible",
//     // "Non-Smoking Property",
//   ];

//   const availableLanguages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Italian",
//     "Portuguese",
//     "Dutch",
//     "Russian",
//     "Ukrainian",
//     "Polish",
//     "Turkish",
//     "Greek",
//     "Hungarian",
//     "Romanian",
//     "Mandarin Chinese",
//     "Cantonese",
//     "Japanese",
//     "Korean",
//     "Vietnamese",
//     "Thai",
//     "Hindi",
//     "Bengali",
//     "Urdu",
//     "Punjabi",
//     "Marathi",
//     "Tamil",
//     "Telugu",
//     "Arabic",
//     "Persian (Farsi)",
//     "Hebrew",
//     "Pashto",
//     "Kurdish",
//     "Swahili",
//     "Hausa",
//     "Yoruba",
//     "Igbo",
//     "Zulu",
//     "Amharic",
//     "Tagalog",
//     "Malay",
//     "Indonesian",
//     "Burmese",
//     "Khmer",
//     "Lao",
//   ];

//   const activities1 = [
//     {
//       name: "Stays",
//       icon: "/images/filters/activities/1.svg",
//     },
//     {
//       name: "Event Space",
//       icon: "/images/filters/activities/2.svg",
//     },
//     {
//       name: "Photo shoot",
//       icon: "/images/filters/activities/3.svg",
//     },
//     {
//       name: "Meeting",
//       icon: "/images/filters/activities/4.svg",
//     },
//   ];

//   const otherActivities = [
//     {
//       name: "Party",
//       icon: "/images/filters/activities/5.svg",
//     },
//     {
//       name: "Film Shoot",
//       icon: "/images/filters/activities/6.svg",
//     },
//     {
//       name: "Performance",
//       icon: "/images/filters/activities/7.svg",
//     },
//     {
//       name: "Workshop",
//       icon: "/images/filters/activities/8.svg",
//     },
//     {
//       name: "Corporate Event",
//       icon: "/images/filters/activities/9.svg",
//     },
//     {
//       name: "Wedding",
//       icon: "/images/filters/activities/10.svg",
//     },
//     {
//       name: "Dinner",
//       icon: "/images/filters/activities/11.svg",
//     },
//     {
//       name: "Retreat",
//       icon: "/images/filters/activities/12.svg",
//     },
//     {
//       name: "Pop-up",
//       icon: "/images/filters/activities/13.svg",
//     },
//     {
//       name: "Networking",
//       icon: "/images/filters/activities/14.svg",
//     },
//     {
//       name: "Fitness Class",
//       icon: "/images/filters/activities/15.svg",
//     },
//     {
//       name: "Audio Recording",
//       icon: "/images/filters/activities/16.svg",
//     },
//     {
//       name: "Swimming Pool",
//       icon: "/images/filters/activities/17.svg",
//     },
//   ];

//   const handleRemoveData = async (setValue) => {
//     if (setValue === setFlexibleDate) {
//       setNewDate("");
//     }
//     setValue("");

//     try {
//       const response = await guestHomeData({
//         ...(login_id ? { user_id: login_id } : {}),
//         // latitude: currentLocation?.latitude || 0,
//         // longitude: currentLocation?.longitude || 0,
//       });
//     } catch (error) {
//       console.error("Error fetching filtered data:", error);
//     }
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => {
//     // console.log("Hello clicked");
//     setShow(true);
//   };

//   const handleDate = (e) => {
//     setSelectedDate(e.toLocaleDateString());
//   };

//   const handleTimeChange = (type, value) => {
//     let updatedFromTime = fromTime;
//     let updatedToTime = toTime;

//     if (type === "from") {
//       updatedFromTime = value;
//       setFromTime(value);

//       // Automatically set `toTime` by adding `Hour`
//       const fromMoment = moment(value, "hh:mm A");
//       const newToMoment = fromMoment.clone().add(hour, "hours");
//       const newToTime = newToMoment.format("hh:mm A");

//       // If the new toTime is valid, set it
//       if (timeOptions.includes(newToTime)) {
//         updatedToTime = newToTime;
//         setToTime(newToTime);
//       } else {
//         // If the time goes out of range
//         updatedToTime = "";
//         setToTime("");
//       }
//     } else {
//       updatedToTime = value;
//       setToTime(value);
//     }

//     // Ensure newDate is valid
//     if (!newDate) {
//       console.error("Error: newDate is undefined or invalid.");
//       return;
//     }

//     let updatedDate = new Date(newDate); // Clone the base date

//     // Handle date rollover (if toTime is before fromTime)
//     if (
//       updatedFromTime &&
//       updatedToTime &&
//       timeOptions.indexOf(updatedToTime) <= timeOptions.indexOf(updatedFromTime)
//     ) {
//       updatedDate.setDate(updatedDate.getDate() + 1); // move to next day
//     }

//     const formattedDate = format(updatedDate, "yyyy-MM-dd");

//     const formattedStartTime = updatedFromTime
//       ? `${updatedFromTime.padStart(5, "0")}`
//       : null;

//     const formattedEndTime = updatedToTime
//       ? `${updatedToTime.padStart(5, "0")}`
//       : null;

//     // Update display value
//     setFlexibleDate(
//       `${formattedDate} | ${updatedFromTime || "Not Selected"} - ${
//         updatedToTime || "Not Selected"
//       }`
//     );

//     // Set backend values
//     if (type === "from") {
//       setStart_time(formattedStartTime);
//     } else {
//       setEnd_time(formattedEndTime);
//     }
//   };

//   const handleFilterData = async () => {
//     try {
//       setShowModal(false);
//       // if (!start_time || !end_time) {
//       //   toast.error("Error: Start time or End time is missing.");
//       //   return;
//       // }
//       const allFieldsEmpty =
//         !selectedPlace &&
//         !selectedDate &&
//         !hour &&
//         !start_time &&
//         !end_time &&
//         !selectedActivity &&
//         !coordinates?.lat <= 0 &&
//         !coordinates?.lng <= 0;

//       if (allFieldsEmpty) {
//         toast.error("Please select at least one filter to proceed.");
//         return;
//       }
//       const response = await guestHomeData({
//         location: selectedPlace,
//         date: selectedDate,
//         hour: hour,
//         start_time: start_time,
//         end_time: end_time,
//         activity: selectedActivity,
//         user_id: login_id ?? "",
//         latitude: coordinates?.lat,
//         longitude: coordinates?.lng,
//       });

//       if (!response?.data) {
//         // console.log("Response is null or empty:", response?.data);
//         navigate("*");
//       }
//     } catch (error) {
//       console.error("Error fetching filtered data:", error);
//     }
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setSelectedPlace("");
//     setSelectedDate("");
//     setSelectedActivity("");
//     setHour("");
//     setFlexibleDate("");
//     setOpenInput(false);
//   };

//   const handleHourChange = (value) => {
//     let newHour = parseInt(value);
//     setHour(newHour);
//     // Prevent sudden jumps between 0 → 11 or 11 → 0
//     if (
//       Math.abs(newHour - hour) > 0 &&
//       !(newHour === 0 && hour === 11) &&
//       !(newHour === 11 && hour === 0)
//     ) {
//       return; // Ignore the change if it's a sudden jump
//     }
//     setHour(newHour);
//   };

//   const sections = [
//     {
//       title: "Number of people",
//       name: "people_count",
//       options: ["Any", 3, 4, 5, 7, "8+"],
//     },
//     {
//       title: "Property size (sq ft)",
//       name: "property_size",
//       options: ["Any", 250, 350, 450, 550, 650, 750],
//     },
//     // {
//     //   title: "Parking space capacity",
//     //   name: "parking_space",
//     //   options: ["Any", 1, 2, 3, 4, 5, 6, 7, "8+"],
//     // },
//     {
//       title: "Bedrooms",
//       name: "bedroom",
//       options: ["Any", 1, 2, 3, 4, 5, 6, 7, "8+"],
//     },
//     {
//       title: "Bathrooms",
//       name: "bathroom",
//       options: ["Any", 1, 2, 3, 4, 5, 6, 7, "8+"],
//     },
//   ];

//   const handleSelect = (section, option) => {
//     // if (option != "Any" && option != "") {
//     //   setPreferences({
//     //     ...preferences,
//     //     [section]: option,
//     //   });
//     // }
//     setPreferences({
//       ...preferences,
//       [section]: option,
//     });
//   };

//   const handleInputChange = (section, value) => {
//     if (value === "") {
//       setPreferences({
//         ...preferences,
//         [section]: "Any", // reset logic
//       });
//       return;
//     }

//     const newValue = parseInt(value, 10);
//     if (!isNaN(newValue)) {
//       setPreferences({
//         ...preferences,
//         [section]: newValue,
//       });
//     }
//   };

//   const handleSearch = async () => {
//     // const normalizedPreferences = Object.fromEntries(
//     //   Object.entries(preferences).map(([key, value]) => [
//     //     key, value === "Any" ? "" : value,
//     //   ])
//     // );
//     const normalizedPreferences = Object.fromEntries(
//       Object.entries(preferences).filter(([_, value]) => value !== "Any")
//     );
//     const payload = {
//       // ...(selectedValue != "any_type" &&
//       //   selectedValue != "" && { place_type: selectedValue }),
//       // maximum_price: values[1],
//       // ...(coordinates?.lat != null ? {latitude: coordinates?.lat} : {latitude: currentLocation?.latitude}),
//       // ...(coordinates?.lng != null ? {longitude: coordinates?.lng} : {longitude: currentLocation?.longitude}),
//       // ...(values[0] != RangeValue?.min && {minimum_price: values[0]}),
//       // ...(values[1] != RangeValue?.max && {maximum_price: values[1]}),
//       user_id: userId,
//       ...(selectedValue != "any_type" &&
//         selectedValue != "" &&
//         selectedValue != 1 && {
//           place_type: selectedValue == "any_type" ? "" : selectedValue,
//         }),
//       minimum_price: values[0],
//       ...(values[1] != RangeValue?.max && { maximum_price: values[1] }),

//       ...(filterLocation != "" && { location: filterLocation }),
//       ...(coordinates?.lat != null && { latitude: coordinates?.lat }),
//       ...(coordinates?.lng != null && { longitude: coordinates?.lng }),
//       ...(selectedDuration && { time: selectedDuration }),
//       ...normalizedPreferences,
//       ...(togglesBooking?.[0]?.toggle != 0 && {
//         instant_booking: togglesBooking?.[0]?.toggle ? 1 : 0,
//       }),
//       ...(togglesBooking?.[1]?.toggle != 0 && {
//         self_check_in: togglesBooking?.[1]?.toggle ? 1 : 0,
//       }),
//       ...(togglesBooking?.[2]?.toggle != 0 && {
//         allows_pets: togglesBooking?.[2]?.toggle ? 1 : 0,
//       }),
//       ...(finalDate != null && { date: finalDate }),
//       ...(selectedActivitiesFilter?.length > 0 && {
//         activities: selectedActivitiesFilter,
//       }),
//       ...(selectedAmenities?.length > 0 && { amenities: selectedAmenities }),
//       ...(selectedLanguages?.length > 0 && { languages: selectedLanguages }),
//     };

//     const response = await homeDataFilters(payload);
//     if (response?.success) {
//       setFilterShow(false);
//       setRemoveFilter(true);
//     } else {
//       navigate("*");
//     }
//   };

//   const handleClearFilter = async () => {
//     handleCleanAll();
//     const response = await guestHomeData({
//       user_id: login_id ?? "",
//       latitude: currentLocation?.latitude,
//       longitude: currentLocation?.longitude,
//     });

//     setRemoveFilter(false);
//   };

//   useEffect(() => {
//     // Apply z-index fix for Google Autocomplete dropdown
//     const style = document.createElement("style");
//     style.innerHTML = `
//         .pac-container {
//           z-index: 100000000 !important; /* Higher than Bootstrap modal */
//           position: absolute !important;
//         }
//       `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   useEffect(() => {
//     // Move autocomplete dropdown inside modal
//     const modalElement = document.getElementById("filter-modal");
//     const pacContainers = document.querySelectorAll(".pac-container");
//     pacContainers.forEach((container) => {
//       if (modalElement) {
//         modalElement.appendChild(container);
//       }
//     });
//   }, []);

//   const handleClick = (e) => {
//     e.preventDefault(); // prevent default React Router navigation
//     window.location.href = "/"; // force full page reload
//   };
//   const handleNavigation = () => {
//     if (login_id && access_token != "undefined") {
//       setFilterShow(true);
//     } else {
//       // setIsLoginModal(true);
//       setFilterShow(true);
//     }
//   };

//   // const GOOGLE_KEY = ""; // Replace with your actual key

//   // Check if Google Maps script is loaded
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);

//   // const GOOGLE_KEY = ""; // Replace with your actual key

//   // Check if Google Maps script is loaded
//   useEffect(() => {
//     if (window.google && window.google.maps) {
//       setIsScriptLoaded(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => setIsScriptLoaded(true);
//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, [GOOGLE_KEY]);

//   function formatDateToMMDDYYYY(date) {
//     const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
//     const dd = String(date.getDate()).padStart(2, "0");
//     const yyyy = date.getFullYear();

//     return `${mm}-${dd}-${yyyy}`;
//   }

//   return (
//     <>
//       <div className="mob-search-filter border-start-0 border-end-0">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="mob-search-filter-in">
//                 <div className="mob-search-in">
//                   <Form
//                     className="d-flex align-items-center w-100 "
//                     style={{ position: "relative" }}
//                   >
//                     {openInput && (
//                       <div className="d-flex align-items-center w-100">
//                         {/* Location Filter */}
//                         {isMobileWidth ? (
//                           <>
//                           <input onClick={(e) => {
//                               e.preventDefault();
//                               setShowModal(true);
//                             }}
//                             value={selectedPlace ? selectedPlace?.length > 5 ? selectedPlace?.slice(0, 5) + "." : selectedPlace : ""} readOnly  placeholder="where" style={{
//                             width: "100%",
//                             // minWidth:"22%",
//                             // padding: "8px",
//                             height: "100%",
//                             border: "none",
//                             cursor: "text",
//                             outline:"none",
//                             boxShadow:"none",
//                             backgroundColor: "transparent",
//                             fontWeight: "500",
//                             textAlign:"center"
//                           }}/>
//                             {/* <button onClick={(e) => { { e.preventDefault(); setShowModal(true); } }}
//                               style={{
//                                 width: "100%",
//                                 minWidth: "22%",
//                                 height: "100%",
//                                 padding: "8px",
//                                 border: "none",
//                                 cursor: "text",
//                                 outline: "none",
//                                 boxShadow: "none",
//                                 backgroundColor: "transparent",
//                               }}
//                             >
//                               {selectedPlace ? selectedPlace?.length > 6 ? selectedPlace?.slice(0, 6) + "..." : selectedPlace : "Where"}
//                             </button> */}

//                             <MobSearch
//                               showMobSearch={showModal}
//                               handleToggleMobSearch={handleToggleMobSearch}
//                               selectedPlace={selectedPlace}
//                               coordinates={coordinates}
//                               selectedActivity={selectedActivity}
//                               selectedDate={selectedDate}
//                               toTime={toTime}
//                               newDate={newDate}
//                               flexibleDate={flexibleDate}
//                               fromTime={fromTime}
//                               start_time={start_time}
//                               end_time={end_time}
//                               hour={hour}
//                               show={show}
//                               key={key}
//                               // Function props
//                               setSelectedPlace={(val) => setSelectedPlace(val)}
//                               setCoordinates={(val) => setCoordinates(val)}
//                               onActivityChange={setSelectedActivity}
//                               onDateChange={(val) => {
//                                 setNewDate(val);
//                                 setSelectedDate(val);
//                               }}
//                               onTimeChange={(type, value) => {
//                                 if (type === "from") setFromTime(value);
//                                 else setToTime(value);
//                               }}
//                               onHourChange={setHour}
//                               onShowToggle={setShow}
//                               onKeyChange={setKey}
//                               onFlexibleDateChange={setFlexibleDate}
//                               onStartTimeChange={setStart_time}
//                               onEndTimeChange={setEnd_time}
//                               onCleanAll={handleCleanAll}
//                               onSearch={handleFilterData}
//                               handleHourChange={handleHourChange}
//                               timeOptions={timeOptions}
//                               handleTimeChange={handleTimeChange}
//                               handleDate={handleDate}
//                             />
//                           </>
//                         ) : (
//                           <Dropdown
//                             style={{
//                               width: "22%",
//                               height: "100%",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               border: "none",
//                               cursor: "pointer",
//                               backgroundColor: "transparent",
//                             }}
//                           >
//                             <Dropdown.Toggle
//                               variant="light"
//                               className="no-caret "
//                               style={{
//                                 backgroundColor: "transparent",
//                                 overflow: "hidden",
//                                 border: "none",
//                               }}
//                             >
//                               {selectedPlace || "Where"}
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu className="w-100 p-lg-2">
//                               <Autocomplete
//                                 apiKey={GOOGLE_KEY}
//                                 onPlaceSelected={(place) => {
//                                   if (
//                                     place &&
//                                     place.geometry &&
//                                     place.geometry.location
//                                   ) {
//                                     const lat = place.geometry.location.lat();
//                                     const lng = place.geometry.location.lng();
//                                     setSelectedPlace(
//                                       place.formatted_address || place.name
//                                     );
//                                     setCoordinates({ lat, lng });
//                                   } else {
//                                     setSelectedPlace("");
//                                   }
//                                 }}
//                                 options={{ types: ["(cities)"] }}
//                                 placeholder="Search for a place..."
//                                 className="google-autocomplete"
//                                 style={{
//                                   width: "100%",
//                                   padding: "8px",
//                                   border: "1px solid #ccc",
//                                   borderRadius: "4px",
//                                 }}
//                               />
//                             </Dropdown.Menu>
//                           </Dropdown>
//                         )}
//                         <div
//                           style={{
//                             height: "40px",
//                             width: "1px",
//                             backgroundColor: "#ccc",
//                             margin: "0 10px 0 0",
//                           }}
//                         ></div>

//                         {/* Time Filter */}
//                         <div
//                           style={{
//                             width: "22%",
//                             height: "100%",
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             borderRadius: "25px",
//                             cursor: "pointer",
//                             backgroundColor: "transparent",
//                           }}
//                         >
//                           <Button
//                             className="w-100"
//                             as="div"
//                             style={{
//                               width: "100%",
//                               padding: "8px 16px",
//                               borderRadius: "8px",
//                               backgroundColor: "transparent",
//                               color: "#000",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               border: "0",
//                               fontWeight: "500",
//                             }}
//                             // onClick={handleShow}
//                             onClick={handleToggleMobSearch}
//                           >
//                             {"Time"}
//                           </Button>
//                         </div>

//                         <div
//                           style={{
//                             height: "40px",
//                             width: "1px",
//                             backgroundColor: "#ccc",
//                             margin: "0 0 0 15px",
//                           }}
//                         ></div>

//                         {/* Activity Filter */}
//                         <Dropdown
//                           className="w-100"
//                           style={{
//                             width: "32%",
//                             marginRight: "50px",
//                           }}
//                         >
//                           <Dropdown.Toggle
//                             className="no-caret"
//                             variant="light"
//                             id="dropdown-activity"
//                             style={{
//                               border: "none",
//                               padding: "8px 16px",
//                               backgroundColor: "transparent",
//                               width: "100%",
//                               fontSize: "16px",
//                               fontWeight: "500",
//                               textAlign: "center",
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                             onClick={handleToggleMobSearch}
//                           >
//                             {selectedActivity || "Activity"}
//                           </Dropdown.Toggle>
//                           <Dropdown.Menu
//                             style={{
//                               padding: "8px",
//                               minWidth: "250px",
//                               width: "100%",
//                             }}
//                           >
//                             {activities.map((act, index) => (
//                               <Dropdown.Item
//                                 key={index}
//                                 onClick={() => setSelectedActivity(act)}
//                               >
//                                 {act}
//                               </Dropdown.Item>
//                             ))}
//                           </Dropdown.Menu>
//                         </Dropdown>
//                       </div>
//                     )}

//                     {!openInput && (
//                       <div className="w-100 d-flex align-items-center p-1">
//                         <Form
//                           className="w-100"
//                           onSubmit={handleSearchQuery}
//                           style={{
//                             marginRight: "35px",
//                           }}
//                         >
//                           <InputGroup
//                             className="border p-1"
//                             style={{
//                               borderRadius: "40px",
//                             }}
//                           >
//                             <FormControl
//                               type="text"
//                               placeholder="Search"
//                               value={searchQuery}
//                               onChange={(e) => setSearchQuery(e.target.value)}
//                               className="border-0"
//                               style={{
//                                 boxShadow: "none",
//                                 borderRadius: "40px",
//                                 padding: "8px 12px",
//                               }}
//                             />
//                             <Button
//                               variant="light"
//                               className="border-0"
//                               onClick={() => {
//                                 setSearchQuery("");
//                                 setOpenInput(true);
//                               }}
//                               style={{
//                                 background: "transparent",
//                                 boxShadow: "none",
//                                 marginRight: "5px",
//                               }}
//                             >
//                               <X size={20} color="#999" />
//                             </Button>
//                           </InputGroup>
//                         </Form>
//                       </div>
//                     )}

//                     {/* Search Button */}
//                     <Button
//                       className="d-flex align-items-center justify-content-center shadow-sm"
//                       style={{
//                         border: "0",
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         position: "absolute",
//                         right: "5px",
//                         top: "50%",
//                         backgroundColor: "#3A4B4C",
//                         transform: "translateY(-50%)",
//                       }}
//                       onClick={handleFilterData}
//                     >
//                       <FaSearch size={14} color="#fff" />
//                     </Button>
//                   </Form>
//                 </div>
//                 <div
//                   className="mob-filter-in"
//                   onClick={() => handleNavigation()}
//                 >
//                   <Link>
//                     {" "}
//                     <img src="/images/mobile/filters/filter.svg" alt="" />{" "}
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <header style={{}}>
//         {/* <!-- NAV -->
//         <!-- DESKTOP-&-TABLET --> */}
//         <div className="nav-wrap" style={{ padding: "0px 30px" }}>
//           <nav className="navbar navbar-expand-lg navbar-light bg-white">
//             <div className="container-fluid">
//               <Link className="navbar-brand" to="/" onClick={handleClick}>
//                 <img src="/images/logo.svg" alt="Logo" />
//               </Link>
//               <button
//                 className="navbar-toggler"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#navbarSupportedContent"
//                 aria-controls="navbarSupportedContent"
//                 aria-expanded="false"
//                 aria-label="Toggle navigation"
//               >
//                 <span className="navbar-toggler-icon"></span>
//               </button>
//               <div
//                 className="collapse navbar-collapse "
//                 id="navbarSupportedContent"
//               >
//                 <div className="nav-inner w-100 d-flex justify-content-center align-items-center ">
//                   <div
//                     className="nav-inner-mid"
//                     style={{
//                       border: openInput ? "1px solid #E5E5E5" : "0", // Adjust border style as needed

//                       marginRight: "0px",
//                       padding: "5px",
//                     }}
//                   >
//                     <Form
//                       className=" d-flex align-items-center "
//                       style={{
//                         height: "100%",
//                         width: "100%",
//                         content: "fit",
//                       }}
//                       onSubmit={handleFormSubmit}
//                     >
//                       <div
//                         className="input-group"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           // justifyContent: "space-evenly",
//                           textAlign: "center",
//                         }}
//                       >
//                         {openInput ? (
//                           <div
//                             className="d-flex align-items-center gap-3"
//                             style={{
//                               // justifyContent: "space-between",
//                               alignItems: "center",
//                               width: "100%",
//                               height: "100%",
//                             }}
//                           >
//                             {/* Location Filter */}
//                             <div
//                               style={{
//                                 width: "32%",
//                                 height: "100%",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",

//                                 borderRadius: "25px",
//                                 cursor: "pointer",
//                                 backgroundColor: "transparent",
//                                 // boxShadow: "0px 0px 10px rgba(59, 55, 55, 0.1)",
//                               }}
//                             >
//                               <Dropdown
//                                 className="w-100"
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   display: "flex",
//                                 }}
//                               >
//                                 <Dropdown.Toggle
//                                   className="no-caret"
//                                   variant="light"
//                                   id="dropdown-where"
//                                   style={{
//                                     border: "none",
//                                     padding: "8px 16px",
//                                     backgroundColor: "transparent",
//                                     width: "100%",
//                                     fontSize: "16px",
//                                     fontWeight: "500",
//                                     textAlign: "center",
//                                     justifyContent: "center",
//                                     whiteSpace: "nowrap",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                   }}
//                                 >
//                                   <style>
//                                     {`
//                                    .no-caret::after {
//                                      display: none !important;
//                                      textAlign:center;
//                                    }
//                                      `}
//                                   </style>

//                                   {selectedPlace || "Where"}
//                                 </Dropdown.Toggle>

//                                 <Dropdown.Menu
//                                   style={{
//                                     padding: "8px",
//                                     minWidth: "250px",
//                                     width: "100%",
//                                   }}
//                                 >
//                                   <div style={{ padding: "8px" }}>
//                                     <Autocomplete
//                                       apiKey={GOOGLE_KEY}
//                                       onPlaceSelected={(place) => {
//                                         if (
//                                           place &&
//                                           place.geometry &&
//                                           place.geometry.location
//                                         ) {
//                                           const lat =
//                                             place.geometry.location.lat();
//                                           const lng =
//                                             place.geometry.location.lng();

//                                           setSelectedPlace(
//                                             place.formatted_address ||
//                                               place.name
//                                           );

//                                           setCoordinates({ lat, lng });
//                                         } else {
//                                           console.warn(
//                                             "No valid address or location found in the selected place."
//                                           );

//                                           setSelectedPlace("");
//                                         }
//                                       }}
//                                       options={{ types: ["(cities)"] }}
//                                       placeholder="Search for a place..."
//                                       className="google-autocomplete"
//                                       style={{
//                                         width: "100%",
//                                         padding: "8px",
//                                         border: "1px solid #ccc",
//                                         borderRadius: "4px",
//                                       }}
//                                     />
//                                   </div>
//                                 </Dropdown.Menu>
//                               </Dropdown>
//                             </div>
//                             <div
//                               style={{
//                                 height: "40px",
//                                 width: "1px",
//                                 backgroundColor: "#ccc",
//                                 margin: "0 10px 0 0",
//                               }}
//                             ></div>
//                             <div
//                               style={{
//                                 width: "22%",
//                                 height: "100%",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: "25px",
//                                 cursor: "pointer",
//                                 backgroundColor: "transparent", // Ensure full transparency
//                               }}
//                             >
//                               <Button
//                                 className="w-100"
//                                 as="div"
//                                 style={{
//                                   width: "100%",
//                                   padding: "8px 16px",
//                                   borderRadius: "8px",
//                                   backgroundColor: "transparent", // Transparent background
//                                   color: "#000", // Text color
//                                   cursor: "pointer",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   border: "0",
//                                   fontWeight: "500",
//                                 }}
//                                 onClick={handleShow}
//                                 // onClick={(e) => e.currentTarget.nextSibling.classList.toggle("show"),} // Open dropdown on click
//                               >
//                                 {"Time"}
//                               </Button>
//                             </div>
//                             <div
//                               style={{
//                                 height: "40px",
//                                 width: "1px",
//                                 backgroundColor: "#ccc",
//                                 margin: "0 0 0 15px",
//                               }}
//                             ></div>
//                             {/* Activity Filter */}
//                             <div
//                               style={{
//                                 width: "32%",
//                                 marginRight: "50px",
//                                 height: "100%",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: "25px",
//                                 cursor: "pointer",
//                                 backgroundColor: "transparent", // Transparent background
//                               }}
//                             >
//                               <Dropdown
//                                 className="w-100"
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   display: "flex",
//                                 }}
//                               >
//                                 <Dropdown.Toggle
//                                   className="no-caret"
//                                   variant="light"
//                                   id="dropdown-activity"
//                                   style={{
//                                     border: "none",
//                                     padding: "8px 16px",
//                                     backgroundColor: "transparent",
//                                     width: "100%",
//                                     fontSize: "16px",
//                                     fontWeight: "500",
//                                     textAlign: "center", // ✅ centers text
//                                     whiteSpace: "nowrap",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                   }}
//                                 >
//                                   <style>
//                                     {`
//                                       .no-caret::after {
//                                         display: none !important;
//                                         textAlign:center;
//                                       }
//                                     `}
//                                   </style>

//                                   {selectedActivity || "Activity"}
//                                 </Dropdown.Toggle>

//                                 <Dropdown.Menu
//                                   style={{
//                                     padding: "8px",
//                                     minWidth: "250px",
//                                     width: "100%",
//                                   }}
//                                 >
//                                   {activities.map((act, index) => (
//                                     <Dropdown.Item
//                                       key={index}
//                                       onClick={() => setSelectedActivity(act)}
//                                     >
//                                       {act}
//                                     </Dropdown.Item>
//                                   ))}
//                                 </Dropdown.Menu>
//                               </Dropdown>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="w-100 d-flex align-items-center p-1">
//                             {openInput !== true && ( // Show input only if openInput is true
//                               <Form
//                                 className="w-100"
//                                 onSubmit={handleSearchQuery}
//                                 style={{
//                                   // borderRadius:'20px',
//                                   marginRight: "35px",
//                                 }}
//                               >
//                                 <InputGroup
//                                   className="border p-1"
//                                   style={{
//                                     borderRadius: "40px",
//                                   }}
//                                 >
//                                   <FormControl
//                                     type="text"
//                                     placeholder="Search"
//                                     value={searchQuery}
//                                     onChange={(e) =>
//                                       setSearchQuery(e.target.value)
//                                     }
//                                     className="border-0"
//                                     style={{
//                                       boxShadow: "none",
//                                       borderRadius: "40px", // Adjust input field border-radius
//                                       padding: "8px 12px",
//                                     }}
//                                   />
//                                   <Button
//                                     variant="light"
//                                     className="border-0"
//                                     onClick={() => {
//                                       setSearchQuery(""); // Clears input
//                                       setOpenInput(true); // Closes input box
//                                     }}
//                                     style={{
//                                       background: "transparent",
//                                       boxShadow: "none",
//                                       marginRight: "5px",
//                                     }}
//                                   >
//                                     <X size={20} color="#999" />
//                                   </Button>
//                                 </InputGroup>
//                               </Form>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <Button
//                         // type="submit"
//                         className="d-flex align-items-center justify-content-center shadow-sm"
//                         style={{
//                           border: "0",
//                           width: "40px",
//                           height: "40px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           position: "absolute",
//                           right: "5px",
//                           top: "50%",
//                           backgroundColor: "#3A4B4C",
//                           transform: "translateY(-50%)",
//                         }}
//                         onClick={() => handleFilterData()}
//                       >
//                         <FaSearch size={14} />
//                       </Button>
//                     </Form>
//                   </div>
//                   {/* Right Side Links */}
//                   {!login_id ? (
//                     <div
//                       className="nav-inner-right position-static ms-auto"
//                       style={{ margin: "0" }}
//                     >
//                       <ul
//                         className="list-unstyled d-flex mb-0"
//                         // style={{ padding: "10px" }}
//                       >
//                         <li className="me-3">
//                           <Link
//                             to="/aboutUs"
//                             className="active text-decoration-none"
//                             style={{
//                               border: "1px solid #4AEAB1", // consolidated border styling
//                               height: "100%",
//                               borderRadius: "30px",
//                               backgroundColor: "#fff",
//                               color: "black",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center", // vertical center
//                               justifyContent: "center", // horizontal center
//                               padding: "14px",
//                               width: "115%",
//                               textAlign: "center", // optional for inline content
//                               fontSize: "18px",
//                             }}
//                           >
//                             About Us
//                           </Link>
//                         </li>
//                         <li>
//                           <button
//                             type="button"
//                             onClick={() => handleModalToggle("register", true)}
//                             className="list-unstyled d-flex mb-0"
//                             style={{
//                               border: "none",
//                               borderRadius: "30px",
//                               backgroundColor: "#4AEAB1",
//                               boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//                               color: "black",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center", // vertical centering
//                               justifyContent: "center", // horizontal centering ✅
//                               padding: "14px",
//                               width: "120%",
//                               textAlign: "center", // helpful for text content
//                               fontSize: "18px",
//                             }}
//                           >
//                             Register
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   ) : (
//                     // <Nav
//                     //   className="d-flex align-items-center"
//                     //   style={{ marginLeft: "18%" }}
//                     // >
//                     //   {/* Bookings Icon */}
//                     //   <Nav.Item>
//                     //     <Nav.Link
//                     //       as={Link}
//                     //       to="/booking"
//                     //       style={{ position: "relative", padding: "5px" }}
//                     //     >
//                     //       <span
//                     //         style={{
//                     //           position: "absolute",
//                     //           top: "-5px",
//                     //           right: "8px",
//                     //           backgroundColor: "#2CD5A4",
//                     //           color: "black",
//                     //           borderRadius: "50%",
//                     //           fontSize: "12px",
//                     //           fontWeight: "bold",
//                     //           padding: "4px 7px",
//                     //           display: "flex",
//                     //           alignItems: "center",
//                     //           justifyContent: "center",
//                     //           minWidth: "18px",
//                     //           minHeight: "18px",
//                     //           lineHeight: "1",
//                     //         }}
//                     //       >
//                     //         2
//                     //       </span>
//                     //       <img
//                     //         src="/images/nav-section/bookings.svg"
//                     //         alt="Bookings"
//                     //         style={{
//                     //           marginRight: "10px",
//                     //           height: "25px",
//                     //           filter:
//                     //             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                     //         }}
//                     //       />
//                     //     </Nav.Link>
//                     //   </Nav.Item>

//                     //   {/* Chat Icon */}
//                     //   <Nav.Item>
//                     //     <Nav.Link
//                     //       as={Link}
//                     //       to="/location"
//                     //       style={{ position: "relative", padding: "5px" }}
//                     //     >
//                     //       <span
//                     //         style={{
//                     //           position: "absolute",
//                     //           top: "-5px",
//                     //           right: "10px",
//                     //           backgroundColor: "#2CD5A4",
//                     //           color: "black",
//                     //           borderRadius: "50%",
//                     //           fontSize: "12px",
//                     //           fontWeight: "bold",
//                     //           padding: "4px 7px",
//                     //           display: "flex",
//                     //           alignItems: "center",
//                     //           justifyContent: "center",
//                     //           minWidth: "18px",
//                     //           minHeight: "18px",
//                     //           lineHeight: "1",
//                     //         }}
//                     //       >
//                     //         2
//                     //       </span>
//                     //       <img
//                     //         src="/images/nav-section/chat.svg"
//                     //         alt="Chat"
//                     //         style={{
//                     //           marginRight: "10px",
//                     //           height: "25px",
//                     //           filter:
//                     //             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                     //         }}
//                     //       />
//                     //     </Nav.Link>
//                     //   </Nav.Item>

//                     //   {/* Wishlist Icon */}
//                     //   <Nav.Item>
//                     //     <Nav.Link
//                     //       as={Link}
//                     //       to="/wishlist"
//                     //       style={{ padding: "5px" }}
//                     //     >
//                     //       <img
//                     //         src="/images/nav-section/wishlist.svg"
//                     //         alt="Wishlist"
//                     //         style={{
//                     //           marginRight: "10px",
//                     //           height: "25px",
//                     //           filter:
//                     //             "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                     //         }}
//                     //       />
//                     //     </Nav.Link>
//                     //   </Nav.Item>
//                     //   {/* Profile Dropdown */}
//                     //   <Nav.Item>
//                     //     <Dropdown>
//                     //       <Dropdown.Toggle
//                     //         as="div"
//                     //         id="dropdown-profile"
//                     //         className="nav-account-in-profile"
//                     //         style={{ cursor: "pointer" }}
//                     //       >
//                     //         <img
//                     //           src="/images/nav-section/user-profile.png"
//                     //           alt="User Profile"
//                     //           style={{
//                     //             height: "40px",
//                     //             width: "40px",
//                     //             borderRadius: "50%",
//                     //             objectFit: "cover",
//                     //             border: "2px solid #D1D1D1",
//                     //           }}
//                     //         />
//                     //       </Dropdown.Toggle>
//                     //       <Dropdown.Menu
//                     //         align="end"
//                     //         style={{
//                     //           minWidth: "200px",
//                     //           borderRadius: "15px",
//                     //           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//                     //           border: "none",
//                     //           overflow: "hidden", // Prevents shadow overflow
//                     //           padding: "5px", // Ensures internal spacing
//                     //         }}
//                     //       >
//                     //         <Dropdown.Item
//                     //           as="div"
//                     //           style={{
//                     //             padding: "3px",
//                     //             borderRadius: "10px",
//                     //             transition: "0.3s",
//                     //           }}
//                     //           onMouseEnter={(e) => {
//                     //             e.currentTarget.style.backgroundColor =
//                     //               "#8195b8";
//                     //             e.currentTarget.style.boxShadow =
//                     //               "inset 0px 0px 10px rgba(0, 0, 0, 0.1)";
//                     //           }}
//                     //           onMouseLeave={(e) => {
//                     //             e.currentTarget.style.backgroundColor =
//                     //               "transparent";
//                     //             e.currentTarget.style.boxShadow = "none";
//                     //           }}
//                     //         >
//                     //           <form onSubmit={handleSwitch}>
//                     //             <button
//                     //               type="submit"
//                     //               className="dropdown-item"
//                     //               style={{
//                     //                 border: "none",
//                     //                 background: "none",
//                     //                 width: "100%",
//                     //                 textAlign: "left",
//                     //                 borderRadius: "10px",
//                     //               }}
//                     //             >
//                     //               Switch to Host
//                     //             </button>
//                     //           </form>
//                     //         </Dropdown.Item>
//                     //         {[
//                     //           {
//                     //             label: "Payment History",
//                     //             to: "/payment-history",
//                     //           },
//                     //           {
//                     //             label: "Language",
//                     //             dataTarget: "#language-popup",
//                     //             dataToggle: "modal",
//                     //           },
//                     //           {
//                     //             label: "Notifications",
//                     //             to: "/notifications",
//                     //             state: { type: "guest" },
//                     //           },
//                     //           {
//                     //             label: "Help Center",
//                     //             to: "/helpCenter",
//                     //             state: { type: "guest" },
//                     //           },
//                     //           { label: "Settings", to: "/profile" },
//                     //           { label: "About Us", to: "/aboutUs" },
//                     //           {
//                     //             label: "Logout",
//                     //             to: "/",
//                     //             dataTarget: "#logout-popup",
//                     //             dataToggle: "modal",
//                     //             action: () => navigate("/"),
//                     //           },
//                     //         ].map((item, index) => (
//                     //           <Dropdown.Item
//                     //             key={index}
//                     //             as={item.to ? Link : "div"}
//                     //             to={item.to}
//                     //             state={item.state}
//                     //             data-bs-target={item.dataTarget}
//                     //             data-bs-toggle={item.dataToggle}
//                     //             onClick={item.action}
//                     //             style={{
//                     //               padding: "8px",
//                     //               borderRadius: "10px",
//                     //               transition: "0.3s",
//                     //               textDecoration: "none",
//                     //             }}
//                     //             onMouseEnter={(e) => {
//                     //               e.currentTarget.style.backgroundColor =
//                     //                 "#8195b8";
//                     //               e.currentTarget.style.boxShadow =
//                     //                 "inset 0px 0px 10px rgba(0, 0, 0, 0.1)";
//                     //             }}
//                     //             onMouseLeave={(e) => {
//                     //               e.currentTarget.style.backgroundColor =
//                     //                 "transparent";
//                     //               e.currentTarget.style.boxShadow = "none";
//                     //             }}
//                     //           >
//                     //             {item.label}
//                     //           </Dropdown.Item>
//                     //         ))}
//                     //       </Dropdown.Menu>
//                     //     </Dropdown>
//                     //   </Nav.Item>
//                     // </Nav>

//                     <nav
//                       className="web-navbar ms-auto"
//                       style={{
//                         position: "relative",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         backgroundColor: "#ffffff",
//                         padding: "15px 20px",
//                         zIndex: 9,
//                         // width: "100%",
//                         // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         alignItems: "center",
//                         marginLeft: "16%",
//                       }}
//                     >
//                       {/* LOGO */}
//                       {/* <div style={{ fontSize: "1.5rem", margin: "0 15px" }}>
//                               <Link to="/">
//                                 <img src="/images/logo.svg" alt="Logo" style={{ height: "40px" }} />
//                               </Link>
//                             </div> */}

//                       {/* NAV ITEMS */}
//                       <div style={{ display: "flex", alignItems: "center" }}>
//                         {/* Bookings Icon */}
//                         <div
//                           style={{
//                             position: "relative",
//                             padding: "5px",
//                             marginRight: "10px",
//                           }}
//                         >
//                           <Link
//                             to="/booking"
//                             style={{ display: "flex", alignItems: "center" }}
//                             onClick={markBookingsAsRead}
//                           >
//                             {showBadge && (
//                               <span
//                                 style={{
//                                   position: "absolute",
//                                   top: "-5px",
//                                   right: "10px",
//                                   backgroundColor: "#2CD5A4",
//                                   color: "black",
//                                   borderRadius: "50%",
//                                   fontSize: "12px",
//                                   fontWeight: "bold",
//                                   padding: "4px 6px",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   minWidth: "18px",
//                                   minHeight: "18px",
//                                   lineHeight: "1",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {newUnreadCount}
//                               </span>
//                             )}
//                             <img
//                               src="/images/nav-section/bookings.svg"
//                               alt="Bookings"
//                               style={{
//                                 height: "25px",
//                                 marginRight: "10px",
//                                 filter:
//                                   "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                               }}
//                             />
//                           </Link>
//                         </div>

//                         {/* Chat Icon */}
//                         <div
//                           style={{
//                             position: "relative",
//                             padding: "5px",
//                             marginRight: "10px",
//                           }}
//                         >
//                           <Link
//                             to="/chat"
//                             style={{ display: "flex", alignItems: "center" }}
//                           >
//                             {unreadCountChat > 0 && (
//                               <span
//                                 style={{
//                                   position: "absolute",
//                                   top: "-5px",
//                                   right: "10px",
//                                   backgroundColor: "#2CD5A4",
//                                   color: "black",
//                                   borderRadius: "50%",
//                                   fontSize: "12px",
//                                   fontWeight: "bold",
//                                   padding: "4px 6px",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   minWidth: "18px",
//                                   minHeight: "18px",
//                                   lineHeight: "1",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {unreadCountChat}
//                               </span>
//                             )}
//                             <img
//                               src="/images/nav-section/chat.svg"
//                               alt="Chat"
//                               style={{
//                                 height: "25px",
//                                 marginRight: "10px",
//                                 filter:
//                                   "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                               }}
//                             />
//                           </Link>
//                         </div>

//                         {/* Wishlist Icon */}
//                         <div style={{ padding: "5px", marginRight: "10px" }}>
//                           <Link
//                             to="/wishlist"
//                             style={{ display: "flex", alignItems: "center" }}
//                           >
//                             <img
//                               src="/images/nav-section/wishlist.svg"
//                               alt="Wishlist"
//                               style={{
//                                 height: "25px",
//                                 marginRight: "10px",
//                                 filter:
//                                   "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
//                               }}
//                             />
//                           </Link>
//                         </div>

//                         {/* Profile Dropdown */}
//                         <div style={{ position: "relative" }} ref={dropdownRef}>
//                           <div
//                             onClick={toggleDropdown}
//                             style={{
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                             }}
//                           >
//                             <img
//                               // src={
//                               //   profileData?.profileData?.profile_image
//                               //     ? imageBase + profileData?.profileData?.profile_image ||
//                               //       imageBase +
//                               //         profileData?.profileData?.profile_image
//                               //           ?.profile_image_url
//                               //     : "/images/nav-section/user-profile1.png"
//                               // }
//                               src={
//                                 profileData?.profileData?.profile_image
//                                   ? typeof profileData?.profileData
//                                       ?.profile_image === "object"
//                                     ? `${
//                                         imageBase +
//                                         profileData?.profileData?.profile_image
//                                           ?.profile_image_url
//                                       }`
//                                     : `${
//                                         imageBase +
//                                         profileData?.profileData?.profile_image
//                                       }`
//                                   : "/images/nav-section/user-profile1.png"
//                               }
//                               alt="User Profile"
//                               style={{
//                                 height: "50px",
//                                 width: "50px",
//                                 borderRadius: "50%",
//                                 objectFit: "cover",
//                                 border: "2px solid #CCC",
//                                 padding: "2px",
//                               }}
//                             />
//                           </div>

//                           {dropdownOpen && (
//                             <div
//                               className="head-pro-drop"
//                               style={{
//                                 position: "absolute",
//                                 right: 0,
//                                 minWidth: "190px",
//                                 height: "auto",
//                                 borderRadius: "15px",
//                                 boxShadow: "0px 0px 14px 0px #0000001A",
//                                 backgroundColor: "white",
//                                 zIndex: 1001,
//                                 padding: "5px",
//                                 marginTop: "5px",
//                                 color: "black",
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   padding: "3px",
//                                   borderRadius: "10px",
//                                   cursor: "pointer",
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     "transparent";
//                                   e.currentTarget.style.boxShadow =
//                                     "inset 0px 0px 10px rgba(0, 0, 0, 0.0)";
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     "transparent";
//                                   e.currentTarget.style.boxShadow = "none";
//                                 }}
//                               >
//                                 <button
//                                   onClick={handleSwitch}
//                                   style={{
//                                     border: "1.4px solid black",
//                                     background: "none",
//                                     width: "100%",
//                                     // textAlign: "left",
//                                     borderRadius: "10px",
//                                     padding: "8px",
//                                     cursor: "pointer",
//                                     textAlign: "center",
//                                   }}
//                                 >
//                                   Switch to Host
//                                 </button>
//                               </div>

//                               {menuItems.map((item, index) => (
//                                 <div
//                                   key={index}
//                                   style={{
//                                     padding: "5px",
//                                     borderRadius: "10px",
//                                     cursor: "pointer",
//                                     marginLeft: "5px",
//                                   }}
//                                   data-bs-target={item.dataTarget}
//                                   data-bs-toggle={item.dataToggle}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.backgroundColor =
//                                       "transparent";
//                                     e.currentTarget.style.boxShadow =
//                                       "inset 0px 0px 10px rgba(0, 0, 0, 0.0)";
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.backgroundColor =
//                                       "transparent";
//                                     e.currentTarget.style.boxShadow = "none";
//                                   }}
//                                   onClick={() => handleMenuItemClick(item)}
//                                 >
//                                   {item.to ? (
//                                     <Link
//                                       to={item.to}
//                                       state={item.state}
//                                       style={{
//                                         textDecoration: "none",
//                                         color: "inherit",
//                                         display: "block",
//                                       }}
//                                     >
//                                       {item.label}
//                                     </Link>
//                                   ) : (
//                                     item.label
//                                   )}
//                                 </div>
//                               ))}

//                               <hr
//                                 style={{ marginBottom: "0", marginTop: "0px" }}
//                               />
//                               <button
//                                 onClick={() => setShowLogoutModal(true)}
//                                 style={{
//                                   background: "none",
//                                   width: "100%",
//                                   textAlign: "left",
//                                   borderRadius: "10px",
//                                   padding: "5px",
//                                   cursor: "pointer",
//                                   border: "none",
//                                   marginTop: "0px",
//                                   marginLeft: "5px",
//                                 }}
//                               >
//                                 Logout
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </nav>
//                   )}
//                 </div>
//                 <MobFooter />
//               </div>
//             </div>
//           </nav>
//         </div>

//         {showLogoutModal && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: "rgba(0,0,0,0.5)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               zIndex: 1050,
//             }}
//           >
//             <div
//               style={{
//                 width: "70%",
//                 borderRadius: "13px",
//                 backgroundColor: "white",
//                 padding: "20px",
//                 maxWidth: "350px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                 }}
//               >
//                 <button
//                   onClick={() => setShowLogoutModal(false)}
//                   style={{
//                     background: "#3A4B4C",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "50%",
//                     width: "25px",
//                     height: "25px",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   &times;
//                 </button>
//               </div>

//               <div style={{ textAlign: "center", padding: "0 20px" }}>
//                 <h3
//                   style={{
//                     fontWeight: "400",
//                     fontSize: "28px",
//                     color: "#000000",
//                     marginBottom: "10px",
//                     fontFamily: "sans-serif poppins",
//                   }}
//                 >
//                   Logout
//                 </h3>

//                 <div style={{ margin: "10px 0" }}>
//                   <img
//                     src="/images/popups/logout.svg"
//                     alt="Logout"
//                     style={{
//                       width: "90px",
//                       height: "90px",
//                       marginBottom: "20px",
//                     }}
//                   />
//                 </div>

//                 <p style={{ marginBottom: "30px" }}>
//                   Are you sure you want to logout?
//                 </p>

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     gap: "15px",
//                     marginBottom: "20px",
//                   }}
//                 >
//                   <button
//                     onClick={handleLogout}
//                     style={{
//                       padding: "10px 50px",
//                       borderRadius: "50px",
//                       border: "none",
//                       backgroundColor: "#4AEAB1",
//                       color: "#000",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Yes
//                   </button>
//                   <button
//                     onClick={() => setShowLogoutModal(false)}
//                     style={{
//                       padding: "10px 37px",
//                       border: "1px solid #4AEAB1",
//                       borderRadius: "50px",
//                       backgroundColor: "#fff",
//                       color: "#000",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* <!-- DESKTOP-&-TABLET -->
//     <!-- MOBILE --> */}

//         {/* <div className="mob-nav border-start-0 border-end-0">
//           <div className="container-fluid">
//             <ul className="gap-5">
//               <li>
//                 <Link to="/">
//                   <img src="/images/mobile/nav/1.svg" alt="" />
//                   Discover
//                 </Link>
//               </li>

//               <li>
//                 <Link to="/WishList">
//                   <img src="/images/mobile/nav/4.svg" alt="" />
//                   Wishlists
//                 </Link>
//               </li>

//               {login_id ? (
//                 <>
//                   <li>
//                     <Link
//                       to="/chat"
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       <img src="/images/nav-section/chat.svg" alt="Chat" />
//                       Inbox
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/booking"
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       <img
//                         src="/images/nav-section/bookings.svg"
//                         alt="Bookings"
//                       />
//                       Booking
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/profile">
//                       <img src="/images/mobile/nav/5.svg" alt="Profile" />
//                       Profile
//                     </Link>
//                   </li>
//                 </>
//               ) : (

//                 <li>
//                   <a
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleModalToggle("login", true);
//                     }}
//                   >
//                     <img src="/images/mobile/nav/5.svg" alt="Login" />
//                     Login
//                   </a>
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div> */}
// <MobFooter />
//         {/* <!-- MOBILE -->
//     <!-- NAV -->
//     <!-- MAP-BUTTON --> */}
//         <div
//           className="mob-show-map animate__animated animate__backInUp animate__delay-1s"
//           // onClick={handleShowMap}
//         ></div>
//         {/* <!-- MAP-BUTTON --> */}
//       </header>
//       {/* <RegisterModal
//         show={regModl}
//         onHide={() => setRegModl(false)}
//         CallBack={(bool) => setRegModl(bool)}
//         loginModal={true}
//       /> */}
//       <RegisterModal
//         show={isRegisterModalOpen}
//         onHide={() => handleModalToggle("register", false)}
//         CallBack={(bool) => setIsRegisterModalOpen(bool)}
//         loginModal={registerModal}
//         ToggleVal={(bool) => setRegisterModal(bool)}
//       />

//       <RegisterModal
//         show={isLoginModalOpen}
//         onHide={() => handleModalToggle("login", false)}
//         CallBack={(bool) => setIsLoginModalOpen(bool)}
//         loginModal={modalToggleValue}
//         ToggleVal={(bool) => setModalToggleValue(bool)}
//       />

//       {/* <div className="top-filter-wrap py-3 "> */}
//       <div className="top-filter-wrap ">
//         <Container fluid>
//           <Row
//             className="align-items-center flex-wrap"
//             style={{ margin: "0px 30px  0px 60px", gap: "10px" }}
//           >
//             {/* Location Filter */}
//             {selectedPlace && (
//               <Col
//                 xs="auto"
//                 className="d-flex align-items-center bg-white rounded-pill shadow-sm border "
//                 style={{
//                   padding:
//                     selectedDate && flexibleDate && hour
//                       ? "4px 8px"
//                       : "8px 16px",
//                   fontSize:
//                     selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
//                 }}
//               >
//                 <img
//                   src="/images/filters/location.svg"
//                   alt="Location"
//                   className="me-2"
//                   style={{ width: 20, height: 20 }}
//                 />
//                 <span className="fw-semibold">{selectedPlace}</span>
//                 <CloseButton
//                   aria-label="Clear"
//                   onClick={() => handleRemoveData(setSelectedPlace)}
//                   className="ms-2"
//                   style={{
//                     position: "relative",
//                     top: "0",
//                     left: "0",
//                     transform: "none",
//                   }}
//                 />
//               </Col>
//             )}

//             {/* Activity Filter */}
//             {selectedActivity && (
//               <Col
//                 xs="auto"
//                 className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
//                 style={{
//                   padding:
//                     selectedDate && flexibleDate && hour
//                       ? "4px 8px"
//                       : "8px 16px",
//                   fontSize:
//                     selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
//                 }}
//               >
//                 <img
//                   src="/images/filters/filters.svg"
//                   alt="Activity"
//                   className="me-2"
//                   style={{ width: 20, height: 20 }}
//                 />
//                 <span className="fw-semibold">{selectedActivity}</span>
//                 <CloseButton
//                   aria-label="Clear"
//                   onClick={() => handleRemoveData(setSelectedActivity)}
//                   className="ms-2"
//                   style={{
//                     position: "relative",
//                     top: "0",
//                     left: "0",
//                     transform: "none",
//                   }}
//                 />
//               </Col>
//             )}

//             {/* Date Filter */}
//             {selectedDate && !flexibleDate && (
//               <Col
//                 xs="auto"
//                 className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
//                 style={{
//                   padding:
//                     selectedDate && flexibleDate && hour
//                       ? "4px 8px"
//                       : "8px 16px",
//                   fontSize:
//                     selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
//                 }}
//               >
//                 <img
//                   src="/images/filters/calendar-icon.svg"
//                   alt="Calendar"
//                   className="me-2"
//                   style={{ width: 20, height: 20 }}
//                 />
//                 <span className="fw-semibold">
//                   {format(selectedDate, "MM-dd-yyyy")}
//                 </span>
//                 <CloseButton
//                   aria-label="Clear"
//                   onClick={() => handleRemoveData(setSelectedDate)}
//                   className="ms-2"
//                   style={{
//                     position: "relative",
//                     top: "0",
//                     left: "0",
//                     transform: "none",
//                   }}
//                 />
//               </Col>
//             )}

//             {/* Flexible Date Filter */}
//             {flexibleDate && (
//               <Col
//                 xs="auto"
//                 className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
//                 style={{
//                   padding:
//                     selectedDate && flexibleDate && hour
//                       ? "4px 8px"
//                       : "8px 16px",
//                   fontSize:
//                     selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
//                 }}
//               >
//                 <img
//                   src="/images/filters/calendar-icon.svg"
//                   alt="Flexible Date"
//                   className="me-2"
//                   style={{ width: 20, height: 20 }}
//                 />
//                 <span className="fw-semibold">
//                   {moment(flexibleDate.split("|")[0].trim()).format(
//                     "MM-DD-YYYY"
//                   )}
//                 </span>{" "}
//                 | {flexibleDate.split("|")[1].trim()}
//                 <CloseButton
//                   aria-label="Clear"
//                   onClick={() => {
//                     handleRemoveData(setFlexibleDate);
//                     handleRemoveData(setSelectedDate);
//                   }}
//                   className="ms-2"
//                   style={{
//                     position: "relative",
//                     top: "0",
//                     left: "0",
//                     transform: "none",
//                   }}
//                 />
//               </Col>
//             )}

//             {hour && (
//               <Col
//                 xs="auto"
//                 className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
//                 style={{
//                   padding:
//                     selectedDate && flexibleDate && hour
//                       ? "4px 8px"
//                       : "8px 16px",
//                   fontSize:
//                     selectedDate && flexibleDate && hour ? "0.85rem" : "1rem",
//                 }}
//               >
//                 <img
//                   src="/images/filters/time.svg"
//                   alt="Time"
//                   className="me-2"
//                   style={{ width: 20, height: 20 }}
//                 />
//                 <span className="fw-semibold">{hour} hours</span>
//                 <CloseButton
//                   aria-label="Clear"
//                   onClick={() => handleRemoveData(setHour)}
//                   className="ms-2"
//                   style={{
//                     position: "relative",
//                     top: "0",
//                     left: "0",
//                     transform: "none",
//                   }}
//                 />
//               </Col>
//             )}

//             <Col md="auto" className="ms-auto d-flex gap-lg-2">
//               {removeFilter && (
//                 <Button
//                   onClick={handleClearFilter}
//                   variant="outline-secondary"
//                   className="d-flex align-items-center"
//                 >
//                   Clear Filter
//                 </Button>
//               )}
//               <Button
//                 onClick={() => handleNavigation()}
//                 variant="outline-secondary"
//                 className="d-flex align-items-center"
//                 style={{
//                   border: "solid 1px #E5E5E5",
//                   borderRadius: "30px",
//                   color: "black",
//                   padding: "15px",
//                   fontSize: "18px",
//                 }}
//               >
//                 <img
//                   src="/images/filters/filters.svg"
//                   alt="Filters"
//                   className="me-2"
//                   style={{
//                     width: 20,
//                     height: 20,
//                   }}
//                 />
//                 Filters
//               </Button>

//               <Button
//                 style={{
//                   backgroundColor: "#3A4B4C",
//                   borderRadius: "30px",
//                   border: "none",
//                   padding: "15px",
//                   fontSize: "18px",
//                 }}
//                 onClick={() => setShowMap((prev) => !prev)}
//               >
//                 <img
//                   src="/images/filters/show-map.svg"
//                   alt="Show Map"
//                   className="me-2"
//                   style={{ width: 20, height: 20 }}
//                 />

//                 {showMap ? "Hide map" : "Show map"}
//               </Button>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//       {show && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1050,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               padding: "15px",
//               width: "100%",
//               maxWidth: "380px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={handleClose}
//               style={{
//                 position: "absolute",
//                 top: "0",
//                 right: "8px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "1.5rem",
//                 cursor: "pointer",
//               }}
//             >
//               &times;
//             </button>

//             {/* Custom Tab Buttons */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "#f0ecec",
//                 borderRadius: "40px",
//                 color: "black",
//                 padding: "6px",
//                 fontSize: "18px",
//                 fontWeight: "400px",
//                 width: "100%",
//                 height: "auto",
//               }}
//             >
//               <button
//                 onClick={() => setKey("dates")}
//                 style={{
//                   backgroundColor: key === "dates" ? "white" : "transparent",
//                   border: "none",
//                   padding: "8px 16px",
//                   borderRadius: "40px",
//                   cursor: "pointer",
//                   width: "100%",
//                   height: "auto",
//                   top: "29px",
//                   left: "129px",
//                 }}
//               >
//                 Dates
//               </button>
//               <button
//                 onClick={() => setKey("hourly")}
//                 style={{
//                   backgroundColor: key === "hourly" ? "white" : "transparent",
//                   border: "none",
//                   padding: "8px 16px",
//                   borderRadius: "40px",
//                   cursor: "pointer",
//                   width: "100%",
//                   height: "auto",
//                   top: "29px",
//                   left: "129px",
//                 }}
//               >
//                 Hourly
//               </button>
//               <button
//                 onClick={() => setKey("flexible")}
//                 style={{
//                   backgroundColor: key === "flexible" ? "white" : "transparent",
//                   border: "none",
//                   padding: "8px 16px",
//                   borderRadius: "40px",
//                   cursor: "pointer",
//                   width: "100%",
//                   height: "auto",
//                   top: "29px",
//                   left: "129px",
//                 }}
//               >
//                 Flexible
//               </button>
//             </div>

//             <div style={{ marginTop: "20px" }} className="date-picker">
//               {key === "dates" && (
//                 <div style={{ display: "flex", justifyContent: "center" }}>
//                   <DayPicker
//                     mode="single"
//                     selected={selectedDate}
//                     disabled={{ before: new Date() }}
//                     onSelect={(e) =>
//                       setSelectedDate(e ? format(e, "yyyy-MM-dd") : "")
//                     }
//                     onChange={(e) => handleDate(e)}
//                     footer={
//                       selectedDate
//                         ? `Selected: ${format(selectedDate, "MM-dd-yyyy")}`
//                         : "Pick a day."
//                     }
//                   />
//                 </div>
//               )}

//               {key === "hourly" && (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     position: "relative",
//                   }}
//                 >
//                   <div
//                     style={{
//                       transition: "transform 0.2s ease-in-out",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = "scale(1.05)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = "scale(1)";
//                     }}
//                   >
//                     <div className="hour-slider-wrap">
//                       <div
//                         id="slider"
//                         style={{
//                           position: "relative",
//                           width: "280px",
//                           height: "280px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <img
//                           src={main}
//                           alt="Main Background"
//                           style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                             width: "93%",
//                             height: "93%",
//                             zIndex: 3,
//                             pointerEvents: "none",
//                           }}
//                         />
//                         <img
//                           src={dotted}
//                           alt="Dotted Overlay"
//                           style={{
//                             position: "absolute",
//                             top: "auto",
//                             left: "auto",
//                             width: "95%",
//                             height: "95%",
//                             zIndex: 1,
//                           }}
//                         />
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                             zIndex: 3,
//                             textAlign: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               fontSize: "3rem",
//                               color: "black",
//                               fontWeight: "bold",
//                               lineHeight: "1",
//                             }}
//                           >
//                             {hour || 0}
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "2rem",
//                               color: "black",
//                               marginTop: "0.2rem",
//                             }}
//                           >
//                             Hours
//                           </div>
//                         </div>
//                         <div style={{ position: "relative", zIndex: 2 }}>
//                           <CircularSlider
//                             min={0}
//                             max={24}
//                             trackSize={40}
//                             progressSize={40}
//                             knobSize={40}
//                             knobColor="#fff"
//                             trackColor="transparent"
//                             progressColorFrom="#4aeab1"
//                             progressColorTo="#4aeab1"
//                             direction={1}
//                             dataIndex={3}
//                             label=" "
//                             labelColor="transparent"
//                             valueColor="transparent"
//                             valueFontSize="0rem"
//                             labelFontSize="1rem"
//                             data={Array.from(
//                               { length: 23 },
//                               (_, i) => `${i + 1}`
//                             )}
//                             onChange={(value) => {
//                               const label = document.querySelector(
//                                 '[aria-label="Hour"]'
//                               );
//                               if (label) {
//                                 label.style.animation = "pulse 0.5s ease";
//                                 setTimeout(() => {
//                                   label.style.animation = "";
//                                 }, 500);
//                               }
//                               handleHourChange(value);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <style>
//                     {`
//                 @keyframes pulse {
//                   0% { transform: scale(1); }
//                   50% { transform: scale(1.15); }
//                   100% { transform: scale(1); }
//                 }
//               `}
//                   </style>
//                 </div>
//               )}

//               {key === "flexible" && (
//                 <>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       width: "100%",
//                     }}
//                   >
//                     <DayPicker
//                       mode="single"
//                       selected={newDate}
//                       disabled={{ before: new Date() }}
//                       onSelect={(e) => {
//                         setNewDate(e ? format(e, "yyyy-MM-dd") : "");
//                         setSelectedDate(e ? format(e, "yyyy-MM-dd") : "");
//                       }}
//                     />
//                   </div>
//                   <div
//                     className="time-slot d-flex mt-4"
//                     style={{
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <Form.Select
//                       value={fromTime}
//                       onChange={(e) => handleTimeChange("from", e.target.value)}
//                       style={{
//                         border: "1px solid black",
//                         borderRadius: "20px",
//                         width: "50%",
//                       }}
//                     >
//                       {timeOptions.map((time, index) => (
//                         <option key={index} value={time}>
//                           {time}
//                         </option>
//                       ))}
//                     </Form.Select>
//                     <Form.Select
//                       value={toTime}
//                       onChange={(e) => handleTimeChange("to", e.target.value)}
//                       style={{
//                         border: "1px solid black",
//                         borderRadius: "20px",
//                         width: "50%",
//                       }}
//                     >
//                       {timeOptions.map((time, index) => (
//                         <option key={index} value={time}>
//                           {time}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 marginTop: "20px",
//               }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {isMobileWidth && (
//         <style>
//           {`
//       #filter-modal.custom-modal {
//         margin: 0 !important;
//         max-width: 100% !important;
//       }

//       #filter-modal.custom-modal .modal-content {
//         border: none !important;
//         border-radius: 0 !important;
//         box-shadow: none !important;
//         padding: 0 !important;
//         margin: 0 !important;
//         height: 100vh;
//       }

//       #filter-modal.custom-modal .modal-body {
//         // padding: 0 !important;
//         // margin: 0 !important;
//         // height: 100%;
//            background-color:white;
//       }

//       #filter-modal.modal-backdrop {
//         display: none !important; /* Remove backdrop if you want it to feel like a page */
//       }
//     `}
//         </style>
//       )}

//       <Modal
//         show={filterShow}
//         onHide={handleClose}
//         centered
//         rounded
//         size="lg"
//         id="filter-modal"
//         dialogClassName="custom-modal"
//         style={{ zIndex: 10000, borderRadius: isMobileWidth ? "0" : "20px" }}
//       >
//         <Modal.Body>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "flex-end", // Aligns the close button to the right
//               justifyContent: "right",
//               borderBottom: isMobileWidth ? "1px solid #ccc" : "0px",
//               marginBottom: "10px",
//             }}
//           >
//             {isMobileWidth && (
//               <>
//                 <div
//                   className="modal-footer"
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     width: "100%",
//                   }}
//                 >
//                   {/* Clean All Button */}

//                   <div
//                     onClick={() => {
//                       setFilterShow(false);
//                       handleCleanAll();
//                     }}
//                     style={{
//                       backgroundColor: "white",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       height: "24px",
//                       width: "24px",
//                       borderRadius: "50%",
//                       color: "black",
//                       cursor: "pointer",
//                       fontWeight: "500",
//                       border: "1px solid #ccc",
//                       padding: "10px",
//                     }}
//                   >
//                     <i
//                       className="fa-regular fa-arrow-left"
//                       style={{ textAlign: "center" }}
//                     ></i>
//                   </div>

//                   <button
//                     onClick={handleCleanAll}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       backgroundColor: "#fff",
//                       border: "1px solid #E5E5E5",
//                       borderRadius: "50px",
//                       // padding: "5px 20px",
//                       cursor: "pointer",
//                       fontWeight: "500",
//                       transition: "0.3s",
//                       // visibility:'hidden'
//                     }}
//                   >
//                     Clean All
//                     <FaRedo
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         color: isCleaned ? "#2F3E46" : "#fff",
//                         fontSize: "18px",
//                         padding: "5px",
//                         backgroundColor: "#3A4B4C",
//                         borderRadius: "50%",
//                       }}
//                     />
//                   </button>

//                   {/* Search Button */}
//                   <button
//                     onClick={handleSearch}
//                     style={{
//                       width: "auto",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       backgroundColor: "#4AEAB1",
//                       border: "none",
//                       borderRadius: "30px",
//                       padding: "4px 5px 4px 30px",
//                       cursor: "pointer",
//                       fontWeight: "500",
//                       color: "#000",
//                       transition: "0.3s",
//                     }}
//                   >
//                     Search
//                     <Container className="d-flex justify-content-end m-0 p-0">
//                       <div
//                         className="search-icon d-flex align-items-center justify-content-center"
//                         style={{
//                           height: "35px",
//                           width: "35px",
//                           backgroundColor: "#3A4B4C",
//                           borderRadius: "50%",
//                           color: "#fff",
//                           fontSize: "16px", // Ensure visibility
//                           marginLeft: "auto",
//                         }}
//                       >
//                         <i
//                           className="fa-regular fa-magnifying-glass"
//                           style={{
//                             color: "#FFFFFF",
//                             fontSize: "14px",
//                             borderRadius: "50%",
//                           }}
//                         ></i>
//                       </div>
//                     </Container>
//                   </button>
//                 </div>
//               </>
//             )}

//             {!isMobileWidth && (
//               <div
//                 style={{
//                   backgroundColor: "#3A4B4C",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   height: "24px",
//                   width: "24px",
//                   borderRadius: "50%",
//                   color: "#fff",
//                   cursor: "pointer",
//                   fontWeight: "500",
//                 }}
//                 onClick={() => {
//                   setFilterShow(false);
//                   handleCleanAll();
//                 }}
//               >
//                 <X
//                   size={14}
//                   style={{
//                     color: "#fff",
//                     fontWeight: "bold", // "600" is valid, but "bold" is clearer
//                     cursor: "pointer",
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="justify-content-between p-lg-3">
//             <div className="align-items-center">
//               <h5
//                 style={{
//                   fontSize: "1.5rem",
//                   fontWeight: "bold",
//                   color: "#333",
//                 }}
//               >
//                 Type of Place
//               </h5>
//               <p>Search rooms, entire homes, or any type of place.</p>

//               <ToggleButtonGroup
//                 type="radio"
//                 name="options"
//                 value={selectedValue}
//                 onChange={(val) => setSelectedValue(val)}
//                 className="d-flex w-100 rounded-pill"
//                 style={{ backgroundColor: "#D1D4D4", padding: "5px" }}
//               >
//                 {[
//                   { id: "tbg-btn-1", value: "any_type", label: "Any Type" },
//                   { id: "tbg-btn-2", value: "room", label: "Room" },
//                   {
//                     id: "tbg-btn-3",
//                     value: "entire_home",
//                     label: "Entire Home",
//                   },
//                 ].map((btn) => (
//                   <ToggleButton
//                     key={btn.id}
//                     id={btn.id}
//                     value={btn.value}
//                     className="flex-grow-1 border-0"
//                     style={{
//                       backgroundColor:
//                         selectedValue === btn.value ? "white" : "transparent",
//                       color: selectedValue === btn.value ? "black" : "black",
//                       fontWeight: "500",
//                       padding: "10px",
//                       borderRadius: "50px",
//                     }}
//                   >
//                     {btn.label}
//                   </ToggleButton>
//                 ))}
//               </ToggleButtonGroup>
//             </div>
//             <div className="align-items-center p-lg-2 mt-4">
//               <h5>Price Range</h5>
//               <p>Hourly prices before fees and taxes</p>
//               <Container className="d-flex flex-column align-items-center w-100">
//                 <div
//                   className="d-flex w-100 justify-content-center"
//                   style={{ marginBottom: "-2px" }}
//                 >
//                   <Image
//                     src="/images/filters/price-range.svg"
//                     alt="Price Range"
//                     className="w-100"
//                     fluid
//                   />
//                 </div>

//                 <div className="w-100">
//                   <Range
//                     step={1}
//                     min={RangeValue.min}
//                     max={RangeValue.max}
//                     // values={values}
//                     values={[
//                       values[0] >= RangeValue.min ? values[0] : RangeValue.min,
//                       values[1] <= RangeValue.max ? values[1] : RangeValue.max,
//                     ]}
//                     onChange={(newValues) => setValues(newValues)}
//                     renderTrack={({ props, children }) => (
//                       <div
//                         {...props}
//                         style={{
//                           ...props.style,
//                           height: "6px",
//                           background: "#000",
//                           borderRadius: "3px",
//                           position: "relative",
//                         }}
//                       >
//                         {children}
//                       </div>
//                     )}
//                     renderThumb={({ props }) => (
//                       <div
//                         {...props}
//                         style={{
//                           ...props.style,
//                           height: "16px",
//                           width: "16px",
//                           background: "#fff",
//                           border: "2px solid #000",
//                           borderRadius: "50%",
//                         }}
//                       />
//                     )}
//                   />
//                 </div>
//               </Container>
//               <div className="d-flex justify-content-between align-items-center p-1">
//                 <Form.Group className="w-50 p-lg-2">
//                   <Form.Label>Minimum</Form.Label>
//                   <Form.Control
//                     type="number"
//                     onChange={(e) => handleInputChangeMinMax(0, e)}
//                     value={values[0]}
//                     style={{
//                       borderRadius: "10px",
//                       height: "50px",
//                       boxShadow: "none",
//                       outline: "none",
//                       borderColor: "#B1B1B1",
//                     }}
//                   />
//                 </Form.Group>
//                 <Form.Group className="30px p-3 mt-4">—</Form.Group>
//                 <Form.Group className="w-50 mr-2">
//                   {/* <Form.Label className="text-muted small">Maximum</Form.Label> */}
//                   <Form.Label className="">Maximum</Form.Label>
//                   <Form.Control
//                     type="number"
//                     onChange={(e) => {
//                       handleInputChangeMinMax(0, e);
//                     }}
//                     value={values[1]}
//                     style={{
//                       borderRadius: "10px",
//                       height: "50px",
//                       boxShadow: "none",
//                       outline: "none",
//                       borderColor: "#B1B1B1",
//                     }}
//                   />
//                 </Form.Group>
//               </div>
//             </div>
//             <div className="d-flex py-2 justify-conten     align-items-center">
//               <div
//                 className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
//                 style={{
//                   padding: "12px 16px",
//                   fontSize: "1.1rem",
//                   // fontWeight: "500",
//                   // font: "caption",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   border: "1px solid #ddd",
//                 }}
//               >
//                 <img
//                   src="/images/filters/location.svg"
//                   alt="Location"
//                   style={{ width: 20, height: 20 }}
//                 />
//                 <Autocomplete
//                   apiKey={GOOGLE_KEY}
//                   onPlaceSelected={(place) => {
//                     setFilterLocation(place.formatted_address);
//                     if (place.geometry?.location) {
//                       const lat = place.geometry.location.lat();
//                       const lng = place.geometry.location.lng();
//                       setCoordinates({ lat, lng });
//                     }
//                   }}
//                   options={{ types: ["(cities)"] }}
//                   placeholder={filterLocation || "Location"}
//                   className="google-autocomplete"
//                   style={{
//                     width: "100%",
//                     border: "none",
//                     outline: "none",
//                     fontSize: "1.1rem",
//                   }}
//                 />
//               </div>

//               <Dropdown className="p-lg-2">
//                 <Dropdown.Toggle
//                   variant="light"
//                   id="dropdown-basic"
//                   className="d-flex align-items-center bg-white rounded-pill shadow-sm border"
//                   style={{
//                     padding: "12px 16px",
//                     fontSize: "1.1rem",
//                     fontWeight: "500",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <img
//                     src="/images/filters/calendar-icon.svg"
//                     alt="calendar icon"
//                     style={{ width: 20, height: 20 }}
//                   />
//                   {finalDate ? format(finalDate, "MM-dd-yyyy") : "Date"}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   style={{
//                     padding: "15px",
//                     boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//                     borderRadius: "12px",
//                     border: "none",
//                     minWidth: "240px",
//                   }}
//                 >
//                   <DayPicker
//                     mode="single"
//                     selected={finalDate}
//                     disabled={{ before: new Date() }}
//                     onSelect={(date) => {
//                       setFinalDate(format(date || new Date(), "yyyy-MM-dd"));
//                       setSelectedDate(false);
//                     }}
//                   />
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>

//             <div style={{ position: "relative", display: "inline-block" }}>
//               <Form.Select
//                 value={selectedDuration}
//                 onChange={(e) => setSelectedDuration(e.target.value)}
//                 style={{
//                   appearance: "none",
//                   padding: "12px 16px",
//                   paddingLeft: "40px", // space for icon
//                   fontSize: "1.1rem",

//                   borderRadius: "999px",
//                   border: "1px solid #ddd",
//                   backgroundColor: "#fff",
//                   backgroundImage:
//                     "url(\"data:image/svg+xml;utf8,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
//                   backgroundRepeat: "no-repeat",
//                   backgroundPosition: "right 12px center",
//                   backgroundSize: "14px",
//                   boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//                   cursor: "pointer",
//                   color: "#000",
//                   minWidth: "174px",
//                 }}
//               >
//                 <option value={0}>Time</option>
//                 {[
//                   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
//                   19, 20, 21, 22, 23,
//                 ].map((duration) => (
//                   <option key={duration} value={duration}>
//                     {duration} hours
//                   </option>
//                 ))}
//               </Form.Select>

//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "14px",
//                   transform: "translateY(-50%)",
//                   pointerEvents: "none",
//                   color: "#333",
//                 }}
//               >
//                 <Clock size={18} />
//               </div>
//             </div>

//             <div className="my-2">
//               <h2 className="text-dark">Preferences</h2>
//               {sections.map((section, index) => (
//                 <div key={index} className="mb-3">
//                   <p>{section.title}</p>
//                   <div
//                     className="d-flex align-items-center justify-content-between p-lg-2"
//                     style={{
//                       backgroundColor: "#D1D4D4",
//                       borderRadius: "50px",
//                       padding: "8px",
//                     }}
//                   >
//                     <ToggleButtonGroup
//                       style={{ width: "75%" }}
//                       type="radio"
//                       name={section.name}
//                       // value={preferences[section.name]}
//                       value={""}
//                       onChange={(value) => handleSelect(section.name, value)}
//                       className="d-flex flex-wrap filter-radio-custum-text"
//                     >
//                       {section.options.map((option, idx) => (
//                         <ToggleButton
//                           key={idx}
//                           id={`${section.name}-${idx}`}
//                           value={option || ""}
//                           variant="light"
//                           className="border-0 rounded-pill px-lg-3 py-2"
//                           style={{
//                             backgroundColor:
//                               preferences[section.name] == option
//                                 ? "#50E3C2"
//                                 : "transparent",
//                             fontWeight: "500",
//                             cursor: "pointer",
//                           }}
//                         >
//                           {option}
//                         </ToggleButton>
//                       ))}
//                     </ToggleButtonGroup>

//                     <div
//                       className="d-flex align-items-center justify-content-right ms-2 "
//                       style={{ width: "24%" }}
//                     >
//                       <InputGroup // style={{ width: "180px", position: "relative" }}
//                       >
//                         <Form className="filter-radio-btn-group">
//                           <Form.Control
//                             type="number"
//                             placeholder="Type..."
//                             value={
//                               preferences[section.name] === "Any"
//                                 ? ""
//                                 : preferences[section.name]
//                             }
//                             onChange={(e) =>
//                               handleInputChange(section.name, e.target.value)
//                             }
//                             className="text-center border-0"
//                             style={{
//                               height: "40px",
//                               paddingRight: "25px", // Ensures text doesn’t overlap the button
//                               borderRadius: "50px",
//                               border: "1px solid #D1D4D4",
//                             }}
//                           />
//                           <Button
//                             variant="success"
//                             className="position-absolute"
//                             style={{
//                               right: "5px",
//                               top: "50%",
//                               transform: "translateY(-50%)",
//                               borderRadius: "50%",
//                               width: "25px",
//                               height: "25px",
//                               background: "#50E3C2",
//                               border: "none",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <i className="fa-solid fa-check text-dark"></i>
//                           </Button>
//                         </Form>
//                       </InputGroup>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div
//               style={{
//                 padding: "10px 0",
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//               }}
//             >
//               <h4 style={{ marginBottom: "20px" }}>Activities</h4>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: isMobileWidth
//                     ? "repeat(auto-fill, minmax(65px, 1fr))"
//                     : "repeat(auto-fill, minmax(130px, 1fr))",
//                   gap: isMobileWidth ? "10px" : "12px",
//                   fontSize: isMobileWidth ? "11px" : "",
//                   textAlign: "center",
//                 }}
//               >
//                 {activities1.map((activity) => (
//                   <div
//                     key={activity.name}
//                     onClick={() => toggleActivity(activity.name)}
//                     style={{
//                       backgroundColor: selectedActivitiesFilter.includes(
//                         activity.name
//                       )
//                         ? "#50E3C2"
//                         : "white",
//                       border: "1px solid #ccc",
//                       padding: isMobileWidth ? "10px" : "20px",
//                       borderRadius: "12px",
//                       textAlign: "center",
//                       fontWeight: "500",
//                       cursor: "pointer",
//                       transition: "0.3s",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: isMobileWidth ? "" : "12px",
//                         marginBottom: "8px",
//                         color: selectedActivitiesFilter.includes(activity.name)
//                           ? "white"
//                           : "black",
//                       }}
//                     >
//                       {/* <img src={activity.icon} loading="lazy" style={{width:isMobileWidth ? "20px" : ""}}/> */}
//                       <Image
//                         src={activity.icon}
//                         alt={activity.name}
//                         fluid
//                         rounded
//                         style={{
//                           height: isMobileWidth ? "20px" : "40px",
//                           objectFit: "contain",
//                         }}
//                       />
//                     </div>
//                     <span
//                       style={{
//                         color: selectedActivitiesFilter.includes(activity.name)
//                           ? "white"
//                           : "black",
//                       }}
//                     >
//                       {activity.name}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <h6
//                 style={{
//                   marginTop: "20px",
//                   marginBottom: "10px",
//                   cursor: "pointer",
//                   fontWeight: "500",
//                 }}
//                 onClick={() => setShowOtherActivities(!showOtherActivities)}
//               >
//                 Other Activities{" "}
//                 {showOtherActivities ? <FaAngleUp /> : <FaAngleDown />}
//               </h6>

//               {showOtherActivities && (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: isMobileWidth
//                       ? "repeat(auto-fill, minmax(65px, 1fr))"
//                       : "repeat(auto-fill, minmax(130px, 1fr))",
//                     gap: isMobileWidth ? "10px" : "12px",
//                     fontSize: isMobileWidth ? "11px" : "",
//                     textAlign: "center",
//                   }}
//                 >
//                   {otherActivities.map((activity) => (
//                     <div
//                       key={activity.name}
//                       onClick={() => toggleActivity(activity.name)}
//                       style={{
//                         backgroundColor: selectedActivitiesFilter.includes(
//                           activity.name
//                         )
//                           ? "#50E3C2"
//                           : "white",
//                         border: "1px solid #ccc",
//                         padding: isMobileWidth ? "10px" : "20px",
//                         borderRadius: "12px",
//                         textAlign: "center",
//                         fontWeight: "500",
//                         cursor: "pointer",
//                         transition: "0.3s",
//                       }}
//                     >
//                       <div
//                         className="d-flex justify-content-center align-items-center p-lg-2 rounded"
//                         style={{
//                           fontSize: "24px",
//                           marginBottom: "8px",
//                           color: selectedActivitiesFilter.includes(
//                             activity.name
//                           )
//                             ? "black"
//                             : "white",
//                         }}
//                       >
//                         <Image
//                           src={activity.icon}
//                           alt={activity.name}
//                           fluid
//                           rounded
//                           style={{
//                             height: isMobileWidth ? "20px" : "40px",
//                             objectFit: "contain",
//                           }}
//                         />
//                       </div>

//                       <span
//                         style={{
//                           color: selectedActivitiesFilter.includes(
//                             activity.name
//                           )
//                             ? "white"
//                             : "black",
//                         }}
//                       >
//                         {activity.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div
//               className="nw-pop-amenities-wrp"
//               style={{
//                 padding: "10px 0",
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//               }}
//             >
//               <h4 style={{ marginBottom: "20px" }}>Amenities</h4>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "10px",
//                 }}
//               >
//                 {(showMore
//                   ? [...basicAmenities, ...moreAmenities]
//                   : basicAmenities
//                 ).map((amenity) => (
//                   <label
//                     key={amenity}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       cursor: "pointer",
//                       wordBreak: "break-word",
//                       whiteSpace: "normal",
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedAmenities.includes(amenity)}
//                       onChange={() => toggleAmenity(amenity)}
//                       style={{ marginRight: "8px" }}
//                     />
//                     {amenity}
//                   </label>
//                 ))}
//               </div>

//               {/* {showMore && (
//                 <div style={{ marginTop: "10px" }}>
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 1fr",
//                       gap: "10px",
//                     }}
//                   >
//                     {moreAmenities.map((amenity) => (
//                       <label
//                         key={amenity}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedAmenities.includes(amenity)}
//                           onChange={() => toggleAmenity(amenity)}
//                           style={{ marginRight: "8px" }}
//                         />
//                         {amenity}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )} */}

//               <p
//                 style={{
//                   marginTop: "10px",
//                   cursor: "pointer",
//                   color: "#000",
//                   textDecoration: "underline",
//                 }}
//                 onClick={() => setShowMore(!showMore)}
//               >
//                 {showMore ? "Show Less" : "Show More"}
//               </p>
//             </div>

//             <div
//               style={{
//                 padding: "10px 0",
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//               }}
//             >
//               <h4 style={{ marginBottom: "20px" }}>Booking</h4>

//               {togglesBooking.map((item, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "15px",
//                   }}
//                 >
//                   <div style={{ maxWidth: "85%" }}>
//                     <strong style={{ fontWeight: "500", color: "black" }}>
//                       {item.title}
//                     </strong>
//                     {item.info && (
//                       <span
//                         className="info-wrap"
//                         style={{
//                           position: "relative",
//                           display: "inline-block",
//                           marginLeft: "8px",
//                         }}
//                       >
//                         <span
//                           onMouseEnter={() => setIsHovered1(true)}
//                           onMouseLeave={() => setIsHovered1(false)}
//                           style={{
//                             display: "inline-block",
//                             position: "relative",
//                           }}
//                         >
//                           <img
//                             src="/images/create-profile/info.svg"
//                             alt=""
//                             style={{ cursor: "pointer", marginLeft: 0 }}
//                           />
//                           {isHovered1 && (
//                             <span
//                               style={{
//                                 display: "block",
//                                 position: "absolute",
//                                 top: "-13px",
//                                 left: "22px",
//                                 backgroundColor: "#fff",
//                                 color: "#000",
//                                 padding: "15px 20px",
//                                 boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.2)",
//                                 borderRadius: "12px",
//                                 width: "410px",
//                                 zIndex: 10,
//                                 whiteSpace: "normal",
//                                 fontSize: "14px",
//                                 wordBreak: "break-word",
//                                 maxWidth: isMobileWidth ? "200px" : "none",
//                               }}
//                             >
//                               Your safety and peace of mind are our top
//                               priorities. ZYVO is proud to provide comprehensive
//                               liability insurance coverage for all bookings
//                             </span>
//                           )}
//                         </span>
//                       </span>
//                     )}
//                     {item.description && (
//                       <p
//                         style={{
//                           margin: "5px 0",
//                           fontSize: "14px",
//                           color: "#666",
//                         }}
//                       >
//                         {item.description}
//                       </p>
//                     )}
//                   </div>
//                   <div
//                     onClick={() => handleToggleBooking(index)}
//                     style={{
//                       width: "40px",
//                       height: "20px",
//                       borderRadius: "10px",
//                       backgroundColor: item.toggle ? "#2C3E41" : "#ccc",
//                       display: "flex",
//                       alignItems: "center",
//                       padding: "2px",
//                       cursor: "pointer",
//                       transition: "0.3s",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "16px",
//                         height: "16px",
//                         borderRadius: "50%",
//                         backgroundColor: "#fff",
//                         transform: item.toggle
//                           ? "translateX(20px)"
//                           : "translateX(0px)",
//                         transition: "0.3s",
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div
//               className="nw-pop-amenities-wrp"
//               style={{
//                 padding: "10px 0",
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//               }}
//             >
//               <h4 style={{ marginBottom: "20px" }}>Language</h4>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "12px",
//                 }}
//               >
//                 {availableLanguages
//                   .slice(0, showMoreLanguages ? availableLanguages.length : 8)
//                   .map((language, index) => (
//                     <label
//                       key={index}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedLanguages.includes(language)}
//                         onChange={() => handleSelection(language)}
//                       />
//                       {language}
//                     </label>
//                   ))}
//               </div>

//               <div
//                 onClick={() => setShowMoreLanguages(!showMoreLanguages)}
//                 style={{
//                   marginTop: "10px",
//                   cursor: "pointer",
//                   color: "black",
//                   textDecoration: "underline",
//                 }}
//               >
//                 {showMoreLanguages ? "Show Less" : "See More"}
//               </div>
//             </div>
//           </div>
//         </Modal.Body>

//         {!isMobileWidth && (
//           <Modal.Footer
//             style={{ padding: "16px", borderTop: "1px solid #ddd" }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 width: "100%",
//               }}
//               className="modal-footer"
//             >
//               {/* Clean All Button */}
//               <button
//                 onClick={handleCleanAll}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   backgroundColor: "#fff",
//                   border: "1px solid #E5E5E5",
//                   borderRadius: "50px",
//                   padding: "5px 20px",
//                   cursor: "pointer",
//                   fontWeight: "500",
//                   transition: "0.3s",
//                 }}
//               >
//                 Clean All
//                 <FaRedo
//                   style={{
//                     width: "30px",
//                     height: "30px",
//                     color: isCleaned ? "#2F3E46" : "#fff",
//                     fontSize: "18px",
//                     padding: "5px",
//                     backgroundColor: "#3A4B4C",
//                     borderRadius: "50%",
//                   }}
//                 />
//               </button>

//               {/* Search Button */}
//               <button
//                 onClick={handleSearch}
//                 style={{
//                   width: "auto",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   backgroundColor: "#4AEAB1",
//                   border: "none",
//                   borderRadius: "30px",
//                   padding: "4px 5px 4px 30px",
//                   cursor: "pointer",
//                   fontWeight: "500",
//                   color: "#000",
//                   transition: "0.3s",
//                 }}
//               >
//                 Search
//                 <Container className="d-flex justify-content-end m-0 p-0">
//                   <div
//                     className="search-icon d-flex align-items-center justify-content-center"
//                     style={{
//                       height: "35px",
//                       width: "35px",
//                       backgroundColor: "#3A4B4C",
//                       borderRadius: "50%",
//                       color: "#fff",
//                       fontSize: "16px", // Ensure visibility
//                       marginLeft: "auto",
//                     }}
//                   >
//                     <i
//                       className="fa-regular fa-magnifying-glass"
//                       style={{
//                         color: "#FFFFFF",
//                         fontSize: "14px",
//                         borderRadius: "50%",
//                       }}
//                     ></i>
//                   </div>
//                 </Container>
//               </button>
//             </div>
//           </Modal.Footer>
//         )}
//       </Modal>

//       <LanguageModal />
//     </>
//   );
// };

// export default HomeHeader;
