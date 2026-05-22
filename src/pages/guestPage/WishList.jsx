import { useEffect, useState } from "react";
import AuthModal from "../../components/guest/authModal";
import { Link } from "react-router-dom";
import useCommon from "../../hooks/useCommon";
import { KEYS } from "../../config/Constant";
import MobFooter from "../../components/MobFooter";
import { useSelector } from "react-redux";

function WishList() {
    const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId =userInfo?.user_id ||userData?.user_id;
  const { guestWishlistData, deleteWishlist } = useCommon();

  const [wishlistArr, setWishlistArr] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [isMobileWidth, setIsMobileWidth] = useState(false);
  
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 780);
    };
    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);
    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);
  
  const getWishlist = async () => {
    const wishlistData = await guestWishlistData({user_id: userId});
    setWishlistArr(wishlistData?.data);
  };

  const handleWishlistDelete = async (id) => {
    const response = await deleteWishlist({ user_id: userId, wishlist_id: id });
    getWishlist();
  };

  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <>
      <main style={{ marginTop: "-35px" }}>
        <div className="notifications-wrap" style={{
            backgroundColor: "white", backgroundSize: "20px 20px",
            backgroundImage:"radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
          }}>
          {/* mobile */}
          {/* <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                     <Link to="/"> <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>  */}

          <div className="container-fluid" style={{padding: isMobileWidth ? "3rem 15px 0px 15px " : "3rem 1.5rem 3rem 2.5rem" }}>
            <div className="row">
              <div className="col-lg-12">
                <div className="notifications-in">
                  <h2 className="pb-lg-5" style={{color:"black"}}>
                    {/* <Link to="/wishlist"> <i className="fa-regular fa-arrow-left"></i> </Link> */}
                    Wishlist{" "}

                    <button type="button" onClick={() => setIsEditing((prev) => !prev)}>
                      {isEditing ? "Done" : "Edit"}
                    </button>
                  </h2>
                </div>
              </div>

              {(wishlistArr.length == 0) && (<div style={{textAlign: "center", fontSize: "20px"}}>No Wishlist Found</div>)}
              
              {wishlistArr.map((item, index) => (
                <div key={index} className="col-lg-3 col-md-6">
                  <div className="explore-guides-articles-in">
                    <button type="button" hidden={!isEditing} onClick={() => handleWishlistDelete(item?.wishlist_id)}>
                      <i className="fa-regular fa-xmark"></i>
                    </button>
                    <Link to="/wishlistDetails" state={{ wishlist_id: item?.wishlist_id, wishlistname: item?.wishlist_name,}}>
                      <div className="explore-guides-articles-image wishlist-image">
                        <img src={`https://zyvo.tgastaging.com/${item.last_saved_property_image}`} loading="lazy" alt="Wishlist Item" />
                      </div>
                      <h3 className={!isMobileWidth && "ms-3 m-0"} style={{marginBottom: isMobileWidth ? "0px" : ""}}>{item?.wishlist_name}</h3>
                      <p className={!isMobileWidth &&"ms-3"}>{item?.items_in_wishlist} saved</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <AuthModal />
      <MobFooter />
    </>
  );
}

export default WishList;

// import { useEffect, useState } from "react";
// import AuthModal from "../../components/guest/authModal";
// import { Link } from "react-router-dom";
// import useCommon from "../../hooks/useCommon";
// import { KEYS } from "../../config/Constant";
// import MobFooter from "../../components/MobFooter";

// function WishList() {
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId = userData?.user_id;
//   const { guestWishlistData, deleteWishlist } = useCommon();

//   const [wishlistArr, setWishlistArr] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);

//   const getWishlist = async () => {
//     const wishlistData = await guestWishlistData({
//       user_id: userId,
//     });
//     setWishlistArr(wishlistData?.data);
//   };

//   const handleWishlistDelete = async (id) => {
//     const response = await deleteWishlist({ user_id: userId, wishlist_id: id });
//     getWishlist();
//   };

//   useEffect(() => {
//     getWishlist();
//   }, []);

//   return (
//     <>
//       <main style={{ marginTop: "-35px" }}>
//         <div
//           className="notifications-wrap"
//           style={{
//             backgroundColor: "white",
//             backgroundImage:
//               " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
//             backgroundSize: "20px 20px",
//           }}
//         >
//           {/* mobile */}

//           {/* <div className="mob-search-filter border-start-0 border-end-0">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="mob-search-filter-in">
//                   <div className="mob-search-bar-back">
//                      <Link to="/">
//                       <i className="fa-regular fa-arrow-left"></i>
//                     </Link>
              
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>  */}

//           <div className="container-fluid p-5 px-4 ">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="notifications-in">
//                   <h2>
//                     {/* <Link to="/wishlist">
//                       <i className="fa-regular fa-arrow-left"></i>
//                     </Link> */}
//                     Wishlist{" "}
//                     <button
//                       type="button"
//                       onClick={() => setIsEditing((prev) => !prev)}
//                     >
//                       {isEditing ? "Done" : "Edit"}
//                     </button>
//                   </h2>
//                 </div>
//               </div>
//               {wishlistArr.map((item, index) => (
//                 <div key={index} className="col-lg-3 col-md-6">
//                   <div className="explore-guides-articles-in">
//                     <button
//                       type="button"
//                       hidden={!isEditing}
//                       onClick={() => handleWishlistDelete(item?.wishlist_id)}
//                     >
//                       <i className="fa-regular fa-xmark"></i>
//                     </button>
//                     <Link
//                       to="/wishlistDetails"
//                       state={{
//                         wishlist_id: item?.wishlist_id,
//                         wishlistname: item?.wishlist_name,
//                       }}
//                     >
//                       <div className="explore-guides-articles-image">
//                         <img
//                           src={`https://zyvo.tgastaging.com/${item.last_saved_property_image}`}
//                           loading="lazy" alt="Wishlist Item"
//                         />
//                       </div>
//                       <h3>{item?.wishlist_name}</h3>
//                       <p>{item?.items_in_wishlist} saved</p>
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//       <AuthModal />
//       <MobFooter />
//     </>
//   );
// }

// export default WishList;
