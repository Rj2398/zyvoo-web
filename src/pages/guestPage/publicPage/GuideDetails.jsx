import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image, Card, } from "react-bootstrap";
import AuthModal from "../../../components/guest/authModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import useCommon from "../../../hooks/useCommon";
import { imageBase, KEYS } from "../../../config/Constant";
import ShareModal from "../../../components/guest/bookingDetailsModal/ShareModal";

function GuideDetails() {
  const location = useLocation();
  const { guideId } = location.state || {};
  const { getGuideDetail, getGuideList } = useCommon();
  const navigate = useNavigate();
  const { id } = useParams();

  const currentGuideId = guideId || id;
  const [guideDetails, setGuideDetails] = useState();
  const userType = localStorage.getItem(KEYS.USER_TYPE);
  const [guideArr, setGuideArr] = useState([]);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const fetchGuideDetails = async () => {
    try {
      const response = await getGuideDetail({ guide_id: currentGuideId });
      setGuideDetails(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGuides = async () => {
    const result = await getGuideList({ user_type: userType });
    setGuideArr(result.data);
  };

  useEffect(() => {
    fetchGuides();
  }, [userType]);

  useEffect(() => {
    if (currentGuideId) {
      fetchGuideDetails();
    }
  }, [currentGuideId]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const suggestions =
      guideArr?.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      ) || [];

    setFilteredSuggestions(value ? suggestions : []);
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm(item?.title);
    setFilteredSuggestions([]);
    navigate(`/guide-detail/${item?.id}`, {
      state: { currentGuideId: item?.id },
    });
  };

  const capitalizeFirstLetter = (title) => {
    // console.log('object')
    if (!title) return title;
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  return (
    <div>
      <main  >
        {/* Mobile Search Filter */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <Container fluid>
            <Row>
              <Col>
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    {/* <a onClick={(e) => {
                      e.preventDefault();
                      // console.log("#############################");
                      navigate(-1)
                    }}>
                      <i className="fa-regular fa-arrow-left"></i>

                    </a> */}
                   <Link to="#" onClick={() => navigate(-1)}  >
                      <i className="fa-regular fa-arrow-left" style={{ textAlign: 'center',marginLeft: !isMobileWidth && '10px' }}></i>
                    </Link>


                    {/* <Form style={{
                      position: "relative",
                      width: "100%",
                      margin: "10px",
                      height: "auto",
                    }} >
                      <Form.Group controlId="searchArticle"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#f8f9fa",
                          borderRadius: "15px",
                          padding: "2px 10px",
                        }} >
                        <Form.Control
                          type="text"
                          placeholder="Search article..."
                          style={{
                            border: "none",
                            boxShadow: "none",
                            background: "transparent",
                            borderRadius: "15px",
                            padding: "6px 35px 6px 8px",
                            fontSize: "15px",
                            width: "100%",
                            height: "35px",
                          }} />
                        <Button variant="link"
                          style={{
                            position: "absolute",
                            right: "10px",
                            color: "#6c757d",
                            padding: "0",
                            fontSize: "16px", // Adjust icon size
                          }} >
                          <i className="fa-regular fa-magnifying-glass"></i>
                        </Button>
                      </Form.Group>
                    </Form> */}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="guides-articles-details guide-details-mobile" style={{ padding: isMobileWidth ?"0":"10px 23px", position: "relative" }}>
          {/* Back Button */}
          <div
            className="web-navbar"
            onClick={() => navigate(-1)}
            style={{
              left: "15px",
              top: "50%",
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft:'10px'
            }}
          >
            <FaArrowLeft style={{ color: "white" }} />
          </div>

          <Container fluid >
            <Row>
              {/* Left Side - Article Details */}
              <Col lg={8} md={6}  style={{marginLeft:'-2px'}}>
                <div className="guides-articles-left">
                  <div className="guides-articles-left-top">
                    <div className="guides-articles-left-top-data">
                      <p className="guide-category">{guideDetails?.category}</p>
                      <h1 className="guide-title">
                        {capitalizeFirstLetter(guideDetails?.title)}
                      </h1>
                      <ul className="guide-meta">
                        <li>
                          <Image
                            src="/images/guides-articles/date.svg"
                            loading="lazy" alt="Date"
                          />
                          {guideDetails?.date}
                        </li>
                        <li>
                          <Image
                            src="/images/guides-articles/time.svg"
                            loading="lazy" alt="Time"
                          />
                          {guideDetails?.time_required}
                        </li>
                      </ul>
                    </div>
                    <div className="guides-articles-left-top-image guide-image-container">
                      <Image
                        src={`${imageBase}${guideDetails?.cover_image}`}
                        loading="lazy" alt="Article"
                        fluid
                      />
                    </div>
                  </div>

                  <div className="guides-articles-left-mid guide-content">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: guideDetails?.description,
                      }}
                    />
                  </div>
                </div>
              </Col>

              {/* Right Side - Sidebar */}
              <Col lg={4} md={6}>
                <div className="guides-articles-right">
                  <div
                    className="sidebar-search-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      padding: " 0px",
                      marginTop:'-3px'
                    }}
                  >
                    <Form
                      style={{ width: "90%", maxWidth: "400px" }}
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <Form.Group
                        controlId="searchArticle"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#f8f9fa",
                          borderRadius: "15px",
                          position: "relative",
                        }}
                      >
                        <Form.Control
                          type="text"
                          placeholder="Search guide..."
                          value={searchTerm}
                          onChange={handleInputChange}
                          style={{
                            border: "none",
                            background: "transparent",
                            borderRadius: "15px",
                            padding: "6px 40px 6px 8px",
                            fontSize: "15px",
                            width: "101%",
                            height: "35px",
                            color:'#202356'
                          }}
                        />
                        <Button
                          variant="link"
                          style={{
                            position: "absolute",
                            right: "12px",
                            color: "#6c757d",
                            padding: "0",
                            fontSize: "16px",
                          }}
                        >
                          <i className="fa-solid fa-magnifying-glass"  style={{color:'#6c757d'}}></i>{" "}
                        </Button>
                      </Form.Group>
                      {filteredSuggestions.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "60px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "90%",
                            maxWidth: "400px",
                            background: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                            zIndex: 1000,
                          }}
                        >
                          {filteredSuggestions
                            ?.slice(0, 5)
                            .map((item, index) => (
                              <div
                                key={index}
                                onClick={() => handleSuggestionClick(item)}
                                style={{
                                  padding: "8px 12px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f1f1f1",
                                }}
                              >
                                {item.title}
                              </div>
                            ))}
                        </div>
                      )}
                    </Form>
                  </div>

                  {/* Video Section */}
                  <Col
                    lg={12}
                    md={4}
                    sm={6}
                    xs={12}
                    className="related-guides-container"
                    style={{
                      padding: "15px",
                      margin: "10px",
                      height: "400px",
                      overflow: "auto",
                    }}
                  >
                    {guideArr
                      ?.filter((a) => a.id !== currentGuideId)
                      .map((data, index) => (
                        <Card
                          key={index}
                          className="guide-card"
                          style={{
                            backgroundColor: "#374442",
                            borderRadius: "15px",
                            padding: "15px",
                            margin: "10px auto",
                            color: "#ffffff",
                            position: "relative",
                            width: "100%",
                            height: "auto",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Card.Body
                            style={{ padding: "0", position: "relative" }}
                          >
                            {/* Play Button */}
                            <div
                              style={{
                                position: "absolute",
                                top: "15px",
                                left: "15px",
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#ffffff",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                src={`${imageBase}${data?.cover_image}`}
                                alt={data.title || "img"}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "100%",
                                }}
                              />
                              {/* <i className="fa-solid fa-play" style={{ color: "#374442", fontSize: "14px" }} ></i> */}
                            </div>

                            {/* Title */}
                            <Card.Title
                              as="h5"
                              style={{
                                fontSize: "28px",
                                fontWeight: "400",
                                marginTop: "70px",
                                textAlign: "left",
                                padding: "0 10px",
                              }}
                            >
                              <Link
                                to={`/guide-detail/${data?.id}`}
                                state={{ currentGuideId: data?.id }}
                                style={{
                                  color: "#ffffff",
                                  textDecoration: "none",
                                }}
                              >
                                {data?.title || "Title No Available"}
                              </Link>
                            </Card.Title>

                            {/* Metadata Section */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                fontSize: "12px",
                                opacity: "0.8",
                                padding: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap:'10px'
                                }}
                              >
                               <Image   style={{width:'18px'}}
                            src="/images/guides-articles/date.svg"
                            loading="lazy" alt="Date"
                          />
                                {data?.date || "Not Available"}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                   gap:'10px'
                                }}
                              >
                               <Image   style={{width:'18px'}}
                            src="/images/guides-articles/time.svg"
                            loading="lazy" alt="Time"
                          />
                                {data?.time_required || "Time not available"}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                  </Col>
                </div>
              </Col>

              {/* Author Section */}
              <Col md={4} className="author-section">
                <Card
                  style={{
                      borderRadius: "15px",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: isMobileWidth ? "14px" : "18px",
                        fontWeight: isMobileWidth ? "500" : "600",
                        marginBottom: "10px",
                        textAlign:"start",
                        marginLeft:'2px',
                        color:'black'
                      }}
                    >
                      Author:
                    </Card.Title>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: !isMobileWidth ?"10px":'2px',
                      }}
                    >
                      <img src="/images/guides-articles/user.svg"  style={{ fontSize: "20px",width:'35.64px',height:"35.64px",color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}/>
                      <span style={{ fontSize:isMobileWidth?"14px": "16px", fontWeight: "400" }}>
                        {guideDetails?.author_name}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Share Section */}
              <Col
                md={4}
                className="share-section"
                onClick={() => setShowShareModal(true)}
                style={{ cursor: "pointer" }}
              >
                <Card
                  style={{
                    borderRadius: "15px",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Card.Body
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Card.Title
                      style={{
                        fontSize: isMobileWidth ? "14px" : "18px",
                        fontWeight: isMobileWidth ? "500" : "600",
                        marginBottom: "10px",
                        textAlign: "center",
                        width: "100%",
                        color:'black'
                      }}
                    >
                      {/* {isMobileWidth ? "Share This guide:":"Share :" } */}
                      Share This Guide:
                    </Card.Title>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#4AEAB1",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // marginRight: "auto",
                      }}
                    >
                      {/* <img src="/images/guides-articles/share.svg" style={{ fontSize: isMobileWidth ? "16px" : "18px", color: "#333" }}/> */}
                    <img src="/images/guides-articles/share.svg"  style={{ fontSize: "20px",width:'35.64px',height:"35.64px",color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}/>

                    </div>
                  </Card.Body>
                </Card>
              </Col>
            {

             isMobileWidth && <hr style={{width:"95%", display:'flex', margin:"auto"}}/>
            }

              {isMobileWidth && (
                <Col lg={12}>
                  <div
                    className="help-center-touch mob-need"
                    style={{ textAlign: "center", padding: "40px 0" }}
                  >
                    <h4>Need to get in touch?</h4>
                    <p>
                      We'll start with some questions and get you to the right
                      place.
                    </p>
                    <Link
                      to="/contactUs"
                      className="btn"
                      style={{
                        backgroundColor: "#4AEAB1",
                        color: "#000",
                        padding: "10px 20px",
                        fontSize: isMobileWidth ? "14px" : "16px",
                        textDecoration: "none",
                        fontWeight: isMobileWidth ? "" : "bold",
                        borderRadius: "30px",
                      }}
                    >
                      Contact Us
                    </Link>
                  </div>
                </Col>
              )}
            </Row>

            {showShareModal && (
              <ShareModal onClose={() => setShowShareModal(false)} />
            )}
          </Container>
        </div>

        {/* Mobile Action Bar - Only shows on mobile */}
        <div className="mobile-action-bar d-lg-none">
          <div className="action-item">
            <div className="action-icon author-icon">
              <i className="fa-solid fa-user"></i>
            </div>
            <span className="action-label">Author</span>
          </div>
          <div className="action-item" onClick={() => setShowShareModal(true)}>
            <div className="action-icon share-icon">
              <i className="fa-solid fa-share-nodes"></i>
            </div>
            <span className="action-label">Share</span>
          </div>
        </div>
      </main>

      <AuthModal />
    </div>
  );
}

