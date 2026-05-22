import { useEffect, useState } from "react";
import AuthModal from "../../components/guest/authModal";
import { Link, useNavigate } from "react-router-dom";
import useCommon from "../../hooks/useCommon";
import { useLocation } from "react-router-dom";
import CustomCarouselGuest from "../../components/guest/CustomCarouselGuest";
import { imageBase, KEYS } from "../../config/Constant";
import {  AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";

const WishListDetails = () => {
  const { getSavedItemsInWishlist, removeItemFromWishlist } = useCommon();
    const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId =userInfo?.user_id ||userData?.user_id;
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 780);
    };
    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);
    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const { wishlist_id, wishlistname } = location.state || {};
  const [currentLocation, setCurrentLocation] = useState({latitude: null, longitude: null});

  const [wishlistItemsArr, setWishlistItemsArr] = useState([]);

  const getSavedItems = async () => {
    const result = await getSavedItemsInWishlist({
      wishlist_id, user_id: userId,
      longitude: currentLocation.longitude,
      latitude: currentLocation.latitude,
    });
    setWishlistItemsArr(result?.data || []);
  };

  const handleRemoveItemFromWishlist = async (propertyId) => {
    const result = await removeItemFromWishlist({ property_id: propertyId, user_id: userId, });
    if (result.success) {
      await getSavedItems();
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({latitude: position.coords.latitude, longitude: position.coords.longitude });
          },
          (error) => {console.error(error.message);}
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    getSavedItems();
  }, [currentLocation?.latitude]);

  function formatReview(value) {
    const num = Number(value);
    if (isNaN(num)) return ""; 
    return Number.isInteger(num) ? num?.toString() : num?.toFixed(1);
  }

    const truncateText = (text, limit) =>
  text?.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <>
     <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                  <Link to="/wishlist"> <i className="fa-regular fa-arrow-left"></i> </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <main>
        <div className="notifications-wrap location-grid-map-wrap">
          <div className="container-fluid" style={{padding:isMobileWidth?" ":"0 1.5rem 0 2.5rem" }}>
            <div className="row"  >
              <div className="col-lg-12">
                 {/* <div className="notifications-in">
                  <h2> <Link to="/wishlist"> <i className="fa-regular fa-arrow-left"></i> </Link> </h2>
                </div> */}
                <div className="notifications-in">
                  <h2> {wishlistname} </h2>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="location-grid-map-in">
                  <div className="location-grid-wrap">
                    {wishlistItemsArr?.length == 0 && (
                      <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center",
                        width: "100%", }} >
                        No Wishlist found
                      </h1>
                    )}
                    {wishlistItemsArr?.map((item, index) => (
                      <div className="location-grid-item" key={index}>
                        <div id="carouselExampleIndicators" className="carousel slide" 
                          data-bs-ride="carousel">
                          <div className="carousel-inner-top">
                            {item?.is_instant_book ? (
                              <h3> <i className="fa-solid fa-bolt"></i> Instant book </h3>
                            ) : ( "" )}
                            <div className="carousel-inner-top-heart">
                              <a onClick={() => handleRemoveItemFromWishlist( item?.property_id)}>
                                {/* <img src="/images/locations-grid/profile/heart-fill.svg"
                                  className="active" loading="lazy" alt="" /> */}
                                 <AiFillHeart size={30} color="red" />
                              </a>
                            </div>
                          </div>
                          <CustomCarouselGuest images={item?.images} propertyId={item?.property_id} />
                          <div className="carousel-inner-bottom" onClick={() => navigate("/host-listing", { state: { hostId: item?.host_id }})}>
                            <div className="carousel-inner-bottom-image">
                              <img src={imageBase + item?.host_profile_image } style={{ borderRadius:'50%' }} loading="lazy" alt="profile" />
                              {item?.is_star_host &&( <span className="carousel-profile-batch"></span>)}
                            </div>
                            <h2>
                              <Link to="#" style={{fontWeight:'400', fontSize:"15px"}}> Hosted by {item?.host_name} </Link>{" "}
                              <br />
                              <span style={{ fontSize: "13px" }}> {item?.host_location || "No Address Available"} </span>
                            </h2>
                          </div>
                        </div>
                        <div className="carousel-inner-content">
                          <div className="carousel-inner-content-top">
                            <h1>
                              <Link to={`/location/${item?.property_id}`} state={{ property_id: item?.property_id }} style={{fontSize:"18px", fontWeight:"400"}}> {truncateText(item?.title,16)}</Link>
                            </h1>
                            <p ><i className="fa-solid fa-clock"></i><span style={{fontSize:"18px", fontWeight:"400"}}> ${parseFloat(item?.hourly_rate)}/h</span></p>
                          </div>
                          <ul>
                            <li className="align-items-start wishlist-icons-text" style={{color: 'rgb(252, 168, 0)'}}>
                              <img src="/images/locations-grid/star-icon.svg" loading="lazy" alt="" className=" wishlist-icons"/>
                              {/* <span>{formatReview(item?.rating)}</span> <span style={{color:'#ccc'}}> ({item?.review_count})</span>  */}
                              <span style={{fontSize:"14px", fontWeight:"400"}}>{`${formatReview(item?.rating)} (${item?.review_count})`}</span> 
                            </li> 
                            {item?.location_in_miles && <li className="wishlist-icons-text" style={{fontSize:"14px", fontWeight:"400"}}>
                              <img src="/images/locations-grid/location-icon.svg" loading="lazy" alt="" className=" wishlist-icons"/>{" "}
                              {item?.location_in_miles} miles away
                            </li>}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="location-map-wrap">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2261.139268703457!2d-133.14340392403935!3d55.4776704131501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x540e467f9dd315f3%3A0xf4eae0d4d7764524!2s245%20Cold%20Storage%20Rd%2C%20Craig%2C%20AK%2099921%2C%20USA!5e0!3m2!1sen!2sin!4v1723457458145!5m2!1sen!2sin"
                      width="600" height="450" allowFullScreen="" loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AuthModal />
    </>
  );
};

export default WishListDetails;