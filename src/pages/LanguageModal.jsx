import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import useProfile from "../hooks/useProfile";
import { KEYS } from "../config/Constant";

const LanguageModal = () => {
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO)) || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userData?.user_id ? String(userData?.user_id) : null;
  const { getUserProfile, addLanguage } = useProfile();

  const [savedLanguage, setSavedLanguage] = useState([]);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };
    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);
    return () => window.removeEventListener('resize', checkWindowWidth);
  }, [])

  // Ref for modal and close button
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const languageOptions = [
    { language: "English", country: "USA" },
    { language: "Spanish", country: "Spain" },
    { language: "French", country: "France" },
    { language: "German", country: "Germany" },
    { language: "Italian", country: "Italy" },
    { language: "Portuguese", country: "Portugal" },
    { language: "Dutch", country: "Netherlands" },
    { language: "Russian", country: "Russia" },
    { language: "Ukrainian", country: "Ukraine" },
    { language: "Polish", country: "Poland" },
    { language: "Turkish", country: "Turkey" },
    { language: "Greek", country: "Greece" },
    { language: "Hungarian", country: "Hungary" },
    { language: "Romanian", country: "Romania" },
    { language: "Mandarin Chinese", country: "China" },
    { language: "Cantonese", country: "Hong Kong" },
    { language: "Japanese", country: "Japan" },
    { language: "Korean", country: "South Korea" },
    { language: "Vietnamese", country: "Vietnam" },
    { language: "Thai", country: "Thailand" },
    { language: "Hindi", country: "India" },
    { language: "Bengali", country: "Bangladesh" },
    { language: "Urdu", country: "Pakistan" },
    { language: "Punjabi", country: "India" },
    { language: "Marathi", country: "India" },
    { language: "Tamil", country: "India" },
    { language: "Telugu", country: "India" },
    { language: "Arabic", country: "United Arab Emirates" },
    { language: "Persian (Farsi)", country: "Iran" },
    { language: "Hebrew", country: "Israel" },
    { language: "Pashto", country: "Afghanistan" },
    { language: "Kurdish", country: "Iraq" },
    { language: "Swahili", country: "Kenya" },
    { language: "Hausa", country: "Nigeria" },
    { language: "Yoruba", country: "Nigeria" },
    { language: "Igbo", country: "Nigeria" },
    { language: "Zulu", country: "South Africa" },
    { language: "Amharic", country: "Ethiopia" },
    { language: "Tagalog", country: "Philippines" },
    { language: "Malay", country: "Malaysia" },
    { language: "Indonesian", country: "Indonesia" },
    { language: "Burmese", country: "Myanmar" },
    { language: "Khmer", country: "Cambodia" },
    { language: "Lao", country: "Laos" },
  ];

  useEffect(() => {
    const modal = modalRef.current;
    const handleModalShow = () => {
      handleGetProfile();
    };
    modal?.addEventListener("show.bs.modal", handleModalShow);
    return () => {
      modal?.removeEventListener("show.bs.modal", handleModalShow);
    };
  }, []);

  const handleGetProfile = async () => {
    try {
      const res = await getUserProfile({ user_id: userId });
      setSavedLanguage(res.data.languages);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const target = e.nativeEvent.submitter;
    const language = target.dataset.language;

    if (language) {
      const response = await addLanguage({ user_id: userId, language_name: language });
      if (response?.success) {
        handleGetProfile(); // Re-fetch profile after adding language
      }
      // Programmatically close the modal after submission
      if (closeButtonRef.current) {
        closeButtonRef.current.click(); // Close the modal
      }
    }
  };

  return (
    <div>
      <div className="modal fade" id="language-popup" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" ref={modalRef} >
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h2>
                <span style={isMobileWidth ? {
                  fontSize: "19px",
                  fontWeight: "400",
                  margin: "auto",
                  textAlign: "center"
                } : {}}>Choose a Language and Region </span>

                <button type="button" className="close" data-bs-dismiss="modal"
                  aria-label="Close" ref={closeButtonRef}
                  style={isMobileWidth ? {
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
                    fontSize: "25px"
                  } : {}}>
                  <span aria-hidden="true">×</span>
                </button>
              </h2>
              <form onSubmit={handleSubmit}>
                {languageOptions.map((option, index) => (
                  <button key={index} type="submit" data-language={option.language}
                    style={{
                      backgroundColor: isMobileWidth ? (savedLanguage.includes(option.language) ? "#84d6fe" : "") : (savedLanguage.includes(option.language) ? "rgb(74, 234, 177)" : ""),
                      border: isMobileWidth && "1px solid #ccc",
                      minWidth: isMobileWidth ? "48%" : "",
                      fontSize: isMobileWidth ? "13px" : "",
                      appearance: "none",
                      WebkitAppearance: "none",
                      color: "black",
                    }}>
                    {option.language} <span style={{ fontWeight: isMobileWidth ? "300" : "" }}>{option.country}</span>
                  </button>
                ))}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LanguageModal);