export default GuideDetails;


// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Image, Card, } from "react-bootstrap";
// import AuthModal from "../../../components/guest/authModal";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// import useCommon from "../../../hooks/useCommon";
// import { imageBase, KEYS } from "../../../config/Constant";
// import ShareModal from "../../../components/guest/bookingDetailsModal/ShareModal";

// function GuideDetails() {
//   const location = useLocation();
//   const { guideId } = location.state || {};
//   const { getGuideDetail, getGuideList } = useCommon();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const currentGuideId = guideId || id;
//   const [guideDetails, setGuideDetails] = useState();
//   const userType = localStorage.getItem(KEYS.USER_TYPE);
//   const [guideArr, setGuideArr] = useState([]);

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth();
//     window.addEventListener("resize", checkWindowWidth);

//     return () => window.removeEventListener("resize", checkWindowWidth);
//   }, []);

//   const fetchGuideDetails = async () => {
//     try {
//       const response = await getGuideDetail({ guide_id: currentGuideId });
//       setGuideDetails(response?.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchGuides = async () => {
//     const result = await getGuideList({ user_type: userType });
//     setGuideArr(result.data);
//   };

//   useEffect(() => {
//     fetchGuides();
//   }, [userType]);

//   useEffect(() => {
//     if (currentGuideId) {
//       fetchGuideDetails();
//     }
//   }, [currentGuideId]);

