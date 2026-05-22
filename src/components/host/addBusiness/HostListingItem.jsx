import React from "react";
import { Col, Carousel, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { imageBase } from "../../../config/Constant";

// Reusable Component for Each Location Card
const HostListingItem = ({
  property_id = "",
  title = "",
  hourly_rate = "",
  distance_miles = "",
  reviews_total_rating = "",
  reviews_total_count = "",
  property_images = [""],
  isMobileWidth
}) => {
  const navigate = useNavigate();

  const formatReviewCount = (count) => {
    if (!count || count <= 0) return "0";
    if (count < 100) {
      return count;
    }
    if (count < 1000) {
      const rounded = Math.floor(count / 100) * 100;
      return `${rounded}+`;
    } else if (count < 1_000_000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
    } else if (count < 1_000_000_000) {
      return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
    } else {
      return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B+`;
    }
  };

function formatReview(value) {
  const num = Number(value);
  if (isNaN(num)) return "";
  return num > 0 ? num.toFixed(1) : "0";
}


  return (
    <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mt-3">
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          width: "100%",
          background: "#fff",
          paddingBottom: "10px",
        }}
      >
        {/* Carousel */}
        <div style={{ position: "relative", width: "100%", height: "80%" }}>
          <Carousel interval={property_images?.length > 1 ? 3000 : null}
            indicators={property_images?.length > 1} controls={false} style={{ width: "100%" }} >
            {property_images?.map((img, index) => (
              <Carousel.Item key={index}>
                <Image src={imageBase + img} className="d-block w-100" alt={title}
                  onClick={() => navigate(`/location/${property_id}`)}
                  style={{
                    objectFit: "cover",
                    height: isMobileWidth ? "280px" : "350px",
                    cursor: "pointer",
                    borderRadius: "20px",
                  }} // Increased image height
                />

                <style>
                  {`
                    .carousel-indicators {
                      position: absolute;
                      bottom: 2%;              /* Adjust vertical position */
                      left: 33%;
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

        {/* Details */}
        <div style={{ padding: "10px 0px" }}>
          <div style={{ 
              fontSize: "15px", color: "#000", display: "flex", justifyContent: "space-between",
            }} >
            <h6 style={{  marginBottom: "5px", fontWeight: "400", fontSize: "18px"}} >
              <Link to={`/location/${property_id}`} style={{ textDecoration: "none", color: "#000" ,fontWeight:"400",fontSize:"18px"}}>
                {title}
              </Link>
            </h6>
            <p style={{
                fontSize: "18px",
                fontWeight: "400",
                marginBottom: "5px",
                color: "black",
              }} >
              <i className="fa-solid fa-clock" 
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "5px",
                  marginRight: "5px",
                  color: "#3A4B4C",
                }} >
                
              </i>
              ${parseInt(hourly_rate) || 0}/h
            </p>
          </div>

          {/* Ratings & Distance */}
          <ul style={{ padding: 0, listStyle: "none", display: "flex", gap: "15px", fontSize: "13px", margin: 0,
              // justifyContent: "space-between",
            }} >
            <li style={{ display: "flex", alignItems: "flex-start", gap: 2,fontSize:"14px", fontWeight:"400" }}>
              <Image src="/images/locations-grid/star-icon.svg" loading="lazy" alt="Rating"
                style={{ width: "16px", marginRight: "4px", }}
              />
              <span style={{ color: "#FCA800" }}> {formatReview(reviews_total_rating)} </span>
              <span> ({reviews_total_count})</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", fontSize:"14px",color:'#A4A4A4' }}>
              <Image src="/images/locations-grid/location-icon.svg" loading="lazy" alt="Location"
                style={{ width: "16px", marginRight: "4px" }} />
              {distance_miles} miles away
            </li>
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default HostListingItem;
