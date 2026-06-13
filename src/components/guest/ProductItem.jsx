// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CustomCarouselGuest from "./CustomCarouselGuest";
// import useCommon from "../../hooks/useCommon";
// import AddToWishlistModal from "./wishlistModals/AddToWishlistModal";
// import { imageBase, KEYS } from "../../config/Constant";
// import RegisterModal from "./authModalGuest/RegisterModal";
// import Loader2 from "../Loader2";
// import { Image } from "react-bootstrap";
// import { useSelector } from "react-redux";
// const ProductItem = ({
//   hourly_rate, distance_miles, images = [], is_in_wishlist, is_instant_book, property_id,
//   rating, reviewCount, title, hosted_by, hostImg, address, award, currentLocation, }) => {

//  const {userInfo} = useSelector(({user})=>user)

//   const { guestWishlistData, isLoading, guestHomeData, removeItemFromWishlist, } = useCommon();
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))  || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO))
//   // const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId =userInfo?.user_id||userData?.user_id;
//   const access_token =userInfo?.token|| userData?.access_token;

//   const [isLogniModal, setIsLoginModal] = useState(false);

//   const [wishlistArr, setWishlistArr] = useState([]);

//   const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const login_id = localSaved?.user_id ? String(localSaved?.user_id) : null;
//   const [showAddWishlistModal, setShowAddWishlistModal] = useState(false);
//   const [propertyId, setPropertyId] = useState(null);
//   const [refresh, setRefresh] = useState(0);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   const [modalToggleValue, setModalToggleValue] = useState(false);

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       const isMobileOrTablet = window.innerWidth <= 991; // includes tablets
//       setIsMobileWidth(isMobileOrTablet);
//     };

//     checkWindowWidth(); // Check immediately on mount
//     window.addEventListener("resize", checkWindowWidth);
//     return () => {
//       window.removeEventListener("resize", checkWindowWidth);
//     };
//   }, []); // Don't put window.innerWidth in the deps

//   const fetchList = async () => {
//     try {
//       const res = await guestHomeData({
//         user_id: login_id ?? "",
//         latitude: currentLocation?.latitude,
//         longitude: currentLocation?.longitude,
//       });
//     } catch (error) {
//       console.error("Error fetching guest home data:", error);
//     }
//   };

//   const handleWishlistClick = async () => {
//     if (userId && access_token) {
//       if (is_in_wishlist) {
//         await removeItemFromWishlist({
//           user_id: userId,
//           property_id: property_id,
//         });
//       }
//       setShowAddWishlistModal(!is_in_wishlist);
//       setRefresh((prev) => prev + 1);
//       fetchList();
//       getWishlist();
//       setPropertyId(property_id);
//     } else {
//       setIsLoginModal(true);
//     }
//   };

//   const getWishlist = async () => {
//     const wishlistData = await guestWishlistData({
//       user_id: userId,
//     });
//     setWishlistArr(wishlistData?.data);
//   };

//   const handleNavigation = () => {
//     navigate(`/location/${property_id}`, {
//       state: { distance: distance_miles },
//     });
//   };

//   function formatReview(value) {
//     const num = Number(value);
//     if (isNaN(num)) return "";
//     return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
//   }

//   const truncateText = (text, limit) =>
//   text?.length > limit ? text.slice(0, limit) + "..." : text;

//   // if (isLoading) return <Loader2 visible={isLoading} />;

