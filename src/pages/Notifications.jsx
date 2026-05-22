import { useState, useEffect } from "react";
import AuthModal from "../components/guest/authModal";
import useCommon from "../hooks/useCommon";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {  KEYS } from "../config/Constant";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Notifications() {

  const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id||userData?.user_id;

  const { guestNotifications, hostNotifications, markNotification } = useCommon();

  const notificationSvgMap = { booking: 1, booking_auto_cancelled:1, zyvo: 2, payment: 3, };

  const [notificationArr, setNotificationArr] = useState([]);
  const [useTypes, setUserTypes] = useState(localStorage.getItem(KEYS.USER_TYPE));
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  const fetchGuestNotifications = async () => {
    const result = await guestNotifications({ user_id: userId });
    setNotificationArr(result.data);
  };

  const fetchHostNotifications = async () => {
    const result = await hostNotifications({ user_id: userId });
    setNotificationArr(result.data);
  };

  const handleRemoveNotifications = async (id) => {
    try {
      const result = await markNotification({
        user_id: userId,
        notification_id: id,
      });

      if (result.success) {
        // Remove the notification from the state
        setNotificationArr((prev) => prev.filter((notification) => notification.notification_id !== id));
      } else {
        console.error("Failed to mark notification:", result.message);
      }
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  useEffect(() => {
    if (useTypes == "guest") {
      fetchGuestNotifications();
    } else {
      fetchHostNotifications();
    }
  }, []);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };
    checkWindowWidth(); // run on mount
    window.addEventListener('resize', checkWindowWidth);
    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  return (
    <>
      <main>
        {/* MOBILE */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link to="/profile">
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* MOBILE */}
        <div className="notifications-wrap" style={{ padding: "20px 0" }}>
          <Container>
            <Row>
              <Col lg={12}>
                <h2 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: isMobileWidth ?"400":"500",color:'black' }} >
                  Notifications
                </h2>
                <hr style={{ marginBottom: !isMobileWidth && "50px", fontSize: "22px", fontWeight: "600",marginTop:'-15px' }}/>

                {(notificationArr.length === 0) && (<div style={{textAlign: "center", fontSize: "18px"}}>No Notifications Yet</div>)}

                {notificationArr.map((notification, index) => (
                  <Card key={index}  className="notification-screen-cards"  style={{backgroundColor:'#F5F5F5' ,width:isMobileWidth && '95%',}}>
                    <div className="notification-screen-card-inner"  style={{backgroundColor:'#4AEAB11A !important'}}>
                      <img src={`/images/notifications/${notificationSvgMap[notification.type]}.svg`}
                        loading="lazy" alt="notifications" style={{ width: "30px", height: "30px"  }} />
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <h6 style={{ marginBottom: "7px", fontSize: isMobileWidth ? "13px" : "16px", fontWeight: "500",color:'black'}}>
                        {notification?.title}
                      </h6>
                      <p style={{ margin: 0, fontSize: isMobileWidth ? "12px" : "13px", color: "#666",marginTop: !isMobileWidth && '3px ' }}>
                        {notification?.message}
                      </p>
                    </div>

                    {/* Close Button */}
                    <Button onClick={() => handleRemoveNotifications(notification.notification_id)}
                      variant="link"
                      style={isMobileWidth ? {
                        fontSize: "12px",
                        padding: "0px 4px",
                        marginLeft: "auto",
                        position: "absolute",
                        right: "5px",
                        top: "5px",
                        backgroundColor: "#3a4b4c",
                        borderRadius: "50%",
                        color: "white",
                        fontWeight: "bolder",
                      } : {
                        color: "#000",
                        fontSize: "24px",
                        padding: "5px",
                        marginLeft: "auto",
                      }}>
                      <i className="fa-regular fa-xmark"></i>
                    </Button>
                  </Card>
                ))}
              </Col>
            </Row>
          </Container>
        </div>
      </main>
      <AuthModal />
    </>
  );
}

export default Notifications;

// import { useState, useEffect } from "react";
// import AuthModal from "../components/guest/authModal";
// import useCommon from "../hooks/useCommon";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import {  KEYS } from "../config/Constant";
// import { Link } from "react-router-dom";

