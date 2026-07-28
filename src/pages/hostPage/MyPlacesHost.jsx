import { useEffect, useState } from "react";
import CustomCarousel from "../../components/host/CustomCarousel";
import useHome from "../../hooks/host/useHome";
import { Dropdown, OverlayTrigger, Card, Popover } from "react-bootstrap";
import { FaCirclePlus } from "react-icons/fa6";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { SlidersHorizontal } from "lucide-react";
import { useLocation } from "react-router-dom";

import AddPropertyModal from "../../components/host/addBusiness/AddPropertyModal";
import { KEYS } from "../../config/Constant";

import Pagination from "../../components/guest/Pagination";
import { useNavigate } from "react-router-dom";
import { setAddnewPropertyState } from "../../store/slices/hostuserSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "../../store/slices/userSlice";

function MyPlacesHost() {
  const locationState = useLocation();
  const { userInfo } = useSelector(({ user }) => user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getList, setGetList] = useState([]);
  const [addProperyShow, setAddPropertyShow] = useState(false);
  const [property_id, setPropertyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [earningType, setEarningType] = useState("total");
  const [earningData, setEarningData] = useState(0);
  const itemsPerPage = 7;
  const [list, setList] = useState([]);
  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id || userData?.user_id;

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    if (locationState?.state?.openAddProperty) {
      setPropertyId(null);
      setAddPropertyShow(true);
      dispatch(setAddnewPropertyState(true));
    }
  }, [locationState]);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const [location, setLocation] = useState({ lat: null, long: null });
  const { getHomeList, earnings, isLoading } = useHome();

  useEffect(() => {
    if (getList) {
      setList(getList);
    }
  }, [getList]);

  const totalPages = Math.ceil(list.length / itemsPerPage);

  const paginatedData = isMobileWidth
    ? list
    : list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // const getLocation = () => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation({
  //           lat: position.coords.latitude,
  //           long: position.coords.longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error(error.message);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by your browser.");
  //   }
  // };

  const getLocation = () => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({
          lat: latitude,
          long: longitude,
        });

        // console.log("Current Location:", latitude, longitude);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getDataList = async () => {
    try {
      const response = await getHomeList({
        user_id: userId,
        latitude: location?.lat,
        longitude: location?.long,
      });
      if (response) {
        setGetList(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getLocation();
  }, [location.lat]);

  useEffect(() => {
    getDataList();
  }, [location.lat]);
  const getEarning = async () => {
    try {
      const response = await earnings({
        type: earningType,
        host_id: userId,
      });

      if (response) {
        setEarningData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEarning();
  }, [earningType]);

  function formatReview(value) {
    const num = Number(value);

    if (isNaN(num)) return ""; // handle invalid inputs
    return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
  }

  const popover = (
    <Popover
      id="info-popover"
      style={{
        backgroundColor: "white", // White background
        borderRadius: "30px", // Smooth rounded corners
        padding: "10px", // Adequate spacing
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0px 4px 4px 0px #00000040", // Soft floating effect
        maxWidth: "500px", // Set width for readability
        textAlign: "left", // Align text properly
        border: "1px solid #E0E0E0", // Light border
        marginRight: "100px",
      }}
    >
      <Popover.Body style={{ color: "black" }}>
        <p style={{ marginBottom: "10px" }}>
          <strong>Total earnings - </strong> This is calculated by aggregating
          all earnings since the host signed up on Zyvo till the date shown
          (Dynamic Real-Time Updates are expected).
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Future Earnings - </strong> This filter dynamically calculates
          and updates the amount shown to reflect the total revenue that hosts
          are expected to earn from existing future bookings over the next 90
          days. It provides hosts with a real-time snapshot of their anticipated
          earnings from confirmed bookings during the specified timeframe.
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          <strong>NOTE: </strong> This filter’s content is dynamic and adjusts
          in real-time as new bookings are confirmed or existing bookings are
          modified within the 90-day window. Hosts can view changes to their
          future earnings and associated properties as bookings are added,
          updated, or canceled, providing them with an up-to-date overview of
          their upcoming revenue stream.
        </p>
      </Popover.Body>
    </Popover>
  );

  return (
    <div style={{ margin: "1rem" }}>
      {isMobileWidth && (
        <hr style={{ marginTop: "-24px", width: "114%", marginLeft: "-9%" }} />
      )}
      <div
        className="d-flex align-items-center justify-content-between px-lg-3 resFirstScreen3"
        style={{
          paddingBottom: "40px",
          paddingTop: isMobileWidth ? "0px" : "40px",
          margin: isMobileWidth ? "30px -20px -22px -4px" : "",
        }}
      >
        <h1
          className="m-0 resFirstScreen2"
          style={{
            fontSize: isMobileWidth ? "20px" : "30px",
            fontWeight: isMobileWidth ? "400" : "",
            color: isMobileWidth ? "black" : "",
          }}
        >
          My Places
        </h1>

        <div className="d-flex align-items-center">
          <OverlayTrigger placement="bottom" overlay={popover}>
            <div
              style={{
                cursor: "pointer",
                backgroundColor: "white",
                color: "#4AEAB1",
                padding: isMobileWidth ? "6px 9px" : "10px 16px",
                borderRadius: "40px",
                display: "flex",
                alignItems: "center",
                fontWeight: "600",
                border: "1px solid #4AEAB1",
                marginRight: isMobileWidth ? "7px" : "12px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                position: "relative",
              }}
            >
              <span
                style={
                  isMobileWidth
                    ? { fontSize: isMobileWidth ? "14px" : "16px" }
                    : {}
                }
              >
                ${earningData?.amount}
              </span>
              <HiMiniInformationCircle
                size={isMobileWidth ? 18 : 22}
                style={{
                  color: "#4AEAB1",
                  cursor: "pointer",
                  marginLeft: "8px",
                  height: "21px",
                  width: "21px",
                }}
              />
            </div>
          </OverlayTrigger>

          <Dropdown>
            <Dropdown.Toggle
              className="border-0 bg-transparent p-0 shadow-none d-flex justify-content-center align-items-center"
              style={{ cursor: "pointer" }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: isMobileWidth ? "35px" : "42px",
                  height: isMobileWidth ? "35px" : "42px",
                  backgroundColor: "white",
                  scale: "-1",
                  borderRadius: "50%",
                  border: "1px solid #D3D3D3",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <SlidersHorizontal size={20} color="black" />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="filter-dropdown"
              style={{
                backgroundColor: "#f8f9fa",
                margin: "0px",
                color: "black",
                padding: "10px",
                borderRadius: "12px",
                border: "1px solid #E5E5E5",
                boxShadow: "0px 0px 14px 0px #0000001A",
                fontSize: "14px",
                fontWeight: "bold",
                minWidth: "180px",
              }}
            >
              <Dropdown.Item
                style={{
                  padding: "6px 10px",
                  textAlign: "left",
                  color: "black",
                }}
                onClick={() => setEarningType("total")}
              >
                Total Earning
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  padding: "6px 10px",
                  textAlign: "left",
                  color: "black",
                }}
                onClick={() => setEarningType("future")}
              >
                Future Earning
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {isMobileWidth && (
        <hr style={{ marginTop: "-14px", width: "114%", marginLeft: "-9%" }} />
      )}
      <div
        // style={{
        //   display: "flex",
        //   gap: "20px",
        //   flexWrap: "wrap",
        // }}
        className="container-fluid"
      >
        <div className={`row ${isMobileWidth ? "flex-column-reverse" : ""}`}>
          {paginatedData?.map((item, index) => {
            return (
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                key={index}
                style={{ marginBottom: "20px" }}
              >
                <CustomCarousel
                  data={item}
                  images={item?.property_images}
                  propertyId={item?.property_id}
                  onEdit={(bool) => {
                    setPropertyId(item?.property_id);
                    setAddPropertyShow(bool);
                  }}
                  onDelete={() => getDataList()}
                />

                <div
                  className="carousel-inner-content"
                  style={{
                    marginTop: "2px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: " inherit",
                  }}
                >
                  <div
                    className="carousel-inner-content-top"
                    style={{ color: "black" }}
                  >
                    <h1
                      onClick={() =>
                        navigate(`/my-place-history`, {
                          state: { routedData: item },
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {/* {item?.title
                        ?.toLowerCase()
                        ?.split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")} */}
                      {/* commented added 20-07-2026 */}
                      {item?.title
                        ?.toLowerCase()
                        ?.split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ").length > 15
                        ? item?.title
                            ?.toLowerCase()
                            ?.split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                            ?.slice(0, 15) + "..."
                        : item?.title
                            ?.toLowerCase()
                            ?.split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                    </h1>
                    <p>
                      <i className="fa-solid fa-clock"></i>{" "}
                      <span
                        style={{ whiteSpace: "nowrap", padding: 0, margin: 0 }}
                      >
                        {"$" + parseFloat(item?.hourly_rate) + "/h"}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    margin: "0px 0px 25px 10px", // Fixed margin to apply both bottom & left
                    fontWeight: "300",
                    fontSize: "14px",
                    color: "gray", // Changed to "gray" instead of "GrayText" for better compatibility
                  }}
                >
                  <ul
                    className="my-place-ul"
                    style={{ margin: isMobileWidth ? "8px 6px 0px -1px" : "" }}
                  >
                    <li className="my-place-li">
                      <div className="rating-container">
                        <img
                          src="/images/locations-grid/star-icon.svg"
                          alt="Star"
                          className="rating-star"
                        />
                        <span className="rating-text">
                          {formatReview(item?.property_rating)}
                          <span className="rating-count">
                            ({item?.property_review_count})
                          </span>
                        </span>
                      </div>
                    </li>

                    <li className="my-place-li" style={{ color: "gray" }}>
                      <img
                        src="/images/locations-grid/location-icon.svg"
                        loading="lazy"
                        alt="Location"
                        style={{ width: "16px" }}
                      />
                      {item?.distance_miles} miles away
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}

          <div
            style={{
              flex: "1 1 calc(25% - 20px)",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "start",
            }}
          >
            <Card
              style={{
                width: "100%",
                maxWidth: "350px",
                height: "100vh",
                maxHeight: isMobileWidth ? "250px" : "350px",

                cursor: "pointer",
                border: "2px dashed #B1B1B1", // Dashed border for the add card
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                textAlign: "center",
                gap: "1rem",
              }}
            >
              <FaCirclePlus
                style={{ fontSize: "50px", color: "#3A4B4C" }}
                onClick={() => {
                  setPropertyId(null);
                  setAddPropertyShow(true);
                  dispatch(setAddnewPropertyState(true));
                }}
              />
              <div
                onClick={() => {
                  setPropertyId(null);
                  setAddPropertyShow(true);
                  dispatch(setAddnewPropertyState(true));
                }}
              >
                Add new Place
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div
        className="home-pagination-wrap"
        style={{ alignContent: "center", marginTop: "5%" }}
      >
        {!isMobileWidth && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <AddPropertyModal
        show={addProperyShow}
        onHide={() => {
          setAddPropertyShow(false);
          getDataList();
        }}
        property_id={property_id}
      />
    </div>
  );
}

export default MyPlacesHost;

// import { useEffect, useState } from "react";
// import CustomCarousel from "../../components/host/CustomCarousel";
// import useHome from "../../hooks/host/useHome";
// import { Dropdown, OverlayTrigger, Card, Popover, } from "react-bootstrap";
// import { FaCirclePlus } from "react-icons/fa6";
// import { HiMiniInformationCircle } from "react-icons/hi2";
// import { SlidersHorizontal } from "lucide-react";

// import AddPropertyModal from "../../components/host/addBusiness/AddPropertyModal";
// import { KEYS } from "../../config/Constant";

// import Pagination from "../../components/guest/Pagination";
// import { useNavigate } from "react-router-dom";
// import { setAddnewPropertyState } from "../../store/slices/hostuserSlice";
// import { useDispatch } from "react-redux";
// import { setLoginModal } from "../../store/slices/userSlice";

// function MyPlacesHost() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [getList, setGetList] = useState([]);
//   const [addProperyShow, setAddPropertyShow] = useState(false);
//   const [property_id, setPropertyId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [earningType, setEarningType] = useState("total");
//   const [earningData, setEarningData] = useState(0);
//   const itemsPerPage = 7;
//   const [list, setList] = useState([]);
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId = userData?.user_id;

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth(); // run on mount
//     window.addEventListener('resize', checkWindowWidth);

//     return () => window.removeEventListener('resize', checkWindowWidth);

//   }, []);

//   const [location, setLocation] = useState({ lat: null, long: null });
//   const { getHomeList, earnings, isLoading } = useHome();

//   useEffect(() => {
//     getDataList();
//   }, [location?.lat]);

//   useEffect(() => {
//     if (getList) {
//       setList(getList);
//     }
//   }, [getList]);

//   const totalPages = Math.ceil(list.length / itemsPerPage);

//   const paginatedData = isMobileWidth ? list : list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   useEffect(() => {
//     getLocation();
//   }, []);

//   const getLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             long: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error(error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by your browser.");
//     }
//   };

//   const getDataList = async () => {
//     try {
//       const response = await getHomeList({
//         user_id: userId,
//         latitude: location?.lat || 22.572645,
//         longitude: location?.long || 88.363892,
//       });
//       if (response) {
//         setGetList(response?.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getEarning = async () => {
//     try {
//       const response = await earnings({
//         type: earningType,
//         host_id: userId,
//       });

//       if (response) {
//         setEarningData(response?.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getEarning();
//   }, [earningType]);

//   function formatReview(value) {
//     const num = Number(value);

//     if (isNaN(num)) return ""; // handle invalid inputs
//     return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
//   }

//   const popover = (
//     <Popover
//       id="info-popover"
//       style={{
//         backgroundColor: "white", // White background
//         borderRadius: "30px", // Smooth rounded corners
//         padding: "10px", // Adequate spacing
//         fontSize: "14px",
//         fontWeight: "500",
//         boxShadow: "0px 4px 4px 0px #00000040", // Soft floating effect
//         maxWidth: "500px", // Set width for readability
//         textAlign: "left", // Align text properly
//         border: "1px solid #E0E0E0", // Light border
//         marginRight: "100px",
//       }}
//     >
//       <Popover.Body style={{ color: "black" }}>
//         <p style={{ marginBottom: "10px" }}>
//           <strong>Total earnings - </strong> This is calculated by aggregating
//           all earnings since the host signed up on Zyvo till the date shown
//           (Dynamic Real-Time Updates are expected).
//         </p>
//         <p style={{ marginBottom: "10px" }}>
//           <strong>Future Earnings - </strong> This filter dynamically calculates
//           and updates the amount shown to reflect the total revenue that hosts
//           are expected to earn from existing future bookings over the next 90
//           days. It provides hosts with a real-time snapshot of their anticipated
//           earnings from confirmed bookings during the specified timeframe.
//         </p>
//         <p style={{ fontSize: "12px", color: "#666" }}>
//           <strong>NOTE: </strong> This filter’s content is dynamic and adjusts
//           in real-time as new bookings are confirmed or existing bookings are
//           modified within the 90-day window. Hosts can view changes to their
//           future earnings and associated properties as bookings are added,
//           updated, or canceled, providing them with an up-to-date overview of
//           their upcoming revenue stream.
//         </p>
//       </Popover.Body>
//     </Popover>
//   );

//   return (
//     <div style={{ margin: "1rem" }}>
//       <div className="d-flex align-items-center justify-content-between px-lg-3 resFirstScreen3" style={{ paddingBottom:"40px", paddingTop: isMobileWidth ? "0px" : "40px"}}>
//           <h1 className="m-0 resFirstScreen2" style={isMobileWidth ? {fontSize: "20px"} : {}}>My Places</h1>

//           <div className="d-flex align-items-center">
//             <OverlayTrigger placement="bottom" overlay={popover}>
//               <div
//                 style={{
//                   cursor: "pointer",
//                   backgroundColor: "white",
//                   color: "#4AEAB1",
//                   padding: isMobileWidth ? "6px 9px" : "10px 16px",
//                   borderRadius: "40px",
//                   display: "flex",
//                   alignItems: "center",
//                   fontWeight: "600",
//                   border: "1px solid #4AEAB1",
//                   marginRight: isMobileWidth ? "7px" : "12px",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                   fontSize: "16px",
//                   position: "relative",
//                 }}
//               >
//                 <span style={isMobileWidth ? {fontSize: isMobileWidth ? "14px" : "16px"} : {}}>${earningData?.amount}</span>
//                 <HiMiniInformationCircle
//                   size={isMobileWidth ? 18 : 22}
//                   style={{
//                     color: "#4AEAB1",
//                     cursor: "pointer",
//                     marginLeft: "8px",
//                   }}
//                 />
//               </div>
//             </OverlayTrigger>

//             <Dropdown>
//               <Dropdown.Toggle className="border-0 bg-transparent p-0 shadow-none d-flex justify-content-center align-items-center" style={{ cursor: "pointer" }} >
//                 <div className="d-flex align-items-center justify-content-center"
//                   style={{
//                     width: isMobileWidth ? "35px" : "42px",
//                     height: isMobileWidth ? "35px" : "42px",
//                     backgroundColor: "white",
//                     scale: '-1',
//                     borderRadius: "50%",
//                     border: "1px solid #D3D3D3",
//                     boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <SlidersHorizontal size={20} color="black" />
//                 </div>
//               </Dropdown.Toggle>

//               <Dropdown.Menu
//                 className="filter-dropdown"
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   margin: "0px",
//                   color: "black",
//                   padding: "10px",
//                   borderRadius: "12px",
//                   border: "1px solid #E5E5E5",
//                   boxShadow: "0px 0px 14px 0px #0000001A",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                   minWidth: "180px",
//                 }}
//               >
//                 <Dropdown.Item
//                   style={{
//                     padding: "6px 10px",
//                     textAlign: "left",
//                     color: "black",
//                   }}
//                   onClick={() => setEarningType("total")}
//                 >
//                   Total Earnings
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                   style={{
//                     padding: "6px 10px",
//                     textAlign: "left",
//                     color: "black",
//                   }}
//                   onClick={() => setEarningType("future")}
//                 >
//                   Future Earnings
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         </div>

//       <div
//         // style={{
//         //   display: "flex",
//         //   gap: "20px",
//         //   flexWrap: "wrap",
//         // }}
//         className="container-fluid"
//       >
//         <div className={`row ${isMobileWidth ? "flex-column-reverse" : ""}`}>
//           {paginatedData?.map((item, index) => {
//             return (
//               <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
//                 key={index} style={{ marginBottom: "20px"}} >

//                 <CustomCarousel data={item} images={item?.property_images}
//                   propertyId={item?.property_id}
//                   onEdit={(bool) => {
//                     setPropertyId(item?.property_id);
//                     setAddPropertyShow(bool);
//                   }}
//                   onDelete={() => getDataList()}
//                 />

//                 <div className="carousel-inner-content"
//                   style={{
//                     marginTop: "2px",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     cursor: " inherit",
//                   }}
//                 >
//                   <div className="carousel-inner-content-top" >
//                     <h1 onClick={() =>
//                         navigate(`/my-place-history`, {
//                           state: { routedData: item },
//                         })
//                       }
//                       style={{ cursor: "pointer" }}
//                     >
//                       {item?.title?.toLowerCase()?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
//                     </h1>
//                     <p>
//                       <i className="fa-solid fa-clock"></i> ${parseFloat(item?.hourly_rate)} / h
//                     </p>
//                   </div>
//                 </div>

//                 <div style={{
//                     margin: "0px 0px 25px 10px", // Fixed margin to apply both bottom & left
//                     fontWeight: "300",
//                     fontSize: "14px",
//                     color: "gray", // Changed to "gray" instead of "GrayText" for better compatibility
//                   }}
//                 >
//                   <ul className="my-place-ul" >
//                     <li className="my-place-li" >
//                       <img src="/images/locations-grid/star-icon.svg" loading="lazy" alt="Star"
//                         style={{ width: isMobileWidth ? "14px" : "16px" }}/>
//                       <span>{formatReview(item?.property_rating)}</span> (
//                       {item?.property_review_count})
//                     </li>
//                     <li className="my-place-li" style={{color:'gray'}}>
//                       <img src="/images/locations-grid/location-icon.svg"
//                         loading="lazy" alt="Location" style={{ width: "16px" }}
//                       />
//                       {item?.distance_miles} miles away
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//             );
//           })}

//           <div
//             style={{
//               flex: "1 1 calc(25% - 20px)",
//               marginBottom: "20px",
//               display: "flex",
//               justifyContent: "start",
//             }}
//           >
//             <Card
//               style={{
//                 width: "100%",
//                 maxWidth: "350px",
//                 height: "100vh",
//                 maxHeight:  isMobileWidth ? "250px" : "350px",

//                 cursor: "pointer",
//                 border: "2px dashed #B1B1B1", // Dashed border for the add card
//                 borderRadius: "20px",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: "20px",
//                 textAlign: "center",
//                 gap: "1rem",
//               }}
//             >
//               <FaCirclePlus
//                 style={{ fontSize: "50px", color: "#3A4B4C" }}
//                 onClick={() => {
//                   setPropertyId(null);
//                   setAddPropertyShow(true);
//                   dispatch(setAddnewPropertyState(true));
//                 }}
//               />
//               <div
//                 onClick={() => {
//                   setPropertyId(null);
//                   setAddPropertyShow(true);
//                   dispatch(setAddnewPropertyState(true));
//                 }}
//               >
//                 Add new Place
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//       <div className="home-pagination-wrap" style={{ alignContent: "center", marginTop: "5%" }}>
//       {!isMobileWidth && (
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={setCurrentPage}
//                 />
//               </div>
//             </div>
//           </div>
//        )}
//        </div>
//       <AddPropertyModal
//         show={addProperyShow}
//         onHide={() => {
//           setAddPropertyShow(false);
//           getDataList();
//         }}
//         property_id={property_id}
//       />
//     </div>
//   );
// }

// export default MyPlacesHost;
