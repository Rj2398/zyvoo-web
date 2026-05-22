import { useEffect, useState } from "react";
import { Carousel, Col, Dropdown, Image, Modal, Row, } from "react-bootstrap";
import HostListingItem from "../../components/host/addBusiness/HostListingItem";
import { SlArrowRight } from "react-icons/sl";
import { FaStar } from "react-icons/fa";
import useCommon from "../../hooks/useCommon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { imageBase } from "../../config/Constant";
import { IoIosArrowDown } from "react-icons/io";

function HostListing() {
  const data = useLocation();
  const navigate = useNavigate();
  const hostId = data?.state?.hostId;

  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { host_listing, filter_host_reviews, isLoading } = useCommon();
  const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null, });

  const [currentHostData, setCurrentHostData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [selectedSort, setSelectedSort] = useState("highest_review");

  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? currentHostData?.properties : currentHostData?.properties?.slice(0, 8);

  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({latitude: position.coords.latitude,longitude: position.coords.longitude});
          },
          (error) => {console.error(error.message);}
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
      }
    };
    getLocation();
  }, [currentLocation?.longitude]);

  useEffect(() => {
    const fetchHostData = async () => {
      if (hostId) {
        try {
          const res = await host_listing({host_id: hostId, latitude: currentLocation?.latitude, longitude: currentLocation?.longitude});
          if (res?.code == 200) {
            setCurrentHostData(res?.data);
          }
        } catch (error) {
          console.error("Error fetching host data:", error);
        }
      }
    };
    fetchHostData();
  }, [data, host_listing, currentLocation?.latitude]);

  useEffect(() => {
    const fetchInitialReviews = async () => {
      if (hostId) {
        try {
          const res = await filter_host_reviews({
            host_id: hostId,
            filter: selectedSort,
            page: 1,
          });
          if (res?.code === 200) {
            setReviewData(res?.data || []);
            setTotalPages(res?.pagination?.total_pages);
            setCurrentPage(1);
          }
        } catch (error) {
          console.error("Error fetching initial reviews:", error);
        }
      }
    };

    fetchInitialReviews();
  }, [selectedSort, filter_host_reviews]);

  const handleSelect = (eventKey) => {
    setSelectedSort(eventKey);
  };

  const handleLoadMoreReviews = async () => {
    const nextPage = currentPage + 1;

    if (hostId && nextPage <= totalPages) {
      try {
        const res = await filter_host_reviews({host_id: hostId, filter: selectedSort, page: nextPage});
        if (res?.code === 200) {
          setReviewData((prev) => [...prev, ...res.data]);
          setCurrentPage(nextPage);
        }
      } catch (error) {
        console.error("Error loading more reviews:", error);
      }
    }
  };

  const sortLabels = { 
    highest_review: "Highest Review", lowest_review: "Lowest Review", recent_review: "Recent Reviews",
  };

  const formatReviewCount = (count) => {
    if (!count || count <= 0) return "0";
    if (count < 100) return count;

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

  const [isMobileWidth,setIsMobileWidth]=useState(false)

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };
 
    checkWindowWidth(); // run on mount
    window.addEventListener('resize', checkWindowWidth);
 
    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {" "}
        Loading...{" "}
      </div>
    );
  }

  return (
    <>
      <main className="mb-0"
        style={{
          backgroundColor: "white",
          backgroundImage: " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
          backgroundSize: "20px 20px",
        }}
      >
        {/* <!-- MOBILE --> */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link to="#" onClick={() => navigate(-1)}>
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE -->*/}
        <div className="host-listing-wrap help-center-wrap location-grid-map-wrap">
          <div className="container-fluid">
            <div className={`${isMobileWidth ? "" : "row"} m-0 p-0 m-lg-4`} style={{ justifyContent: "space-between" }}>
              <div className={isMobileWidth ? "" : "row gap-5"}>
                <Col lg={3} md={4} className="px-5 px-sm-2 px-lg-0">
                  <div className="p-1 p-lg-4 " style={{ 
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                    }} >
                    <div className="profile-img-cover-main" style={{width: isMobileWidth ? "70px" : "", height: isMobileWidth ? "70px" : ""}}>
                      <Image src={ currentHostData?.host?.profile_picture ? imageBase + currentHostData?.host?.profile_picture : "/images/chat/profile/1.svg" } loading="lazy" alt="Host"
                        roundedCircle
                        style={{
                          width: "100%",
                          height: "100%",
                          border: isMobileWidth ? "2px solid #EBEDED" : "8px solid #EBEDED",
                          borderRadius: "50%",
                          padding: "5px",
                          objectFit: "cover",
                        }}
                      />

                      {currentHostData?.is_star_host && (
                        <Image src="/images/locations-grid/profile/batch.svg" loading="lazy" alt="Batch"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            width: "40px",
                          }}
                        />
                      )}
                    </div>
                    <hr style={{margin: isMobileWidth ? "0" : ""}}/>
                    <h2 style={{ fontSize: isMobileWidth ? "18px" : "20px", margin: isMobileWidth ? "5px 0" : "10px 0", color: "#000", fontWeight: "500"}}>
                      {currentHostData?.host?.name || "No Name Available"}
                    </h2>
                    <p style={{ color: "#000", fontSize: "18px", margin: isMobileWidth ? "0" : "",padding: isMobileWidth ? "0" : "" }}>Host</p>
                  </div>
                </Col>
                {isMobileWidth && <hr />}
                <Col md={7}>
                  <div style={{ padding: isMobileWidth ? "0" :"15px", borderRadius: "10px" }}>
                    <h3 style={{ marginBottom: "25px",fontSize: isMobileWidth ? "18px" : "22px" }}>About Host</h3>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginBottom: "20px",
                        // justifyContent: "space-between",
                      }}
                    >
                      {currentHostData?.about_host?.host_profession && (
                        <div style={{ display: "flex", alignItems: "center", padding:"7px 14px", border:"1px solid gray", borderRadius:"50px", fontSize: isMobileWidth ? "12px" : "" }}>
                          <Image src="/images/create-profile/work.svg" loading="lazy" alt="Work" style={{ marginRight: "8px" }} />
                          {currentHostData?.about_host?.host_profession}
                        </div>
                      )}

                      {currentHostData?.about_host?.location && (
                        <div style={{ display: "flex", alignItems: "center", padding:"7px 14px", border:"1px solid gray", borderRadius:"50px",fontSize: isMobileWidth ? "12px" : "" }}>
                          <Image src="/images/create-profile/location.svg" loading="lazy" alt="Location" style={{ marginRight: "8px" }} /> 
                          {currentHostData?.about_host?.location}
                        </div>
                      )}

                      {currentHostData?.about_host?.language && (
                        <div style={{ display: "flex", alignItems: "center", padding:"7px 14px", border:"1px solid gray", borderRadius:"50px",fontSize: isMobileWidth ? "12px" : "" }}>
                          <Image src="/images/create-profile/languages.svg" loading="lazy" alt="Languages" style={{ marginRight: "8px" }} /> 
                          {currentHostData?.about_host?.language?.join(", ")}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: "30px" }}>
                      <p style={{ textAlign: "justify",fontSize: isMobileWidth ? "14px" : "" }}>
                        {expanded ? currentHostData?.about_host?.description : `${currentHostData?.about_host?.description?.substring(0, 900 )}...`}{" "}
                        <a href="#" onClick={(e) => { 
                            e.preventDefault();
                            setExpanded(!expanded);
                          }}
                          style={{
                            color: "#4AEAB1",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}>
                          {currentHostData?.about_host?.description?.length >
                            900 && (expanded ? "Read less" : "Read more")}
                        </a>
                      </p>
                    </div>
                  </div>
                </Col>
              </div>

              <hr style={{ border: "none", borderTop: "0.5px solid #000",
                  width: "100%",
                  marginTop: "30px",
                  margin: "20px 0",
                }}
              />

              <Row className="d-flex justify-content-between align-items-center my-2">
                <Col>
                  <h4 style={{ fontWeight: "500", color:"black", marginBottom: "0", fontSize: isMobileWidth ? "15px" : "20px" }}>
                    {currentHostData?.host?.name}’s Listings
                  </h4>
                </Col>
                <Col xs="auto">
                  <button
                    onClick={() => setShowModal(true)}
                    style={{
                      fontSize: isMobileWidth ? "15px" : "",
                      textDecoration: "none",
                      color: "black",
                      fontWeight: "400",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px", // Adds spacing between text and icon
                    }}
                  >
                    View more <SlArrowRight />
                  </button>
                </Col>
              </Row>

              <div className={isMobileWidth ? "" : "container"}>
                <div className={isMobileWidth ? "" : "row"}>
                  {/* {currentHostData?.properties?.map((location, index) => (
                    <HostListingItem key={index} {...location} isMobileWidth={isMobileWidth}/>
                  ))} */}
                  {
                    isMobileWidth ? currentHostData?.properties?.slice(0,1)?.map((location, index) => (
                    <HostListingItem key={index} {...location} isMobileWidth={isMobileWidth}/>
                  )) : currentHostData?.properties?.slice(0,4).map((location, index) => (
                    <HostListingItem key={index} {...location} isMobileWidth={isMobileWidth}/>
                  ))
                  }
                </div >
              </div>

              <div className="col-lg-12 mt-5">
                <div className="location-reviews">
                  <Row className="align-items-center mb-4"
                    style={{
                      borderTop: "1px solid #ddd",
                      paddingBottom: "15px",
                    }}
                  >
                    {/* Reviews Title */}
                    <Col xs={12} md={6} className="d-flex align-items-center">
                      <h4 style={{
                          fontSize: "18px",
                          margin: "0",
                          display: "flex",
                          alignItems: "center",
                          width:"100%"
                          // fontWeight: "600",
                        }}
                      >
                        {" "}
                        Reviews ({currentHostData?.total_host_review_count || 0}
                        )
                        <span style={{
                            marginLeft: "15px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight:'400'
                          }} >
                          <Image src="/images/locations-grid/star-icon.svg" loading="lazy" alt="Star"
                            style={{ width: "16px", marginRight: "5px" }}
                          />
                          <span style={{ fontSize: "16px",
                              color: "rgb(252, 168, 0)",
                              marginRight: "5px",
                             
                            }}
                          >
                            {formatReview(currentHostData?.total_host_review_rating) || 0}
                          </span>
                          Rating
                        </span>
                      </h4>
                    </Col>

                    {/* Sort Dropdown */}
                    <Col xs={12} md={6} className="d-flex justify-content-between justify-content-md-end align-items-center py-3" >
                      <p style={{
                          margin: "0",
                          fontSize: "16px",
                          fontWeight: "400",
                          marginRight: "10px",
                        }}
                      >
                        Sort by:
                      </p>

                      <Dropdown onSelect={handleSelect}>
                        {/* <Dropdown.Toggle
                          variant="light"
                          id="dropdown-basic"
                          // style={{
                          //   fontSize: "14px",
                          //   fontWeight: "500",
                          //   border: "1px solid #ddd",
                          //   padding: "5px 10px",
                          //   display: "flex",
                          //   alignItems: "center",
                          //   background: "#fff",
                          // }}

                           className="chatgpt-dropdown-toggle"
                        >
                          {sortLabels[selectedSort]}
                        </Dropdown.Toggle> */}


                        <Dropdown.Toggle
                          variant="light"
                          id="dropdown-basic"
                          className="chatgpt-dropdown-toggle"
                       >
                       <span>{sortLabels[selectedSort]}</span>
                       <IoIosArrowDown className="dropdown-chevron" />
                       </Dropdown.Toggle>


                        <Dropdown.Menu>
                          <Dropdown.Item eventKey="highest_review">
                            Highest Review
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="lowest_review">
                            Lowest Review
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="recent_review">
                            Recent Reviews
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>

                  <Row className="mt-4" style={{marginLeft:'-25px'}}>
                    {reviewData?.map((review, index) => (
                      <Col key={index} md={12} className="mb-3">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: "10px",
                            padding: "15px",
                            background: "#fff",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              src={
                                review?.profile_image
                                  ? imageBase + review?.profile_image
                                  : "/images/nav-section/user-profile1.png"
                              }
                              alt={review?.reviewer_name}
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                marginRight: "15px",
                                border:'2px solid #ccc',
                                padding:'5px'
                              }}
                            />
                            <div>
                              <h6
                                style={{
                                  marginTop:"20px",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  
                                }}
                              >
                                {review?.reviewer_name}
                              </h6>
                              <p
                                style={{
                                  marginTop:"5px",
                                  fontSize: "14px",
                                  color: "black",
                                }}
                              >
                                {review?.review_message}
                              </p>
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div>
                              {Array.from({ length: 5 }, (_, index) => (
                                <Image
                                  key={index}
                                  src={
                                    index < review?.review_rating
                                      ? "/images/locations-grid/star-icon.svg"
                                      : "/images/locations-grid/star-icon-blank.svg"
                                  }
                                  loading="lazy" alt="Star"
                                  style={{ width: "14px", marginRight: "3px" }}
                                />
                              ))}
                            </div>
                            <p
                              style={{
                                margin: "5px 0 0",
                                fontSize: "15px",
                                color: "#000000",
                                fontWeight:'400'
                              }}
                            >
                              {review?.review_date}
                            </p>
                          </div>
                        </div>
                        <hr />
                      </Col>
                    ))}
                  </Row>

                  {currentPage < totalPages && (
                    <button
                      type="button"
                      className="location-reviews-btn"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: "250px",
                        margin: "20px auto",
                        padding: "12px 20px",
                        fontSize: "16px",
                        // fontWeight: "bold",
                        color: "black",
                        // backgroundColor: "#ff9800",
                        border: "1px solid balck ",
                        borderRadius: "30px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textAlign: "center",
                        // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                      onClick={handleLoadMoreReviews}
                      // onMouseOver={(e) =>
                      //   (e.target.style.backgroundColor = "#e68900")
                      // }
                      // onMouseOut={(e) =>
                      //   (e.target.style.backgroundColor = "#ff9800")
                      // }
                    >
                      Show More Reviews
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/*  */}

      {/* Listing Modal  */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered fullscreen="lg-down" style={{ margin: "0 auto", maxWidth: isMobileWidth ? "" : "95vw", overflow: "hidden" }} className={isMobileWidth ? "custom-modal-css" : ""} >
        <style>
          {`
            .modal-content {
              border-radius: ${isMobileWidth ? "0px !important" : "0px !important"};
              padding-top:20px;
            }
          `}
        </style>

        <Modal.Header closeButton={isMobileWidth ? false : true} onClick={() => setShowAll(false)}>
          {isMobileWidth ? <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link to="#" onClick={() => setShowModal(false)}>
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <p className="p-0 m-0 pt-2" style={{color:'black'}}>Listing Details</p>
          </div> :
          <Modal.Title>Listing Details</Modal.Title>}
        </Modal.Header>
          <style>
            {`
              .modal-header {
                display: flex;
                flex-shrink: 0;
                align-items: center;
                paddingTop: 10px;
                padding: ${isMobileWidth && "10px 10px 0 5px;"};
                color:black;
                border-Bottom:none;
              }
            `}
        </style>
          
        <Modal.Body
          style={{
            overflowX: "hidden",
            overflowY: "auto",
            maxHeight: "85vh",
            padding: "20px",
          }}
        >
          <Row className="g-4">
            {visibleData?.map((listing, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={index}>
                <div style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    flexDirection: "column",
                  }}
                >
                  {/* <Carousel indicators={false}> */}
                  <Carousel interval={listing?.property_images?.length > 1 ? 3000 : null}
                    indicators={listing?.property_images?.length > 1}
                    controls={false} >
                    {listing?.property_images?.map((img, i) => (
                      <Carousel.Item key={i}>
                        <img src={imageBase + img} alt={`Listing ${i}`} loading="lazy"
                          onClick={() => navigate(`/location/${listing?.property_id}`) }
                          style={{
                            width: "100%",
                            height: "280px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
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
                              gap: 8px;    /* spacing between bullets */
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
                  <div style={{ padding: "7px 0px", background: "#fff", flexGrow: 1 }} >
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}                     >
                      <h6 style={{ fontWeight: "400", margin: "5px 0" ,fontSize:'16px',color:'black'}} onClick={() => navigate(`/location/${listing?.property_id}`) } >
                        {listing?.title}
                      </h6>
                      <p style={{ fontSize: "14px", color: "#555", marginBottom: "5px"}} >
                        <span style={{ fontWeight: "400", color: "#000" }}>
                          <i className="fa-solid fa-clock"
                            style={{
                              fontSize: "16px", fontWeight: "600", color: "#3A4B4C",
                              // display: 'none',
                              // marginBottom: "5px",
                              // marginRight:'10px',
                            }}>
                            {" "}
                          </i>{" "}
                       <span style={{ whiteSpace: 'nowrap', padding: 0, margin: 0, fontSize:"16px", fontWeight:"400"}}>
                        {'$'+ parseFloat(listing?.hourly_rate)+'/h'}
                      </span>
                        </span>
                      </p>
                    </div>
                    <p
                      style={{
                        display: "flex",
                        fontSize: "14px",
                        color: "#777",
                        marginBottom: "0",
                        // justifyContent:'space-between'
                        gap: "15px",
                      }}
                    >
                      <span style={{ fontWeight: "400" }}>
                        <FaStar color="#FFA500"  style={{marginBottom:'5px',marginRight:'5px',}}/>
                        <span
                          style={{
                            fontWeight: "400",
                            color: "rgb(252, 168, 0)",
                            marginRight:'5px'

                          }}
                        >
                          {formatReview(listing?.reviews_total_rating)}
                        </span>
                        ({formatReviewCount(listing?.reviews_total_count)})
                      </span>
                      <span style={{ alignContent: "end" }}>
                        <img src="/images/locations-grid/location-icon.svg" alt="Location" style={{ width: "16px",marginRight:'5px' }}/>
                        {listing?.distance_miles} miles away
                      </span>
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {(currentHostData?.properties?.length > 8 && !showAll) && (
            <button
              type="button"
              className="location-reviews-btn"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "250px",
                margin: "20px auto",
                padding: "12px 20px",
                fontSize: "16px",
                // fontWeight: "bold",
                color: "black",
                // backgroundColor: "#ff9800",
                border: "1px solid balck ",
                borderRadius: "30px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
                // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              }}
              onClick={() => setShowAll(true)}
              // onMouseOver={(e) =>
              //   (e.target.style.backgroundColor = "#e68900")
              // }
              // onMouseOut={(e) =>
              //   (e.target.style.backgroundColor = "#ff9800")
              // }
            >
              Show More
            </button>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HostListing;