//   return (
//     <>
//       <div
//         className="w-full h-full"
//         style={{
//           padding: "2px",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* {/ Image Carousel & Wishlist /} */}
//         <div
//           // onClick={() => handleNavigation(property_id)}
//           className="carousel slide"
//           data-bs-interval="1000000"
//           data-bs-ride="carousel"
//           style={{
//             borderRadius: "25px",
//             overflow: "hidden",
//             position: "relative",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             // cursor: "pointer",
//           }}
//         >
//           {/* {/ Top Section - Instant Book & Wishlist /} */}
//           <div
//             className="carousel-inner-top"
//             style={{
//               position: "absolute",
//               top: "10px",
//               left: "10px",
//               right: "10px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               zIndex: 1,
//             }}
//           >
//             {is_instant_book ? (
//               <h3
//                 style={{
//                   color: "black",
//                   background: "white",
//                   padding: "6px 12px",
//                   borderRadius: "20px",
//                   margin: 0,
//                   lineHeight: "normal",
//                 }}
//               >
//                 <i className="fa-solid fa-bolt"></i> Instant book
//               </h3>
//             ) : (
//               ""
//             )}
//             <div
//               className="carousel-inner-top-heart"
//               onClick={handleWishlistClick}
//               style={{
//                 position: "relative",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "5px",
//                 backgroundColor: "transparant",
//                 padding: "5px",
//                 borderRadius: "5px",
//                 zIndex: 999,
//               }}
//             >
//               {isWishlisted !== null && (
//                 <img src={ isWishlisted || is_in_wishlist
//                       ? "/images/locations-grid/profile/heart-fill.svg"
//                       : isMobileWidth ? "/images/mobileBlankHeart.png" :  "/images/locations-grid/profile/heart.svg"
//                   }
//                   alt="Wishlist"
//                   style={{
//                     width: "24px",
//                     display: "block",
//                     zIndex: 999999,
//                   }}
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                   }}
//                 />
//               )}
//             </div>
//           </div>

//           {/* {/ Main Carousel /} */}
//           <div
//             className="carousel-inner"
//             style={{
//               width: "120%",
//               height: "380px",
//               overflow: "hidden",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: "10px",
//               // border:'10px solid black'
//             }}
//           >
//             <CustomCarouselGuest
//               images={images}
//               propertyId={property_id}
//               distance_miles={distance_miles}
//             />
//           </div>

//           {/* {/ Host Information /} */}

//           <div
//             className="carousel-inner-bottom"
//             style={{
//               position: "absolute",
//               bottom: "10px",
//               left: "10px",
//               right: "10px",
//               display: "flex",
//               alignItems: "center",
//               background: "#ffffffd9",
//               padding: "10px",
//               borderRadius: "8px",
//               width: "95%",
//             }}
//           >
//             <div className="carousel-inner-bottom-image">
//               {/* <img src={imageBase + hostImg} alt="Host" loading="lazy"/> */}
//               <img src={`${imageBase}${hostImg}`} alt="Host" loading="lazy"/>

//               {award && (
//                 <Image src="/images/locations-grid/profile/batch.svg" alt="Batch"
//                   style={{
//                     position: "absolute",
//                     top: "20px",
//                     left: "20px",
//                     bottom: "0",
//                     width: "25px",
//                   }}
//                 />
//               )}
//             </div>
//             <h2>

//            {userId ? ( <span style={{fontSize:isMobileWidth ?"13px":"15px" }}> Hosted by {truncateText(hosted_by, 16)} <br /> </span>):(<span style={{ fontSize:isMobileWidth ?"13px":"15px"}}>{truncateText(hosted_by, 16)}<br/></span>)}

//               {/* Hosted by {hosted_by} <br /> */}
//               <span style={{ fontSize: "13px" }}>
//                 {address || "Address not available"}
//               </span>
//             </h2>
//           </div>
//         </div>

//         {/* {/ Property Details /} */}
//         <div className="carousel-inner-content"
//           style={{
//             marginTop: "2px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             cursor: " inherit",
//           }} >
//           <div className="carousel-inner-content-top">
//             <h1 onClick={() => handleNavigation(property_id)}  style={{ cursor: "pointer",fontWeight:'400', fontSize:isMobileWidth ?"13px":"18px" ,color:'black' }}>
//              {truncateText(title, 16)}
//             </h1>

//             <span style={{ display: "flex", alignItems: "center" ,}}>
//               <i className="fa-solid fa-clock" style={{ fontSize: "18px", marginRight: "5px",color:'#3A4B4C' }} ></i>

