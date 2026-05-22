import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { imageBase } from "../../config/Constant";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const CustomCarouselGuest = ({ images, propertyId, distance_miles }) => {
  const navigate = useNavigate();
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

  return (
    <Carousel
      interval={images.length > 1 ? 3000 : null}
      indicators={images.length > 1}
      controls={false}
      style={{ width: "120%" }}
    >
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <div state={{ property_id: propertyId }} style={{ width: "120%" }}
            onClick={() =>
              navigate(`/location/${propertyId}`, {
                state: { distance: distance_miles },
              })
            }
          >
            {/* <img src={`${imageBase}${image}`} loading="lazy" alt={`Slide ${index + 1}`}  */}
            <img src={`${imageBase}${image}`} loading="lazy" alt={`Slide ${index + 1}`} 
              style={{
                width: "100%",
                height: "380px",
                objectFit: "cover",
                borderRadius: "10px",
                zIndex: 0,
                cursor: "pointer",
              }}
            />
          </div>

          <style>
            {` 
              .carousel-indicators {
                position: absolute;
                bottom:15%; /* ✅ dynamic value */       
                left: ${isMobileWidth ? "35%" : "35%"};;
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
  );
};

export default React.memo(CustomCarouselGuest);
