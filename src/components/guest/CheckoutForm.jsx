import React, { useState, useEffect, useRef } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, } from "@stripe/react-stripe-js";
import { Button, Card, Form, Container, Alert, Row, Col, } from "react-bootstrap";
import useCommon from "../../hooks/useCommon";
import { GOOGLE_KEY, KEYS } from "../../config/Constant";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { Content } from "rsuite";
import { useSelector } from "react-redux";

const CheckOutForm = ({ setSelected, setSelected2, refresh, setRefresh, setShowForm,setShowMobileModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const streetInputRef = useRef(null);
    const {userInfo} = useSelector(({user})=>user)

  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  
  const userId = userInfo?.user_id ? String(userInfo?.user_id) : null||userData?.user_id ? String(userData?.user_id) : null;

  const { saveCardStripe, getSavedAddress, isLoading } = useCommon();
  const [showSavedCards, setShowSavedCards] = useState(true);
  const [showAddCardForm, setShowAddCardForm] = useState(true);
  const [savedCards, setSavedCards] = useState([]);
  const [isCardSave, setIsCardSaved] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stripeToken, setStripeToken] = useState(null);
  const [isSameAsMailing, setIsSameAsMailing] = useState(false);
  const [savedAddress, setSavedAddress] = useState({});
  const [manualAddress, setManualAddress] = useState({street: "", city: "", state: "", zip_code: "",});

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };
    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);
    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const inputStyle = {
    borderRadius: "20px",
    padding: isMobileWidth ? "5px 15px" : "10px 15px",
    border: "1px solid #ccc",
    fontSize: isMobileWidth ? "12px" : "14px",
    width: "100%",
    color:'black'
  };

  


  const sectionTitle = {
    fontWeight: "500",
    fontSize: isMobileWidth ? "14px" : "18px",
    marginBottom: "20px",
    color:"black"
  };

  const checkboxLabelStyle = {
    fontSize: isMobileWidth ? "13px" : "14px",
    marginLeft: "5px",
    verticalAlign: "middle",
    color:'black'
  };

  const formStyle = {
    maxWidth: "700px",
    margin: !isMobileWidth && "30px auto",
    backgroundColor: "#fff",
    padding: !isMobileWidth && "30px",
    borderRadius: "15px",
    boxShadow: isMobileWidth ? "" : "0 0 20px rgba(0,0,0,0.05)",
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadGoogleMapsScript().then(() => {
        if (!streetInputRef.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(
          streetInputRef.current,
          {
            types: ["address"],
            fields: ["address_components", "formatted_address"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const address = {
            street: "",
            city: "",
            state: "",
            zip: "",
          };

          if (!place.address_components) return;

          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes("street_number")) {
              address.street = component.long_name + " " + address.street;
            }
            if (types.includes("route")) {
              address.street += component.long_name;
            }
            if (types.includes("locality")) {
              address.city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              address.state = component.long_name;
            }
            if (types.includes("postal_code")) {
              address.zip = component.long_name || component?.short_name;
            }
          }

          setManualAddress((prev) => ({
            ...prev,
            street: address.street,
            city: address.city,
            state: address.state,
            zip_code: address.zip,
          }));

          setErrorMessage("");
        });
      })
      .catch((err) => {
        console.error("Failed to load Google Maps script:", err);
      });
  }, []);

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleAddCard = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    if (!(manualAddress.street ||(isSameAsMailing && savedAddress?.street_address)) ||
      !(manualAddress.city || (isSameAsMailing && savedAddress?.city)) ||
      !(manualAddress.state || (isSameAsMailing && savedAddress?.state)) ||
      !(manualAddress.zip_code || (isSameAsMailing && savedAddress?.zip_code))
    ) {
      setErrorMessage("Please fill in all address fields.");
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (!cardholderName) {
      setErrorMessage("Please enter the cardholder name.");
      return;
    }
    setIsCardSaved(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, token } = await stripe.createToken(cardNumberElement, {
      name: cardholderName,
      address_line1: savedAddress?.street ?? manualAddress?.street,
      address_city: savedAddress?.city ?? manualAddress?.street,
      address_state: savedAddress?.state ?? manualAddress?.street,
      address_zip: savedAddress?.zip_code ?? manualAddress?.street,
    });

    if (token) {
      try {
        const response = await saveCardStripe({
          user_id: userId,
          token_stripe: token?.id,
        });

        if (response) {
          // setShowForm(false)
          toast.success(response?.message || "Card saved successfully");
          setStripeToken(token.id);
          setSavedCards([
            ...savedCards,
            {
              id: token.id,
              last4: token.card.last4,
              brand: token.card.brand,
              exp: `${token.card.exp_month}/${token.card.exp_year}`,
              cvv: "***",
            },
          ]);
          setShowAddCardForm(false);
          setCardholderName("");
          setIsCardSaved(false);
          // Safe Call
          setSelected?.(false);
          setSelected2?.(false);
          setRefresh?.(!refresh);
          setShowForm?.(false);
          setShowMobileModal?.(false);
          // setSelected(false);
          // setSelected2(false);
          // setRefresh(!refresh);
          // setShowForm(false)
          // showMobileModal(false)
        }
      } catch (error) {
        console.error(error, "Error saving card");
        setErrorMessage("Failed to save card. Please try again.");
        setIsCardSaved(false);
        setRefresh(refresh);
      }
    }

    if (error) {
      setErrorMessage(error.message);
      setIsCardSaved(false);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await getSavedAddress({ user_id: userId });
      setSavedAddress(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cardNumbertOptions = {
      placeholder: "card number",
    style: {
      base: {
       
        color: "black",
        border: "1px solid black",
        "::placeholder": {
          color: "#7A7A7A",
           fontSize: isMobileWidth? "12px" : "14px",
         
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

    const cardElementOptions = {
     
    style: {
      base: {
        // fontSize: "16px",
        color: "black",
        border: "1px solid black",
        "::placeholder": {
          color: "#7A7A7A",
          fontSize: isMobileWidth? "12px" : "14px",
         
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <Container style={formStyle}>
      <Loader visible={isLoading} />
      <div style={{ border: "none" }}>
        {showSavedCards && (
          <Card style={{ border: "none", padding: "0px", }} >
            {showAddCardForm && (
              <Container style={isMobileWidth ? { margin: "0px", padding: "0px" } : {}} >
                <Loader visible={isCardSave} />
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCard();
                  }} >
                  {errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}
                  <Row>
                    <Col md={12}>
                      <div style={{ ...sectionTitle, textAlign: isMobileWidth && "center" }}>
                    {  isMobileWidth ? "Add Card" :" Add New Card"}
                    {
                      isMobileWidth && (<hr/>)
                    }
                      </div>
                    </Col>
                    
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className={isMobileWidth ? "mb-2" : "mb-3"}>
                        {/* {!isMobileWidth && (<Form.Label style={{color:'black'}}>Cardholder Name</Form.Label>)} */}

                        <Form.Control type="text" className="input-placeholder" placeholder={isMobileWidth ? "Name" : "John Doe"}
                          value={cardholderName} required
                          onChange={(e) => {
                            setCardholderName(e.target.value);
                            setErrorMessage("");
                          }}
                          style={{
                            ...inputStyle,
                            borderRadius: "100px", // "--placeholder-color": "yellow !mportant",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className={isMobileWidth ? "mb-2" : "mb-3"}>
                        {/* {!isMobileWidth && <Form.Label  style={{color:'black'}}>Card Number</Form.Label>} */}
                        <div style={inputStyle}>
                          <CardNumberElement options={cardNumbertOptions } />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className={isMobileWidth ? "mb-2" : "mb-3"}>
                        {/* {!isMobileWidth && <Form.Label style={{color:'black'}} >CVV</Form.Label>} */}
                        <div style={inputStyle}> <CardCvcElement options={cardElementOptions} /> </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className={isMobileWidth ? "mb-2" : "mb-3"}>
                        {/* {!isMobileWidth && (<Form.Label style={{color:'black'}}>Expiration Date</Form.Label>)} */}
                        <div style={inputStyle}> <CardExpiryElement options={cardElementOptions} /> </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className={isMobileWidth ? "mt-2" : "mt-4"}>
                    <Col>
                      <h5 className={isMobileWidth ? "mb-1" : "mb-3"} style={{ fontWeight: "500", fontSize: isMobileWidth ? "14px" : "18px",color:'black' }} >
                        Add Billing Address
                      </h5>
                      <div className="col-12">
                        <div style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px",
                          }} >
                          <label style={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }} >
                            <input type="checkbox" id="sameAsMailing" checked={isSameAsMailing}
                              onChange={(e) => setIsSameAsMailing(e.target.checked) }
                              style={{
                                appearance: isSameAsMailing ? "auto" : "none",
                                WebkitAppearance: "none",
                                width: "16px",
                                height: "16px",
                                border: "2px solid #ccc",
                                borderRadius: "3px",
                                outline: "none",
                                marginRight: "8px",
                                color: "white",
                                accentColor: "#3df6b0",
                                cursor: "pointer",
                              }}
                            />
                          </label>

                          <label htmlFor="sameAsMailing" style={checkboxLabelStyle}>
                            Same as Mailing Address
                          </label>
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className={isMobileWidth ? "col-6 mt-3" : "col-md-6"}>
                          {/* <input type="text" placeholder="Street" style={inputStyle}
                            onChange={(e) => {
                              setErrorMessage("");
                              setManualAddress({
                                ...manualAddress,
                                street: e.target.value,
                              });
                            }}
                            value={isSameAsMailing ? savedAddress?.street_address || "" 
                                : manualAddress?.street
                            }
                            readOnly={isSameAsMailing}
                          /> */}

                          <input type="text" className="input-placeholder" placeholder="Street" style={inputStyle} ref={streetInputRef}
                            onChange={(e) => {
                              setErrorMessage("");
                              setManualAddress({
                                ...manualAddress,
                                street: e.target.value,
                              });
                            }}
                            value={isSameAsMailing ? savedAddress?.street_address || "" : manualAddress?.street}
                            // readOnly={isSameAsMailing}
                          />
                        </div>
                        <div className={isMobileWidth ? "col-6 mt-3" : "col-md-6"}>
                          <input type="text"  className="input-placeholder" placeholder="City" style={inputStyle}
                            onChange={(e) => {
                              setErrorMessage("");
                              setManualAddress({
                                ...manualAddress,
                                city: e.target.value,
                              });
                            }}
                            value={isSameAsMailing ? savedAddress?.city || "" : manualAddress?.city }
                            readOnly={isSameAsMailing}
                          />
                        </div>
                        <div className={isMobileWidth ? "col-6 mt-3" : "col-md-6"}>
                          <input type="text" className="input-placeholder" placeholder="State" style={inputStyle} 
                            onChange={(e) => {
                              setErrorMessage("");
                              setManualAddress({
                                ...manualAddress,
                                state: e.target.value,
                              });
                            }}
                            value={ isSameAsMailing ? savedAddress?.state || "" : manualAddress?.state }
                            readOnly={isSameAsMailing}
                          />
                        </div>
                        <div className={isMobileWidth ? "col-6 mt-3" : "col-md-6"}>
                          <input type="text" className="input-placeholder" placeholder="Zip code" style={inputStyle}
                            onChange={(e) => {
                              setErrorMessage("");
                              setManualAddress({
                                ...manualAddress,
                                zip_code: e.target.value,
                              });
                            }}
                            value={ isSameAsMailing ? savedAddress?.zip_code || "" : manualAddress?.zip_code}
                            readOnly={isSameAsMailing}
                          />
                        </div>
                      </div>

                      <div className="user-data-btn"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          margin: isMobileWidth ? "" : "20px 0",
                        }}
                      >
                        <button className="register-modal-body-submit-btn mt-3" onClick={handleAddCard}>
                          Submit
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Container>
            )}
          </Card>
        )}
      </div>
    </Container>
  );
};

export default CheckOutForm;
