import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useCommon from "../hooks/useCommon";
import { imageBase } from "../config/Constant";
import { Container, Row, Col, Image,Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";


const ExploreGuides = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { getGuideList } = useCommon();

  const { user_fname, user_lname } = location.state || {};

  const [type, setType] = useState(location.state?.type || localStorage.getItem("type") || "guest");
  const [guideArr, setGuideArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredGuides1, setFilteredGuides1] = useState([]);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  useEffect(() => {
    localStorage.setItem("type", type);
  }, [type]);

  const fetchGuides = async () => {
    const result = await getGuideList({ user_type: type });
    setGuideArr(result.data);

    if (searchQuery === "") {
      setFilteredGuides1(result?.data || []);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [type, searchQuery.length == 0]);

  const handleSearch = (e) => {
    if (searchQuery === "") {
      setFilteredGuides1(guideArr);
    } else {
      const filtered = guideArr.filter((guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGuides1(filtered);
    }
  };

  return (
    <>
      <main style={{
          backgroundColor: "white",
          backgroundImage: " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="explore-guides-articles-wrap explore-guides-mobile"
          style={{ padding: isMobileWidth ? "0 10px" : "0px 22px 15px"}}>
          <Container fluid>
            <Row className="align-items-center">
              <Col xs={12} className="d-flex flex-column align-items-center position-relative" >
                <div className="mobile-back-button" onClick={() => navigate("/helpCenter")}
                  // onClick={() => navigate(-1)}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    height: "40px",
                    width: "40px",
                    borderRadius: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color:isMobileWidth? "#333":"white",
                    border:"1px solid #333",
                    backgroundColor :!isMobileWidth && "black"
                  }}>
                  {/* <FaArrowLeft style={{ color: "white" }} /> */}
                  <i className="fa-regular fa-arrow-left" style={{textAlign:'center'}}></i>
                </div>

                {isMobileWidth ? (
                  <>
                    <Col className="d-flex justify-content-center">
                      <div className="search-container mt-2"
                        style={{
                          maxWidth: "400px",
                          width: "80%",
                          position: "relative",
                        }}
                      >
                        <input
                          className="search-input"
                          type="text"
                          placeholder="Search question"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch(e);
                          }}
                          style={{
                            borderRadius: "30px",
                            border: "1px solid #37474F",
                            padding: "10px 15px",
                            height: "45px",
                            width: "100%",
                            transition: "all 0.3s ease-in-out",
                          }}
                        />

                        <div
                          className="search-icon"
                          onClick={handleSearch}
                          style={{
                            position: "absolute",
                            right: "5px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: "35px",
                            width: "35px",
                            borderRadius: "50%",
                            backgroundColor: "#37474F",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 999999,
                            cursor: "pointer",
                          }}
                        >
                          <IoSearchSharp
                            style={{
                              fontSize: "18px", // Smaller size like image
                              color: "#fff",
                            }}
                          />
                        </div>
                      </div>               
                    </Col>
               
                  </>
                ) : (
                  
                  <h1 className="text-center mb-3 text-black explore-title">
                    Explore Guides
                  </h1>

                  
                )}
              </Col>


              {isMobileWidth && (

                <>
                   <div
                className="title-divider"
                style={{
                  margin: "30px 0px",
                  top: "50%",
                  left: "0",
                  fontWeight: "400",
                  width: "100%",
                  height: "0.1px",
                  background: "#000000",
                  opacity: 0.3, // Decreases opacity to 30%
                  zIndex: 10, // Ensures the line is behind the buttons
                  transform: "translateY(-50%)", // Centers the line exactly in the middle
                }}
              ></div>
                         
                  <div className="help-center-top" style={{ textAlign: "center", padding: "30px 0" }}>

                     <h6> Hi&nbsp; {user_fname && user_lname ? user_fname + " " + user_lname : type || "Guest"}, how can we help?
                  </h6>                   
                                          <Button disabled={type === "host"} onClick={() => setType("guest")}
                                            style={{
                                              borderRadius: "20px",
                                              backgroundColor: type === "guest" ? "#3A4B4C" : "transparent",
                                              color: type === "guest" ? "white" : "#3A4B4C",
                                              border: type === "guest" ? "none" : "1px solid #3A4B4C",
                                               padding: type === "host" ? "13px 15px" : "11px 15px",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              cursor: type === "host" ? "not-allowed" : "pointer",
                                              marginRight:'10px',
                                              marginTop:'10px'
                                            }} >
                                            Guest
                                          </Button>
                       
                                          <Button disabled={type === "guest"} onClick={() => setType("host")}
                                            style={{
                                              borderRadius: "20px",
                                              backgroundColor: type === "host" ? "#3A4B4C" : "transparent",
                                              color: type === "host" ? "white" : "#3A4B4C",
                                              border: type === "host" ? "none" : "1px solid #3A4B4C",
                                              padding: type === "host" ? "12px 15px" : "11px 15px",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              marginTop:'10px',
                                              cursor: type === "guest" ? "not-allowed" : "pointer",
                                            }} >
                                            Host
                                          </Button>
                       
                                        { !isMobileWidth && (
                                             <span style={{
                                              top: "50%",
                                              left: "0",
                                              fontWeight: "400",
                                              width: "100%",
                                              height: "0.1px",
                                              background: "#000000",
                                              opacity: 0.3,
                                              zIndex: 10,
                                              transform: "translateY(-50%)",
                                            }} ></span>
                                        ) 
                                       }                                                       
                </div>

                
                
                </>
              
              )}

            { !isMobileWidth && <div
                className="title-divider"
                style={{
                  margin: "30px 0px",
                  top: "50%",
                  left: "0",
                  fontWeight: "400",
                  width: "100%",
                  height: "0.1px",
                  background: "#000000",
                  opacity: 0.3, // Decreases opacity to 30%
                  zIndex: 10, // Ensures the line is behind the buttons
                  transform: "translateY(-50%)", // Centers the line exactly in the middle
                }}
              ></div>}
              {(type === "guest" && !isMobileWidth) && (
                <Col className="d-flex justify-content-center">
                  <div
                    className="search-container"
                    style={{
                      maxWidth: "400px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search question"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch(e);
                      }}
                      style={{
                        borderRadius: "30px",
                        border: "1px solid #E5E5E5",
                        padding: "10px 15px",
                        height: "45px",
                        width: "100%",
                        transition: "all 0.3s ease-in-out",
                      }}
                    />

                    <div
                      className="search-icon"
                      onClick={handleSearch}
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: "35px",
                        width: "35px",
                        borderRadius: "50%",
                        backgroundColor: "#37474F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999999,
                        cursor: "pointer",
                      }}
                    >
                      <IoSearchSharp
                        style={{
                          fontSize: "18px", // Smaller size like image
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                </Col>
              )}
            </Row>
            <Row className="mt-lg-4 mb-4">
              <Col xs={12} md={6} lg={4} className="d-flex">
                <h3 className="section-title" style={{color:"black",marginTop:isMobileWidth?"-8px":'50px'}}>Our new guides</h3>
              </Col>
            </Row>
            <Row className="explore-guides-articles-inner mt-4 guides-container">
              {filteredGuides1.length > 0 ? (
                filteredGuides1.map((guide, index) => (
                  <>
                    <Col
                      lg={3}
                      md={4}
                      sm={6}
                      xs={12}
                      key={index}
                      className="mb-4 guide-column"
                    >
                      <div className="explore-guides-articles-in text-center guide-item" style={{padding:isMobileWidth && '0px 10px'}}>
                        <Link to={`/guide-detail/${guide.id}`}
                          state={{ guideId: guide?.id }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="explore-guides-articles-image guide-image-container" style={{height:isMobileWidth && "260px "}}>
                            <Image src={`${imageBase}${guide.cover_image}`}
                              alt={`Cover image of ${guide.title}`}
                              fluid />
                          </div>
                          <h3 className="mt-2 text-start guide-title">
                            {guide.title}
                          </h3>
                          <p
                            className=" text-start guide-description"
                            style={{ fontSize: "14px", color: "black" ,opacity:'50%'}}
                          >
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </p>
                        </Link>
                      </div>
                    </Col>
                    {(index + 1) % 4 === 0 && (
                      <Col lg={12}>
                        <hr
                          style={{
                            borderTop: "2px solid #ccc",
                            margin: "20px 0",
                          }}
                        />
                      </Col>
                    )}
                  </>
                ))
              ) : (
                <Col lg={12} className="text-center mt-4">
                  <p>No guides found.</p>
                </Col>
              )}
            </Row>

            <Col lg={12} className="text-center">
              <div className={isMobileWidth ? "mob-show-map animate__animated animate__backInUp animate__delay-1s":  "help-center-touch contact-section"}
                style={{
                  padding: "40px 0px  0px 0px",
                  borderRadius: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link
                  to="/contactUs"
                  className="btn"
                  style={{
                    backgroundColor: "#4AEAB1",
                    color: "#000",
                    padding: "10px 20px",
                    fontSize: isMobileWidth ? "14px": "16px",
                    textDecoration: "none",
                    fontWeight: isMobileWidth ? "400": "500",
                    borderRadius: "30px",
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </Col>
          </Container>
        </div>
      </main>
    </>
  );
};

export default ExploreGuides;