// function Notifications() {
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId = userData?.user_id;

//   const { guestNotifications, hostNotifications, markNotification } = useCommon();

//   const notificationSvgMap = { booking: 1, booking_auto_cancelled:1, zyvo: 2, payment: 3, };

//   const [notificationArr, setNotificationArr] = useState([]);
//   const [useTypes, setUserTypes] = useState(localStorage.getItem(KEYS.USER_TYPE));
//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   const fetchGuestNotifications = async () => {
//     const result = await guestNotifications({ user_id: userId });
//     setNotificationArr(result.data);
//   };

//   const fetchHostNotifications = async () => {
//     const result = await hostNotifications({ user_id: userId });
//     setNotificationArr(result.data);
//   };

//   const handleRemoveNotifications = async (id) => {
//     try {
//       const result = await markNotification({
//         user_id: userId,
//         notification_id: id,
//       });

//       if (result.success) {
//         // Remove the notification from the state
//         setNotificationArr((prev) => prev.filter((notification) => notification.notification_id !== id));
//       } else {
//         console.error("Failed to mark notification:", result.message);
//       }
//     } catch (error) {
//       console.error("Error marking notification:", error);
//     }
//   };

//   useEffect(() => {
//     if (useTypes == "guest") {
//       fetchGuestNotifications();
//     } else {
//       fetchHostNotifications();
//     }
//   }, []);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };
//     checkWindowWidth(); // run on mount
//     window.addEventListener('resize', checkWindowWidth);
//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, []);

//   return (
//     <>
//       <main>
//         {/* MOBILE */}
//         <div className="mob-search-filter border-start-0 border-end-0">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="mob-search-filter-in">
//                   <div className="mob-search-bar-back">
//                     <Link to="/profile">
//                       <i className="fa-regular fa-arrow-left"></i>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* MOBILE */}
//         <div className="notifications-wrap" style={{ padding: "20px 0" }}>
//           <Container>
//             <Row>
//               <Col lg={12}>
//                 <h2 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: "500" }} >
//                   Notifications
//                 </h2>
//                 <hr style={{ marginBottom: "20px", fontSize: "22px", fontWeight: "600" }}/>

//                 {notificationArr.map((notification, index) => (
//                   <Card key={index}  className="notification-screen-cards"  style={{backgroundColor:'#F5F5F5'}}>
//                     <div className="notification-screen-card-inner"  style={{backgroundColor:'#4AEAB11A !important'}}>
//                       <img src={`/images/notifications/${notificationSvgMap[notification.type]}.svg`}
//                         loading="lazy" alt="notifications" style={{ width: "30px", height: "30px",  }} />
//                     </div>

//                     <div style={{ flexGrow: 1 }}>
//                       <h6 style={{ marginBottom: "5px", fontSize: isMobileWidth ? "13px" : "16px", fontWeight: "500",color:'black'}}>
//                         {notification?.title}
//                       </h6>
//                       <p style={{ margin: 0, fontSize: isMobileWidth ? "12px" : "14px", color: "#666",marginTop: !isMobileWidth && '3px ' }}>
//                         {notification?.message}
//                       </p>
//                     </div>

//                     {/* Close Button */}
//                     <Button onClick={() => handleRemoveNotifications(notification.notification_id)}
//                       variant="link"
//                       style={isMobileWidth ? {
//                         fontSize: "12px",
//                         padding: "0px 4px",
//                         marginLeft: "auto",
//                         position: "absolute",
//                         right: "5px",
//                         top: "5px",
//                         backgroundColor: "#3a4b4c",
//                         borderRadius: "50%",
//                         color: "white",
//                         fontWeight: "bolder",
//                       } : {
//                         color: "#000",
//                         fontSize: "18px",
//                         padding: "5px",
//                         marginLeft: "auto",
//                       }}>
//                       <i className="fa-regular fa-xmark"></i>
//                     </Button>
//                   </Card>
//                 ))}
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </main>
//       <AuthModal />
//     </>
//   );
// }

// export default Notifications;
