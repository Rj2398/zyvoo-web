import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterModal from "./authModalGuest/RegisterModal";
import useCommon from "../../hooks/useCommon";
import { toast } from "react-toastify";
import { KEYS } from "../../config/Constant";

const Footer = () => {
  const { joinNewsLetter } = useCommon();
  const [email, setEmail] = useState("");

  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const useType = localStorage.getItem(KEYS.USER_TYPE);
  const userId = userData?.user_id ? String(userData?.user_id) : null;

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalToggleValue, setModalToggleValue] = useState(false); 
  const [registerModal, setRegisterModal] = useState(true);

  const [isHovered, setIsHovered] = useState(null);
  const handleModalToggle = (modalType, state) => {
    if (modalType === "register") {
      setIsRegisterModalOpen(state);
      if (state === true) {
        setRegisterModal(true); 
      }
    }

    if (modalType === "login") {
      setIsLoginModalOpen(state);
      if (state === true) {
        setModalToggleValue(false); 
      }
    }
  };

  const joinNews = async (e) => {
    e.preventDefault();
    try {
      const response = await joinNewsLetter({ email: email });
      toast.success(response?.message);
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    }
    setEmail("");
  };

  const icons = [
    { className: "fa-facebook-f", color: "#1877f2", url: "https://www.facebook.com" },
    { className: "fa-x-twitter", color: "#1da1f2", url: "https://www.twitter.com" },
    { className: "fa-instagram", color: "#e1306c", url: "https://www.instagram.com" },
    { className: "fa-linkedin-in", color: "#0a66c2", url: "https://www.linkedin.com" },
  ];

  return (
    <footer>
      <div className="footer-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="footer-inner">
                <div className="footer-inner-item">
                  <h2>Join Newsletter</h2>
                  <form onSubmit={joinNews}
                    style={{
                      border: "1px solid white",
                      borderRadius: "50px",
                      backgroundColor: "#3A4B4C",
                      display: "flex",
                      alignItems: "center",
                      padding: "8px",
                    }} >
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" className="news-btn"
                     />

                    <button type="submit"  className="news-btn-submit">
                      {/* <i className="fa-solid fa-paper-plane"></i> */}
                        {/* <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <path d="M3 11.5L21 3L16 21L11 14L3 11.5Z" fill="#2A4145" />
    </svg> */}
                      {/* <img src="/images/footer/newlettericon.png"  style={{background:'grey'}} /> */}
                      <i className="fa-solid fa-paper-plane-top" style={{transform:'rotate(-30deg)',color:'#3A4B4C'}}></i>
                    </button>
                  </form>
                </div>

                <FooterItem title="Company" links={[
                  <Link to="/faq">Faq</Link>,
                  <Link to="/whyus">Why Us</Link>,
                  <Link to="/contactUs">Contact Us</Link>,
                ]}
                />

                <FooterItem title="Account" links={[
                  <Link to="#" onClick={() => handleModalToggle("register", true)} > Register </Link>,
                    <Link to="#" onClick={() => handleModalToggle("login", true)} > Login </Link>,
                  ]}
                />

                <FooterItem title="Resources" links={
                  !userId ? [
                    <Link onClick={() => handleModalToggle("register", true)}> Blog Articles </Link>,
                    <Link onClick={() => handleModalToggle("register", true)} > Explore Now </Link>,
                  ] : [
                    <Link to="/exploreArticles" state={{ useType, searchText: "Search blogs" }}>
                      Blog Articles
                    </Link>,
                    <Link to="/homeGuest">Explore Now</Link>,
                  ]
                  }
                />
                <FooterItem title="Follow Us" links={[
                    <ul>
                      {icons.map((icon, index) => (
                        <li key={index} style={{ display: "inline-block", margin: "0 2px" }}
                          onClick={() => window.open(icon.url, "_blank")} >
                          <div onMouseEnter={() => setIsHovered(index)}
                            onMouseLeave={() => setIsHovered(null)}
                            style={{
                              backgroundColor: "#c1d1d4", 
                              borderRadius: "50%",
                              width: "35px",
                              height: "35px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background-color 0.3s ease",
                              cursor: "pointer",
                            }} >
                            <i className={`fa-brands ${icon.className}`} 
                              style={{ color: isHovered === index ? icon.color : "#1f2e30", 
                                fontSize: "16px",
                                transition: "color 0.3s ease",
                              }}
                            ></i>
                          </div>
                        </li>
                      ))}
                    </ul>,
                  ]}
                />
              </div>

              <div className="footer-payment-icons" style={{ marginLeft: "50px" }} >
                <img src="/images/footer/payments.svg" loading="lazy" alt="Payment Methods" />
              </div>

              <div className="footer-inner-bottom">
                <p>Zyvo © Copyright 2025</p>
                <div className="logo" style={{ marginLeft: "53%" }}>
                  <Link to="/homeGuest"> <img src="/images/fevicon.svg" loading="lazy" alt="Logo" /> </Link>
                </div>
                <ul>
                  <li> <Link to="/privacy-policy">Privacy Policy</Link> </li>
                  <li> | </li>
                  <li> <Link to="/terms-condition">Terms of Service</Link> </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
    </footer>
  );
};

export default React.memo(Footer);

const FooterItem = React.memo(({ title, links }) => (
    <div className="footer-inner-item">
      <h2>{title}</h2>
      {links.map((link, idx) => (
        <h3 key={idx}>{link}</h3>
      ))}
    </div>
  ));