//            <span style={{ whiteSpace: 'nowrap', padding: 0, margin: 0,color:'black',fontWeight:'400', fontSize:isMobileWidth ?"13px":"18px" }}>
//             {'$'+ parseFloat(hourly_rate)+'/h'}
//               </span>
//             </span>
//           </div>
//         </div>
//         <div>
//           <div style={{ fontWeight: "300", fontSize: "14px", color: "gray"}}>
//             <ul style={{
//               listStyle: "none", display: "flex",
//               gap: isMobileWidth ? "0px" : "15px",
//               justifyContent: isMobileWidth ? "space-between" : "flex-start",
//               padding: "0px 8px" , alignItems: "flex-start",
//               margin: 0
//               }} >
//               <li style={{
//                   display: "flex", alignItems: "flex-start", gap: "5px",
//                   color: "#FCA800"
//                 }}
//               >
//                 <img src="/images/locations-grid/star-icon.svg" alt="Star" style={{ width: "16px" }}/>
//                 <span style={{fontSize:isMobileWidth ?"13px":"14px"}}>{`${formatReview(rating)}  (${reviewCount})`}</span>
//                 {/* <span  style={{fontSize:isMobileWidth && "18px"}}>{formatReview(rating)}</span> <span style={{color:isMobileWidth && "grey"}}>({reviewCount})</span> */}
//               </li>
//               <li style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
//                 <img src="/images/locations-grid/location-icon.svg" alt="Location" style={{ width: "16px" }}/>
//                 <span style={{fontSize:isMobileWidth ?"13px":"14px"}}>{distance_miles} miles away</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* {/ Wishlist Modal /} */}
//       <AddToWishlistModal
//         wishlistArr={wishlistArr}
//         showAddWishlistModal={showAddWishlistModal}
//         propertyId={propertyId}
//         userId={userId}
//         handleClose={() => {
//           setShowAddWishlistModal(false);
//         }}
//         fetchList={fetchList}
//       />

//       <RegisterModal
//         show={isLogniModal}
//         onHide={() => setIsLoginModal(false)}
//         CallBack={(bool) => setIsLoginModal(bool)}
//         loginModal={modalToggleValue}
//         ToggleVal={(bool) => setModalToggleValue(bool)}
//       />
//     </>
//   );
// };

