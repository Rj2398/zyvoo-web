import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import { imageBase, KEYS } from "../config/Constant";
import RegisterModal from "./guest/authModalGuest/RegisterModal";
import useProfile from "../hooks/useProfile";
import { useSelector } from "react-redux";

const MobFooter = ({ modalToggle }) => {

    const {userInfo} = useSelector(({user})=>user)
  const { getUserProfile } = useProfile();
  const localSaved = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  
  const login_id =userInfo?.user_id ? String(userInfo?.user_id) : null|| localSaved?.user_id ? String(localSaved?.user_id) : null;
  const userType = localStorage.getItem(KEYS.USER_TYPE);
  const profileData = useSelector((state) => state.profile);
  const location = useLocation();

  const [modalToggleValue, setModalToggleValue] = useState(false);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleGetProfile = async () => {
      try {
        const res = await getUserProfile({ user_id: login_id });
      } catch (error) {
        console.error(error);
      }
    };
    if (login_id) {
      handleGetProfile();
    }
  }, [login_id]);

  const handleModalToggle = (modalType, state) => {
    if (modalType === "register") setIsRegisterModalOpen(state);
    if (modalType === "login") setIsLoginModalOpen(state);
  };

  if(location.pathname === "/create-profile"){
    return <></>
  }

  return (
    <>
      {/* d-lg-none = hide on large screens and up */}
      <div className="mob-nav d-lg-none border-start-0 border-end-0" style={{zIndex:'99999'}}>
        <div className="container-fluid">
          <ul className="d-flex justify-content-around list-unstyled mb-0">
            {userType != "host" && (
              <li className="text-center">
                <Link to="/" className="text-decoration-none">
                  <img src="/images/mobile/nav/1.svg" loading="lazy" alt=""  width="24" />
                  <div className="small">Discover</div>
                </Link>
              </li>
            )}

            {userType == "host" && (
              <li className="text-center">
                <Link to="/homeHost" className="text-decoration-none">
                  <img src="/images/mobile/nav/1.svg" loading="lazy" alt="" width="24" />
                  <div className="small"> Properties </div>
                </Link>
              </li>
            )}

            {/* {userType != "host" && ( */}
              <li className="text-center">
                {!login_id ? (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleModalToggle("login", true);
                    }}
                    className="text-decoration-none"
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/images/mobile/nav/4.svg" loading="lazy" alt="" width="24" />
                    <div className="small">Wishlists</div>
                  </a>
                ) : (
                  // <Link to="/WishList" className="text-decoration-none">
                  // userType==="host" && (
                     <Link to="/chat" className="text-decoration-none">
                    <img src="/images/nav-section/chat.svg" loading="lazy" alt="" width="24" />
                    <div className="small">inbox</div>
                  </Link>
                  // )
                
                )}
              </li>
            {/* )} */}

            {login_id ? (
              <>

                 <li className="text-center">
                  <Link to="/booking" className="text-decoration-none">
                    <img
                      src="/images/mobile/nav/3.svg"
                      loading="lazy" alt="Bookings"
                      width="24"
                    />
                    <div className="small">Booking</div>
                  </Link>
                  </li>

                  {
                    userType!=="host" && (
                     <li className="text-center">
                  <Link to="/wishlist" className="text-decoration-none">
                    <img
                      src="/images/mobile/nav/4.svg"
                      loading="lazy" alt="Chat"
                      width="24"
                    />
                    <div className="small">wishlist</div>
                  </Link>
                </li>)
                  }
            
                {/* <li className="text-center">
                  <Link to="/booking" className="text-decoration-none">
                    <img
                      src="/images/mobile/nav/3.svg"
                      loading="lazy" alt="Bookings"
                      width="24"
                    />
                    <div className="small">Booking</div>
                  </Link>
                </li> */}
                <li className="text-center">
                  <Link to="/profile" className="text-decoration-none">
                    <img src={profileData?.profileData?.profile_image
                          ? typeof profileData?.profileData?.profile_image === "object"
                            ? `${imageBase + profileData?.profileData?.profile_image?.profile_image_url}`
                            : `${imageBase + profileData?.profileData?.profile_image }`
                          : "/images/mobile/nav/5.svg"
                      }
                      loading="lazy" alt="User Profile"
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      width="24"
                    />
                    <div className="small">Profile</div>
                  </Link>
                </li>
              </>
            ) : (
              <li className="text-center">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalToggle("login", true);
                  }}
                  className="text-decoration-none"
                  style={{ cursor: "pointer" }}
                >
                  <img src="/images/mobile/nav/5.svg" loading="lazy" alt="Login" width="24" />
                  <div className="small">Login</div>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <RegisterModal
        show={isRegisterModalOpen}
        onHide={() => handleModalToggle("register", false)}
        CallBack={(bool) => setIsRegisterModalOpen(bool)}
        loginModal={registerModal}
        ToggleVal={(bool) => setRegisterModal(bool)}
      />

      <RegisterModal
        show={isLoginModalOpen}
        onHide={() => handleModalToggle("login", false)}
        CallBack={(bool) => setIsLoginModalOpen(bool)}
        loginModal={modalToggleValue}
        ToggleVal={(bool) => setModalToggleValue(bool)}
      />
      {/* Add this CSS to your global styles */}
    </>
  );
};

export default React.memo(MobFooter);
<style jsx>{`
  .mob-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 1000;
    padding: 8px 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  /* Ensure content isn't hidden behind footer */
  @media (max-width: 991.98px) {
    body {
      padding-bottom: 60px;
    }
  }
`}</style>;