//   const [showShareModal, setShowShareModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredSuggestions, setFilteredSuggestions] = useState([]);

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     const suggestions =
//       guideArr?.filter((item) =>
//         item.title.toLowerCase().includes(value.toLowerCase())
//       ) || [];

//     setFilteredSuggestions(value ? suggestions : []);
//   };

//   const handleSuggestionClick = (item) => {
//     setSearchTerm(item?.title);
//     setFilteredSuggestions([]);
//     navigate(`/guide-detail/${item?.id}`, {
//       state: { currentGuideId: item?.id },
//     });
//   };

//   const capitalizeFirstLetter = (title) => {
//     // console.log('object')
//     if (!title) return title;
//     return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
//   };

//   return (
//     <div>
//       <main>
//         {/* Mobile Search Filter */}
//         <div className="mob-search-filter border-start-0 border-end-0">
//           <Container fluid>
//             <Row>
//               <Col>
//                 <div className="mob-search-filter-in">
//                   <div className="mob-search-bar-back">
//                     {/* <a onClick={(e) => {
//                       e.preventDefault();
//                       // console.log("#############################");
//                       navigate(-1)
//                     }}>
//                       <i className="fa-regular fa-arrow-left"></i>

//                     </a> */}
//                    <Link to="#" onClick={() => navigate(-1)}  >
//                       <i className="fa-regular fa-arrow-left" style={{ textAlign: 'center',marginLeft: !isMobileWidth && '10px' }}></i>
//                     </Link>