// // export default ProductItem;
// export default React.memo(ProductItem);

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCarouselGuest from "./CustomCarouselGuest";
import useCommon from "../../hooks/useCommon";
import AddToWishlistModal from "./wishlistModals/AddToWishlistModal";
import { imageBase, KEYS } from "../../config/Constant";
import RegisterModal from "./authModalGuest/RegisterModal";
import Loader2 from "../Loader2";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { set } from "date-fns";
import defaultContact from "../../assets/defaultContact.jpg";
const ProductItem = ({
  hourly_rate,
  distance_miles,
  images = [],
  is_in_wishlist,
  is_instant_book,
  property_id,
  rating,
  reviewCount,
  title,
  hosted_by,
  hostImg,
  address,
  award,
  currentLocation,
}) => {
  console.log("is_in_wishlist000", is_in_wishlist);

  const { userInfo } = useSelector(({ user }) => user);

  const {
    guestWishlistData,
    isLoading,
    guestHomeData,
    removeItemFromWishlist,
  } = useCommon();

  const [disable, setDisable] = useState(true);

  console.log(disable, "isloading data ");

  const navigate = useNavigate();
  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  // const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const userId = userInfo?.user_id || userData?.user_id;
  const access_token = userInfo?.token || userData?.access_token;

  const [isLogniModal, setIsLoginModal] = useState(false);

  const [wishlistArr, setWishlistArr] = useState([]);

  const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const login_id = localSaved?.user_id ? String(localSaved?.user_id) : null;
  const [showAddWishlistModal, setShowAddWishlistModal] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(is_in_wishlist);

  useEffect(() => {
    setIsWishlisted(is_in_wishlist);
  }, [is_in_wishlist]);

  const [modalToggleValue, setModalToggleValue] = useState(false);

  const [isMobileWidth, setIsMobileWidth] = useState(false);
  //code added for disable

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

  const fetchList = async () => {
    try {
      const res = await guestHomeData({
        user_id: login_id ?? "",
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
      });

      if (res) {
      }
    } catch (error) {
      console.error("Error fetching guest home data:", error);
    }
  };

  const handleWishlistClick = async () => {
    if (userId && access_token) {
      if (isWishlisted) {
        setIsWishlisted(false);
        try {
          await removeItemFromWishlist({
            user_id: userId,
            property_id: property_id,
          });
          fetchList();
          getWishlist();
        } catch (error) {
          setIsWishlisted(true);
        }
      } else {
        setShowAddWishlistModal(true);
        setPropertyId(property_id);
        getWishlist();
      }
      setRefresh((prev) => prev + 1);
    } else {
      setIsLoginModal(true);
    }
  };

  // const handleWishlistClick = async () => {
  //   // e.stopPropagation(); // VERY IMPORTANT (explained below)

  //   // setShowAddWishlistModal(true);

  //   if (userId && access_token) {
  //     if (is_in_wishlist) {
  //       await removeItemFromWishlist({
  //         user_id: userId,
  //         property_id: property_id,
  //       });
  //     }
  //     setShowAddWishlistModal(!is_in_wishlist);
  //     console.log(is_in_wishlist, "is_in_wishlist11");
  //     // setShowAddWishlistModal(true);
  //     setRefresh((prev) => prev + 1);
  //     fetchList();
  //     getWishlist();
  //     setPropertyId(property_id);
  //     console.log("showAddWishlistModal1111", showAddWishlistModal);
  //   } else {
  //     setIsLoginModal(true);
  //   }
  //   // console.log("showAddWishlistModal2222", showAddWishlistModal);
  // };

  const getWishlist = async () => {
    const wishlistData = await guestWishlistData({
      user_id: userId,
    });
    setWishlistArr(wishlistData?.data);
  };

  const handleNavigation = () => {
    navigate(`/location/${property_id}`, {
      state: { distance: distance_miles },
    });
  };

  function formatReview(value) {
    const num = Number(value);
    if (isNaN(num)) return "";
    return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
  }

  const truncateText = (text, limit) =>
    text?.length > limit ? text.slice(0, limit) + "..." : text;

  // if (isLoading) return <Loader2 visible={isLoading} />;

  return (
    <>
      <div
        className="w-full h-full"
        style={{
          padding: "2px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* {/ Image Carousel & Wishlist /} */}
        <div
          // onClick={() => handleNavigation(property_id)}
          className="carousel slide"
          data-bs-interval="1000000"
          data-bs-ride="carousel"
          style={{
            borderRadius: "25px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // cursor: "pointer",
          }}
        >
          {/* {/ Top Section - Instant Book & Wishlist /} */}
          <div
            className="carousel-inner-top"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              right: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            {is_instant_book ? (
              <h3
                style={{
                  color: "black",
                  background: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  margin: 0,
                  lineHeight: "normal",
                }}
              >
                <i className="fa-solid fa-bolt"></i> Instant book
              </h3>
            ) : (
              ""
            )}

            {/* <div
              className="carousel-inner-top-heart"
              // onClick={disable ? handleWishlistClick : undefined}

              onClick={() => {
                if (disable) return;
                handleWishlistClick();
              }}
              style={{
                position: "relative",

                cursor: disable ? "not-allowed" : "pointer",
                opacity: disable ? 0.5 : 1,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                backgroundColor: "transparent",
                padding: "5px",
                borderRadius: "5px",
                zIndex: 999,

                // 👇 important parts
                pointerEvents: isLoading ? "none" : "auto",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isWishlisted !== null && (
                <img
                  src={
                    isWishlisted
                      ? "/images/locations-grid/profile/heart-fill.svg"
                      : isMobileWidth
                      ? "/images/mobileBlankHeart.png"
                      : "/images/locations-grid/profile/heart.svg"
                  }
                  alt="Wishlist"
                  style={{
                    width: "24px",
                    display: "block",
                    zIndex: 999999,
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div> */}

            <div
              className="carousel-inner-top-heart"
              onClick={handleWishlistClick}
              style={{
                position: "relative",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                backgroundColor: "transparant",
                padding: "5px",
                borderRadius: "5px",
                zIndex: 999,
              }}
            >
              {isWishlisted !== null && (
                <img
                  src={
                    isWishlisted
                      ? "/images/locations-grid/profile/heart-fill.svg"
                      : isMobileWidth
                      ? "/images/mobileBlankHeart.png"
                      : "/images/locations-grid/profile/heart.svg"
                  }
                  alt="Wishlist"
                  style={{
                    width: "24px",
                    display: "block",
                    zIndex: 999999,
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* {/ Main Carousel /} */}
          <div
            className="carousel-inner"
            style={{
              width: "120%",
              height: "380px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              // border:'10px solid black'
            }}
          >
            <CustomCarouselGuest
              images={images}
              propertyId={property_id}
              distance_miles={distance_miles}
            />
          </div>

          {/* {/ Host Information /} */}

          <div
            className="carousel-inner-bottom"
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              right: "10px",
              display: "flex",
              alignItems: "center",
              background: "#ffffffd9",
              padding: "10px",
              borderRadius: "15px",
              width: "95%",
            }}
          >
            <div className="carousel-inner-bottom-image">
              <img
                src={hostImg && hostImg !== "undefined" && hostImg !== "null" ? `${imageBase}${hostImg}` : defaultContact}
                alt="Host"
                loading="lazy"
                onError={(e) => {
                  e.target.src = defaultContact;
                }}
              />

              {award && (
                <Image
                  src="/images/locations-grid/profile/batch.svg"
                  alt="Batch"
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    bottom: "0",
                    width: "25px",
                  }}
                />
              )}
            </div>
            <h2>
              {userId ? (
                <span style={{ fontSize: isMobileWidth ? "13px" : "15px" }}>
                  {" "}
                  Hosted by {truncateText(hosted_by, 16)} <br />{" "}
                </span>
              ) : (
                <span style={{ fontSize: isMobileWidth ? "13px" : "15px" }}>
                  {truncateText(hosted_by, 16)}
                  <br />
                </span>
              )}

              {/* Hosted by {hosted_by} <br /> */}
              <span style={{ fontSize: "13px" }}>
                {address || "Address not available"}
              </span>
            </h2>
          </div>
        </div>

        {/* {/ Property Details /} */}
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
          <div className="carousel-inner-content-top">
            <h1
              onClick={() => handleNavigation(property_id)}
              style={{
                cursor: "pointer",
                fontWeight: "400",
                fontSize: isMobileWidth ? "13px" : "18px",
                color: "black",
              }}
            >
              {truncateText(title, 16)}
            </h1>

            <span style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fa-solid fa-clock"
                style={{
                  fontSize: "18px",
                  marginRight: "5px",
                  color: "#3A4B4C",
                }}
              ></i>

              <span
                style={{
                  whiteSpace: "nowrap",
                  padding: 0,
                  margin: 0,
                  color: "black",
                  fontWeight: "400",
                  fontSize: isMobileWidth ? "13px" : "18px",
                }}
              >
                {"$" + parseFloat(hourly_rate) + "/h"}
              </span>
            </span>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: "300", fontSize: "14px", color: "gray" }}>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                gap: isMobileWidth ? "0px" : "15px",
                justifyContent: isMobileWidth ? "space-between" : "flex-start",
                padding: "0px 8px",
                alignItems: "flex-start",
                margin: 0,
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                  color: "#FCA800",
                }}
              >
                <img
                  src="/images/locations-grid/star-icon.svg"
                  alt="Star"
                  style={{ width: "16px" }}
                />
                <span
                  style={{ fontSize: isMobileWidth ? "13px" : "14px" }}
                >{`${formatReview(rating)}  (${reviewCount})`}</span>
                {/* <span  style={{fontSize:isMobileWidth && "18px"}}>{formatReview(rating)}</span> <span style={{color:isMobileWidth && "grey"}}>({reviewCount})</span> */}
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                }}
              >
                <img
                  src="/images/locations-grid/location-icon.svg"
                  alt="Location"
                  style={{ width: "16px" }}
                />
                <span style={{ fontSize: isMobileWidth ? "13px" : "14px" }}>
                  {distance_miles} miles away
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* {/ Wishlist Modal /} */}
      <AddToWishlistModal
        wishlistArr={wishlistArr}
        showAddWishlistModal={showAddWishlistModal}
        propertyId={propertyId}
        userId={userId}
        handleClose={() => {
          setShowAddWishlistModal(false);
        }}
        fetchList={fetchList}
        onAddSuccess={() => setIsWishlisted(true)}
      />

      <RegisterModal
        show={isLogniModal}
        onHide={() => setIsLoginModal(false)}
        CallBack={(bool) => setIsLoginModal(bool)}
        loginModal={modalToggleValue}
        ToggleVal={(bool) => setModalToggleValue(bool)}
      />
    </>
  );
};

// export default ProductItem;
export default React.memo(ProductItem);
