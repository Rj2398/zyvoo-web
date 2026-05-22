import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
 
import AuthModal from "../components/guest/authModal";
import useCommon from "../hooks/useCommon";
import { imageBase, KEYS } from "../config/Constant";
import { IoSearchSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
 
function HelpCenter() {
      const {userInfo} = useSelector(({user})=>user)
  const location = useLocation();
  const navigate =useNavigate();
  const [type, setType] = useState(localStorage.getItem("USER_TYPE") || "guest");
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  
 
  const userId =userInfo?.user_id ? String(userInfo?.user_id) : null|| userData?.user_id ? String(userData?.user_id) : null;
 
  const { helpCenter } = useCommon();
  const [helpCenterData, setHelpCenterData] = useState();
  const [articleArr, setArticleArr] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [guideArr, setGuideArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
 
  const [isMobileWidth,setIsMobileWidth]=useState(false)
 
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };
 
    checkWindowWidth(); // run on mount
    window.addEventListener('resize', checkWindowWidth);
 
    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);
 
  const fetchHeplcenter = async () => {
    const result = await helpCenter({
      user_id: userId,
      user_type: type,
    });
    setHelpCenterData(result?.data);
    setGuideArr(result?.data?.guides);
    setArticleArr(result?.data?.articles);
    // Initialize filtered data with all items
    setFilteredArticles(result?.data?.articles || []);
    setFilteredGuides(result?.data?.guides || []);
  };
 
  useEffect(() => {
    fetchHeplcenter();
  }, [type, searchQuery.length == 0]);
 
  const handleSearch = async (e) => {
    // e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
 
    if (query === "") {
      // If search query is empty, show all items
      setFilteredArticles(articleArr);
      setFilteredGuides(guideArr);
      return;
    }
 
    // Filter articles
    const filteredArticles = articleArr.filter((article) =>
      article.title.toLowerCase().includes(query)
    );
 
    // Filter guides
    const filteredGuides = guideArr.filter((guide) =>
      guide.title.toLowerCase().includes(query)
    );
 
    setFilteredArticles(filteredArticles);
    setFilteredGuides(filteredGuides);
  };
 
  const capitalizeFirstLetter = (title) => {
    if (!title) return title;
    return title.charAt(0).toUpperCase() + title.slice(1);
  };
 
  return (
    <>
      <main style={{
          backgroundColor: "white",
          backgroundImage: " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
          backgroundSize: "20px 20px",
        }} >
        {/* Mobile Back Button */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link  onClick={() => navigate(-1)} style={{ padding:"0"}}>
                      <i className="fa-regular fa-arrow-left" style={{textAlign:'center'}}></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <div className="help-center-wrap" style={{margin : isMobileWidth ? "0" : "auto", padding : isMobileWidth ? "0" : "auto"}}>
          <Container fluid style={{margin : isMobileWidth ? "0" : "auto", padding : isMobileWidth ? "0" : "auto"}}>
            <Row style={{ padding: isMobileWidth ? "0" :"0 26px", margin: isMobileWidth ? "0" : "0 -15px"}}>
              <Col lg={12}>
                <div className="help-center-top" style={{ textAlign: "center", padding:isMobileWidth?"10px 0":"30px 0", }} >
                   <h1 > Hi&nbsp;
                    {helpCenterData?.user_fname && helpCenterData?.user_lname
                      ? helpCenterData?.user_fname + " " + helpCenterData?.user_lname : type || "Guest"}
                    , how can we help?
                  </h1>
                </div>
                { !isMobileWidth && type === "host" && (
                  <Col className="d-flex justify-content-center">
                    <div style={{
                        maxWidth: "400px",
                        width: "100%",
                        position: "relative",
                      }} >
                      <input type="text" placeholder="Search question" value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearch(e);
                        }}
                        style={{
                          borderRadius: "30px",
                          border: "1px solid #37474F",
                          padding: "10px 15px",
                          height: "40px",
                          width: "100%",
                          transition: "all 0.3s ease-in-out",
                        }} />
 
                      <div onClick={handleSearch} style={{
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
                        }} >
                        <IoSearchSharp style={{ fontSize: "14px", color: "#fff"}} />
                      </div>
                    </div>
                  </Col>
                )}
 
                <div className="help-center-mid" style={{ textAlign: "center" }} >
                  <div className="help-center-btn"
                    style={{
                      display: "flex",
                      gap: "10px",
                      borderRadius: "30px",
                      alignItems: "center",
                      background: "transparent",
                      zIndex: 2,
                      position: "relative",
                      marginLeft: "-3px",
                    }} >
                    <Button disabled={type === "host"} onClick={() => setType("guest")}
                      style={{
                        borderRadius: "20px",
                        backgroundColor: type === "guest" ? "#3A4B4C" : "transparent",
                        color: type === "guest" ? "white" : "#3A4B4C",
                        border: type === "guest" ? "none" : "1px solid #3A4B4C",
                        padding: type === "guest" ? "6px 15px" : "4px 15px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: type === "host" ? "not-allowed" : "pointer",
                      }} >
                      Guest
                    </Button>
 
                    <Button disabled={type === "guest"} onClick={() => setType("host")}
                      style={{
                        borderRadius: "20px",
                        backgroundColor: type === "host" ? "#3A4B4C" : "transparent",
                        color: type === "host" ? "white" : "#3A4B4C",
                        border: type === "host" ? "none" : "1px solid #3A4B4C",
                        padding: type === "host" ? "5px 15px" : "4px 17px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: type === "guest" ? "not-allowed" : "pointer",
                        height: isMobileWidth ? "40px" : ""
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
 
                  <h2 style={{ marginTop: "20px" }}>
                    Guides for {type === "guest" ? "Guest" : "Hosts"}{" "}
                    <Link to="/explore-guides" state={{ type: type, user_fname: helpCenterData?.user_fname,
                      user_lname: helpCenterData?.user_lname }}>
                      Browse all Guides{" "}
                      <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                  </h2>
                </div>
              </Col>
 
              {filteredGuides.map((guide, index) => (
                <Col lg={3} md={3} xs={6} key={guide?.id} className={isMobileWidth?"mb-0":'mb-4' } >
                  <Card className="help-center-guides" style={{
                      textAlign: "center",
                      borderRadius: "22px",
                      padding: "0px",
                      border: "none",
                    }} >
                    <Link to={`/guide-detail/${guide.id}`} state={{ guideId: guide?.id }} >
                      <Card.Img variant="top" src={`${imageBase}${guide.cover_image}`} loading="lazy" alt="guide-detail"
                        style={{
                          width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px",
                        }} />
                    </Link>
                    <Card.Body>
                      <Card.Text style={{ textTransform:"none"}}>
                        {capitalizeFirstLetter(guide.title)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
 
              <Row className="mt-4" style={{margin : isMobileWidth &&  "0" , padding : isMobileWidth ? "0" : "auto"}}>
                <Col lg={12} className="mb-3">
                  <div className="help-center-mid" style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      
                    }} >
                    <h2 style={{ marginBottom:isMobileWidth?"1px":"20px",padding:'0' }}>
                      Top Articles{" "}
                      <Link to="/exploreArticles" state={{ type: type,
                          user_fname: helpCenterData?.user_fname, user_lname: helpCenterData?.user_lname }}>
                        Browse all Article's{" "}
                        <i className="fa-regular fa-chevron-right"></i>
                      </Link>
                    </h2>
                  </div>
                </Col>
 
                {filteredArticles.map((article, index) => (
                  <Col lg={4} md={6} key={index} className="mb-4" >
                    <Card className="help-center-articles"
                      style={{ border: "0", padding: "0", textAlign: "left", }} >
                      <Card.Body>
                        <Card.Title style={{ marginBottom: "15px" }} >
                          <Link to={`/articles-detail/${article?.id}`}
                            style={{ textDecoration: "none", color: "black" }}
                            state={{ articleId: article?.id }} >
                            {article.title}
                          </Link>
                        </Card.Title>
                        {/* <Card.Text> */}
                          <div dangerouslySetInnerHTML={{ __html: article?.description, }} />
                        {/* </Card.Text> */}
                      </Card.Body>
                      <div style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#ccc",
                          opacity: 0.7,
                        }}
                      ></div>
                    </Card>
                  </Col>
                ))}
              </Row>
 
              <Col lg={12}>
                <div className="help-center-touch mob-need"
                  style={{ textAlign: "center", padding: "40px 0" }} >
                  <h4>Need to get in touch?</h4>
                  <p> We'll start with some questions and get you to the right place. </p>
                  <Link to="/contactUs" className="btn"
                    style={{
                      backgroundColor: "#4AEAB1",
                      color: "#000",
                      padding: "10px 20px",
                      fontSize: "16px",
                      textDecoration: "none",
                      fontWeight: isMobileWidth?"":"bold",
                      borderRadius: "30px",
                    }} >
                    Contact Us
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
      <AuthModal />
    </>
  );
}
 
export default HelpCenter;

// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button, } from "react-bootstrap";
// import { Link, useLocation, useNavigate } from "react-router-dom";
 
// import AuthModal from "../components/guest/authModal";
// import useCommon from "../hooks/useCommon";
// import { imageBase, KEYS } from "../config/Constant";
// import { IoSearchSharp } from "react-icons/io5";
 
// function HelpCenter() {
//   const location = useLocation();
//   const navigate =useNavigate();
//   const [type, setType] = useState(localStorage.getItem("USER_TYPE") || "guest");
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  
 
//   const userId = userData?.user_id ? String(userData?.user_id) : null;
 
//   const { helpCenter } = useCommon();
//   const [helpCenterData, setHelpCenterData] = useState();
//   const [articleArr, setArticleArr] = useState([]);
//   const [filteredArticles, setFilteredArticles] = useState([]);
//   const [filteredGuides, setFilteredGuides] = useState([]);
//   const [guideArr, setGuideArr] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
 
//   const [isMobileWidth,setIsMobileWidth]=useState(false)
 
//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };
 
//     checkWindowWidth(); // run on mount
//     window.addEventListener('resize', checkWindowWidth);
 
//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, []);
 
//   const fetchHeplcenter = async () => {
//     const result = await helpCenter({
//       user_id: userId,
//       user_type: type,
//     });
//     setHelpCenterData(result?.data);
//     setGuideArr(result?.data?.guides);
//     setArticleArr(result?.data?.articles);
//     // Initialize filtered data with all items
//     setFilteredArticles(result?.data?.articles || []);
//     setFilteredGuides(result?.data?.guides || []);
//   };
 
//   useEffect(() => {
//     fetchHeplcenter();
//   }, [type, searchQuery.length == 0]);
 
//   const handleSearch = async (e) => {
//     // e.preventDefault();
//     const query = searchQuery.toLowerCase().trim();
 
//     if (query === "") {
//       // If search query is empty, show all items
//       setFilteredArticles(articleArr);
//       setFilteredGuides(guideArr);
//       return;
//     }
 
//     // Filter articles
//     const filteredArticles = articleArr.filter((article) =>
//       article.title.toLowerCase().includes(query)
//     );
 
//     // Filter guides
//     const filteredGuides = guideArr.filter((guide) =>
//       guide.title.toLowerCase().includes(query)
//     );
 
//     setFilteredArticles(filteredArticles);
//     setFilteredGuides(filteredGuides);
//   };
 
//   const capitalizeFirstLetter = (title) => {
//     if (!title) return title;
//     return title.charAt(0).toUpperCase() + title.slice(1);
//   };
 
//   return (
//     <>
//       <main style={{
//           backgroundColor: "white",
//           backgroundImage: " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
//           backgroundSize: "20px 20px",
//         }} >
//         {/* Mobile Back Button */}
//         <div className="mob-search-filter border-start-0 border-end-0">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="mob-search-filter-in">
//                   <div className="mob-search-bar-back">
//                     <Link  onClick={() => navigate(-1)} style={{ padding:"0"}}>
//                       <i className="fa-regular fa-arrow-left" style={{textAlign:'center'}}></i>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
 
//         <div className="help-center-wrap" style={{margin : isMobileWidth ? "0" : "auto", padding : isMobileWidth ? "0" : "auto"}}>
//           <Container fluid style={{margin : isMobileWidth ? "0" : "auto", padding : isMobileWidth ? "0" : "auto"}}>
//             <Row style={{ padding: isMobileWidth ? "0" :"0 20px", margin: isMobileWidth ? "0" : "0 -15px"}}>
//               <Col lg={12}>
//                 <div className="help-center-top" style={{ textAlign: "center", padding:isMobileWidth?"10px 0":"30px 0", }} >
//                    <h1 > Hi&nbsp;
//                     {helpCenterData?.user_fname && helpCenterData?.user_lname
//                       ? helpCenterData?.user_fname + " " + helpCenterData?.user_lname : type || "Guest"}
//                     , how can we help?
//                   </h1>
//                 </div>
//                 { !isMobileWidth && type === "host" && (
//                   <Col className="d-flex justify-content-center">
//                     <div style={{
//                         maxWidth: "400px",
//                         width: "100%",
//                         position: "relative",
//                       }} >
//                       <input type="text" placeholder="Search question" value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") handleSearch(e);
//                         }}
//                         style={{
//                           borderRadius: "30px",
//                           border: "1px solid #37474F",
//                           padding: "10px 15px",
//                           height: "40px",
//                           width: "100%",
//                           transition: "all 0.3s ease-in-out",
//                         }} />
 
//                       <div onClick={handleSearch} style={{
//                           position: "absolute",
//                           right: "5px",
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           height: "30px",
//                           width: "30px",
//                           borderRadius: "50%",
//                           backgroundColor: "#37474F",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           zIndex: 999999,
//                           cursor: "pointer",
//                         }} >
//                         <IoSearchSharp style={{ fontSize: "14px", color: "#fff"}} />
//                       </div>
//                     </div>
//                   </Col>
//                 )}
 
//                 <div className="help-center-mid" style={{ textAlign: "center" }} >
//                   <div className="help-center-btn"
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                       borderRadius: "30px",
//                       alignItems: "center",
//                       background: "transparent",
//                       zIndex: 2,
//                       position: "relative",
//                       margin: "0px",
//                     }} >
//                     <Button disabled={type === "host"} onClick={() => setType("guest")}
//                       style={{
//                         borderRadius: "20px",
//                         backgroundColor: type === "guest" ? "#3A4B4C" : "transparent",
//                         color: type === "guest" ? "white" : "#3A4B4C",
//                         border: type === "guest" ? "none" : "1px solid #3A4B4C",
//                         padding: "5px 15px",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         cursor: type === "host" ? "not-allowed" : "pointer",
//                       }} >
//                       Guest
//                     </Button>
 
//                     <Button disabled={type === "guest"} onClick={() => setType("host")}
//                       style={{
//                         borderRadius: "20px",
//                         backgroundColor: type === "host" ? "#3A4B4C" : "transparent",
//                         color: type === "host" ? "white" : "#3A4B4C",
//                         border: type === "host" ? "none" : "1px solid #3A4B4C",
//                         padding: "5px 15px",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         cursor: type === "guest" ? "not-allowed" : "pointer",
//                       }} >
//                       Host
//                     </Button>
 
//                   { !isMobileWidth && (
//                        <span style={{
//                         top: "50%",
//                         left: "0",
//                         fontWeight: "400",
//                         width: "100%",
//                         height: "0.1px",
//                         background: "#000000",
//                         opacity: 0.3,
//                         zIndex: 10,
//                         transform: "translateY(-50%)",
//                       }} ></span>
//                   ) 
//                  }
//                   </div>
 
//                   <h2 style={{ marginTop: "20px" }}>
//                     Guides for {type === "guest" ? "Guest" : "Hosts"}{" "}
//                     <Link to="/explore-guides" state={{ type: type, user_fname: helpCenterData?.user_fname,
//                       user_lname: helpCenterData?.user_lname }}>
//                       Browse all Guides{" "}
//                       <i className="fa-regular fa-chevron-right"></i>
//                     </Link>
//                   </h2>
//                 </div>
//               </Col>
 
//               {filteredGuides.map((guide, index) => (
//                 <Col lg={3} md={3} xs={6} key={guide?.id} className={isMobileWidth?"mb-0":'mb-4' } >
//                   <Card className="help-center-guides" style={{
//                       textAlign: "center",
//                       borderRadius: "22px",
//                       padding: "0px",
//                       border: "none",
//                     }} >
//                     <Link to={`/guide-detail/${guide.id}`} state={{ guideId: guide?.id }} >
//                       <Card.Img variant="top" src={`${imageBase}${guide.cover_image}`} loading="lazy" alt="guide-detail"
//                         style={{
//                           width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px",
//                         }} />
//                     </Link>
//                     <Card.Body>
//                       <Card.Text style={{ textTransform:"none"}}>
//                         {capitalizeFirstLetter(guide.title)}
//                       </Card.Text>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
 
//               <Row className="mt-4" style={{margin : isMobileWidth &&  "0" , padding : isMobileWidth ? "0" : "auto"}}>
//                 <Col lg={12} className="mb-3">
//                   <div className="help-center-mid" style={{
//                       textAlign: "center",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
                      
//                     }} >
//                     <h2 style={{ marginBottom:isMobileWidth?"1px":"20px",padding:'0' }}>
//                       Top Articles{" "}
//                       <Link to="/exploreArticles" state={{ type: type,
//                           user_fname: helpCenterData?.user_fname, user_lname: helpCenterData?.user_lname }}>
//                         Browse all Article's{" "}
//                         <i className="fa-regular fa-chevron-right"></i>
//                       </Link>
//                     </h2>
//                   </div>
//                 </Col>
 
//                 {filteredArticles.map((article, index) => (
//                   <Col lg={4} md={6} key={index} className="mb-4" >
//                     <Card className="help-center-articles"
//                       style={{ border: "0", padding: "0", textAlign: "left", }} >
//                       <Card.Body>
//                         <Card.Title style={{ marginBottom: "15px" }} >
//                           <Link to={`/articles-detail/${article?.id}`}
//                             style={{ textDecoration: "none", color: "black" }}
//                             state={{ articleId: article?.id }} >
//                             {article.title}
//                           </Link>
//                         </Card.Title>
//                         {/* <Card.Text> */}
//                           <div dangerouslySetInnerHTML={{ __html: article?.description, }} />
//                         {/* </Card.Text> */}
//                       </Card.Body>
//                       <div style={{
//                           position: "absolute",
//                           bottom: "0",
//                           left: "0",
//                           width: "100%",
//                           height: "1px",
//                           backgroundColor: "#ccc",
//                           opacity: 0.7,
//                         }}
//                       ></div>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
 
//               <Col lg={12}>
//                 <div className="help-center-touch mob-need"
//                   style={{ textAlign: "center", padding: "40px 0" }} >
//                   <h4>Need to get in touch?</h4>
//                   <p> We'll start with some questions and get you to the right place. </p>
//                   <Link to="/contactUs" className="btn"
//                     style={{
//                       backgroundColor: "#4AEAB1",
//                       color: "#000",
//                       padding: "10px 20px",
//                       fontSize: "16px",
//                       textDecoration: "none",
//                       fontWeight: isMobileWidth?"":"bold",
//                       borderRadius: "30px",
//                     }} >
//                     Contact Us
//                   </Link>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </main>
//       <AuthModal />
//     </>
//   );
// }
 
// export default HelpCenter;
