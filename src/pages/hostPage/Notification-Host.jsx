// import React, { useState } from "react";
// import Header from "../../components/host/Header";
// import Footer from "../../components/guest/Footer";
// import AuthModal from "../../components/guest/authModal";
// import { useDispatch } from "react-redux";
// import { setUserType } from "../../store/slices/userSlice";
// import { imageBase, KEYS } from "../../config/Constant";
// import useCommon from "../../hooks/useCommon";

// function NotificationHost() {
//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId = userData?.user_id;

//   const dispatch = useDispatch();
//   const { hostNotifications, markNotification } = useCommon();

//   const [useTypes, setUserTypes] = useState(
//     localStorage.getItem(KEYS.USER_TYPE) || "host"
//   );
//   const [notificationlist, setNotificationlist] = useState([]);

//   dispatch(setUserType(useTypes));

//   const sendNotification = async (e) => {
//     if (e) e.preventDefault(); // Prevent default if event exists

//     if (!userId) {
//       console.error("User ID not found");
//       return;
//     }

//     try {
//       const res = await hostNotifications({
//         user_id: userId,
//       });

//       setNotificationlist(res);
//       console.log("notication sent:", res);
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   const setmarkNotification = async (id) => {
//     // if (e) e.preventDefault(); // Prevent default if event exists

//     try {
//       const res = await markNotification({
//         notification_id: id,
//       });

//       setNotificationlist(res);
//       console.log("notication sent:", res);
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };
//   return (
//     <>
//       {/* <Header /> */}
//       <main>
//         {/* MOBILE */}
//         <div className="mob-search-filter border-start-0 border-end-0">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="mob-search-filter-in">
//                   <div className="mob-search-bar-back">
//                     <a href="/">
//                       <i className="fa-regular fa-arrow-left"></i>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* MOBILE */}

//         <div className="notifications-wrap">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="notifications-in">
//                   <h2>Notifications</h2>
//                   {notificationlist.map((notification, index) => (
//                     <div
//                       className="notificaton-strip"
//                       key={notificationlist.notification_id}
//                     >
//                       <div className="notificaton-in">
//                         <div className="notificaton-icon">
//                           <img
//                             src={
//                               imageBase +
//                               `/images/notifications/${(index % 3) + 1}
//                           .svg`
//                             }
//                           />
//                         </div>
//                         <div className="notificaton-content">
//                           <h6>{notification}</h6>
//                           <p></p>
//                         </div>
//                         <button
//                           type="button"
//                           className="notification-cross"
//                           onClick={() =>
//                             setmarkNotification(
//                               notificationlist.notification_id
//                             )
//                           }
//                         >
//                           <i className="fa-regular fa-xmark"></i>
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <AuthModal />
//       <Footer />
//     </>
//   );
// }

// export default NotificationHost;
