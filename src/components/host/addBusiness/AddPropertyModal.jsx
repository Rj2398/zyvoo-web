import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";

import PriceAvailblity from "./PriceAvailblity";
import AddProperty from "./AddProperty";
import { useDispatch, useSelector } from "react-redux";
import GalleryLocation from "./Gallery_location";
import useHome from "../../../hooks/host/useHome";
import { setAddnewPropertyState } from "../../../store/slices/hostuserSlice";


function AddPropertyModal(props) {
  const ShowData = useSelector((state) => state?.hostuser?.showNewProperty);
  const dispatch = useDispatch();
  const { getPropertyDetails } = useHome();
  const [propertyData, setPropertyData] = useState();

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  const propertyID = props?.property_id;

  const [activeTab, setActiveTab] = useState("home_setup");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!propertyID) return;

    const fetchPropertyDetails = async () => {
      try {
        const response = await getPropertyDetails({ property_id: propertyID });

        if (response?.data) {
          const data = response.data;
          setPropertyData(data);
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [propertyID, ShowData, props.show]);

  useEffect(() => {
    setPropertyData(propertyData);
  }, [propertyData]);

  return (
    <>
      <Modal backdrop={"static"} {...props} size="lg" centered id="location-modal"
        aria-labelledby="contained-modal-title-vcenter" style={{ zIndex: 10000 }}
        dialogClassName="custom-modal custom-modal-css"
      >
        <Modal.Body className="dialogue-modal d" >
          <style>
            {` .dialogue-modal {
                  border-radius: 30px;
                  background-color: #ffffff;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                  // padding: 20px;
                  font-family: sans-serif;
                  font-size: 14px; 
                  color: black;
                  line-height: 1.6;
                }`
            }
          </style>

          {!isMobileWidth && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", }} >
                <button onClick={() => {
                  setPropertyData(null);
                  props.onHide();
                  dispatch(setAddnewPropertyState(false));
                  setActiveTab("home_setup");
                }}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    background:'#3A4B4C',
                    width:'30px',
                    height:'30px',
                    borderRadius:'50%',
                    color:'#fff'
                  }} >
                  &times;
                </button>
              </div>

              <h4 className="property-modal-main-heading"> Manage your place </h4>
              <h6 className="property-modal-main-sub-heading"> Setup places, availability, prices and more. </h6>

              <div className="property-modal-radio-switch" >
                {[{ key: "home_setup", label: "Home Setup" },
                { key: "gallery_location", label: "Gallery & Location" },
                { key: "price_availability", label: "Price and Availability" },
                ].map(({ key, label }) => (
                  <button key={key} disabled className="property-modal-radio-switch-btn"
                    onClick={() => handleTabChange(key)}
                    style={{
                      backgroundColor: activeTab === key ? "#FFFFFF" : "transparent",
                      color: activeTab === key ? "#000000" : "#000",
                      border: activeTab === key ? "1px solid #FFFFFF" : "2px solid transparent",
                      fontWeight:activeTab===key?"500":"400",
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}



          {/* code for add modal */}
          {activeTab === "home_setup" && (
            <AddProperty
              onCallBack={(val) => setActiveTab(val)}
              propertyDataa={ShowData ? null : propertyData}
              isEdited={props?.property_id}
              onBack={() => {
                setPropertyData(null);
                props.onHide(); // This closes the modal
                dispatch(setAddnewPropertyState(false));
                setActiveTab("home_setup"); // Reset to first tab for next opening
              }}
              activeTab={activeTab}
            />
          )}

          {activeTab === "gallery_location" && (
            <GalleryLocation
              switchToAddProperty={(val) => setActiveTab(val)}
              propertyDataa={ShowData ? null : propertyData}
              isEdited={props?.property_id}
              onBack={() => {
                setPropertyData(null);
                props.onHide(); // This closes the modal
                dispatch(setAddnewPropertyState(false));
                setActiveTab("home_setup"); // Reset to first tab for next opening
              }}
              activeTab={activeTab}
            />
          )}

          {activeTab === "price_availability" && (
            <PriceAvailblity
              switchToGallery={(val) => setActiveTab(val)}
              hideModal={props.onHide}
              propertyDataa={ShowData ? null : propertyData}
              propertyID={propertyID}
              onBack={() => {
                setPropertyData(null);
                props.onHide(); // This closes the modal
                dispatch(setAddnewPropertyState(false));
                setActiveTab("home_setup"); // Reset to first tab for next opening
              }}
              activeTab={activeTab}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* //Css for popups to cover full width of mobile */}
    </>
  );
}

export default AddPropertyModal;

