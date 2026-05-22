// import React from "react";

// import AuthModal from "../../components/guest/authModal";

// function ChatHost() {
//   return (
//     <>
//       {/* <Header /> */}

//       {/*
//       body
//       */}

//       <main>
//         {/* <!-- MOBILE --> */}
//         <div className="mob-search-filter border-start-0 border-end-0 mob-booking-filter mob-chat-filter">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="mob-search-filter-in">
//                   <div className="mob-search-bar-back">
//                     {/* <!-- <a href="chat.html"><i className="fa-regular fa-arrow-left"></i></a> --> */}
//                     <form action="">
//                       <label>
//                         <input type="text" placeholder="Search..." />
//                         <button type="submit">
//                           <i className="fa-regular fa-magnifying-glass"></i>
//                         </button>
//                       </label>
//                     </form>
//                   </div>
//                   <div className="mob-filter-in ms-auto dropdown">
//                     <a
//                       href="#"
//                       className="dropdown-toggle"
//                       role="button"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       <img
//                         src="/images/mobile/filters/filter.svg"
//                         alt=""
//                       />
//                     </a>
//                     <div className="dropdown-menu">
//                       <ul>
//                         <li>
//                           <a href="#">All Conversations</a>
//                         </li>
//                         <li>
//                           <a href="#">Archived</a>
//                         </li>
//                         <li>
//                           <a href="#">Unread</a>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <!-- MOBILE --> */}

