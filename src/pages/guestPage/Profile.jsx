import { useState, useEffect } from "react";
import AuthModal from "../../components/guest/authModal";
import { useDispatch, useSelector } from "react-redux";
import useProfile from "../../hooks/useProfile";
import Autocomplete from "react-google-autocomplete";
import Constant, { GOOGLE_KEY, imageBase, KEYS } from "../../config/Constant";
import ForgotWithEmail from "../../components/guest/authProfileModals/EmailVerification";
import PhoneVerification from "../../components/guest/authProfileModals/PhoneVerification";
import ChangePassword from "../../components/guest/authProfileModals/ChangePassword";
import Modal from "react-bootstrap/Modal";
import { openPersona } from "../../store/slices/profileSlice";
import AddCardView from "../../components/guest/AddCardView";
import CheckIcon from "../../assets/gallery/check_icon.png";

import CardBankPayment from "../../components/host/cardBankPayment";
import UpdatePhone from "../../components/guest/authProfileModals/UpdatePhone";
import UpdateEmail from "../../components/guest/authProfileModals/UpdateEmail";
import { Link, useNavigate } from "react-router-dom";
import uploadImg from "../../assets/defaultContact.jpg";
import cameraImg from "../../assets/gallery/camera.svg";
import { setUserType, clearUser } from "../../store/slices/userSlice";
import MobFooter from "../../components/MobFooter";
import LanguageModal from "../LanguageModal";
import { toast } from "react-toastify";

