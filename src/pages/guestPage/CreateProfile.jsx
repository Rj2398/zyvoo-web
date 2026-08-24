import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import AuthModal from "../../components/guest/authModal";
import { useDispatch, useSelector } from "react-redux";
import useProfile from "../../hooks/useProfile";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_KEY, imageBase, KEYS } from "../../config/Constant";
import EmailVerification from "../../components/guest/authProfileModals/EmailVerification";
import PhoneVerification from "../../components/guest/authProfileModals/PhoneVerification";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { openPersona } from "../../store/slices/profileSlice";
import uploadImg from "../../assets/gallery/upload.png";
import cameraImg from "../../assets/gallery/camera.svg";

const availableLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Ukrainian",
  "Polish",
  "Turkish",
  "Greek",
  "Hungarian",
  "Romanian",
  "Mandarin Chinese",
  "Cantonese",
  "Japanese",
  "Korean",
  "Vietnamese",
  "Thai",
  "Hindi",
  "Bengali",
  "Urdu",
  "Punjabi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Arabic",
  "Persian (Farsi)",
  "Hebrew",
  "Pashto",
  "Kurdish",
  "Swahili",
  "Hausa",
  "Yoruba",
  "Igbo",
  "Zulu",
  "Amharic",
  "Tagalog",
  "Malay",
  "Indonesian",
  "Burmese",
  "Khmer",
  "Lao",
];