//                     {/* <Form style={{
//                       position: "relative",
//                       width: "100%",
//                       margin: "10px",
//                       height: "auto",
//                     }} >
//                       <Form.Group controlId="searchArticle"
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           background: "#f8f9fa",
//                           borderRadius: "15px",
//                           padding: "2px 10px",
//                         }} >
//                         <Form.Control
//                           type="text"
//                           placeholder="Search article..."
//                           style={{
//                             border: "none",
//                             boxShadow: "none",
//                             background: "transparent",
//                             borderRadius: "15px",
//                             padding: "6px 35px 6px 8px",
//                             fontSize: "15px",
//                             width: "100%",
//                             height: "35px",
//                           }} />
//                         <Button variant="link"
//                           style={{
//                             position: "absolute",
//                             right: "10px",
//                             color: "#6c757d",
//                             padding: "0",
//                             fontSize: "16px", // Adjust icon size
//                           }} >
//                           <i className="fa-regular fa-magnifying-glass"></i>
//                         </Button>
//                       </Form.Group>
//                     </Form> */}
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </div>

//         <div className="guides-articles-details guide-details-mobile" style={{ padding: isMobileWidth ?"0":"10px 23px", position: "relative" }}>
//           {/* Back Button */}
//           <div
//             className="web-navbar"
//             onClick={() => navigate(-1)}
//             style={{
//               left: "15px",
//               top: "50%",
//               height: "40px",
//               width: "40px",
//               borderRadius: "50%",
//               backgroundColor: "black",
//               transform: "translateY(-50%)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginLeft:'10px'
//             }}
//           >
//             <FaArrowLeft style={{ color: "white" }} />
//           </div>