function Profile() {
  const {
    getUserProfile,
    ProfileImg,
    addHobby,
    deleteHobby,
    addPet,
    deletePet,
    addWork,
    deleteWork,
    deleteLanguage,
    addLanguage,
    addPlace,
    deletePlace,
    addAboutMe,
    addName,
    addStreet,
    addCity,
    addState,
    addZip,
  } = useProfile();
  const { userInfo } = useSelector(({ user }) => user);

  const isShowPasswordfield = localStorage.getItem("SocialLogin");
  const profileData = useSelector((state) => state.profile);
  const [isUploading, setIsUploading] = useState(false);
  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const useTypes = localStorage.getItem("USER_TYPE");

  const GoogleApi = GOOGLE_KEY;
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const userId = userInfo?.user_id
    ? String(userInfo?.user_id)
    : null || userData?.user_id
    ? String(userData?.user_id)
    : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [aboutMe, setAboutMe] = useState(profileData?.profileData?.about_me);
  const [isAddingAboutMe, setIsAddingAboutMe] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isAddingName, setIsAddingName] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [switchToGuest, setSwitchToGuest] = useState(false);
  const [switchToHost, setSwitchToHost] = useState(false);

  const [showUpdatePhoneModal, setShowUpdateModal] = useState(false);

  const [hobbies, setHobbies] = useState([]);
  const [pets, setPets] = useState([]);
  const [works, setWorks] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [places, setPlaces] = useState([]);
  const [editingIndex, setEditingIndex] = useState({ type: null, index: null });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [newHobby, setNewHobby] = useState("");
  const [isAddingHobby, setIsAddingHobby] = useState(false);

  const [newPet, setNewPet] = useState("");
  const [isAddingPet, setIsAddingPet] = useState(false);

  const [newWork, setNewWork] = useState("");
  const [isAddingWork, setIsAddingWork] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState("");
  const [isAddingPlace, setIsAddingPlace] = useState(false);

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [isAddingStreet, setIsAddingStreet] = useState(false);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [isAddingState, setIsAddingState] = useState(false);
  const [isAddingZip, setIsAddingZip] = useState(false);

  const [verifyEmailModal, setVerifyEmailModal] = useState(false);
  const [verifyPhoneModal, setVerifyPhoneModal] = useState(false);

  const [updateEmailShow, setUpdateEmailShow] = useState(false);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [preview, setPreview] = useState(null);

  // console.log(preview, "preview******");

  //  verified
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [newLoginUserDetails, setNewLoginUserDetails] = useState();

  useEffect(() => {
    const handleGetProfile = async () => {
      try {
        const res = await getUserProfile({ user_id: userId });
        setIsIdentityVerified(res?.data?.identity_verified);
        setNewLoginUserDetails(res?.data);
      } catch (error) {
        // console.error("Error fetching user profile:", error);
      }
    };

    handleGetProfile();
  }, []);

  useEffect(() => {
    if (profileData?.profileData?.profile_image) {
      setPreview(profileData?.profileData?.profile_image);
    }
    if (profileData?.profileData?.first_name) {
      setFirstName(profileData?.profileData?.first_name);
    }
    if (profileData?.profileData?.last_name) {
      setLastName(profileData?.profileData?.last_name);
    }
    if (profileData?.profileData?.about_me) {
      setAboutMe(profileData.profileData.about_me);
    }
    if (profileData?.profileData?.hobbies) {
      setHobbies(profileData.profileData.hobbies);
    }
    if (profileData?.profileData?.pets) {
      setPets(profileData.profileData.pets);
    }
    if (profileData?.profileData?.my_work) {
      setWorks(profileData.profileData.my_work);
    }
    if (profileData?.profileData?.languages) {
      setLanguages(profileData.profileData.languages);
    }
    if (profileData?.profileData?.where_live) {
      setPlaces(profileData.profileData.where_live);
    }
    if (profileData?.profileData?.street) {
      setStreetAddress(profileData?.profileData?.street);
    }
    if (profileData?.profileData?.city) {
      setCity(profileData.profileData.city);
    }
    if (profileData?.profileData?.state) {
      setState(profileData.profileData.state);
    }
    if (profileData?.profileData?.zip_code) {
      setZipCode(profileData.profileData.zip_code);
    }

    if (profileData?.profileData?.email) {
      setEmail(profileData.profileData.email);
    }

    if (profileData?.profileData?.phone_number) {
      setPhoneNumber(profileData.profileData.phone_number);
    }

    if (profileData?.profileData?.email_verified) {
      setIsEmailVerified(true);
    }

    if (profileData?.profileData?.phone_verified) {
      setIsPhoneVerified(true);
    }

    if (profileData?.profileData?.identity_verified) {
      setIsIdentityVerified(true);
    }
  }, [profileData?.profileData]);

  const handleAboutMeSubmit = async () => {
    if (isAddingAboutMe) {
      const trimmedLength = aboutMe.replace(/\s/g, "").length;
      if (trimmedLength < 3 || trimmedLength > 150) {
        toast.error("Please enter between 3 and 150 non-space characters.");
        return;
      }
      await addAboutMe({ user_id: userId, about_me: aboutMe });
      setIsAddingAboutMe(false);
      toast.success("About me updated successfully.");
    } else {
      setIsAddingAboutMe(true);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    try {
      await addName({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
      });

      setIsAddingName(false); // Close the input after saving
    } catch (error) {
      console.error("Failed to add name:", error);
      alert("There was an error saving your name. Please try again.");
    }
  };

  const handleEdit = (type, index, value) => {
    if (type === "hobby") {
      const updatedList = [...hobbies];
      updatedList[index] = value;
      setHobbies(updatedList);
    }
    if (type === "pet") {
      const updatedList = [...pets];
      updatedList[index] = value;
      setPets(updatedList);
    }
    if (type === "work") {
      const updatedList = [...works];
      updatedList[index] = value;
      setWorks(updatedList);
    }
    setEditingIndex({ type, index });
  };

  const handleUpdate = async (type, index) => {
    if (type === "hobby") {
      await addHobby({ user_id: userId, index, hobby_name: hobbies[index] });
    }
    if (type === "pet") {
      await addPet({ user_id: userId, index, pet_name: pets[index] });
    }
    if (type === "work") {
      await addWork({ user_id: userId, index, work_name: works[index] });
    }
    setEditingIndex({ type: null, index: null });
  };

  const handleDelete = async (type, index) => {
    if (type === "hobby") {
      await deleteHobby({ user_id: userId, index }); // Call API action
      setHobbies(hobbies.filter((_, i) => i !== index));
    }
    if (type === "pet") {
      await deletePet({ user_id: userId, index });
      setPets(pets.filter((_, i) => i !== index));
    }
    if (type === "language") {
      await deleteLanguage({ user_id: userId, index });
      setLanguages(languages.filter((_, i) => i !== index));
    }
    if (type === "work") {
      await deleteWork({ user_id: userId, index });
      setWorks(works.filter((_, i) => i !== index));
    }
    if (type === "place") {
      await deletePlace({ user_id: userId, index });
      setPlaces(places.filter((_, i) => i !== index));
      toast.success("Address deleted successfully.");
    }
  };

  const handleAdd = async (type) => {
    if (type === "hobby" && newHobby.trim()) {
      if (newHobby.length < 3 || newHobby.length > 20) {
        toast.error("Please enter between 3 and 20 characters.");
        return;
      }
      await addHobby({ user_id: userId, hobby_name: newHobby }); // Call API action
      setHobbies([...hobbies, newHobby]);
      setNewHobby("");
      setIsAddingHobby(false);
      toast.success("Hobby added successfully.");
    }
    if (type === "pet" && newPet.trim()) {
      if (newPet.length < 3 || newPet.length > 20) {
        toast.error("Please enter between 3 and 20 characters.");
        return;
      }
      await addPet({ user_id: userId, pet_name: newPet }); // Call API action
      setPets([...pets, newPet]);
      setNewPet("");
      setIsAddingPet(false);
      toast.success("Pet added successfully.");
    }
    if (type === "work" && newWork.trim()) {
      if (newWork.length < 3 || newWork.length > 20) {
        toast.error("Please enter between 3 and 20 characters.");
        return;
      }
      await addWork({ user_id: userId, work_name: newWork }); // Call API action
      setWorks([...works, newWork]);
      setNewWork("");
      setIsAddingWork(false);
      toast.success("Work added successfully.");
    }
    if (
      type === "language" &&
      selectedLanguage &&
      !languages.includes(selectedLanguage)
    ) {
      await addLanguage({ user_id: userId, language_name: selectedLanguage });
      setLanguages([...languages, selectedLanguage]);
      setSelectedLanguage("");
      setIsAddingLanguage(false);
      toast.success("Language added successfully.");
    }
    if (type === "place") {
      await addPlace({ user_id: userId, place_name: selectedPlace });
      setPlaces([...places, selectedPlace]);
      setSelectedPlace("");
      setIsAddingPlace(false);
      toast.success("Place added successfully.");
    }
  };

  const getAddressPart = (components, type, short = false) => {
    const component = components.find((c) => c.types.includes(type));
    if (!component) return "";
    return short ? component.short_name : component.long_name;
  };

  const handleAddressSubmit = async (type) => {
    if (type === "street") {
      if (isAddingStreet) {
        try {
          await addStreet({ user_id: userId, street_address: streetAddress });
          city && (await addCity({ user_id: userId, city: city }));
          state && (await addState({ user_id: userId, state: state }));
          zipCode && (await addZip({ user_id: userId, zip_code: zipCode }));
          setIsAddingStreet(false);
          toast.success("Street address added successfully.");
        } catch (error) {
          console.error("Failed to add street:", error);
        }
      } else {
        setIsAddingStreet(true);
      }
    }
    if (type === "city") {
      if (isAddingCity) {
        await addCity({ user_id: userId, city: city });
        setIsAddingCity(false);
        toast.success("City added successfully.");
      } else {
        setIsAddingCity(true);
      }
    }
    if (type === "state") {
      if (isAddingState) {
        await addState({ user_id: userId, state: state });
        setIsAddingState(false);
        toast.success("State added successFully");
      } else {
        setIsAddingState(true);
      }
    }
    if (type == "zip") {
      if (isAddingZip) {
        await addZip({ user_id: userId, zip_code: zipCode });
        setIsAddingZip(false);
        toast.success("Zip code added successfully.");
      } else {
        setIsAddingZip(true);
      }
    }
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/\d(?=\d{4})/g, "*");
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;
    const localPreview = URL.createObjectURL(selectedFile); // Set a local preview immediately
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("profile_image", selectedFile);

    try {
      const res = await ProfileImg(formData);
      if (res?.data) {
        setPreview(res?.data?.profile_image_url);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser()); // Clear Redux user state
    toast.success("Logout Successfully.");
    navigate("/");
    setShowLogoutModal(false);
    localStorage.removeItem("SocialLogin");
  };

  useEffect(() => {
    if (switchToGuest) {
      dispatch(setUserType("guest"));
      Constant.selectedFlow = "guest";
      localStorage.setItem(KEYS.USER_TYPE, "guest");
      navigate("/homeGuest");
    }
  }, [switchToGuest, dispatch, navigate]);

  useEffect(() => {
    if (switchToHost) {
      dispatch(setUserType("host"));
      Constant.selectedFlow = "host";
      localStorage.setItem(KEYS.USER_TYPE, "host");
      navigate("/");
    }
  }, [switchToHost, dispatch, navigate]);

  const handleSwitch = (e) => {
    e.preventDefault();
    setSwitchToGuest(true);
  };

  const handleSwitch2 = (e) => {
    e.preventDefault();
    setSwitchToHost(true);
  };

  return (
    <>
      <main>
        {/* <!-- MOBILE --> */}

        <div
          className="complete-your-profile"
          style={{
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
            backgroundSize: "20px 20px",
            display: "flex",
            flexDirection: "row", // Ensures children are arranged in a row
            justifyContent: "space-between", // Adjust as needed
            alignItems: "flex-start", // Align items to the top
            padding: !isMobileWidth ? "10px 30px 15px 30px" : "0px",
          }}
        >
          <div className="container-fluid">
            <div className="row">
              {/* {isMobileWidth && useTypes==="host" && (
                <>
                    <div className="col-lg-8 col-md-6 order-lg-first">
                      <div className="complete-your-profile-left">
                        <form onSubmit={(e) => e.preventDefault()}>  
                          <h2>
                          About Me{" "}
                          <p style={{border: '1px solid #e5e5e5', display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", fontSize: "15px", padding: "6px", borderRadius: "100px"}}>Edit
                          <button type="button" className={`${isAddingAboutMe ? "check" : ""}`}
                            onClick={handleAboutMeSubmit} style={{height: "22px", width: "22px"}}>
                            <i className={`fa-solid ${ isAddingAboutMe ? "fa-check" : "fa-pen" }`} style={{fontSize: "12px"}}></i>
                          </button>
                          </p>
                        </h2>
                        <div className="about-me" style={{marginBottom: "-20px", marginTop: "-20px"}}>
                          <textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)}
                            disabled={!isAddingAboutMe}
                            style={{
                              border: "none",
                              outline: "none",
                              boxShadow: "none",
                              //  resize: "none",
                              background: "transparent",
                              // height: "0px",
                              padding: "4px",
                            }}            
                          />
                        </div>
                        </form>
                      </div>
                    </div>

                
                </>
              )
              } */}
              <div className="col-lg-4 col-md-6">
                <div className="complete-your-profile-right">
                  <div className="complete-your-profile-right-top">
                    <div className="user-profile-upload-name">
                      <div className="user-profile-upload">
                        <div className="user-profile-upload-image">
                          <img
                            src={
                              preview
                                ? typeof preview === "object"
                                  ? `${imageBase + preview?.profile_image_url}`
                                  : `${imageBase + preview}`
                                : uploadImg
                            }
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #D1D1D1",
                            }}
                          />
                        </div>
                        <button
                          style={{
                            width: isMobileWidth ? "25px" : "30px",
                            height: isMobileWidth ? "25px" : "30px",
                          }}
                          type="button"
                          onClick={() => setShowFileUploadModal(true)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </div>
                      <div className="user-profile-name">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "9",
                          }}
                        >
                          <h2>
                            Hey{" "}
                            {firstName && lastName
                              ? `${firstName} ${lastName}`
                              : useTypes == "host"
                              ? "Host"
                              : "Guest"}
                            !
                          </h2>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingName(!isAddingName);
                            }}
                            style={{
                              width: isMobileWidth ? "28px" : "30px",
                              height: isMobileWidth ? "28px" : "30px",
                              borderRadius: "50%",
                              backgroundColor: "#4aeab1",
                              color: "#3a4b4c",
                              fontSize: "14px",
                              border: "3px solid #fff",
                            }}
                          >
                            <i
                              className="fa-solid fa-pen"
                              style={{ fontSize: "14px" }}
                            ></i>
                          </button>
                        </div>
                        {isAddingName && (
                          <div className="user-name-dropdown">
                            <form onSubmit={handleNameSubmit}>
                              <div
                                className="user-profile-upload-image"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "relative",
                                  marginBottom: "5px",
                                }}
                              >
                                <img
                                  src={
                                    preview
                                      ? imageBase +
                                        (preview?.profile_image_url
                                          ? preview?.profile_image_url
                                          : preview)
                                      : "/images/nav-section/user-profile1.png"
                                  }
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "100%",
                                  }}
                                />
                                <div
                                  // type="submit"
                                  style={{
                                    position: "absolute",
                                    bottom: "1px",
                                    right: "35%",
                                    width: "25px",
                                    height: "25px",
                                    borderRadius: "50%",
                                    backgroundColor: "#4aeab1",
                                    color: "#3a4b4c",
                                    fontSize: "12px",
                                    border: "2px solid #fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // cursor: "pointer",
                                  }}
                                >
                                  <i className="fa-solid fa-check"></i>
                                </div>
                              </div>
                              <label>
                                <input
                                  type="text"
                                  placeholder="First name*"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Last name*"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  required
                                />
                              </label>
                              <input type="submit" value="Save Changes" />
                            </form>
                          </div>
                        )}

                        <p>
                          {useTypes === "host" ? "Host" : "Guest"}
                          <span className="info-wrap">
                            <img
                              src="/images/create-profile/info.svg"
                              loading="lazy"
                              alt="info-wrap"
                              style={{ marginBottom: "7px" }}
                            />
                            <span className="info-in">
                              Before you can book or host on the platform the
                              name on Id must match verification documents.
                            </span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="complete-your-profile-right-bottom">
                    <div className="complete-your-profile-right-bottom-in">
                      <div className="complete-your-profile-right-bottom-image">
                        <img
                          src="/images/create-profile/mail.svg"
                          loading="lazy"
                          alt="info-wrap"
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Email Address</h1>
                        {isEmailVerified ? (
                          <p>
                            Verified{" "}
                            {/* <i className="fa-regular fa-badge-check"></i> */}
                            <img
                              src={CheckIcon}
                              loading="lazy"
                              alt="Dotted Overlay"
                              style={{
                                width: "15%",
                                height: "15%",
                              }}
                            />
                          </p>
                        ) : (
                          <a
                            onClick={() => setVerifyEmailModal(true)}
                            style={{ cursor: "pointer" }}
                          >
                            <u>Confirm now</u>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="complete-your-profile-right-bottom-in">
                      <div className="complete-your-profile-right-bottom-image">
                        <img
                          src="/images/create-profile/call.svg"
                          loading="lazy"
                          alt="complete-your-profile-right-bottom"
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Phone Number</h1>
                        {isPhoneVerified ? (
                          <p>
                            {" "}
                            Verified{" "}
                            <img
                              src={CheckIcon}
                              loading="lazy"
                              alt="Dotted Overlay"
                              style={{
                                width: "15%",
                                height: "15%",
                              }}
                            />
                          </p>
                        ) : (
                          <a
                            onClick={() => {
                              setVerifyPhoneModal(true);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <u>Confirm now</u>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="complete-your-profile-right-bottom-in">
                      <div className="complete-your-profile-right-bottom-image">
                        <img
                          src="/images/create-profile/identity.svg"
                          loading="lazy"
                          alt="complete-your-profile-right-bottom"
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Verify identity</h1>
                        {newLoginUserDetails?.identity_verified == "1" ||
                        profileData?.personaStatus === "approved" ||
                        profileData?.personaStatus === "completed" ? (
                          <p>
                            Verified{" "}
                            <img
                              src={CheckIcon}
                              loading="lazy"
                              alt="Dotted Overlay"
                              style={{
                                width: "15%",
                                height: "15%",
                              }}
                            />
                          </p>
                        ) : (
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={() => dispatch(openPersona())}
                          >
                            <u>Confirm now</u>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-6 order-lg-first">
                <div className="complete-your-profile-left">
                  <form onSubmit={(e) => e.preventDefault()}>
                    {isMobileWidth && (
                      <>
                        <h2>
                          About Me{" "}
                          <button
                            type="button"
                            className={`${isAddingAboutMe ? "check" : ""}`}
                            onClick={handleAboutMeSubmit}
                          >
                            <i
                              className={`fa-solid ${
                                isAddingAboutMe ? "fa-check" : "fa-pen"
                              }`}
                            ></i>
                          </button>
                        </h2>
                        <div className="about-me">
                          <textarea
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            disabled={!isAddingAboutMe}
                          />
                        </div>
                      </>
                    )}
                    <div className="user-data-list-wrap">
                      <h2>Please Add Location (Where I Live)</h2>
                      <div className="user-data-list-inner">
                        {places.map((location, index) => (
                          <div
                            key={index}
                            className="user-data-list-item"
                            style={{
                              // width: "50%",
                              display: "flex",
                              alignItems: "center",
                              gap: "1px",
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Enter your location"
                              value={location}
                              disabled
                              style={{ flex: 1, minWidth: 0 }}
                            />
                            <button
                              type="button"
                              onClick={() => handleDelete("place", index)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ))}
                        {isAddingPlace && (
                          <div
                            className="user-data-list-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1px",
                              minWidth: "250px",
                            }}
                          >
                            <Autocomplete
                              apiKey={GOOGLE_KEY}
                              onPlaceSelected={(place) =>
                                setSelectedPlace(place.formatted_address)
                              }
                              options={{ types: ["(cities)"] }}
                              placeholder="Search for a place..."
                              className="google-autocomplete"
                              onChange={(e) => {
                                if (!e.target.value) {
                                  setSelectedPlace("");
                                }
                              }}
                              style={{
                                padding: "8px",
                                borderRadius: "20px",
                                flex: 1,
                                fontSize: isMobileWidth && "12px",
                                minWidth: 0,
                              }}
                            />
                            {selectedPlace && (
                              <button
                                type="button"
                                className="check"
                                onClick={() => handleAdd("place")}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {!selectedPlace && (
                              <button
                                type="button"
                                onClick={() => setIsAddingPlace(false)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        )}
                        {!isAddingPlace && places.length <= 1 && (
                          <button
                            type="button"
                            className="add-new-btn"
                            onClick={() => setIsAddingPlace(true)}
                          >
                            Add New <i className="fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                      <h2>My work</h2>
                      <div className="user-data-list-inner">
                        {works.map((work, index) => (
                          <div
                            className="user-data-list-item my-work"
                            key={`${index}`}
                          >
                            <input
                              type="text"
                              placeholder="Lawyer"
                              value={work}
                              // maxLength={10}
                              onChange={(e) =>
                                handleEdit("work", index, e.target.value)
                              }
                            />
                            <button
                              style={{ marginLeft: "50%" }}
                              type="button"
                              className={`${
                                editingIndex.type === "work" &&
                                editingIndex.index === index
                                  ? "check"
                                  : "icon-btn"
                              }`}
                              onClick={() =>
                                editingIndex.type === "work" &&
                                editingIndex.index === index
                                  ? handleUpdate("work", index)
                                  : handleDelete("work", index)
                              }
                            >
                              <i
                                className={`fa-solid ${
                                  editingIndex.type === "work" &&
                                  editingIndex.index === index
                                    ? "fa-check"
                                    : "fa-xmark"
                                }`}
                              ></i>
                            </button>
                            <div className="user-data-list-dropdown">
                              <ul>
                                <li className="where-src-item">
                                  <a>
                                    <img
                                      src="/images/create-profile/list-icons/work.svg"
                                      loading="lazy"
                                      alt="work"
                                    />
                                    Lawyer
                                  </a>
                                </li>
                                <li className="where-src-item">
                                  <a>
                                    <img
                                      src="/images/create-profile/list-icons/work.svg"
                                      loading="lazy"
                                      alt="Lawyer"
                                    />
                                    Lawyer
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                        {isAddingWork && (
                          <div className="user-data-list-item my-work">
                            <input
                              type="text"
                              value={newWork}
                              onChange={(e) => setNewWork(e.target.value)}
                            />
                            {newWork !== "" && (
                              <button
                                type="button"
                                className="icon-btn check"
                                onClick={() => handleAdd("work")}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {newWork == "" && (
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setIsAddingWork(false)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        )}
                        {!isAddingWork && works.length <= 1 && (
                          <button
                            type="button"
                            className="add-new-btn"
                            onClick={() => setIsAddingWork(true)}
                          >
                            Add New <i className="fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                      <h2>Languages I speak*</h2>
                      <div
                        className="user-data-list-inner"
                        style={{ flexWrap: isMobileWidth ? "nowrap" : "wrap" }}
                      >
                        {languages.map((language, index) => (
                          <div
                            className="user-data-list-item languages"
                            key={index}
                          >
                            <input type="text" value={language} readOnly />
                            <button
                              type="button"
                              onClick={() => handleDelete("language", index)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div className="user-data-list-dropdown">
                              <ul>
                                <li className="where-src-item">
                                  <a>
                                    <img
                                      src="/images/create-profile/list-icons/languages.svg"
                                      loading="lazy"
                                      alt=""
                                    />
                                    English
                                  </a>
                                </li>
                                <li className="where-src-item">
                                  <a>
                                    <img
                                      src="/images/create-profile/list-icons/languages.svg"
                                      loading="lazy"
                                      alt=""
                                    />
                                    English
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                        {isAddingLanguage && languages.length <= 1 && (
                          <div className="user-data-list-item languages">
                            <input
                              type="text"
                              value={selectedLanguage}
                              data-bs-target="#language-popup"
                              data-bs-toggle="modal"
                              placeholder="Select a language"
                            />

                            {selectedLanguage !== "" && (
                              <button
                                type="button"
                                className="check"
                                onClick={() => handleAdd("language")}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {selectedLanguage === "" && (
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setIsAddingLanguage(false)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        )}
                        {!isAddingLanguage && languages.length <= 1 && (
                          <button
                            type="button"
                            className="add-new-btn"
                            data-bs-target="#language-popup"
                            data-bs-toggle="modal"
                            onClick={() => setIsAddingLanguage(true)}
                          >
                            Add New <i className="fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                      <h2>Hobbies</h2>
                      <div className="user-data-list-inner">
                        {hobbies.map((hobby, index) => (
                          <div
                            key={index}
                            className="user-data-list-item hobbies"
                          >
                            <input
                              type="text"
                              value={hobbies[index]}
                              placeholder="Hobbies"
                              onChange={(e) =>
                                handleEdit("hobby", index, e.target.value)
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                editingIndex.type === "hobby" &&
                                editingIndex.index === index
                                  ? handleUpdate("hobby", index)
                                  : handleDelete("hobby", index)
                              }
                              className={`${
                                editingIndex.type === "hobby" &&
                                editingIndex.index === index
                                  ? "check"
                                  : "icon-btn"
                              }`}
                            >
                              <i
                                className={`fa-solid ${
                                  editingIndex.type === "hobby" &&
                                  editingIndex === index
                                    ? "fa-check"
                                    : "fa-xmark"
                                }`}
                              ></i>
                            </button>
                          </div>
                        ))}
                        {isAddingHobby && (
                          <div className="user-data-list-item hobbies">
                            <input
                              type="text"
                              value={newHobby}
                              onChange={(e) => setNewHobby(e.target.value)}
                            />
                            {newHobby != "" && (
                              <button
                                type="button"
                                className="check"
                                onClick={() => handleAdd("hobby")}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {newHobby === "" && (
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setIsAddingHobby(false)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        )}
                        {!isAddingHobby && hobbies.length <= 1 && (
                          <button
                            type="button"
                            className="add-new-btn"
                            onClick={() => setIsAddingHobby(true)}
                          >
                            Add New <i className="fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                      <h2>Pets</h2>
                      <div className="user-data-list-inner">
                        {pets.map((pet, index) => (
                          <div
                            className="user-data-list-item pets"
                            key={`index` + index}
                          >
                            <input
                              type="text"
                              placeholder="Pets"
                              value={pet}
                              onChange={(e) =>
                                handleEdit("pet", index, e.target.value)
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                editingIndex.type === "pet" &&
                                editingIndex.index === index
                                  ? handleUpdate("pet", index)
                                  : handleDelete("pet", index)
                              }
                              className={`${
                                editingIndex.type === "pet" &&
                                editingIndex.index === index
                                  ? "check"
                                  : "icon-btn"
                              }`}
                            >
                              <i
                                className={`fa-solid ${
                                  editingIndex.type === "pet" &&
                                  editingIndex.index === index
                                    ? "fa-check"
                                    : "fa-xmark"
                                }`}
                              ></i>
                            </button>
                            <div className="user-data-list-dropdown">
                              <ul>
                                <li className="where-src-item">
                                  <a>Dog</a>
                                </li>
                                <li className="where-src-item">
                                  <a>Dog</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                        {isAddingPet && (
                          <div className="user-data-list-item pets">
                            <input
                              type="text"
                              value={newPet}
                              onChange={(e) => setNewPet(e.target.value)}
                            />
                            {newPet !== "" && (
                              <button
                                type="button"
                                className="check"
                                onClick={() => handleAdd("pet")}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {newPet === "" && (
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setIsAddingPet(false)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        )}
                        {!isAddingPet && pets.length <= 1 && (
                          <button
                            type="button"
                            className="add-new-btn"
                            onClick={() => setIsAddingPet(true)}
                          >
                            Add New <i className="fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                      <h2>Email</h2>
                      <div className="user-data-list-inner">
                        <div
                          className="user-data-list-item input-field"
                          style={{ width: isMobileWidth && "100%" }}
                        >
                          <input
                            type="text"
                            placeholder="Enter Your Email"
                            value={email}
                            disabled
                          />
                          <button
                            style={{
                              width: isMobileWidth ? "25px" : "30px",
                              height: isMobileWidth ? "25px" : "30px",
                            }}
                            type="button"
                            className="edit-field"
                            onClick={() => setUpdateEmailShow(true)}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                      </div>
                      <h2>Phone Number</h2>
                      <div className="user-data-list-inner">
                        <div
                          className="user-data-list-item input-field"
                          style={{ width: isMobileWidth && "100%" }}
                        >
                          <input
                            type="text"
                            placeholder="Enter Your Phone Number"
                            defaultValue={maskPhoneNumber(phoneNumber)}
                            readOnly
                          />
                          <button
                            type="button"
                            className="edit-field"
                            onClick={() => setShowUpdateModal(true)}
                            style={{
                              width: isMobileWidth ? "25px" : "30px",
                              height: isMobileWidth ? "25px" : "30px",
                            }}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                      </div>

                      {!isShowPasswordfield && (
                        <>
                          <h2>Password</h2>
                          <div className="user-data-list-inner">
                            <div
                              className="user-data-list-item input-field"
                              style={{ width: isMobileWidth && "100%" }}
                            >
                              <input
                                type="password"
                                placeholder="Enter Your Password"
                                defaultValue="***********"
                                readOnly
                              />
                              <button
                                type="button"
                                className="edit-field"
                                onClick={() => setShowChangePasswordModal(true)}
                                style={{
                                  width: isMobileWidth ? "25px" : "30px",
                                  height: isMobileWidth ? "25px" : "30px",
                                }}
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      <h2>Mailing Address</h2>
                      <div
                        className="user-data-list-inner mailing-address-wrap"
                        style={{
                          display: "flex",
                          gap: "10px",
                          flex: "flex-start",
                        }}
                      >
                        <div className="user-data-list-item input-field">
                          <Autocomplete
                            apiKey={GoogleApi}
                            readOnly={!isAddingStreet}
                            value={streetAddress}
                            //  value={streetAddress?.split(/[^a-zA-Z0-9\s]/)?.[1]?.trim()?.split(/\s+/)?.slice(0, 2)?.join(" ")}
                            onPlaceSelected={(place) => {
                              if (!place?.address_components) return;
                              const components = place.address_components;
                              const streetNumber = getAddressPart(
                                components,
                                "street_number"
                              );
                              const route = getAddressPart(components, "route");
                              const city = getAddressPart(
                                components,
                                "locality"
                              );
                              const state = getAddressPart(
                                components,
                                "administrative_area_level_1",
                                true
                              );
                              const zipCode = getAddressPart(
                                components,
                                "postal_code"
                              );
                              const street = `${streetNumber} ${route}`;

                              setCity(city);
                              setState(state);
                              setZipCode(zipCode);
                              setStreetAddress(route);
                            }}
                            options={{
                              types: ["address"],
                              fields: ["address_components", "geometry"],
                            }}
                            onChange={(e) => {
                              if (isAddingStreet) {
                                setStreetAddress(e.target.value);
                              }
                            }}
                            placeholder="Street"
                          ></Autocomplete>
                          <button
                            type="button"
                            className={`${
                              isAddingStreet ? "check" : "edit-field"
                            }`}
                            onClick={() =>
                              !isAddingStreet
                                ? setIsAddingStreet(true)
                                : handleAddressSubmit("street")
                            }
                            style={{
                              width: isMobileWidth ? "25px" : "30px",
                              height: isMobileWidth ? "25px" : "30px",
                            }}
                          >
                            <i
                              className={`fa-solid ${
                                isAddingStreet ? "fa-check" : "fa-pen"
                              }`}
                            />
                          </button>
                        </div>

                        <div
                          className="user-data-list-item input-field"
                          style={{ marginLeft: "40px", margin: "0" }}
                        >
                          <input
                            type="text"
                            value={city}
                            disabled={!isAddingCity}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                          />
                          <button
                            type="button"
                            className={`${
                              isAddingCity ? "check" : "edit-field"
                            }`}
                            style={{
                              width: isMobileWidth ? "25px" : "30px",
                              height: isMobileWidth ? "25px" : "30px",
                            }}
                            onClick={() => handleAddressSubmit("city")}
                          >
                            <i
                              className={`fa-solid ${
                                isAddingCity ? "fa-check" : "fa-pen"
                              }`}
                            ></i>
                          </button>
                        </div>
                        <div className="user-data-list-item input-field">
                          <input
                            type="text"
                            value={state}
                            disabled={!isAddingState}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                          />
                          <button
                            type="button"
                            className={`${
                              isAddingState ? "check" : "edit-field"
                            }`}
                            style={{
                              width: isMobileWidth ? "25px" : "30px",
                              height: isMobileWidth ? "25px" : "30px",
                            }}
                            onClick={() => handleAddressSubmit("state")}
                          >
                            <i
                              className={`fa-solid ${
                                isAddingState ? "fa-check" : "fa-pen"
                              }`}
                            ></i>
                          </button>
                        </div>
                        <div
                          className="user-data-list-item input-field"
                          style={{ marginLeft: "40px", margin: "0" }}
                        >
                          <input
                            type="text"
                            value={zipCode}
                            disabled={!isAddingZip}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="Zip Code"
                          />
                          <button
                            type="button"
                            className={`${
                              isAddingZip ? "check" : "edit-field"
                            }`}
                            style={{
                              width: isMobileWidth ? "25px" : "30px",
                              height: isMobileWidth ? "25px" : "30px",
                            }}
                            onClick={() => handleAddressSubmit("zip")}
                          >
                            <i
                              className={`fa-solid ${
                                isAddingZip ? "fa-check" : "fa-pen"
                              }`}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <AddCardView type={useTypes} />
                    {useTypes === "host" && <CardBankPayment />}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE --> */}
        {useTypes === "guest" ? (
          <div className="mob-profile-bottom">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="mob-profile-bottom-in">
                    <h2>Useful Pages</h2>
                    <ul>
                      <li>
                        <Link to="/notifications">
                          <img
                            src="/images/create-profile/mob-profile/1.svg"
                            loading="lazy"
                            alt=""
                          />
                          Notifications
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                    <h2>Support</h2>
                    <ul>
                      <li>
                        <Link to="/helpCenter">
                          <img
                            src="/images/create-profile/mob-profile/2.svg"
                            loading="lazy"
                            alt=""
                          />
                          Visit the Help Center
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/feedback">
                          <img
                            src="/images/create-profile/mob-profile/3.svg"
                            loading="lazy"
                            alt=""
                          />
                          Give us feedback
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                    <h2>Legal</h2>
                    <ul>
                      <li>
                        <Link to="/terms-condition">
                          <img
                            src="/images/create-profile/mob-profile/4.svg"
                            loading="lazy"
                            alt=""
                          />
                          Terms of services
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/privacy-policy">
                          <img
                            src="/images/create-profile/mob-profile/4.svg"
                            loading="lazy"
                            alt=""
                          />
                          Privacy policy
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>

                      <li>
                        <Link to="/faq">
                          <img
                            src="/images/create-profile/mob-profile/4.svg"
                            loading="lazy"
                            alt=""
                          />
                          FAQ's
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                    <div className="mob-profile-bottom-in-btns">
                      <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        style={isMobileWidth ? { paddingRight: "12px" } : {}}
                      >
                        <img
                          src="/images/create-profile/mob-profile/logout.svg"
                          loading="lazy"
                          alt=""
                        />
                        Logout
                      </button>

                      <Link onClick={handleSwitch2}>Switch to Host</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mob-profile-bottom">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="mob-profile-bottom-in">
                    <h2>Useful Pages</h2>
                    <ul>
                      <li>
                        <Link to="/payment-host">
                          <img
                            src="/images/notifications/1.svg"
                            loading="lazy"
                            alt=""
                          />
                          Payments and Withdrawals
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/booking">
                          <img
                            src="/images/create-profile/mob-profile/booking.svg"
                            loading="lazy"
                            alt="booking"
                          />
                          Bookings
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li
                        onClick={() =>
                          navigate("/homeHost", {
                            state: {
                              openAddProperty: true,
                            },
                          })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <Link>
                          <img
                            src="/images/create-profile/mob-profile/create-listing.svg"
                            loading="lazy"
                            alt="create-listing"
                          />
                          Create New Listing
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li>
                        <a
                          href="#"
                          data-bs-target="#language-popup"
                          data-bs-toggle="modal"
                        >
                          <img
                            src="/images/create-profile/languages.svg"
                            loading="lazy"
                            alt="languages"
                          />
                          Language
                          <i className="fa-solid fa-chevron-right"></i>
                        </a>
                      </li>

                      <li>
                        <Link to="/notifications">
                          <img
                            src="/images/create-profile/mob-profile/1.svg"
                            loading="lazy"
                            alt="mob-profile"
                          />
                          Notifications
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                    <h2>Support</h2>
                    <ul>
                      <li>
                        <Link to="/helpCenter" state={{ useTypes: "host" }}>
                          <img
                            src="/images/create-profile/mob-profile/2.svg"
                            loading="lazy"
                            alt="helpCenter"
                          />
                          Visit the Help Center
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/feedback">
                          <img
                            src="/images/create-profile/mob-profile/3.svg"
                            loading="lazy"
                            alt="feedback"
                          />
                          Give us feedback
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                    <h2>Legal</h2>
                    <ul>
                      <li>
                        <Link to="/terms-condition">
                          <img
                            src="/images/create-profile/mob-profile/4.svg"
                            loading="lazy"
                            alt="terms-condition"
                          />
                          Terms of services
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/privacy-policy">
                          <img
                            src="/images/create-profile/mob-profile/4.svg"
                            loading="lazy"
                            alt="privacy-policy"
                          />
                          Privacy policy
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                    <div className="mob-profile-bottom-in-btns">
                      <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        style={{ marginRight: isMobileWidth ? "18px" : "" }}
                      >
                        <img
                          src="/images/create-profile/mob-profile/logout.svg"
                          loading="lazy"
                          alt="logout"
                        />
                        Logout
                      </button>

                      <Link onClick={handleSwitch}>Switch to Guest</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <MobFooter />
        {/* <!-- MOBILE --> */}
      </main>
      <Modal
        show={showFileUploadModal}
        onHide={() => setShowFileUploadModal(false)}
        centered
        className="custom-modal"
      >
        <style>
          {`

.custom-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Optional overlay */
  display: flex;
  justify-content: center; /* Center the modal-dialog */
  align-items: flex-end;   /* Push to bottom */
  z-index: 1050;
}

      .custom-modal .modal-dialog {
        width: 30%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;

      }

      .btn-close {
        width: 10px;
        height: 10px;
        background: #3A4B4C;
        border-radius: 50%;
        opacity: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-close::after {
        content: '×';
        color: #fff;
        font-weight: 500;
        font-size: 20px;
        line-height: 1;
      }

      .upload-options {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 30px;
        flex-wrap: wrap;
      }

      .upload-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      }

      .upload-option img {
        width: 50px;
        height: 50px;
        object-fit: contain;
        margin-bottom: 8px;
      }

      .upload-option span {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      /* ---------- RESPONSIVE STYLES FOR MOBILE ---------- */
      @media (max-width: 576px) {


           
        .custom-modal .modal-dialog {
          width: 100% !important;  /* Full width on small screens */
          margin: 0 auto;
        
        }

 .custom-modal .modal-dialog {
  width: 100% !important;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: end;
  border: none;
  border-radius: 0;
}

.custom-modal .modal-dialog .modal-content {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important; /* Optional: remove shadow too */
  padding:0 !important;
}


 .btn-close {
       display:none !important;
      }

        .upload-options {
          gap: 100px;   
        margin-top:0px;
        }

        .upload-option img {
          width: 40px;           /* Slightly smaller icons */
          height: 40px;
        }

        .upload-option span {
          font-size: 13px;       /* Adjust font size */
        }

        .modal-content {
          padding: 10px;
        }

        .modal-header {
          padding: 8px 10px;
        }

        .modal-title {
          font-size: 16px !important;
        }
      }
    `}
        </style>

        <Modal.Header
          className="profile-close-btn"
          closeButton
          style={{ border: "none", padding: "10px", fontWeight: "500" }}
        />

        <Modal.Title
          className="w-100 text-center"
          style={{ fontSize: "18px", marginTop: "10px" }}
        >
          Add Profile picture
        </Modal.Title>

        <hr style={{ width: "80%", margin: "10px auto" }} />

        <Modal.Body className="text-center">
          <div className="upload-options" htmlFor="camera-input">
            {isMobileWidth && (
              <label htmlFor="camera-input" className="upload-option">
                <img src={cameraImg} loading="lazy" alt="Upload" />
                <span>Take Photo</span>
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            )}

            <label htmlFor="file-upload" className="upload-option">
              {/* <img
                style={{ borderRadius: "50%" }}
                src={
                  preview
                    ? typeof preview === "object"
                      ? `${imageBase + preview?.profile_image_url}`
                      : `${imageBase + preview}`
                    : uploadImg
                }

              
                loading="lazy"
                alt="Upload"
              /> */}

              <img
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginTop: -40,
                }} // objectFit prevents the image from squishing
                src={
                  preview
                    ? typeof preview === "string" && preview.startsWith("blob:")
                      ? preview // 1. If it's a local blob preview, use it directly!
                      : typeof preview === "object"
                      ? `${imageBase + preview?.profile_image_url}` // 2. Handle object fallback
                      : `${imageBase + preview}` // 3. Handle standard backend image string
                    : uploadImg // 4. Default fallback if no preview exists
                }
                loading="lazy"
                alt="Upload"
                onError={(e) => {
                  e.target.src = uploadImg; // Double fallback safety net
                }}
              />
              <span>Upload from Device</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </Modal.Body>
      </Modal>

      <ForgotWithEmail
        USERID={userId}
        show={verifyEmailModal}
        handleClose={() => setVerifyEmailModal(false)}
      />

      <UpdateEmail
        USERID={userId}
        show={updateEmailShow}
        handleClose={() => setUpdateEmailShow(false)}
      />
      <PhoneVerification
        USERID={userId}
        show={verifyPhoneModal}
        handleClose={() => setVerifyPhoneModal(false)}
      />
      <ChangePassword
        show={showChangePasswordModal}
        showChangePasswordModal={showChangePasswordModal}
        setShowChangePasswordModal={setShowChangePasswordModal}
        setShowSuccess={setShowSuccess}
        handleClose={() => {
          setShowChangePasswordModal(false);
        }}
      />

      <UpdatePhone
        USERID={userId}
        show={showUpdatePhoneModal}
        handleClose={() => setShowUpdateModal(false)}
      />

      <LanguageModal isProfile={true} />
      <AuthModal />

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "380px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "#2D3E3F", // Dark circle background
                color: "white",
                border: "none",
                width: "20px",
                height: "20px",
                borderRadius: "50%", // Makes it circular
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Slight shadow for depth
              }}
            >
              x
            </button>

            <h2 style={{ fontWeight: "600", fontSize: "22px" }}>Success</h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "15px 0",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", // Soft shadow around the circle
              }}
            >
              <svg
                width="48"
                height="37.65"
                viewBox="0 0 48 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 20L16 34L46 2"
                  stroke="#4AEAB1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              style={{ color: "#333", fontSize: "14px", marginBottom: "20px" }}
            >
              Your password has been changed successfully.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              style={{
                backgroundColor: "#4AEAB1",
                color: "black",
                border: "none",
                width: "60%",
                fontWeight: "600",
                padding: "12px 0",
                borderRadius: "30px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}

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
              width: "100%",
              borderRadius: isMobileWidth ? "20px" : "13px",
              backgroundColor: "white",
              padding: isMobileWidth ? "10px" : "20px",
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
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: isMobileWidth ? "20px" : "25px",
                  height: isMobileWidth ? "20px" : "25px",
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
                  fontWeight: "500",
                  fontSize: isMobileWidth ? "16px" : "28px",
                  color: "#000000",
                  marginBottom: isMobileWidth ? "0px" : "10px",
                  fontFamily: "sans-serif poppins",
                }}
              >
                Logout
              </h3>

              <hr />

              <div style={{ margin: isMobileWidth ? "-6px" : "20px 0" }}>
                <img
                  src="/images/popups/logout.svg"
                  loading="lazy"
                  alt="Logout"
                  style={{
                    width: isMobileWidth ? "70px" : "90px",
                    height: isMobileWidth ? "70px" : "90px",
                    marginBottom: "10px",
                  }}
                />
              </div>

              <p
                style={{
                  margin: isMobileWidth ? "10px auto" : "30px",
                  fontSize: isMobileWidth ? "14px" : "",
                  width: isMobileWidth ? "58%" : "",
                  textAlign: "center",
                }}
              >
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
                    padding: isMobileWidth ? "10px 40px" : "10px 50px",
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
                    handleLogout();
                    setShowLogoutModal(false);
                  }}
                  style={{
                    padding: isMobileWidth ? "10px 26px" : "10px 37px",
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
    </>
  );
}

export default Profile;

// import { useState, useEffect } from "react";
// import AuthModal from "../../components/guest/authModal";
// import { useDispatch, useSelector } from "react-redux";
// import useProfile from "../../hooks/useProfile";
// import Autocomplete from "react-google-autocomplete";
// import Constant, { GOOGLE_KEY, imageBase, KEYS } from "../../config/Constant";
// import ForgotWithEmail from "../../components/guest/authProfileModals/EmailVerification";
// import PhoneVerification from "../../components/guest/authProfileModals/PhoneVerification";
// import ChangePassword from "../../components/guest/authProfileModals/ChangePassword";
// import Modal from "react-bootstrap/Modal";
// import { openPersona } from "../../store/slices/profileSlice";
// import AddCardView from "../../components/guest/AddCardView";

// import CardBankPayment from "../../components/host/cardBankPayment";
// import UpdatePhone from "../../components/guest/authProfileModals/UpdatePhone";
// import UpdateEmail from "../../components/guest/authProfileModals/UpdateEmail";
// import { Link, useNavigate } from "react-router-dom";
// import uploadImg from "../../assets/defaultContact.jpg";
// import cameraImg from "../../assets/gallery/camera.svg";
// import { setUserType, clearUser } from "../../store/slices/userSlice";
// import MobFooter from "../../components/MobFooter";
// import LanguageModal from "../LanguageModal";
// import { toast } from "react-toastify";

// function Profile() {
//   const { getUserProfile, ProfileImg, addHobby, deleteHobby, addPet, deletePet, addWork, deleteWork, deleteLanguage, addLanguage, addPlace, deletePlace, addAboutMe, addName, addStreet, addCity, addState, addZip } = useProfile();

//   const profileData = useSelector((state) => state.profile);
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const useTypes = localStorage.getItem("USER_TYPE");

//    const [isMobileWidth, setIsMobileWidth] = useState(false);

//     useEffect(() => {
//       const checkWindowWidth = () => {
//         setIsMobileWidth(window.innerWidth <= 768);
//       };

//       checkWindowWidth(); // run on mount
//       window.addEventListener("resize", checkWindowWidth);

//       return () => window.removeEventListener("resize", checkWindowWidth);
//     }, []);

//   const userId = userData?.user_id ? String(userData?.user_id) : null;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [aboutMe, setAboutMe] = useState(profileData?.profileData?.about_me);
//   const [isAddingAboutMe, setIsAddingAboutMe] = useState(false);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [isAddingName, setIsAddingName] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [switchToGuest, setSwitchToGuest] = useState(false);
//   const [switchToHost, setSwitchToHost] = useState(false);

//   const [showUpdatePhoneModal, setShowUpdateModal] = useState(false);

//   const [hobbies, setHobbies] = useState([]);
//   const [pets, setPets] = useState([]);
//   const [works, setWorks] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [places, setPlaces] = useState([]);
//   const [editingIndex, setEditingIndex] = useState({ type: null, index: null });
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [newHobby, setNewHobby] = useState("");
//   const [isAddingHobby, setIsAddingHobby] = useState(false);

//   const [newPet, setNewPet] = useState("");
//   const [isAddingPet, setIsAddingPet] = useState(false);

//   const [newWork, setNewWork] = useState("");
//   const [isAddingWork, setIsAddingWork] = useState(false);

//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [isAddingLanguage, setIsAddingLanguage] = useState(false);

//   const [selectedPlace, setSelectedPlace] = useState("");
//   const [isAddingPlace, setIsAddingPlace] = useState(false);

//   const [streetAddress, setStreetAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zipCode, setZipCode] = useState("");

//   const [isAddingStreet, setIsAddingStreet] = useState(false);
//   const [isAddingCity, setIsAddingCity] = useState(false);
//   const [isAddingState, setIsAddingState] = useState(false);
//   const [isAddingZip, setIsAddingZip] = useState(false);

//   const [verifyEmailModal, setVerifyEmailModal] = useState(false);
//   const [verifyPhoneModal, setVerifyPhoneModal] = useState(false);

//   const [updateEmailShow, setUpdateEmailShow] = useState(false);

//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

//   const [showFileUploadModal, setShowFileUploadModal] = useState(false);
//   const [preview, setPreview] = useState(null);

//   //  verified
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false);
//   const [isIdentityVerified, setIsIdentityVerified] = useState(false);
//   const [newLoginUserDetails, setNewLoginUserDetails] = useState();

//   useEffect(() => {
//     const handleGetProfile = async () => {
//       try {
//         const res = await getUserProfile({ user_id: userId });
//         setIsIdentityVerified(res?.data?.identity_verified);
//         setNewLoginUserDetails(res?.data);
//       } catch (error) {
//         // console.error("Error fetching user profile:", error);
//       }
//     };

//     handleGetProfile();
//   }, []);

//   useEffect(() => {
//     if (profileData?.profileData?.profile_image) {
//       setPreview(profileData?.profileData?.profile_image);
//     }
//     if (profileData?.profileData?.first_name) {
//       setFirstName(profileData?.profileData?.first_name);
//     }
//     if (profileData?.profileData?.last_name) {
//       setLastName(profileData?.profileData?.last_name);
//     }
//     if (profileData?.profileData?.about_me) {
//       setAboutMe(profileData.profileData.about_me);
//     }
//     if (profileData?.profileData?.hobbies) {
//       setHobbies(profileData.profileData.hobbies);
//     }
//     if (profileData?.profileData?.pets) {
//       setPets(profileData.profileData.pets);
//     }
//     if (profileData?.profileData?.my_work) {
//       setWorks(profileData.profileData.my_work);
//     }
//     if (profileData?.profileData?.languages) {
//       setLanguages(profileData.profileData.languages);
//     }
//     if (profileData?.profileData?.where_live) {
//       setPlaces(profileData.profileData.where_live);
//     }
//     if (profileData?.profileData?.street) {
//       setStreetAddress(profileData?.profileData?.street);
//     }
//     if (profileData?.profileData?.city) {
//       setCity(profileData.profileData.city);
//     }
//     if (profileData?.profileData?.state) {
//       setState(profileData.profileData.state);
//     }
//     if (profileData?.profileData?.zip_code) {
//       setZipCode(profileData.profileData.zip_code);
//     }

//     if (profileData?.profileData?.email) {
//       setEmail(profileData.profileData.email);
//     }

//     if (profileData?.profileData?.phone_number) {
//       setPhoneNumber(profileData.profileData.phone_number);
//     }

//     if (profileData?.profileData?.email_verified) {
//       setIsEmailVerified(true);
//     }

//     if (profileData?.profileData?.phone_verified) {
//       setIsPhoneVerified(true);
//     }

//     if (profileData?.profileData?.identity_verified) {
//       setIsIdentityVerified(true);
//     }
//   }, [profileData?.profileData]);

//   const handleAboutMeSubmit = async () => {
//     if (isAddingAboutMe) {
//       const trimmedLength = aboutMe.replace(/\s/g, "").length;
//       if (trimmedLength < 3 || trimmedLength > 20) {
//         toast.error("Please enter between 3 and 20 non-space characters.");
//         return;
//       }
//       await addAboutMe({ user_id: userId, about_me: aboutMe });
//       setIsAddingAboutMe(false);
//     } else {
//       setIsAddingAboutMe(true);
//     }
//   };

//   const handleNameSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await addName({
//         user_id: userId,
//         first_name: firstName,
//         last_name: lastName,
//       });

//       setIsAddingName(false); // Close the input after saving
//     } catch (error) {
//       console.error("Failed to add name:", error);
//       alert("There was an error saving your name. Please try again.");
//     }
//   };

//   const handleEdit = (type, index, value) => {
//     if (type === "hobby") {
//       const updatedList = [...hobbies];
//       updatedList[index] = value;
//       setHobbies(updatedList);
//     }
//     if (type === "pet") {
//       const updatedList = [...pets];
//       updatedList[index] = value;
//       setPets(updatedList);
//     }
//     if (type === "work") {
//       const updatedList = [...works];
//       updatedList[index] = value;
//       setWorks(updatedList);
//     }
//     setEditingIndex({ type, index });
//   };

//   const handleUpdate = async (type, index) => {
//     if (type === "hobby") {
//       await addHobby({ user_id: userId, index, hobby_name: hobbies[index] });
//     }
//     if (type === "pet") {
//       await addPet({ user_id: userId, index, pet_name: pets[index] });
//     }
//     if (type === "work") {
//       await addWork({ user_id: userId, index, work_name: works[index] });
//     }
//     setEditingIndex({ type: null, index: null });
//   };

//   const handleDelete = async (type, index) => {
//     if (type === "hobby") {
//       await deleteHobby({ user_id: userId, index }); // Call API action
//       setHobbies(hobbies.filter((_, i) => i !== index));
//     }
//     if (type === "pet") {
//       await deletePet({ user_id: userId, index });
//       setPets(pets.filter((_, i) => i !== index));
//     }
//     if (type === "work") {
//       await deleteWork({ user_id: userId, index });
//       setWorks(works.filter((_, i) => i !== index));
//     }
//     if (type === "language") {
//       await deleteLanguage({ user_id: userId, index });
//       setLanguages(languages.filter((_, i) => i !== index));
//     }
//     if (type === "place") {
//       await deletePlace({ user_id: userId, index });
//       setLanguages(places.filter((_, i) => i !== index));
//     }
//   };

//   const handleAdd = async (type) => {
//     if (type === "hobby" && newHobby.trim()) {
//       if (newHobby.length < 3 || newHobby.length > 20) {
//       toast.error("Please enter between 3 and 20 characters.");
//       return;
//     }
//         await addHobby({ user_id: userId, hobby_name: newHobby }); // Call API action
//         setHobbies([...hobbies, newHobby]);
//         setNewHobby("");
//         setIsAddingHobby(false);
//       }
//       if (type === "pet" && newPet.trim()) {
//         if (newPet.length < 3 || newPet.length > 20) {
//         toast.error("Please enter between 3 and 20 characters.");
//         return;
//       }
//         await addPet({ user_id: userId, pet_name: newPet }); // Call API action
//         setPets([...pets, newPet]);
//         setNewPet("");
//         setIsAddingPet(false);
//       }
//       if (type === "work" && newWork.trim()) {

//         if (newWork.length < 3 || newWork.length > 20) {
//         toast.error("Please enter between 3 and 20 characters.");
//         return;
//       }
//         await addWork({ user_id: userId, work_name: newWork }); // Call API action
//         setWorks([...works, newWork]);
//         setNewWork("");
//         setIsAddingWork(false);
//       }
//       if (
//         type === "language" &&
//         selectedLanguage &&
//         !languages.includes(selectedLanguage)
//       ) {
//         await addLanguage({ user_id: userId, language_name: selectedLanguage });
//         setLanguages([...languages, selectedLanguage]);
//         setSelectedLanguage("");
//         setIsAddingLanguage(false);
//       }
//       if (type === "place") {
//         await addPlace({ user_id: userId, place_name: selectedPlace });
//         setPlaces([...places, selectedPlace]);
//         setSelectedPlace("");
//         setIsAddingPlace(false);
//       }
//     };

//   const handleAddressSubmit = async (type) => {
//     if (type === "street") {
//       if (isAddingStreet) {
//         try {
//           await addStreet({ user_id: userId, street_address: streetAddress });
//           setIsAddingStreet(false);
//         } catch (error) {
//           console.error("Failed to add street:", error);
//         }
//       } else {
//         setIsAddingStreet(true);
//       }
//     }
//     if (type === "city") {
//       if (isAddingCity) {
//         await addCity({ user_id: userId, city: city });
//         setIsAddingCity(false);
//       } else {
//         setIsAddingCity(true);
//       }
//     }
//     if (type === "state") {
//       if (isAddingState) {
//         await addState({ user_id: userId, state: state });
//         setIsAddingState(false);
//       } else {
//         setIsAddingState(true);
//       }
//     }
//     if (type == "zip") {
//       if (isAddingZip) {
//         await addZip({ user_id: userId, zip_code: zipCode });
//         setIsAddingZip(false);
//       } else {
//         setIsAddingZip(true);
//       }
//     }
//   };

//   const maskPhoneNumber = (phone) => {
//     if (!phone) return "";
//     return phone.replace(/\d(?=\d{4})/g, "*");
//   };

//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];

//     if (!selectedFile) return;
//     const localPreview = URL.createObjectURL(selectedFile);    // Set a local preview immediately
//     setPreview(localPreview);

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("profile_image", selectedFile);

//     try {
//       const res = await ProfileImg(formData);
//       if (res?.data) {
//         setPreview(res?.data?.profile_image_url);
//       }
//     } catch (error) {
//       console.error("Error uploading profile image:", error);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(clearUser()); // Clear Redux user state
//     toast.success("Logout Successfully.")
//     navigate("/");
//     setShowLogoutModal(false);
//   };

//   useEffect(() => {
//     if (switchToGuest) {
//       dispatch(setUserType("guest"));
//       Constant.selectedFlow = "guest";
//       localStorage.setItem(KEYS.USER_TYPE, "guest");
//       navigate("/homeGuest");
//     }
//   }, [switchToGuest, dispatch, navigate]);

//   useEffect(() => {
//     if (switchToHost) {
//       dispatch(setUserType("host"));
//       Constant.selectedFlow = "host";
//       localStorage.setItem(KEYS.USER_TYPE, "host");
//       navigate("/");
//     }
//   }, [switchToHost, dispatch, navigate]);

//   const handleSwitch = (e) => {
//     e.preventDefault();
//     setSwitchToGuest(true);
//   };

//   const handleSwitch2 = (e) => {
//     e.preventDefault();
//     setSwitchToHost(true);
//   };

//   return (
//     <>
//       <main>
//         {/* <!-- MOBILE --> */}

//         <div
//           className="complete-your-profile"
//           style={{
//             backgroundColor: "white",
//             backgroundImage:
//               "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
//             backgroundSize: "20px 20px",
//             display: "flex",
//             flexDirection: "row", // Ensures children are arranged in a row
//             justifyContent: "space-between", // Adjust as needed
//             alignItems: "flex-start", // Align items to the top
//             padding: ! isMobileWidth ?"10px 30px 15px 30px":'0px'
//           }}
//         >
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-4 col-md-6">
//                 <div className="complete-your-profile-right">
//                   <div className="complete-your-profile-right-top">
//                     <div className="user-profile-upload-name">
//                       <div className="user-profile-upload">
//                         <div className="user-profile-upload-image">
//                           <img
//                             src={
//                               preview
//                                 ? typeof preview === "object"
//                                   ? `${imageBase + preview?.profile_image_url}`
//                                   : `${imageBase + preview}`
//                                 : uploadImg
//                             }
//                             style={{
//                               height: "100%",
//                               width: "100%",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                               border: "2px solid #D1D1D1",
//                             }}
//                           />
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => setShowFileUploadModal(true)}
//                         >
//                           <i className="fa-solid fa-pen"></i>
//                         </button>
//                       </div>
//                       <div className="user-profile-name">
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             gap: "9",
//                           }}
//                         >
//                           <h2>
//                             Hey{" "}
//                             {firstName && lastName
//                               ? `${firstName} ${lastName}`
//                               : useTypes == "host" ? "Host" : "Guest"}
//                             !
//                           </h2>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setIsAddingName(!isAddingName);
//                             }}
//                             style={{
//                               width: "30px",
//                               height: "30px",
//                               borderRadius: "50%",
//                               backgroundColor: "#4aeab1",
//                               color: "#3a4b4c",
//                               fontSize: "14px",
//                               border: "3px solid #fff",
//                             }}
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>
//                         </div>
//                         {isAddingName && (
//                           <div className="user-name-dropdown">
//                             <form onSubmit={handleNameSubmit}>
//                               <div
//                                 className="user-profile-upload-image"
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   position: "relative",
//                                   marginBottom: "5px"
//                                 }}
//                               >
//                                 <img
//                                   src={
//                                     preview
//                                       ? imageBase +
//                                         (preview?.profile_image_url
//                                           ? preview?.profile_image_url
//                                           : preview)
//                                       : "/images/nav-section/user-profile1.png"
//                                   }
//                                   style={{
//                                     width: "100px",
//                                     height: "100px",
//                                     borderRadius: "100%",
//                                   }}
//                                 />
//                                 <div
//                                 // type="submit"
//                                 style={{
//                                   position: "absolute",
//                                   bottom: "1px",
//                                   right: "35%",
//                                   width: "25px",
//                                   height: "25px",
//                                   borderRadius: "50%",
//                                   backgroundColor: "#4aeab1",
//                                   color: "#3a4b4c",
//                                   fontSize: "12px",
//                                   border: "2px solid #fff",
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   // cursor: "pointer",
//                                 }}><i className="fa-solid fa-check"></i></div>
//                               </div>
//                               <label>
//                                 <input
//                                   type="text"
//                                   placeholder="First name*"
//                                   value={firstName}
//                                   onChange={(e) => setFirstName(e.target.value)}
//                                   required
//                                 />
//                                 <input
//                                   type="text"
//                                   placeholder="Last name*"
//                                   value={lastName}
//                                   onChange={(e) => setLastName(e.target.value)}
//                                   required
//                                 />
//                               </label>
//                               <input
//                                 type="submit"
//                                 value="Save Changes"
//                               />
//                             </form>
//                           </div>
//                         )}

//                         <p>
//                           {useTypes === "host" ? "Host" : "Guest"}
//                           <span className="info-wrap">
//                             <img
//                               src="/images/create-profile/info.svg"
//                               loading="lazy" alt="info-wrap"
//                             />
//                             <span className="info-in">
//                               Before you can book or host on the platform the
//                               name on Id must match verification documents.
//                             </span>
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="complete-your-profile-right-bottom">
//                     <div className="complete-your-profile-right-bottom-in">
//                       <div className="complete-your-profile-right-bottom-image">
//                         <img
//                           src="/images/create-profile/mail.svg"
//                           loading="lazy" alt="info-wrap"
//                         />
//                       </div>
//                       <div className="complete-your-profile-right-bottom-data">
//                         <h1>Email Address</h1>
//                         {isEmailVerified ? (
//                           <p>
//                             Verified <i className="fa-solid fa-badge-check"></i>
//                           </p>
//                         ) : (
//                           <a
//                             onClick={() => setVerifyEmailModal(true)}
//                             style={{ cursor: "pointer" }}
//                           >
//                             <u>Confirm now</u>
//                           </a>
//                         )}

//                       </div>
//                     </div>
//                     <div className="complete-your-profile-right-bottom-in">
//                       <div className="complete-your-profile-right-bottom-image">
//                         <img
//                           src="/images/create-profile/call.svg"
//                           loading="lazy" alt="complete-your-profile-right-bottom"
//                         />
//                       </div>
//                       <div className="complete-your-profile-right-bottom-data">
//                         <h1>Phone Number</h1>
//                         {isPhoneVerified ? (
//                           <p>
//                             Verified <i className="fa-solid fa-badge-check"></i>
//                           </p>
//                         ) : (
//                           <a
//                             onClick={() => {
//                               setVerifyPhoneModal(true);
//                             }}
//                             style={{ cursor: "pointer" }}
//                           >
//                             <u>Confirm now</u>
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                     <div className="complete-your-profile-right-bottom-in">
//                       <div className="complete-your-profile-right-bottom-image">
//                         <img
//                           src="/images/create-profile/identity.svg"
//                           loading="lazy" alt="complete-your-profile-right-bottom"
//                         />
//                       </div>
//                       <div className="complete-your-profile-right-bottom-data">
//                         <h1>Verify identity</h1>
//                         {newLoginUserDetails?.identity_verified == "1" ||
//                         profileData?.personaStatus === "approved" ||
//                         profileData?.personaStatus === "completed" ? (
//                           <p>
//                             Verified <i className="fa-solid fa-badge-check"></i>
//                           </p>
//                         ) : (
//                           <a
//                             style={{ cursor: "pointer" }}
//                             onClick={() => dispatch(openPersona())}
//                           >
//                             <u>Confirm now</u>
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-8 col-md-6 order-lg-first">
//                 <div className="complete-your-profile-left">
//                   <form onSubmit={(e) => e.preventDefault()}>
//                     <h2>
//                       About Me{" "}
//                       <button
//                         type="button"
//                         className={`${isAddingAboutMe ? "check" : ""}`}
//                         onClick={handleAboutMeSubmit}
//                       >
//                         <i
//                           className={`fa-solid ${
//                             isAddingAboutMe ? "fa-check" : "fa-pen"
//                           }`}
//                         ></i>
//                       </button>
//                     </h2>
//                     <div className="about-me">
//                       <textarea
//                         value={aboutMe}
//                         onChange={(e) => setAboutMe(e.target.value)}
//                         disabled={!isAddingAboutMe}
//                       />
//                     </div>
//                     <div className="user-data-list-wrap">
//                       <h2>Where I live*</h2>
//                       <div className="user-data-list-inner">
//                         {places.map((location, index) => (
//                           <div key={index} className="user-data-list-item" style={{width: "fit-content" }}>
//                             <input
//                               type="text"
//                               placeholder="Enter your location"
//                               value={location}
//                               disabled
//                               style={{ width: "fit-content" }}
//                             />
//                             <button type="button" onClick={() => handleDelete("place", index)} >
//                               <i className="fa-solid fa-xmark"></i>
//                             </button>
//                             <div className="user-data-list-dropdown">
//                               <ul>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/filters/where-icons.svg"
//                                       loading="lazy" alt="where-src-item"
//                                     />
//                                     Alaska, US
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/filters/where-icons.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     California, US
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/filters/where-icons.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     Delaware, US
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/filters/where-icons.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     Florida, US
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/filters/where-icons.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     New York, US
//                                   </a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         ))}
//                         {isAddingPlace && (
//                           <div className="user-data-list-item">
//                             <Autocomplete
//                               apiKey={GOOGLE_KEY}
//                               onPlaceSelected={(place) =>
//                                 setSelectedPlace(place.formatted_address)
//                               }
//                               options={{
//                                 types: ["(cities)"],
//                               }}
//                               placeholder="Search for a place..."
//                               className="google-autocomplete"
//                               style={{ padding: "8px", borderRadius: "20px" }}
//                             />
//                             {selectedPlace && (
//                               <button
//                                 type="button"
//                                 className="check"
//                                 onClick={() => handleAdd("place")}
//                               >
//                                 <i className="fa-solid fa-check"></i>
//                               </button>
//                             )}
//                             {!selectedPlace && (
//                               <button
//                                 type="button"
//                                 onClick={() => setIsAddingPlace(false)}
//                               >
//                                 <i className="fa-solid fa-xmark"></i>
//                               </button>
//                             )}
//                           </div>
//                         )}
//                         {!isAddingPlace && places.length <= 1 && (
//                           <button
//                             type="button"
//                             className="add-new-btn"
//                             onClick={() => setIsAddingPlace(true)}
//                           >
//                             Add New <i className="fa-solid fa-plus"></i>
//                           </button>
//                         )}
//                         {/* <button type="button" className="add-new-btn">
//                           Add New <i className="fa-solid fa-plus"></i>
//                         </button> */}
//                       </div>
//                       <h2>My work</h2>
//                       <div className="user-data-list-inner">
//                         {works.map((work, index) => (
//                           <div
//                             className="user-data-list-item my-work"
//                             key={`${index}`}
//                           >
//                             <input
//                               type="text"
//                               placeholder="Lawyer"
//                               value={work}
//                               // maxLength={10}
//                               onChange={(e) =>
//                                 handleEdit("work", index, e.target.value)
//                               }
//                             />
//                             <button
//                               style={{ marginLeft: "50%" }}
//                               type="button"
//                               className={`${
//                                 editingIndex.type === "work" &&
//                                 editingIndex.index === index
//                                   ? "check"
//                                   : "icon-btn"
//                               }`}
//                               onClick={() =>
//                                 editingIndex.type === "work" &&
//                                 editingIndex.index === index
//                                   ? handleUpdate("work", index)
//                                   : handleDelete("work", index)
//                               }
//                             >
//                               <i
//                                 className={`fa-solid ${
//                                   editingIndex.type === "work" &&
//                                   editingIndex.index === index
//                                     ? "fa-check"
//                                     : "fa-xmark"
//                                 }`}
//                               ></i>
//                             </button>
//                             <div className="user-data-list-dropdown">
//                               <ul>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/create-profile/list-icons/work.svg"
//                                       loading="lazy" alt="work"
//                                     />
//                                     Lawyer
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/create-profile/list-icons/work.svg"
//                                       loading="lazy" alt="Lawyer"
//                                     />
//                                     Lawyer
//                                   </a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         ))}
//                         {isAddingWork && (
//                           <div className="user-data-list-item my-work">
//                             <input
//                               type="text"
//                               value={newWork}
//                               onChange={(e) => setNewWork(e.target.value)}
//                             />
//                             {newWork !== "" && (
//                               <button
//                                 type="button"
//                                 className="icon-btn check"
//                                 onClick={() => handleAdd("work")}
//                               >
//                                 <i className="fa-solid fa-check"></i>
//                               </button>
//                             )}
//                             {newWork == "" && (
//                               <button
//                                 type="button"
//                                 className="icon-btn"
//                                 onClick={() => setIsAddingWork(false)}
//                               >
//                                 <i className="fa-solid fa-xmark"></i>
//                               </button>
//                             )}
//                           </div>
//                         )}
//                         {!isAddingWork && works.length <= 1 && (
//                           <button
//                             type="button"
//                             className="add-new-btn"
//                             onClick={() => setIsAddingWork(true)}
//                           >
//                             Add New <i className="fa-solid fa-plus"></i>
//                           </button>
//                         )}
//                       </div>
//                       <h2>Languages I speak*</h2>
//                       <div className="user-data-list-inner" style={{flexWrap: isMobileWidth ? 'nowrap' : 'wrap'}}>
//                         {languages.map((language, index) => (
//                           <div className="user-data-list-item languages" key={index} >
//                             <input type="text" value={language} readOnly />
//                             <button
//                               type="button"
//                               onClick={() => handleDelete("language", index)}
//                             >
//                               <i className="fa-solid fa-xmark"></i>
//                             </button>
//                             <div className="user-data-list-dropdown">
//                               <ul>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/create-profile/list-icons/languages.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     English
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/create-profile/list-icons/languages.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     English
//                                   </a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         ))}
//                         {isAddingLanguage && languages.length <= 1 && (
//                           <div className="user-data-list-item languages">

//                             <input
//                               type="text"
//                               value={selectedLanguage}
//                               data-bs-target="#language-popup"
//                               data-bs-toggle="modal"
//                               placeholder="Select a language"
//                             />

//                             {selectedLanguage !== "" && (
//                               <button
//                                 type="button"
//                                 className="check"
//                                 onClick={() => handleAdd("language")}
//                               >
//                                 <i className="fa-solid fa-check"></i>
//                               </button>
//                             )}
//                             {selectedLanguage === "" && (
//                               <button
//                                 type="button"
//                                 className="icon-btn"
//                                 onClick={() => setIsAddingLanguage(false)}
//                               >
//                                 <i className="fa-solid fa-xmark"></i>
//                               </button>
//                             )}
//                           </div>
//                         )}
//                         {!isAddingLanguage && languages.length <= 1 && (
//                           <button
//                             type="button"
//                             className="add-new-btn"
//                             data-bs-target="#language-popup"
//                             data-bs-toggle="modal"
//                             onClick={() => setIsAddingLanguage(true)}
//                           >
//                             Add New <i className="fa-solid fa-plus"></i>
//                           </button>
//                         )}
//                       </div>
//                       <h2>Hobbies</h2>
//                       <div className="user-data-list-inner">
//                         {hobbies.map((hobby, index) => (
//                           <div
//                             key={index}
//                             className="user-data-list-item hobbies"
//                           >
//                             <input
//                               type="text"
//                               value={hobbies[index]}
//                               onChange={(e) =>
//                                 handleEdit("hobby", index, e.target.value)
//                               }
//                               placeholder="Hobbies"
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 editingIndex.type === "hobby" &&
//                                 editingIndex.index === index
//                                   ? handleUpdate("hobby", index)
//                                   : handleDelete("hobby", index)
//                               }
//                               className={`${
//                                 editingIndex.type === "hobby" &&
//                                 editingIndex.index === index
//                                   ? "check"
//                                   : "icon-btn"
//                               }`}
//                             >
//                               <i
//                                 className={`fa-solid ${
//                                   editingIndex.type === "hobby" &&
//                                   editingIndex === index
//                                     ? "fa-check"
//                                     : "fa-xmark"
//                                 }`}
//                               ></i>
//                             </button>
//                             <div className="user-data-list-dropdown">
//                               <ul>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/create-profile/list-icons/hobbies.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     Sports
//                                   </a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>
//                                     <img
//                                       src="/images/create-profile/list-icons/hobbies.svg"
//                                       loading="lazy" alt=""
//                                     />
//                                     Sports
//                                   </a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         ))}
//                         {isAddingHobby && (
//                           <div className="user-data-list-item hobbies">
//                             <input
//                               type="text"
//                               value={newHobby}
//                               onChange={(e) => setNewHobby(e.target.value)}
//                             />
//                             {newHobby != "" && (
//                               <button
//                                 type="button"
//                                 className="check"
//                                 onClick={() => handleAdd("hobby")}
//                               >
//                                 <i className="fa-solid fa-check"></i>
//                               </button>
//                             )}
//                             {newHobby === "" && (
//                               <button
//                                 type="button"
//                                 className="icon-btn"
//                                 onClick={() => setIsAddingHobby(false)}
//                               >
//                                 <i className="fa-solid fa-xmark"></i>
//                               </button>
//                             )}
//                           </div>
//                         )}
//                         {!isAddingHobby && hobbies.length <= 1 && (
//                           <button
//                             type="button"
//                             className="add-new-btn"
//                             onClick={() => setIsAddingHobby(true)}
//                           >
//                             Add New <i className="fa-solid fa-plus"></i>
//                           </button>
//                         )}
//                       </div>
//                       <h2>Pets</h2>
//                       <div className="user-data-list-inner">
//                         {pets.map((pet, index) => (
//                           <div
//                             className="user-data-list-item pets"
//                             key={`index` + index}
//                           >
//                             <input
//                               type="text"
//                               placeholder="Pets"
//                               value={pet}
//                               onChange={(e) =>
//                                 handleEdit("pet", index, e.target.value)
//                               }
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 editingIndex.type === "pet" &&
//                                 editingIndex.index === index
//                                   ? handleUpdate("pet", index)
//                                   : handleDelete("pet", index)
//                               }
//                               className={`${
//                                 editingIndex.type === "pet" &&
//                                 editingIndex.index === index
//                                   ? "check"
//                                   : "icon-btn"
//                               }`}
//                             >
//                               <i
//                                 className={`fa-solid ${
//                                   editingIndex.type === "pet" &&
//                                   editingIndex.index === index
//                                     ? "fa-check"
//                                     : "fa-xmark"
//                                 }`}
//                               ></i>
//                             </button>
//                             <div className="user-data-list-dropdown">
//                               <ul>
//                                 <li className="where-src-item">
//                                   <a>Dog</a>
//                                 </li>
//                                 <li className="where-src-item">
//                                   <a>Dog</a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         ))}
//                         {isAddingPet && (
//                           <div className="user-data-list-item pets">
//                             <input
//                               type="text"
//                               value={newPet}
//                               onChange={(e) => setNewPet(e.target.value)}
//                             />
//                             {newPet !== "" && (
//                               <button
//                                 type="button"
//                                 className="check"
//                                 onClick={() => handleAdd("pet")}
//                               >
//                                 <i className="fa-solid fa-check"></i>
//                               </button>
//                             )}
//                             {newPet === "" && (
//                               <button
//                                 type="button"
//                                 className="icon-btn"
//                                 onClick={() => setIsAddingPet(false)}
//                               >
//                                 <i className="fa-solid fa-xmark"></i>
//                               </button>
//                             )}
//                           </div>
//                         )}
//                         {!isAddingPet && pets.length <= 1 && (
//                           <button
//                             type="button"
//                             className="add-new-btn"
//                             onClick={() => setIsAddingPet(true)}
//                           >
//                             Add New <i className="fa-solid fa-plus"></i>
//                           </button>
//                         )}
//                       </div>
//                       <h2>Email</h2>
//                       <div className="user-data-list-inner">
//                         <div className="user-data-list-item input-field">
//                           <input
//                             type="text"
//                             placeholder="Enter Your Email"
//                             value={email}
//                             disabled
//                           />
//                           <button
//                             type="button"
//                             className="edit-field"
//                             onClick={() => setUpdateEmailShow(true)}
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>
//                         </div>
//                       </div>
//                       <h2>Phone Number</h2>
//                       <div className="user-data-list-inner">
//                         <div className="user-data-list-item input-field">
//                           <input
//                             type="text"
//                             placeholder="Enter Your Phone Number"
//                             defaultValue={maskPhoneNumber(phoneNumber)}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="edit-field"
//                             onClick={() => setShowUpdateModal(true)}
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>
//                         </div>
//                       </div>
//                       <h2>Password</h2>
//                       <div className="user-data-list-inner">
//                         <div className="user-data-list-item input-field">
//                           <input
//                             type="password"
//                             placeholder="Enter Your Password"
//                             defaultValue="***********"
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="edit-field"
//                             onClick={() => setShowChangePasswordModal(true)}
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>
//                         </div>
//                       </div>
//                       <h2>Mailing Address</h2>
//                       <div
//                         className="user-data-list-inner mailing-address-wrap"
//                         style={{
//                           display: "flex",
//                           gap: "10px",
//                           flex: "flex-start",
//                         }}
//                       >
//                         <div className="user-data-list-item input-field">
//                           <input
//                             type="text"
//                             value={streetAddress}
//                             disabled={!isAddingStreet}
//                             onChange={(e) => setStreetAddress(e.target.value)}
//                             placeholder="Street"
//                           />
//                           <button
//                             type="button"
//                             className={`${
//                               isAddingStreet ? "check" : "edit-field"
//                             }`}
//                             onClick={() => handleAddressSubmit("street")}
//                           >
//                             <i
//                               className={`fa-solid ${
//                                 isAddingStreet ? "fa-check" : "fa-pen"
//                               }`}
//                             ></i>
//                           </button>
//                         </div>
//                         <div
//                           className="user-data-list-item input-field"
//                           style={{ marginLeft: "40px", margin: "0" }}
//                         >
//                           <input
//                             type="text"
//                             value={city}
//                             disabled={!isAddingCity}
//                             onChange={(e) => setCity(e.target.value)}
//                             placeholder="City"
//                           />
//                           <button
//                             type="button"
//                             className={`${
//                               isAddingCity ? "check" : "edit-field"
//                             }`}
//                             onClick={() => handleAddressSubmit("city")}
//                           >
//                             <i
//                               className={`fa-solid ${
//                                 isAddingCity ? "fa-check" : "fa-pen"
//                               }`}
//                             ></i>
//                           </button>
//                         </div>
//                         <div className="user-data-list-item input-field">
//                           <input
//                             type="text"
//                             value={state}
//                             disabled={!isAddingState}
//                             onChange={(e) => setState(e.target.value)}
//                             placeholder="State"
//                           />
//                           <button
//                             type="button"
//                             className={`${
//                               isAddingState ? "check" : "edit-field"
//                             }`}
//                             onClick={() => handleAddressSubmit("state")}
//                           >
//                             <i
//                               className={`fa-solid ${
//                                 isAddingState ? "fa-check" : "fa-pen"
//                               }`}
//                             ></i>
//                           </button>
//                         </div>
//                         <div
//                           className="user-data-list-item input-field"
//                           style={{ marginLeft: "40px", margin: "0" }}
//                         >
//                           <input
//                             type="text"
//                             value={zipCode}
//                             disabled={!isAddingZip}
//                             onChange={(e) => setZipCode(e.target.value)}
//                             placeholder="Zip Code"
//                           />
//                           <button
//                             type="button"
//                             className={`${
//                               isAddingZip ? "check" : "edit-field"
//                             }`}
//                             onClick={() => handleAddressSubmit("zip")}
//                           >
//                             <i
//                               className={`fa-solid ${
//                                 isAddingZip ? "fa-check" : "fa-pen"
//                               }`}
//                             ></i>
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     <AddCardView />
//                     {useTypes === "host" && <CardBankPayment />}
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <!-- MOBILE --> */}
//         {useTypes === "guest" ? (
//           <div className="mob-profile-bottom">
//             <div className="container-fluid">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="mob-profile-bottom-in">
//                     <h2>Useful Pages</h2>
//                     <ul>
//                       <li>
//                         <Link to="/notifications">
//                           <img
//                             src="/images/create-profile/mob-profile/1.svg"
//                             loading="lazy" alt=""
//                           />
//                           Notifications
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                     <h2>Support</h2>
//                     <ul>
//                       <li>
//                         <Link to="/helpCenter">
//                           <img
//                             src="/images/create-profile/mob-profile/2.svg"
//                             loading="lazy" alt=""
//                           />
//                           Visit the Help Center
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/feedback">
//                           <img
//                             src="/images/create-profile/mob-profile/3.svg"
//                             loading="lazy" alt=""
//                           />
//                           Give us feedback
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                     <h2>Legal</h2>
//                     <ul>
//                       <li>
//                         <Link to="/terms-condition">
//                           <img
//                             src="/images/create-profile/mob-profile/4.svg"
//                             loading="lazy" alt=""
//                           />
//                           Terms of services
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/privacy-policy">
//                           <img
//                             src="/images/create-profile/mob-profile/4.svg"
//                             loading="lazy" alt=""
//                           />
//                           Privacy policy
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>

//                       <li>
//                         <Link to="/faq">
//                           <img
//                             src="/images/create-profile/mob-profile/4.svg"
//                             loading="lazy" alt=""
//                           />
//                           FAQ's
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                     <div className="mob-profile-bottom-in-btns">
//                       <button
//                         type="button"
//                         onClick={() => setShowLogoutModal(true)}
//                       >
//                         <img
//                           src="/images/create-profile/mob-profile/logout.svg"
//                           loading="lazy" alt=""
//                         />
//                         Logout
//                       </button>

//                       <Link onClick={handleSwitch2}>Switch to host</Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="mob-profile-bottom">
//             <div className="container-fluid">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="mob-profile-bottom-in">
//                     <h2>Useful Pages</h2>
//                     <ul>
//                       <li>
//                         <Link to="/payment-host">
//                           <img src="/images/notifications/1.svg" loading="lazy" alt="" />
//                           Payments and Withdrawals
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/booking">
//                           <img
//                             src="/images/create-profile/mob-profile/booking.svg"
//                             loading="lazy" alt="booking"
//                           />
//                           Bookings
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/homeHost">
//                           <img
//                             src="/images/create-profile/mob-profile/create-listing.svg"
//                             loading="lazy" alt="create-listing"
//                           />
//                           Create New Listing
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <a
//                           href="#"
//                           data-bs-target="#language-popup"
//                           data-bs-toggle="modal"
//                         >
//                           <img
//                             src="/images/create-profile/languages.svg"
//                             loading="lazy" alt="languages"
//                           />
//                           Language
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </a>
//                       </li>

//                       <li>
//                         <Link to="/notifications">
//                           <img
//                             src="/images/create-profile/mob-profile/1.svg"
//                             loading="lazy" alt="mob-profile"
//                           />
//                           Notifications
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                     <h2>Support</h2>
//                     <ul>
//                       <li>
//                         <Link to="/helpCenter" state={{ useTypes: "host" }}>
//                           <img
//                             src="/images/create-profile/mob-profile/2.svg"
//                             loading="lazy" alt="helpCenter"
//                           />
//                           Visit the Help Center
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/feedback">
//                           <img
//                             src="/images/create-profile/mob-profile/3.svg"
//                             loading="lazy" alt="feedback"
//                           />
//                           Give us feedback
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                     <h2>Legal</h2>
//                     <ul>
//                       <li>
//                         <Link to="/terms-condition">
//                           <img
//                             src="/images/create-profile/mob-profile/4.svg"
//                             loading="lazy" alt="terms-condition"
//                           />
//                           Terms of services
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/privacy-policy">
//                           <img
//                             src="/images/create-profile/mob-profile/4.svg"
//                             loading="lazy" alt="privacy-policy"
//                           />
//                           Privacy policy
//                           <i className="fa-solid fa-chevron-right"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                     <div className="mob-profile-bottom-in-btns">
//                       <button
//                         type="button"
//                         onClick={() => setShowLogoutModal(true)}
//                       >
//                         <img
//                           src="/images/create-profile/mob-profile/logout.svg"
//                           loading="lazy" alt="logout"
//                         />
//                         Logout
//                       </button>

//                       <Link onClick={handleSwitch}>Switch to Guest</Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         <MobFooter />
//         {/* <!-- MOBILE --> */}
//       </main>
//     <Modal
//   show={showFileUploadModal}
//   onHide={() => setShowFileUploadModal(false)}
//    centered
//   className="custom-modal"
// >
//   <style>
//     {`

// .custom-modal {
//   position: fixed;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   width: 100%;
//   background-color: rgba(0, 0, 0, 0.5); /* Optional overlay */
//   display: flex;
//   justify-content: center; /* Center the modal-dialog */
//   align-items: flex-end;   /* Push to bottom */
//   z-index: 1050;
// }

//       .custom-modal .modal-dialog {
//         width: 30%;
//         margin: auto;
//         display: flex;
//         align-items: center;
//         justify-content: center;

//       }

//       .btn-close {
//         width: 10px;
//         height: 10px;
//         background: #3A4B4C;
//         border-radius: 50%;
//         opacity: 1;
//         position: relative;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }

//       .btn-close::after {
//         content: '×';
//         color: #fff;
//         font-weight: 500;
//         font-size: 20px;
//         line-height: 1;
//       }

//       .upload-options {
//         display: flex;
//         justify-content: center;
//         gap: 40px;
//         margin-top: 30px;
//         flex-wrap: wrap;
//       }

//       .upload-option {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         cursor: pointer;
//       }

//       .upload-option img {
//         width: 50px;
//         height: 50px;
//         object-fit: contain;
//         margin-bottom: 8px;
//       }

//       .upload-option span {
//         font-size: 14px;
//         font-weight: 500;
//         color: #333;
//       }

//       /* ---------- RESPONSIVE STYLES FOR MOBILE ---------- */
//       @media (max-width: 576px) {

//         .custom-modal .modal-dialog {
//           width: 100% !important;  /* Full width on small screens */
//           margin: 0 auto;

//         }

//  .custom-modal .modal-dialog {
//   width: 100% !important;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   justify-content: end;
//   border: none;
//   border-radius: 0;
// }

// .custom-modal .modal-dialog .modal-content {
//   border: none !important;
//   border-radius: 0 !important;
//   box-shadow: none !important; /* Optional: remove shadow too */
//   padding:0 !important;
// }

//  .btn-close {
//        display:none !important;
//       }

//         .upload-options {
//           gap: 100px;
//         margin-top:0px;
//         }

//         .upload-option img {
//           width: 40px;           /* Slightly smaller icons */
//           height: 40px;
//         }

//         .upload-option span {
//           font-size: 13px;       /* Adjust font size */
//         }

//         .modal-content {
//           padding: 10px;
//         }

//         .modal-header {
//           padding: 8px 10px;
//         }

//         .modal-title {
//           font-size: 16px !important;
//         }
//       }
//     `}
//   </style>

//   <Modal.Header
//     className="profile-close-btn"
//     closeButton
//     style={{ border: "none", padding: "10px", fontWeight: "500" }}
//   />

//   <Modal.Title
//     className="w-100 text-center"
//     style={{ fontSize: "18px", marginTop: "10px" }}
//   >
//     Add Profile picture
//   </Modal.Title>

//   <hr style={{ width: "80%", margin: "10px auto" }} />

//   <Modal.Body className="text-center">
//     <div className="upload-options" htmlFor="camera-input">
//       <label htmlFor="camera-input" className="upload-option">
//         <img src={cameraImg} loading="lazy" alt="Upload" />
//         <span>Take Photo</span>
//         <input
//           id="camera-input"
//           type="file"
//           accept="image/*"
//           capture="user"
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />
//       </label>

//       <label htmlFor="file-upload" className="upload-option">
//         <img
//           style={{ borderRadius: "50%" }}
//           src={
//             preview
//               ? typeof preview === "object"
//                 ? `${imageBase + preview?.profile_image_url}`
//                 : `${imageBase + preview}`
//               : uploadImg
//           }
//           loading="lazy" alt="Upload"
//         />
//         <span>Upload from Device</span>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//       </label>
//     </div>
//   </Modal.Body>
// </Modal>

//       <ForgotWithEmail
//         USERID={userId}
//         show={verifyEmailModal}
//         handleClose={() => setVerifyEmailModal(false)}
//       />

//       <UpdateEmail
//         USERID={userId}
//         show={updateEmailShow}
//         handleClose={() => setUpdateEmailShow(false)}
//       />
//       <PhoneVerification
//         USERID={userId}
//         show={verifyPhoneModal}
//         handleClose={() => setVerifyPhoneModal(false)}
//       />
//       <ChangePassword
//         show={showChangePasswordModal}
//         showChangePasswordModal={showChangePasswordModal}
//         setShowChangePasswordModal={setShowChangePasswordModal}
//         setShowSuccess={setShowSuccess}
//         handleClose={() => {
//           setShowChangePasswordModal(false);
//         }}
//       />

//       <UpdatePhone
//         USERID={userId}
//         show={showUpdatePhoneModal}
//         handleClose={() => setShowUpdateModal(false)}
//       />

//       <LanguageModal
//         isProfile={true}
//       />
//       <AuthModal />

//       {showSuccess && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 2,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: "30px",
//               borderRadius: "16px",
//               width: "380px",
//               textAlign: "center",
//               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//               position: "relative",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <button
//               onClick={() => setShowSuccess(false)}
//               style={{
//                 position: "absolute",
//                 top: "15px",
//                 right: "15px",
//                 backgroundColor: "#2D3E3F", // Dark circle background
//                 color: "white",
//                 border: "none",
//                 width: "20px",
//                 height: "20px",
//                 borderRadius: "50%", // Makes it circular
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Slight shadow for depth
//               }}
//             >

//               x
//             </button>

//             <h2 style={{ fontWeight: "600", fontSize: "22px" }}>Success</h2>
//             <div
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "50%",
//                 width: "100px",
//                 height: "100px",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 margin: "15px 0",
//                 boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", // Soft shadow around the circle
//               }}
//             >
//               <svg
//                 width="48"
//                 height="37.65"
//                 viewBox="0 0 48 37"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M2 20L16 34L46 2"
//                   stroke="#4AEAB1"
//                   strokeWidth="4"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>

//             <p
//               style={{ color: "#333", fontSize: "14px", marginBottom: "20px" }}
//             >
//               Your password has been changed successfully.
//             </p>

//             <button
//               onClick={() => setShowSuccess(false)}
//               style={{
//                 backgroundColor: "#4AEAB1",
//                 color: "black",
//                 border: "none",
//                 width: "60%",
//                 fontWeight: "600",
//                 padding: "12px 0",
//                 borderRadius: "30px",
//                 fontSize: "16px",
//                 cursor: "pointer",
//               }}
//             >
//               Okay
//             </button>
//           </div>
//         </div>
//       )}

//       {showLogoutModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1050,
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               borderRadius: "13px",
//               backgroundColor: "white",
//               padding: "20px",
//               maxWidth: "350px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//               }}
//             >
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 style={{
//                   background: "black",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "50%",
//                   width: "25px",
//                   height: "25px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   cursor: "pointer",
//                 }}
//               >
//                 &times;
//               </button>
//             </div>

//             <div style={{ textAlign: "center", padding: "0 20px" }}>
//               <h3
//                 style={{
//                   fontWeight: "400",
//                   fontSize: "28px",
//                   color: "#000000",
//                   marginBottom: "10px",
//                   fontFamily: "sans-serif poppins",
//                 }}
//               >
//                 Logout
//               </h3>

//               <div style={{ margin: "20px 0" }}>
//                 <img
//                   src="/images/popups/logout.svg"
//                   loading="lazy" alt="Logout"
//                   style={{
//                     width: "90px",
//                     height: "90px",
//                     marginBottom: "20px",
//                   }}
//                 />
//               </div>

//               <p style={{ marginBottom: "30px" }}>
//                 Are you sure you want to logout?
//               </p>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: "15px",
//                   marginBottom: "20px",
//                 }}
//               >
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     padding: "10px 50px",
//                     borderRadius: "50px",
//                     border: "none",
//                     backgroundColor: "#4AEAB1",
//                     color: "#000",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setShowLogoutModal(false);
//                   }}
//                   style={{
//                     padding: "10px 37px",
//                     border: "1px solid #4AEAB1",
//                     borderRadius: "50px",
//                     backgroundColor: "#fff",
//                     color: "#000",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Profile;
