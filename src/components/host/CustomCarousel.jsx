import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { imageBase } from "../../config/Constant";
import useHome from "../../hooks/host/useHome";
import { toast } from "react-toastify";
import vector from "../../assets/gallery/Vector.png";
import { useNavigate } from "react-router-dom";
import { setAddnewPropertyState } from "../../store/slices/hostuserSlice";
import { useDispatch } from "react-redux";
import { BsThreeDots } from "react-icons/bs";

const CustomCarousel = ({ images, onEdit, onDelete, propertyId, data }) => {
  const { deleteProperyDetails } = useHome();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);



  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  const removeProperty = async () => {
    try {
      const res = await deleteProperyDetails({ property_id: propertyId });
      if (res) {
        toast.success("Property deleted successfully");
        setShowLogoutModal(false);
      }
      onDelete();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error?.message || error?.data?.message || "Error in delete property"
      );
    }
  };

  const dropdownItemStyle = {
    width: "100%",
    padding: "10px",
    background: "#fff",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    // borderBottom: "1px solid #ddd",
    borderBottom: isMobileWidth ? "none" : "1px solid #ddd",

     appearance: "none",         
     WebkitAppearance: "none",    
     color: "black", 
  };

  return (
    <div style={{
        position: "relative",
        height: isMobileWidth ? "250px" : "350px",
        borderRadius: "20px",
        overflow: "hidden",
      }} >
      <div className="carousel-inner-top" style={{ position: "absolute", top: "10px", left: "10px",
        right: "10px", display: "flex", alignItems: "center", zIndex: 10, }} >
          {(data?.is_instant_book || data?.is_instant_book != 0) && (
            <h3 style={{ color: "black", background: "white", padding: " 10px", borderRadius: "20px", margin: 0}}               >
              <i className="fa-solid fa-bolt"></i> Instant book
            </h3>
          ) }
      </div>
      {/* Three Dots Icon */}
      <div onClick={() => setShowDropdown(!showDropdown)} style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          zIndex: 10,
          padding: "5px",
          // borderRadius: "50%",
          // backgroundColor:'white'
          // background: "rgba(0, 0, 0, 0.6)",
        }}>
        
          {/* <BsThreeDots size={25} color="black" /> */}
          <img src="/images/Host/edit.png" loading="lazy" alt="edit" style={{width: isMobileWidth ? "22px" :"30px"}}/>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            background: "#fff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: isMobileWidth ? "20px" : "5px",
             padding: isMobileWidth ? "1px 0px 0px 8px" : "",
            overflow: "hidden",
            zIndex: 20,
            width:"180px"
          }} >
          <button style={dropdownItemStyle}
            onClick={() => {
              onEdit && onEdit(true);
              setShowDropdown(false);
              dispatch(setAddnewPropertyState(false))
            }} >
            Edit
          </button>
          <button style={dropdownItemStyle} 
            onClick={() => {
              // onDelete && onDelete(true);
              setShowDropdown(false);
              setShowLogoutModal(true);
            }}>
            Delete
          </button>
        </div>
      )}

      {showLogoutModal && (
        <div style={{
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
            padding:isMobileWidth ? '20px': ""
          }} >
          <div style={{ 
              width: "90%",
              borderRadius: "13px",
              backgroundColor: "white",
              padding: "20px",
              maxWidth: "400px",
            }}>
            <div style={{ display: "flex", justifyContent: "flex-end"}} >
              <button onClick={() => setShowLogoutModal(false)}
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
                  fontSize: "25px"
                }} >
                ×
              </button>
            </div>

            <div style={{ textAlign: "center", padding: "0 20px" }}>
              <h3 style={{
                  fontWeight: "600",
                  fontSize: "28px",
                  color: "#000000",
                  marginBottom: "10px",
                  fontFamily: "sans-serif poppins",
                }}>
                {!isMobileWidth && "Delete"}
              </h3>

              <div style={{ margin: isMobileWidth ?"10px 0px" :"20px 0"  }}>
                <img src={vector} loading="lazy" alt="Logout"
                  style={{ width:isMobileWidth?"60px": "90px", height: isMobileWidth?"60px": "90px", marginBottom:isMobileWidth?"": "20px", }} />
              </div>

              <p style={{  fontWeight:isMobileWidth?'16px':"", marginBottom:isMobileWidth?"":"30px", fontWeight: isMobileWidth ? 600 : 500 }}>
                Are you sure you want to delete this property ?
              </p>

              <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  marginBottom: isMobileWidth?"10px":"20px",
                }} >
                <button onClick={() => removeProperty()}
                  style={{
                    padding: isMobileWidth?"10px 40px":"10px 50px",
                    borderRadius: "50px",
                    border: "none",
                    backgroundColor: "#4AEAB1",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight:isMobileWidth?"400": "500",
                    // fontSize: "20px"
                  }} >
                  {isMobileWidth ? "Confirm" : "Yes"}
                </button>
                <button onClick={() => setShowLogoutModal(false)}
                  style={{
                    padding: "10px 37px",
                    border: "1px solid #4AEAB1",
                    borderRadius: "50px",
                    backgroundColor: "#fff",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: "500",
                  }} >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carousel */}
      <Carousel data-bs-theme="dark" controls={false}
        style={{ width: "100%", height: "100%", cursor: "pointer" }}
        interval={images.length > 1 ? 3000 : null}
        indicators={images.length > 1}
      >
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <div style={{ height: "400px", overflow: "hidden", }} >
              <img src={`${imageBase}${image}`} loading="lazy" alt={`Slide ${index + 1}`}
                style={{ width: "100%", height: "90%", objectFit: "cover" }}
                onClick={() =>
                  navigate(`/my-place-history`, { state: { routedData: data } })
                }
              />
            </div>

            <style>
              {`.carousel-indicators {
                  position: absolute;
                  // bottom: 25%;              /* Adjust vertical position */
                  left: 30%;
                  transform: translateX(-50%);
                  z-index: 1;
                  display: flex !important;
                  justify-content: center;
                  gap: 8px;                  /* spacing between bullets */
                }
                        .carousel-indicators [data-bs-target] {
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background-color: #fff; /* white bullets */
                  opacity: 0.5;
                  transition: opacity 0.3s ease;

                }

                .carousel-indicators .active {
                  opacity: 1;
                  background-color: #fff; /* or use your theme color */
                }
            `}
            </style>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

// const dropdownItemStyle = {
//   width: "100%",
//   padding: "10px",
//   background: "#fff",
//   border: "none",
//   textAlign: "left",
//   cursor: "pointer",
//   fontSize: "14px",
//   // borderBottom: "1px solid #ddd",
//   borderBottom: isMobileWidth ? "none" : "1px solid #ddd"
// };

// dropdownItemStyle[":last-child"] = { borderBottom: "none" };

export default React.memo(CustomCarousel);