//           <Container fluid>
//             <Row>
//               {/* Left Side - Article Details */}
//               <Col lg={8} md={6}>
//                 <div className="guides-articles-left">
//                   <div className="guides-articles-left-top">
//                     <div className="guides-articles-left-top-data">
//                       <p className="guide-category">{guideDetails?.category}</p>
//                       <h1 className="guide-title">
//                         {capitalizeFirstLetter(guideDetails?.title)}
//                       </h1>
//                       <ul className="guide-meta">
//                         <li>
//                           <Image
//                             src="/images/guides-articles/date.svg"
//                             loading="lazy" alt="Date"
//                           />
//                           {guideDetails?.date}
//                         </li>
//                         <li>
//                           <Image
//                             src="/images/guides-articles/time.svg"
//                             loading="lazy" alt="Time"
//                           />
//                           {guideDetails?.time_required}
//                         </li>
//                       </ul>
//                     </div>
//                     <div className="guides-articles-left-top-image guide-image-container">
//                       <Image
//                         src={`${imageBase}${guideDetails?.cover_image}`}
//                         loading="lazy" alt="Article"
//                         fluid
//                       />
//                     </div>
//                   </div>

//                   <div className="guides-articles-left-mid guide-content">
//                     <p
//                       dangerouslySetInnerHTML={{
//                         __html: guideDetails?.description,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </Col>

//               {/* Right Side - Sidebar */}
//               <Col lg={4} md={6}>
//                 <div className="guides-articles-right">
//                   <div
//                     className="sidebar-search-container"
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       width: "100%",
//                       padding: " 0px 10px",
//                       marginTop:'-3px'
//                     }}
//                   >
//                     <Form
//                       style={{ width: "90%", maxWidth: "400px" }}
//                       onSubmit={(e) => e.preventDefault()}
//                     >
//                       <Form.Group
//                         controlId="searchArticle"
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           background: "#f8f9fa",
//                           borderRadius: "15px",
//                           position: "relative",
//                         }}
//                       >
//                         <Form.Control
//                           type="text"
//                           placeholder="Search guide..."
//                           value={searchTerm}
//                           onChange={handleInputChange}
//                           style={{
//                             border: "none",
//                             background: "transparent",
//                             borderRadius: "15px",
//                             padding: "6px 40px 6px 8px",
//                             fontSize: "15px",
//                             width: "100%",
//                             height: "35px",
//                             color:'#202356'
//                           }}
//                         />
//                         <Button
//                           variant="link"
//                           style={{
//                             position: "absolute",
//                             right: "12px",
//                             color: "#6c757d",
//                             padding: "0",
//                             fontSize: "16px",
//                           }}
//                         >
//                           <i className="fa-solid fa-magnifying-glass"  style={{color:'#6c757d'}}></i>{" "}
//                         </Button>
//                       </Form.Group>
//                       {filteredSuggestions.length > 0 && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: "60px",
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                             width: "90%",
//                             maxWidth: "400px",
//                             background: "#fff",
//                             border: "1px solid #ddd",
//                             borderRadius: "8px",
//                             boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
//                             zIndex: 1000,
//                           }}
//                         >
//                           {filteredSuggestions
//                             ?.slice(0, 5)
//                             .map((item, index) => (
//                               <div
//                                 key={index}
//                                 onClick={() => handleSuggestionClick(item)}
//                                 style={{
//                                   padding: "8px 12px",
//                                   cursor: "pointer",
//                                   borderBottom: "1px solid #f1f1f1",
//                                 }}
//                               >
//                                 {item.title}
//                               </div>
//                             ))}
//                         </div>
//                       )}
//                     </Form>
//                   </div>

