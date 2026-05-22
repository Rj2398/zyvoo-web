import React, { useEffect, useState, forwardRef, useRef } from "react";
import { Button } from "react-bootstrap";
import useCommon from "../../hooks/useCommon";
import { KEYS } from "../../config/Constant";
import Loader from "../Loader";
import { FaEllipsisVertical } from "react-icons/fa6";

import Dropdown from "react-bootstrap/Dropdown";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import vector from "../../assets/gallery/Vector.png";
import { useSelector } from "react-redux";

const Card = "";
function AddCardView({type}) {
      const {userInfo} = useSelector(({user})=>user)
  const stripePromise = loadStripe(
    "pk_test_51OJYBTBtvbMCJV4HYgcTe7suuWdRm8p0YqsRVOT7VU8z1CmCeMwK1MSIYRp0NQRaBiH26gE3VgmENFKybIgNJVrd00UGnNavL3"
  );

  const dropdownRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))  || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO))
  const userId =userInfo?.user_id ? String(userInfo?.user_id) : null|| userData?.user_id ? String(userData?.user_id) : null;
  const { getAllSavedCard, setPrefferCard, deleteSavedCard, isLoading } =
    useCommon();
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [stripe_customer_id, setStripe_customer_id] = useState("");
  const [showDeleteModalCard, setShowDeleteModalCard] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen && dropdownRef);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const response = await getAllSavedCard({ user_id: userId });
        setSavedCards(response.data?.cards || []);
        setStripe_customer_id(response.data?.stripe_customer_id);
      } catch (error) {
        console.error("Error fetching saved cards:", error);
      }
    };

    fetchSavedCards();
  }, [refresh, userId]);

  const handleSetPreferred = async (card) => {
    try {
      const response = await setPrefferCard({
        user_id: userId,
        card_id: card.card_id,
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error setting preferred card:", error);
    }
  };

  const deletePreferredCard = async (card) => {
    try {
      const response = await deleteSavedCard({
        user_id: userId,
        payment_method_id: card.card_id,
      });
      if (response) {
      }
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error setting preferred card:", error);
    }
  };

  const CustomToggle = forwardRef(({ onClick }, ref) => (
    <span ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: "pointer" }}
    >
      <FaEllipsisVertical size={16} />
    </span>
  ));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  return (
    <>
      <div style={{ width: isMobileWidth ? "100%" : "max-content", fontFamily: "" }}>
        {/* Payment Methods Header */}
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobileWidth ? "" : "space-between",
            fontSize: "18px",
            fontWeight: "500",
            padding: "12px",
            paddingLeft: "0",
            cursor: "pointer",
            gap: "10px",
            color: "#000",
          }}
          onClick={toggleDropdown}
        >
          Payment Methods
          <span>
            <i
              className="fa-solid fa-chevron-down"
              style={{
                transition: "transform 0.3s",
                fontSize: "14px",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            ></i>
          </span>
        </div>

        {(isMobileWidth  ? (dropdownOpen) : (dropdownOpen)) && (
          <div
            style={{
              marginTop: isMobileWidth ? "" : "5px",
              padding: isMobileWidth ? "" :  "10px",
              background: isMobileWidth ? "" : "#fff",
              boxShadow: isMobileWidth ? "" : "0px 2px 6px rgba(0, 0, 0, 0.1)",
              position: isMobileWidth ? "" : "absolute",
              // padding: isMobileWidth ? "1px 0px 0px 15px" : "",
              width: isMobileWidth ? "100%" : "380px",
              zIndex: isMobileWidth ? "" : 1000,
              opacity: isMobileWidth ? "1" : dropdownOpen ? 1 : 0,
              transform: isMobileWidth ? "" : dropdownOpen ? "translateY(0)" : "translateY(-10px)",
              visibility: isMobileWidth ? "" : dropdownOpen ? "visible" : "hidden",
              height: isMobileWidth ? "" : "200px",
              overflowY: "auto",
              maxHeight : isMobileWidth ? "200px" : "",
              border : isMobileWidth ? "1px solid black" : "1px solid #ddd",
              borderRadius : isMobileWidth ? "10px" : "8px"
            }}
          >
            <Loader visible={isLoading} />
            {!isMobileWidth && savedCards.length === 0 ? (
              <div className="text-center p-2">No saved cards found.</div>
            ) : (
              savedCards.map((card, index) => (
                <div key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    fontSize: "14px",
                    padding: isMobileWidth ? "8px 15px" : "8px",
                  }}
                >
                  {/* Card Details */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <img
                      src="/images/payment-methods/visa.svg"
                      loading="lazy" alt="Visa"
                      style={{ width: "30px", height: "auto" }}
                    />
                    <div>
                      <strong>**** {card.last4}</strong>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        Exp: {card.exp_month}/{card.exp_year}
                      </p>
                    </div>
                    {card.is_preferred && (
                      <span className="badge  d-flex justify-end align-items-center ms-auto"
                        style={{ fontWeight: '400', color: 'black', fontSize: '15px' }}
                      >
                        Preferred
                      </span>
                    )}
                  </div>
                  {!card.is_preferred ? (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="link"
                        className="p-0 border-0"
                        id="dropdown-custom-components"
                        as={CustomToggle}
                      ></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                         className="text-black"
                          onClick={() => {
                            handleSetPreferred(card);
                          }}
                        >
                          Make as Preferred
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-black"
                          onClick={() => {
                            setSelectedCard(card);
                            setShowDeleteModalCard(true);
                          }}
                        >
                          Remove
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>


                  ) : <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      className="p-0 border-0"
                      id="dropdown-custom-components"
                      as={CustomToggle}
                    ></Dropdown.Toggle>
                    <Dropdown.Menu>
                      {/* <Dropdown.Item
                          onClick={() => {
                            handleSetPreferred(card);
                          }}
                        >
                          Make as Preferred
                        </Dropdown.Item> */}
                      <Dropdown.Item
                        className="text-black"
                        onClick={() => {
                          setSelectedCard(card);
                          setShowDeleteModalCard(true);
                        }}
                      >
                        Remove
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Add Card Button */}
      {(isMobileWidth && type==="guest" ? dropdownOpen : !dropdownOpen ) && 
        <div style={{ maxWidth: "500px", margin: "8px" }}>
        <Button
          onClick={() => {
            if (window.innerWidth <= 768) {
              setShowMobileModal(true);   // Open popup for mobile
            } else {
              setShowForm(!showForm);     // Keep inline form for web
            }
          }}

          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            color: "black",
            border: "1px solid #b6b6b8",
            borderRadius: "20px",
            padding: "8px 13px",
            fontSize: "16px",
            gap: '15px',
            marginLeft:'-12px'
            // width: "50%",
          }}>
          Add Card
          <div
            style={{
              display: "flex",
              height: isMobileWidth ? "20px" : "25px",
              width: isMobileWidth ? "20px" : "25px",
              borderRadius: "50%",
              backgroundColor: "#2EE5A1",
              justifyContent: "center",
              alignItems: "center",
            }}
          // onClick={() => setShowForm(!showForm)}
          >
            <i className="fa-solid fa-plus"></i>
          </div>
        </Button>

        {showForm && (
          <div style={{ display: showForm ? '' : 'none' }}>
            <div className="m-3 w-100">
              <Elements stripe={stripePromise}>
                <CheckOutForm
                  setRefresh={setRefresh}
                  setShowForm={setShowForm}
                />
              </Elements>
            </div>
          </div>
        )}
        </div>}

      {showDeleteModalCard && (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }} >
          <div style={{
              width: "90%", // Or "100%" if you want
              maxWidth: "400px",
              borderRadius: "13px",
              backgroundColor: "white",
              padding: "20px",
            }} >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowDeleteModalCard(false)}
                style={{
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }} >
                x
              </button>
            </div>
            <div style={{ textAlign: "center", padding: "0 20px" }}>
              <h3 style={{
                  fontWeight: "400",
                  fontSize: "28px",
                  color: "#000000",
                  marginBottom: "10px",
                  fontFamily: "sans-serif poppins",
                }} >
                Delete
              </h3>

              <div style={{ margin: "20px 0" }}>
                <img src={vector} loading="lazy" alt="delete" 
                  style={{
                    width: "90px",
                    height: "90px",
                    marginBottom: "20px",
                  }} />
              </div>

              <p style={{ marginBottom: "30px" }}> Are you sure you want to delete this property? </p>

              <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  marginBottom: "20px",
                }} >
                <button
                  onClick={() => {
                    deletePreferredCard(selectedCard);
                    setShowDeleteModalCard(false);
                  }}
                  style={{
                    padding: "10px 50px",
                    borderRadius: "50px",
                    border: "none",
                    backgroundColor: "#4AEAB1",
                    color: "#000",
                    cursor: "pointer",
                  }}>
                  Yes
                </button>

                <button onClick={() => setShowDeleteModalCard(false)}
                  style={{
                    padding: "10px 37px",
                    border: "1px solid #4AEAB1",
                    borderRadius: "50px",
                    backgroundColor: "#fff",
                    color: "#000",
                    cursor: "pointer",
                  }} >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Mobile Add Card Popup */}
      {showMobileModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
            padding:isMobileWidth?"20px":''
          }}
        >
          <div
            style={{
              width: "95%",
              maxWidth: "400px",
              borderRadius: "13px",
              backgroundColor: "white",
              padding: "20px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <button
                onClick={() => setShowMobileModal(false)}
                style={{
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                x
              </button> */}

                <button
            // type="button"
            // className="close"
                       onClick={() => setShowMobileModal(false)}
            // aria-label="Close"
            style={{
              // position: "absolute",
              // top: "10px",
              // right: "10px",
              background: "#2F3E46",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "white",
              width: isMobileWidth? "25px" : "35px",
              height:isMobileWidth? "25px" : "35px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop:isMobileWidth? "-10px" : ''
            }}
          >
            &times;
          </button>
            </div>

            <Elements stripe={stripePromise}>
              <CheckOutForm setRefresh={setRefresh} setShowForm={setShowForm} setShowMobileModal={setShowMobileModal}/>
            </Elements>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(AddCardView);