//         {/* <!-- CHAT-PAGE --> */}
//         <div className="chat-wrap">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-3">
//                 <div className="chat-left">
//                   <div className="chat-left-top">
//                     <form action="">
//                       <div className="chat-left-top-dropdown dropdown">
//                         <span
//                           className="dropdown-toggle"
//                           role="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           All Conversations{" "}
//                           <img
//                             src="/images/dropdown.svg"
//                             alt=""
//                           />
//                         </span>
//                         <div className="chat-left-top-dropdown-list dropdown-menu">
//                           <ul>
//                             <li>
//                               <a href="#">
//                                 All Conversations
//                               </a>
//                             </li>
//                             <li>
//                               <a href="#">Archived</a>
//                             </li>
//                             <li>
//                               <a href="#">Unread</a>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                       <button type="button">
//                         <i className="fa-regular fa-magnifying-glass"></i>
//                       </button>
//                     </form>
//                   </div>
//                   {/* <!-- DESKTOP-TABLET --> */}
//                   <div
//                     className="chat-list"
//                     id="v-pills-tab"
//                     role="tablist"
//                     aria-orientation="vertical"
//                   >
//                     <button
//                       className="chat-list-in nav-link active"
//                       id="v-pills-1-tab"
//                       data-bs-toggle="pill"
//                       data-bs-target="#v-pills-1"
//                       type="button"
//                       role="tab"
//                       aria-controls="v-pills-1"
//                       aria-selected="true"
//                     >
//                       <div className="chat-list-in-image">
//                         <img
//                           src="/images/chat/profile/1.svg"
//                           alt=""
//                         />
//                       </div>
//                       <div className="chat-list-in-content">
//                         <h1>
//                           Hosted by Mia{" "}
//                           <img
//                             src="/images/locations-grid/profile/batch.svg"
//                             alt=""
//                           />
//                         </h1>
//                         <h2>3 minutes ago</h2>
//                         <p>Hello can we talk about...</p>
//                       </div>
//                     </button>
//                     <button
//                       className="chat-list-in nav-link"
//                       id="v-pills-2-tab"
//                       data-bs-toggle="pill"
//                       data-bs-target="#v-pills-2"
//                       type="button"
//                       role="tab"
//                       aria-controls="v-pills-2"
//                       aria-selected="true"
//                     >
//                       <div className="chat-list-in-image">
//                         <span></span>
//                         <img
//                           src="/images/chat/profile/2.svg"
//                           alt=""
//                         />
//                       </div>
//                       <div className="chat-list-in-content">
//                         <h1>Person Name</h1>
//                         <h2>3 minutes ago</h2>
//                         <p>Hello can we talk about...</p>
//                       </div>
//                     </button>
//                     <button
//                       className="chat-list-in nav-link"
//                       id="v-pills-3-tab"
//                       data-bs-toggle="pill"
//                       data-bs-target="#v-pills-3"
//                       type="button"
//                       role="tab"
//                       aria-controls="v-pills-3"
//                       aria-selected="true"
//                     >
//                       <div className="chat-list-in-image">
//                         <img
//                           src="/images/chat/profile/3.svg"
//                           alt=""
//                         />
//                       </div>
//                       <div className="chat-list-in-content">
//                         <h1>Support Team</h1>
//                         <h2>Yesterday</h2>
//                         <p>Hello can we talk about...</p>
//                       </div>
//                     </button>
//                   </div>
//                   {/* <!-- DESKTOP-TABLET -->
//               <!-- MOBILE --> */}
//                   <div className="chat-list chat-list-mob">
//                     <div className="chat-list-in">
//                       <div className="chat-list-in-image">
//                         <img
//                           src="/images/chat/profile/1.svg"
//                           alt=""
//                         />
//                       </div>
//                       <div className="chat-list-in-content">
//                         <h1>
//                           <a href="mob-chat-details.html">Hosted by Mia</a>{" "}
//                           <img
//                             src="/images/locations-grid/profile/batch.svg"
//                             alt=""
//                           />
//                         </h1>
//                         <h2>3 minutes ago</h2>
//                         <p>Hello can we talk about...</p>
//                       </div>
//                       <div className="dropdown">
//                         <button
//                           type="button"
//                           className="dropdown-toggle"
//                           role="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           <i className="fa-solid fa-ellipsis-vertical"></i>
//                         </button>
//                         <div className="dropdown-menu">
//                           <ul>
//                             <li>
//                               <a href="#">Mute</a>
//                             </li>
//                             <li>
//                               <a href="#">Report</a>
//                             </li>
//                             <li>
//                               <a href="#">Delete chat</a>
//                             </li>
//                             <li>
//                               <a href="#">Block</a>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="chat-list-in">
//                       <div className="chat-list-in-image">
//                         <span></span>
//                         <img
//                           src="/images/chat/profile/2.svg"
//                           alt=""
//                         />
//                       </div>
//                       <div className="chat-list-in-content">
//                         <h1>
//                           <a href="mob-chat-details.html">Person Name</a>
//                         </h1>
//                         <h2>3 minutes ago</h2>
//                         <p>Hello can we talk about...</p>
//                       </div>
//                       <div className="dropdown">
//                         <button
//                           type="button"
//                           className="dropdown-toggle"
//                           role="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           <i className="fa-solid fa-ellipsis-vertical"></i>
//                         </button>
//                         <div className="dropdown-menu">
//                           <ul>
//                             <li>
//                               <a href="#">Mute</a>
//                             </li>
//                             <li>
//                               <a href="#">Report</a>
//                             </li>
//                             <li>
//                               <a href="#">Delete chat</a>
//                             </li>
//                             <li>
//                               <a href="#">Block</a>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="chat-list-in">
//                       <div className="chat-list-in-image">
//                         <img
//                           src="/images/chat/profile/3.svg"
//                           alt=""
//                         />
//                       </div>
//                       <div className="chat-list-in-content">
//                         <h1>
//                           <a href="mob-chat-details.html">Support Team</a>
//                         </h1>
//                         <h2>Yesterday</h2>
//                         <p>Hello can we talk about...</p>
//                       </div>
//                       <div className="dropdown">
//                         <button
//                           type="button"
//                           className="dropdown-toggle"
//                           role="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           <i className="fa-solid fa-ellipsis-vertical"></i>
//                         </button>
//                         <div className="dropdown-menu">
//                           <ul>
//                             <li>
//                               <a href="#">Mute</a>
//                             </li>
//                             <li>
//                               <a href="#">Report</a>
//                             </li>
//                             <li>
//                               <a href="#">Delete chat</a>
//                             </li>
//                             <li>
//                               <a href="#">Block</a>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* <!-- MOBILE --> */}
//                 </div>
//               </div>
//               <div className="col-lg-6 col-md-6">
//                 <div className="chat-mid">
//                   <div className="tab-content" id="v-pills-tabContent">
//                     <div
//                       className="tab-pane fade show active"
//                       id="v-pills-1"
//                       role="tabpanel"
//                       aria-labelledby="v-pills-1-tab"
//                       tabindex="0"
//                     >
//                       {/* <!-- CHATING-SECTION --> */}
//                       <div className="chat-mid-top">
//                         <div className="chat-mid-top-in">
//                           <div className="chat-mid-top-in-image">
//                             <img
//                               src="/images/chat/profile/1.svg"
//                               alt=""
//                             />
//                           </div>
//                           <div className="chat-mid-top-in-text">
//                             <h3>
//                               Host by Mia
//                               <span className="info-wrap">
//                                 <img
//                                   src="/images/locations-grid/profile/batch.svg"
//                                   alt=""
//                                 />
//                                 <span className="info-in">
//                                   <b>Starhost</b>
//                                   This host is vetted by Zyvo for proving the
//                                   best services
//                                 </span>
//                               </span>
//                             </h3>
//                             <p>online</p>
//                           </div>
//                         </div>
//                         <div className="chat-mid-top-btns">
//                           <input type="checkbox" id="star_chat" hidden />
//                           <label for="star_chat">
//                             <i className="fa-light fa-star"></i>
//                             <i className="fa-solid fa-star"></i>
//                           </label>
//                           <div className="dropdown">
//                             <button
//                               type="button"
//                               className="dropdown-toggle"
//                               role="button"
//                               data-bs-toggle="dropdown"
//                               aria-expanded="false"
//                             >
//                               <i className="fa-solid fa-ellipsis"></i>
//                             </button>
//                             <div
//                               className="dropdown-menu dropdown-menu-end"
//                               data-popper-placement=""
//                             >
//                               <ul>
//                                 <li>
//                                   <a href="#">Mute</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Report</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Delete chat</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Block</a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="chat-mid-inner">
//                         {/* <!-- CHAT --> */}
//                         <div className="chat-mid-inner-host-user">
//                           <div className="chat-mid-inner-host-user-info">
//                             <div className="chat-mid-inner-host-user-info-image">
//                               <img
//                                 src="/images/chat/profile/1.svg"
//                                 alt=""
//                               />
//                             </div>
//                             <div className="chat-mid-inner-host-user-info-text">
//                               <h3>Mia</h3>
//                               <p>Jul 20, 2023, 11:32 AM</p>
//                             </div>
//                           </div>
//                           <div className="chat-mid-inner-host-user-chat">
//                             <p>Hi welcome to our house!</p>
//                           </div>
//                         </div>
//                         {/* <!-- CHAT -->
//                     <!-- CHAT --> */}
//                         <div className="chat-mid-inner-host-user">
//                           <div className="chat-mid-inner-host-user-info">
//                             <div className="chat-mid-inner-host-user-info-image">
//                               <img
//                                 src="/images/chat/profile/2.svg"
//                                 alt=""
//                               />
//                             </div>
//                             <div className="chat-mid-inner-host-user-info-text">
//                               <h3>Katelyn</h3>
//                               <p>Jul 20, 2023, 11:32 AM</p>
//                             </div>
//                           </div>
//                           <div className="chat-mid-inner-host-user-chat">
//                             <p>Hi thank you</p>
//                           </div>
//                         </div>
//                         {/* <!-- CHAT --> */}
//                       </div>
//                       <div className="chat-mid-typing">
//                         <form action="">
//                           <div className="chat-mid-typing-in">
//                             <textarea placeholder="Type a message..."></textarea>
//                             <label>
//                               <img
//                                 src="/images/chat/file.svg"
//                                 alt=""
//                               />
//                               <input type="file" hidden />
//                             </label>
//                           </div>
//                           <button type="submit">
//                             <img
//                               src="/images/chat/send.svg"
//                               alt=""
//                             />
//                           </button>
//                         </form>
//                       </div>
//                       {/* <!-- CHATING-SECTION --> */}
//                     </div>
//                     <div
//                       className="tab-pane fade"
//                       id="v-pills-2"
//                       role="tabpanel"
//                       aria-labelledby="v-pills-2-tab"
//                       tabindex="0"
//                     >
//                       {/* <!-- CHATING-SECTION --> */}
//                       <div className="chat-mid-top">
//                         <div className="chat-mid-top-in">
//                           <div className="chat-mid-top-in-image">
//                             <img
//                               src="/images/chat/profile/1.svg"
//                               alt=""
//                             />
//                           </div>
//                           <div className="chat-mid-top-in-text">
//                             <h3>
//                               Host by Mia
//                               <span className="info-wrap">
//                                 <img
//                                   src="/images/locations-grid/profile/batch.svg"
//                                   alt=""
//                                 />
//                                 <span className="info-in">
//                                   <b>Starhost</b>
//                                   This host is vetted by Zyvo for proving the
//                                   best services
//                                 </span>
//                               </span>
//                             </h3>
//                             <p>online</p>
//                           </div>
//                         </div>
//                         <div className="chat-mid-top-btns">
//                           <input type="checkbox" id="star_chat_2" hidden />
//                           <label for="star_chat_2">
//                             <i className="fa-light fa-star"></i>
//                             <i className="fa-solid fa-star"></i>
//                           </label>
//                           <div className="dropdown">
//                             <button
//                               type="button"
//                               className="dropdown-toggle"
//                               role="button"
//                               data-bs-toggle="dropdown"
//                               aria-expanded="false"
//                             >
//                               <i className="fa-solid fa-ellipsis"></i>
//                             </button>
//                             <div
//                               className="dropdown-menu dropdown-menu-end"
//                               data-popper-placement=""
//                             >
//                               <ul>
//                                 <li>
//                                   <a href="#">Mute</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Report</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Delete chat</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Block</a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="chat-mid-inner">
//                         {/* <!-- CHAT --> */}
//                         <div className="chat-mid-inner-host-user">
//                           <div className="chat-mid-inner-host-user-info">
//                             <div className="chat-mid-inner-host-user-info-image">
//                               <img
//                                 src="/images/chat/profile/1.svg"
//                                 alt=""
//                               />
//                             </div>
//                             <div className="chat-mid-inner-host-user-info-text">
//                               <h3>Mia</h3>
//                               <p>Jul 20, 2023, 11:32 AM</p>
//                             </div>
//                           </div>
//                           <div className="chat-mid-inner-host-user-chat">
//                             <p>Hi welcome to our house!</p>
//                           </div>
//                         </div>
//                         {/* <!-- CHAT -->
//                     <!-- CHAT --> */}
//                         <div className="chat-mid-inner-host-user">
//                           <div className="chat-mid-inner-host-user-info">
//                             <div className="chat-mid-inner-host-user-info-image">
//                               <img
//                                 src="/images/chat/profile/2.svg"
//                                 alt=""
//                               />
//                             </div>
//                             <div className="chat-mid-inner-host-user-info-text">
//                               <h3>Katelyn</h3>
//                               <p>Jul 20, 2023, 11:32 AM</p>
//                             </div>
//                           </div>
//                           <div className="chat-mid-inner-host-user-chat">
//                             <p>Hi thank you</p>
//                           </div>
//                         </div>
//                         {/* <!-- CHAT --> */}
//                       </div>
//                       <div className="chat-mid-typing">
//                         <form action="">
//                           <div className="chat-mid-typing-in">
//                             <textarea placeholder="Type a message..."></textarea>
//                             <label>
//                               <img
//                                 src="/images/chat/file.svg"
//                                 alt=""
//                               />
//                               <input type="file" hidden />
//                             </label>
//                           </div>
//                           <button type="submit">
//                             <img
//                               src="/images/chat/send.svg"
//                               alt=""
//                             />
//                           </button>
//                         </form>
//                       </div>
//                       {/* <!-- CHATING-SECTION --> */}
//                     </div>
//                     <div
//                       className="tab-pane fade"
//                       id="v-pills-3"
//                       role="tabpanel"
//                       aria-labelledby="v-pills-3-tab"
//                       tabindex="0"
//                     >
//                       {/* <!-- CHATING-SECTION --> */}
//                       <div className="chat-mid-top">
//                         <div className="chat-mid-top-in">
//                           <div className="chat-mid-top-in-image">
//                             <img
//                               src="/images/chat/profile/1.svg"
//                               alt=""
//                             />
//                           </div>
//                           <div className="chat-mid-top-in-text">
//                             <h3>
//                               Host by Mia
//                               <span className="info-wrap">
//                                 <img
//                                   src="/images/locations-grid/profile/batch.svg"
//                                   alt=""
//                                 />
//                                 <span className="info-in">
//                                   <b>Starhost</b>
//                                   This host is vetted by Zyvo for proving the
//                                   best services
//                                 </span>
//                               </span>
//                             </h3>
//                             <p>online</p>
//                           </div>
//                         </div>
//                         <div className="chat-mid-top-btns">
//                           <input type="checkbox" id="star_chat_3" hidden />
//                           <label for="star_chat_3">
//                             <i className="fa-light fa-star"></i>
//                             <i className="fa-solid fa-star"></i>
//                           </label>
//                           <div className="dropdown">
//                             <button
//                               type="button"
//                               className="dropdown-toggle"
//                               role="button"
//                               data-bs-toggle="dropdown"
//                               aria-expanded="false"
//                             >
//                               <i className="fa-solid fa-ellipsis"></i>
//                             </button>
//                             <div
//                               className="dropdown-menu dropdown-menu-end"
//                               data-popper-placement=""
//                             >
//                               <ul>
//                                 <li>
//                                   <a href="#">Mute</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Report</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Delete chat</a>
//                                 </li>
//                                 <li>
//                                   <a href="#">Block</a>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="chat-mid-inner">
//                         {/* <!-- CHAT --> */}
//                         <div className="chat-mid-inner-host-user">
//                           <div className="chat-mid-inner-host-user-info">
//                             <div className="chat-mid-inner-host-user-info-image">
//                               <img
//                                 src="/images/chat/profile/1.svg"
//                                 alt=""
//                               />
//                             </div>
//                             <div className="chat-mid-inner-host-user-info-text">
//                               <h3>Mia</h3>
//                               <p>Jul 20, 2023, 11:32 AM</p>
//                             </div>
//                           </div>
//                           <div className="chat-mid-inner-host-user-chat">
//                             <p>Hi welcome to our house!</p>
//                           </div>
//                         </div>
//                         {/* <!-- CHAT -->
//                     <!-- CHAT --> */}
//                         <div className="chat-mid-inner-host-user">
//                           <div className="chat-mid-inner-host-user-info">
//                             <div className="chat-mid-inner-host-user-info-image">
//                               <img
//                                 src="/images/chat/profile/2.svg"
//                                 alt=""
//                               />
//                             </div>
//                             <div className="chat-mid-inner-host-user-info-text">
//                               <h3>Katelyn</h3>
//                               <p>Jul 20, 2023, 11:32 AM</p>
//                             </div>
//                           </div>
//                           <div className="chat-mid-inner-host-user-chat">
//                             <p>Hi thank you</p>
//                           </div>
//                         </div>
//                         {/* <!-- CHAT --> */}
//                       </div>
//                       <div className="chat-mid-typing">
//                         <form action="">
//                           <div className="chat-mid-typing-in">
//                             <textarea placeholder="Type a message..."></textarea>
//                             <label>
//                               <img
//                                 src="/images/chat/file.svg"
//                                 alt=""
//                               />
//                               <input type="file" hidden />
//                             </label>
//                           </div>
//                           <button type="submit">
//                             <img
//                               src="/images/chat/send.svg"
//                               alt=""
//                             />
//                           </button>
//                         </form>
//                       </div>
//                       {/* <!-- CHATING-SECTION --> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-3 col-md-6">
//                 <div className="chat-right">
//                   <div className="chat-right-top">
//                     <h3>Hosted by</h3>
//                     <div className="chat-right-top-profile">
//                       <img
//                         className="chat-right-top-profile-image"
//                         src="/images/chat/profile/1.svg"
//                         alt=""
//                       />
//                       <h2>Mia J.</h2>
//                       <img
//                         className="chat-right-top-batch-image"
//                         src="/images/locations-grid/profile/batch.svg"
//                         alt=""
//                       />
//                     </div>
//                     <hr />
//                     <a href="#">Host Properties</a>
//                     <p>
//                       <img
//                         src="/images/guides-articles/time.svg"
//                         alt=""
//                       />
//                       Typically respond within 1 hr
//                     </p>
//                   </div>
//                   <div className="chat-right-bottom">
//                     <ul>
//                       <li>
//                         From{" "}
//                         <span>
//                           <b>United States</b>
//                         </span>
//                       </li>
//                       <li>
//                         Member Since <span>Jun 2023</span>
//                       </li>
//                       <li>
//                         English <span>Native</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <!-- CHAT-PAGE --> */}
//       </main>

//       <AuthModal />
//       {/* <Footer /> */}
//     </>
//   );
// }

// export default ChatHost;