//                   {/* Video Section */}
//                   <Col
//                     lg={12}
//                     md={4}
//                     sm={6}
//                     xs={12}
//                     className="related-guides-container"
//                     style={{
//                       padding: "15px",
//                       margin: "10px",
//                       height: "400px",
//                       overflow: "auto",
//                     }}
//                   >
//                     {guideArr
//                       ?.filter((a) => a.id !== currentGuideId)
//                       .map((data, index) => (
//                         <Card
//                           key={index}
//                           className="guide-card"
//                           style={{
//                             backgroundColor: "#374442",
//                             borderRadius: "15px",
//                             padding: "15px",
//                             margin: "10px auto",
//                             color: "#ffffff",
//                             position: "relative",
//                             width: "100%",
//                             height: "auto",
//                             display: "flex",
//                             flexDirection: "column",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <Card.Body
//                             style={{ padding: "0", position: "relative" }}
//                           >
//                             {/* Play Button */}
//                             <div
//                               style={{
//                                 position: "absolute",
//                                 top: "15px",
//                                 left: "15px",
//                                 width: "32px",
//                                 height: "32px",
//                                 backgroundColor: "#ffffff",
//                                 borderRadius: "50%",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               <Image
//                                 src={`${imageBase}${data?.cover_image}`}
//                                 alt={data.title || "img"}
//                                 style={{
//                                   width: "32px",
//                                   height: "32px",
//                                   borderRadius: "100%",
//                                 }}
//                               />
//                               {/* <i className="fa-solid fa-play" style={{ color: "#374442", fontSize: "14px" }} ></i> */}
//                             </div>

//                             {/* Title */}
//                             <Card.Title
//                               as="h5"
//                               style={{
//                                 fontSize: "28px",
//                                 fontWeight: "400",
//                                 marginTop: "70px",
//                                 textAlign: "left",
//                                 padding: "0 10px",
//                               }}
//                             >
//                               <Link
//                                 to={`/guide-detail/${data?.id}`}
//                                 state={{ currentGuideId: data?.id }}
//                                 style={{
//                                   color: "#ffffff",
//                                   textDecoration: "none",
//                                 }}
//                               >
//                                 {data?.title || "Title No Available"}
//                               </Link>
//                             </Card.Title>

//                             {/* Metadata Section */}
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "20px",
//                                 fontSize: "12px",
//                                 opacity: "0.8",
//                                 padding: "10px",
//                                 marginTop: "10px",
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap:'10px'
//                                 }}
//                               >
//                                <Image   style={{width:'18px'}}
//                             src="/images/guides-articles/date.svg"
//                             loading="lazy" alt="Date"
//                           />
//                                 {data?.date || "Not Available"}
//                               </div>
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                    gap:'10px'
//                                 }}
//                               >
//                                <Image   style={{width:'18px'}}
//                             src="/images/guides-articles/time.svg"
//                             loading="lazy" alt="Time"
//                           />
//                                 {data?.time_required || "Time not available"}
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       ))}
//                   </Col>
//                 </div>
//               </Col>

