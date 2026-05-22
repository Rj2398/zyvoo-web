import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image,Button } from "react-bootstrap";
import useCommon from "../hooks/useCommon";
import { imageBase } from "../config/Constant";
import { FaArrowLeft } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";


const ExploreArticles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchText } = location.state || {};

  const { user_fname, user_lname } = location.state || {};

  const type =
    location.state?.type ||
    location.state?.useTypes ||
    localStorage.getItem("USER_TYPE") ||
    "guest";
  const [filteredArticles1, setFilteredArticles1] = useState([]);
  const { getArticleList } = useCommon();
  const [articleArr, setArticleArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const fetchArticles = async () => {
    const result = await getArticleList({ user_type: type });
    setArticleArr(result?.data || []);
    if (searchQuery === "") {
      setFilteredArticles1(result?.data || []);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [type, searchQuery.length == 0]); // Removed searchQuery dependency here

  const handleSearch = (e) => {
    if (searchQuery === "") {
      // If search is empty, show all articles
      setFilteredArticles1(articleArr);
    } else {
      const filtered = articleArr.filter((guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles1(filtered);
    }
  };

  return (
    <>
      <main
        style={{
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
          backgroundSize: "20px 20px",
       
        }}
      >
        <div className="explore-guides-articles-wrap mob-explore-article"
         style={{ padding: isMobileWidth ? "0 10px" : "0px 22px 15px"}}>
          <Container fluid >
            <Row className="align-items-center">
              {/* <Col xs={12} className="d-flex flex-column align-items-center position-relative" >
                <div className="mobile-back-button" onClick={() => navigate("/helpCenter")}
                
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
                    color: "#333",
                    border:"1px solid #333",
                  }}>
                 
                  <i className="fa-regular fa-arrow-left" style={{textAlign:'center'}}></i>
                </div>

                {isMobileWidth ? (
                  <>
                    <Col className="d-flex justify-content-center">
                      <div
                        style={{
                          maxWidth: "400px",
                          width: "75%",
                          position: "relative",
                        }}
                      >
                        <input
                          type="text"
                     
                          placeholder={"Search questions"}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch(e);
                          }}
                          style={{
                            borderRadius: "30px",
                            border: "1px solid #E5E5E5",
                            padding: "10px 15px",
                            height: "40px",
                            width: "100%",
                            transition: "all 0.3s ease-in-out",
                          }}
                        />

                        <div
                          onClick={handleSearch}
                          style={{
                            position: "absolute",
                            right: "5px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: "30px",
                            width: "30px",
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
                              fontSize: "14px", // Smaller size like image
                              color: "#fff",
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </>
                ) : (
                  <h1 className="text-center mb-3">Explore Articles</h1>
                )}
              </Col> */}

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
                                    Explore Articles
                                  </h1>
                                )}
                              </Col>


              {/* {isMobileWidth && (
                <div
                  className="help-center-top"
                  style={{ textAlign: "center", padding: "30px 0" }}
                >
                  <h6>
                    Hi&nbsp;
                    {user_fname && user_lname
                      ? user_fname + " " + user_lname
                      : type || "Guest"}
                    , how can we help?
                  </h6>
                </div>
              )} */}


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

              {/* <div
                style={{
                  fontWeight: "400",
                  width: "100%",
                  height: "1px",
                  background: "#000000",
                  opacity: 0.3,
                  zIndex: 10,
                }}
              ></div> */}

                 {/* <div
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
              ></div> */}

              {(type === "guest" && !isMobileWidth) && (
                <Col className="d-flex justify-content-center">
                  <div
                    style={{
                      maxWidth: "400px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <input
                      type="text"
                      // placeholder={searchText ? searchText : "Search Articles"}
                      placeholder={"Search questions"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch(e);
                      }}
                      style={{
                        borderRadius: "30px",
                        border: "1px solid #E5E5E5",
                        padding: "10px 15px",
                        height: "40px",
                        width: "100%",
                        transition: "all 0.3s ease-in-out",
                      }}
                    />

                    <div
                      onClick={handleSearch}
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: "30px",
                        width: "30px",
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
                          fontSize: "14px", // Smaller size like image
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                </Col>
              )}
            </Row>
            <Row className="mt-4 mb-4">
              <Col xs={12} md={6} lg={4} className="d-flex">
                <h3 className="section-title" style={{color:'black',marginTop:isMobileWidth?"-32px":'50px',fontWeight:'400'}} >Our new articles</h3>
              </Col>
            </Row>
            <Row className="explore-guides-articles-inner mt-4">
              {filteredArticles1.length > 0 ? (
                filteredArticles1.map((article, index) => (
                  <Col
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    key={index}
                    className="mb-4"
                  >
                    <div className="explore-guides-articles-in text-center">
                      <Link
                        to={`/articles-detail/${article?.id}`}
                        state={{ articleId: article?.id }}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className="explore-guides-articles-image" style={{height:isMobileWidth && "260px "}}>
                          <Image src={`${imageBase}${article.cover_image}`}
                            alt={`Cover image of ${article.title}`}
                            fluid />
                        </div>
                        <h3 className="mt-2 text-start">{article.title}</h3>
                        <div className="article-description text-start"  style={{ fontSize: "14px", color: "black" }}>
                          {(<p dangerouslySetInnerHTML={{ __html: article?.description}}/>) ||
                            "No Data Found."}
                        </div>
                      </Link>
                    </div>
                  </Col>
                ))
              ) : (
                <Col lg={12} className="text-center mt-4">
                  <p>No Article found.</p>
                </Col>
              )}
            </Row>

            <Col lg={12} className="text-center">
              <div  className={isMobileWidth ? "mob-show-map animate__animated animate__backInUp animate__delay-1s":  "help-center-touch"}
                style={{
                  padding: "40px 0",
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

export default ExploreArticles;