const CreateProfile = () => {
  const { userInfo } = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const routedData = location.state || {};
  const { getUserProfile, complete_profile, deleteLanguage } = useProfile();

  const profileData = useSelector((state) => state.profile);
  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id || userData?.user_id;

  const [aboutMe, setAboutMe] = useState();
  const [isAddingAboutMe, setIsAddingAboutMe] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isAddingName, setIsAddingName] = useState(false);
  const [hobbies, setHobbies] = useState([]);
  const [pets, setPets] = useState([]);
  const [works, setWorks] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [places, setPlaces] = useState([]);
  const [editingIndex, setEditingIndex] = useState({ type: null, index: null });
  const [newHobby, setNewHobby] = useState("");
  const [isAddingHobby, setIsAddingHobby] = useState(false);
  const [newPet, setNewPet] = useState("");
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [newWork, setNewWork] = useState("");
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const [verifyEmailModal, setVerifyEmailModal] = useState(false);
  const [verifyPhoneModal, setVerifyPhoneModal] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [showNameEditModal, setShowNameEditModal] = useState(false);

  const [newLoginUserDetails, setNewLoginUserDetails] = useState({});

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  useEffect(() => {
    const handleGetProfile = async () => {
      try {
        const res = await getUserProfile({
          user_id: routedData?.user_id || userId,
        });
        setNewLoginUserDetails(res?.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    handleGetProfile();
  }, [verifyEmailModal, verifyPhoneModal]);

  const handleAboutMeSubmit = async () => {
    if (isAddingAboutMe) {
      setIsAddingAboutMe(false);
    } else {
      setIsAddingAboutMe(true);
    }
  };

  useEffect(() => {
    if (profileData?.profileData?.first_name) {
      setFirstName(profileData?.profileData?.first_name);
    }
    if (profileData?.profileData?.last_name) {
      setLastName(profileData?.profileData?.last_name);
    }
    if (profileData?.profileData?.languages) {
      setLanguages(profileData.profileData.languages);
    }
  }, [profileData?.profileData]);

  const handleNameSubmit = async () => {
    setIsAddingName(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!firstName?.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!lastName?.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!aboutMe?.trim()) {
      toast.error("About Me is required");
      return;
    }
    if (!places.length) {
      toast.error("Please select where you live");
      return;
    }
    if (!works.length) {
      toast.error("Please add at least one work entry");
      return;
    }
    if (!hobbies.length) {
      toast.error("Please select at least one hobby");
      return;
    }
    if (!languages.length) {
      toast.error("Please select at least one language");
      return;
    }
    if (!pets.length) {
      toast.error("Please select at least one pet");
      return;
    }
    if (!imageUpload) {
      toast.error("Please upload a profile image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("user_id", userId);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("about_me", aboutMe);
      formData.append("where_live[]", places.join(","));
      formData.append("works[]", works.join(","));
      formData.append("hobbies[]", hobbies.join(","));
      formData.append("languages[]", languages.join(","));
      formData.append("pets[]", pets.join(","));
      formData.append(
        "identity_verify",
        profileData?.personaStatus == "approved" || "completed" ? "1" : "0"
      );

      if (imageUpload) {
        formData.append("profile_image", imageUpload);
      }

      const response = await complete_profile(formData);
      if (response) {
        toast.success("Account created successfully");
        navigate("/");
      } else {
        console.error("Profile submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleSkip = async (event) => {
    event.preventDefault();
    if (!firstName?.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!lastName?.trim()) {
      toast.error("Last name is required");
      return;
    }
    navigate("/");
    localStorage.setItem("setSkipuser", true);
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
      // await addHobby({ user_id: userId, index, hobby_name: hobbies[index] });
    }
    if (type === "pet") {
      // await addPet({ user_id: userId, index, pet_name: pets[index] });
    }
    if (type === "work") {
      // await addWork({ user_id: userId, index, work_name: works[index] });
    }

    setEditingIndex({ type: null, index: null });
  };

  const handleDelete = async (type, index) => {
    if (type === "hobby") {
      setHobbies(hobbies.filter((_, i) => i !== index));
    }
    if (type === "pet") {
      setPets(pets.filter((_, i) => i !== index));
    }
    if (type === "work") {
      setWorks(works.filter((_, i) => i !== index));
    }
    // if (type === "language") {
    //   setLanguages(languages.filter((_, i) => i !== index));
    // }
    if (type === "language") {
      await deleteLanguage({ user_id: userId, index });
      setLanguages(languages.filter((_, i) => i !== index));
    }
    if (type === "place") {
      setPlaces(places.filter((_, i) => i !== index)); // ✅ fixed this line
    }
  };

  const handleAdd = async (type) => {
    if (type === "hobby" && newHobby.trim()) {
      // await addHobby({ user_id: userId, hobby_name: newHobby });
      setHobbies([...hobbies, newHobby]);
      setNewHobby("");
      setIsAddingHobby(false);
    }
    if (type === "pet" && newPet.trim()) {
      // await addPet({ user_id: userId, pet_name: newPet });
      setPets([...pets, newPet]);
      setNewPet("");
      setIsAddingPet(false);
    }
    if (type === "work" && newWork.trim()) {
      // await addWork({ user_id: userId, work_name: newWork });
      setWorks([...works, newWork]);
      setNewWork("");
      setIsAddingWork(false);
    }
    if (
      type === "language" &&
      selectedLanguage &&
      !languages.includes(selectedLanguage)
    ) {
      // await addLanguage({ user_id: userId, language_name: selectedLanguage });
      setLanguages([...languages, selectedLanguage]);
      setSelectedLanguage("");
      setIsAddingLanguage(false);
    }
    if (type === "place" && selectedPlace?.trim()) {
      // await addPlace({ user_id: userId, place_name: selectedPlace });
      setPlaces([...places, selectedPlace]);
      setSelectedPlace("");
      setIsAddingPlace(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const imageUrl = URL.createObjectURL(selectedFile); // Preview the uploaded image
    setPreview(imageUrl);
    setSelectedImage(imageUrl);
    setImageUpload(selectedFile);
    setShowFileUploadModal(false);
  };

  const handleUploadClick = () => {
    setPreview(selectedImage); // Set the preview image once the user clicks the "Upload Image" button
    setSelectedImage(null); // Optionally, reset selected image after uploading
    setShowFileUploadModal(false);
  };

  return (
    <>
      <main>
        <div
          className="complete-your-profile"
          style={{
            display: "flex",
            flexDirection: "row", // Ensures children are arranged in a row
            justifyContent: "space-between", // Adjust as needed
            alignItems: "flex-start", // Align items to the top
            padding: !isMobileWidth ? "10px 30px 15px 30px" : "0px",
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="complete-your-profile-left">
                  <p style={{ fontSize: "25px" }}>Complete your profile</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="complete-your-profile-right">
                  <div className="complete-your-profile-right-top">
                    <div className="user-profile-upload-name">
                      <div className="user-profile-upload">
                        <div className="user-profile-upload-image">
                          <img
                            src={
                              preview
                                ? preview
                                : "/images/nav-section/user-profile1.png"
                            }
                            loading="lazy"
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
                            {" "}
                            Hey{" "}
                            {firstName && lastName
                              ? `${firstName} ${lastName}`
                              : "Guest"}
                            !{" "}
                          </h2>

                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingName((prev) => !prev);
                            }}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              backgroundColor: "#4aeab1",
                              color: "#3a4b4c",
                              fontSize: "14px",
                              border: "3px solid #fff",
                            }}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>

                        {isAddingName && (
                          <div
                            className="user-name-dropdown"
                            style={{ display: "block" }}
                          >
                            <div
                              className="user-profile-upload-image"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={
                                  preview
                                    ? preview
                                    : "/images/nav-section/user-profile1.png"
                                }
                                loading="lazy"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "100%",
                                }}
                              />
                            </div>
                            <label>
                              <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First name*"
                              />
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last name*"
                              />
                            </label>

                            <input
                              type="button"
                              value="Save Changes"
                              onClick={() => handleNameSubmit()}
                              style={{
                                padding: "10px 12px 10px 12px",
                                fontSize: "14px",
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                backgroundColor: "#3A4B4C",
                                width: "100%",
                                color: "white",
                              }}
                            />
                          </div>
                        )}

                        <p>
                          {" "}
                          Guest
                          <span className="info-wrap">
                            <img
                              src="/images/create-profile/info.svg"
                              loading="lazy"
                              alt="info"
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
                          alt=""
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Email Address</h1>
                        {newLoginUserDetails?.email_verified == "1" ? (
                          <p>
                            {" "}
                            Verified <i className="fa-solid fa-badge-check"></i>{" "}
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
                          alt=""
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Phone Number</h1>
                        {newLoginUserDetails?.phone_verified == "1" ? (
                          <p>
                            {" "}
                            Verified <i className="fa-solid fa-badge-check"></i>{" "}
                          </p>
                        ) : (
                          <a
                            onClick={() => setVerifyPhoneModal(true)}
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
                          alt=""
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Verify identity</h1>
                        {newLoginUserDetails?.identity_verified === "1" ||
                        profileData?.personaStatus === "approved" ||
                        profileData?.personaStatus === "completed" ? (
                          <p>
                            {" "}
                            Verified <i className="fa-solid fa-badge-check"></i>{" "}
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
                  <form action="">
                    <h2>
                      About Me
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

                    <div className="user-data-list-wrap">
                      <h2>Please Add Location (Where I Live)</h2>
                      <div
                        className="user-data-list-inner"
                        style={{ width: "fit-content" }}
                      >
                        {places.map((location, index) => (
                          <div
                            key={index}
                            className="user-data-list-item"
                            style={{ width: "fit-content" }}
                          >
                            <input
                              type="text"
                              placeholder="New York, US"
                              id="where-search"
                              value={location}
                              disabled
                              style={{ width: "100%" }}
                            />
                            <button
                              type="button"
                              onClick={() => handleDelete("place", index)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>

                            <div
                              className="user-data-list-dropdown"
                              style={{ width: "fit-content" }}
                            >
                              <div key={index} className="user-data-list-item">
                                <input
                                  type="text"
                                  placeholder="New York, US"
                                  id="where-search"
                                  value={location}
                                  disabled
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDelete("place", index)}
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {isAddingPlace && (
                          <div
                            className="user-data-list-item"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px", // optional spacing between items
                            }}
                          >
                            <Autocomplete
                              style={{ padding: "8px", borderRadius: "20px" }}
                              apiKey={GOOGLE_KEY}
                              onPlaceSelected={(place) =>
                                setSelectedPlace(place.formatted_address)
                              }
                              options={{
                                types: ["(cities)"],
                              }}
                              placeholder="Search for a place..."
                              className="google-autocomplete"
                            />
                            {selectedPlace ? (
                              <button
                                type="button"
                                className="check"
                                onClick={() => handleAdd("place")}
                                style={{ right: "-15px" }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsAddingPlace(false)}
                                style={{ right: "-12px" }}
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
                              onChange={(e) =>
                                handleEdit("work", index, e.target.value)
                              }
                              disabled
                            />
                            <button
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
                                      alt="list-icons"
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
                                className="icon-btn"
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
                      <div className="user-data-list-inner">
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
                              value={hobby}
                              onChange={(e) =>
                                handleEdit("hobby", index, e.target.value)
                              }
                              placeholder="Hobbies"
                              disabled={
                                !(
                                  editingIndex.type === "hobby" &&
                                  editingIndex.index === index
                                )
                              }
                            />
                            <button
                              type="button"
                              className={`${
                                editingIndex.type === "hobby" &&
                                editingIndex.index === index
                                  ? "check"
                                  : "icon-btn"
                              }`}
                              onClick={() =>
                                editingIndex.type === "hobby" &&
                                editingIndex.index === index
                                  ? handleUpdate("hobby", index)
                                  : handleDelete("hobby", index)
                              }
                            >
                              <i
                                className={`fa-solid ${
                                  editingIndex.type === "hobby" &&
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
                                      src="/images/create-profile/list-icons/hobbies.svg"
                                      loading="lazy"
                                      alt=""
                                    />
                                    Sports
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}

                        {isAddingHobby && (
                          <div className="user-data-list-item hobbies">
                            <input
                              type="text"
                              value={newHobby}
                              onChange={(e) => setNewHobby(e.target.value)}
                            />
                            {newHobby !== "" ? (
                              <button
                                type="button"
                                className="check"
                                onClick={() => handleAdd("hobby")}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            ) : (
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
                              disabled
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
                    </div>
                    <div className="user-data-btn">
                      <button
                        type="submit"
                        onClick={(e) => handleFormSubmit(e)}
                      >
                        Save Profile
                      </button>
                      <Link to="#" onClick={handleSkip}>
                        Skip for now
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Modal
        show={showFileUploadModal}
        onHide={() => setShowFileUploadModal(false)}
        centered
        className="custom-modal"
      >
        <Modal.Header
          closeButton
          style={{ border: "none", padding: "10px" }}
        ></Modal.Header>

        <Modal.Title
          className="w-100 text-center "
          style={{ fontSize: "16px" }}
        >
          Add profile picture
        </Modal.Title>
        <hr />

        <Modal.Body className="text-center">
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            <img
              src={selectedImage || uploadImg}
              loading="lazy" alt="Profile Upload"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "10px",
                border: "2px dashed #ccc",
              }}
            />
          </label>
          <div
            style={{ display: "flex", justifyContent: "center", margin: 10 }}
          >
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <button
              onClick={handleUploadClick}
              disabled={!selectedImage}
              style={{
                backgroundColor: selectedImage ? "#4CAF50" : "#ccc", 
                color: "#fff",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                cursor: selectedImage ? "pointer" : "not-allowed",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                marginTop: "20px",
                width: "100%", 
              }}
              className="upload-image-button"
            >
              Upload Image
            </button>
          </div>
        </Modal.Body>
  </Modal> */}

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
              <img
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

      <Modal
        show={showNameEditModal}
        onHide={() => setShowNameEditModal(false)}
        centered
      >
        <Modal.Body className="user-name-dropdown">
          <label>
            <input
              type="text"
              placeholder="First name*"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name*"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <input
            type="submit"
            value="Save Changes"
            onClick={() => setShowNameEditModal(false)}
          />
        </Modal.Body>
      </Modal>
      <EmailVerification
        USERID={routedData?.user_id || userId}
        show={verifyEmailModal}
        handleClose={() => setVerifyEmailModal(false)}
      />
      <PhoneVerification
        USERID={routedData?.user_id || userId}
        show={verifyPhoneModal}
        handleClose={() => setVerifyPhoneModal(false)}
      />
      <AuthModal />
    </>
  );
};

export default CreateProfile;
<style>
  {`
    .custom-modal .modal-dialog {
      width: 90%;
      max-width: 400px;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (min-width: 768px) {
      .custom-modal .modal-dialog {
        width: 50%;
      }
    }

    @media (min-width: 1024px) {
      .custom-modal .modal-dialog {
        width: 30%;
      }
    }

    .btn-close {
      width: 10px;
      height: 10px;
      background-color: #000;
      border-radius: 50%;
      opacity: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close::after {
      content: 'x';
      color: #fff;
      font-weight: bold;
      font-size: 20px;
      line-height: 1;
      margin-top: -4px;
    }
  `}
</style>;