//               {/* Author Section */}
//               <Col md={4} className="author-section">
//                 <Card
//                   style={{
//                       borderRadius: "15px",
//                     padding: "10px",
//                     textAlign: "center",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Card.Body>
//                     <Card.Title
//                       style={{
//                         fontSize: isMobileWidth ? "14px" : "16px",
//                         fontWeight: isMobileWidth ? "500" : "600",
//                         marginBottom: "10px",
//                         textAlign:"start",
//                         marginLeft:'10px'
//                       }}
//                     >
//                       Author :
//                     </Card.Title>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: !isMobileWidth ?"10px":'2px',
//                       }}
//                     >
//                       <i className="fa-solid fa-user" style={{ fontSize: "20px",width:'40px',height:"40px",background:'black',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}></i>
//                       <span style={{ fontSize:isMobileWidth?"14px": "16px", fontWeight: "400" }}>
//                         {guideDetails?.author_name}
//                       </span>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Share Section */}
//               <Col
//                 md={4}
//                 className="share-section"
//                 onClick={() => setShowShareModal(true)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <Card
//                   style={{
//                     borderRadius: "15px",
//                     padding: "10px",
//                     textAlign: "center",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Card.Body
//                     style={{
//                       width: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Card.Title
//                       style={{
//                         fontSize: isMobileWidth ? "14px" : "16px",
//                         fontWeight: isMobileWidth ? "500" : "600",
//                         marginBottom: "10px",
//                         textAlign: "center",
//                         width: "100%",
//                       }}
//                     >
//                       {/* {isMobileWidth ? "Share This guide:":"Share :" } */}
//                       Share This Guide:
//                     </Card.Title>
//                     <div
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         backgroundColor: "#4AEAB1",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         // marginRight: "auto",
//                       }}
//                     >
//                       <i className="fa-solid fa-share-nodes" style={{ fontSize: isMobileWidth ? "16px" : "18px", color: "#333" }}></i>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             {

//              isMobileWidth && <hr style={{width:"95%", display:'flex', margin:"auto"}}/>
//             }

//               {isMobileWidth && (
//                 <Col lg={12}>
//                   <div
//                     className="help-center-touch mob-need"
//                     style={{ textAlign: "center", padding: "40px 0" }}
//                   >
//                     <h4>Need to get in touch?</h4>
//                     <p>
//                       We'll start with some questions and get you to the right
//                       place.
//                     </p>
//                     <Link
//                       to="/contactUs"
//                       className="btn"
//                       style={{
//                         backgroundColor: "#4AEAB1",
//                         color: "#000",
//                         padding: "10px 20px",
//                         fontSize: isMobileWidth ? "14px" : "16px",
//                         textDecoration: "none",
//                         fontWeight: isMobileWidth ? "" : "bold",
//                         borderRadius: "30px",
//                       }}
//                     >
//                       Contact Us
//                     </Link>
//                   </div>
//                 </Col>
//               )}
//             </Row>

//             {showShareModal && (
//               <ShareModal onClose={() => setShowShareModal(false)} />
//             )}
//           </Container>
//         </div>

//         {/* Mobile Action Bar - Only shows on mobile */}
//         <div className="mobile-action-bar d-lg-none">
//           <div className="action-item">
//             <div className="action-icon author-icon">
//               <i className="fa-solid fa-user"></i>
//             </div>
//             <span className="action-label">Author</span>
//           </div>
//           <div className="action-item" onClick={() => setShowShareModal(true)}>
//             <div className="action-icon share-icon">
//               <i className="fa-solid fa-share-nodes"></i>
//             </div>
//             <span className="action-label">Share</span>
//           </div>
//         </div>
//       </main>

//       <AuthModal />
//     </div>
//   );
// }

// export default GuideDetails;
