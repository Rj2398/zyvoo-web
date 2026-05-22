import React, { useEffect, useState } from "react";
import { Dropdown, Card } from "react-bootstrap";
import useCommon from "../../hooks/useCommon";
import { KEYS } from "../../config/Constant";
import Loader from "../Loader";
import visa from "../../assets/gallery/visa.svg";
import amex from "../../assets/gallery/amex.png";
import applePay from "../../assets/gallery/Apple-pay.svg";
import mastercard from "../../assets/gallery/mastercard.svg";
import { useSelector } from "react-redux";

const SavedCardsDropdown = ({ getStripId, getcard_id }) => {
      const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))|| JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId =userInfo?.user_id ? String(userInfo?.user_id) : null|| userData?.user_id ? String(userData?.user_id) : null;
  const { getAllSavedCard, setPrefferCard, deleteSavedCard, isLoading } =
    useCommon();

  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [stripe_customer_id, setStripe_customer_id] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const response = await getAllSavedCard({ user_id: userId });

        setSavedCards(response.data?.cards || []);

        setStripe_customer_id(response.data?.stripe_customer_id);
        getStripId(response.data?.stripe_customer_id || stripe_customer_id);

        let findCardID = response.data?.cards;

        if (findCardID && findCardID.length > 0) {
          const preferredCard = findCardID.find((card) => card.is_preferred); 

          if (preferredCard) {
            setSelectedCardId(preferredCard.card_id);
            getcard_id(preferredCard.card_id || selectedCardId);
          }
        }
      } catch (error) {
        console.error("Error fetching saved cards:", error);
      }
    };

    fetchSavedCards();
  }, [refresh, userId]);

  const handleSetPreferred = async (card) => {
    try {
      await setPrefferCard({ user_id: userId, card_id: card.card_id });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error setting preferred card:", error);
    }
  };


  return (
    <Dropdown
      show={showDropdown}
      onToggle={(isOpen) => setShowDropdown(isOpen)}
    >
      <Dropdown size="sm" 
      // onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCard ? (
          `**** ${selectedCard.last4}`
        ) : (
          <div className="d-flex gap-2">
            <img src={visa} loading="lazy" alt="Visa" style={{ width: "40px" }} />
            <img src={amex} loading="lazy" alt="Amex" style={{ width: "40px" }} />
            <img src={applePay} loading="lazy" alt="Apple Pay" style={{ width: "40px" }} />
            <img src={mastercard} loading="lazy" alt="Mastercard" style={{ width: "40px" }} />
          </div>
        )}
      </Dropdown>
      <Dropdown.Menu
        className="p-2"
        style={{
          minWidth: "260px",
          maxHeight: "250px",
          overflowY: "auto",
        }}
      >
        <Loader visible={isLoading} />
        {savedCards.length === 0 ? (
          <div className="text-center p-2">No saved cards found.</div>
        ) : (
          savedCards.map((card) => (
            <Dropdown.Item
              key={card.card_id}
              className="p-0"
              onClick={() => handleSetPreferred(card)}
            >
              <Card
                className={`p-2 mb-1 ${
                  card.is_preferred ? "border-success" : ""
                }`}
                style={{ height: "60px", fontSize: "14px" }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center p-2">
                  <div>
                    <strong>**** {card.last4}</strong>
                    <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                      Exp: {card.exp_month}/{card.exp_year}
                    </p>
                  </div>
                  {card.is_preferred && (
                    <span style={{ color: "black" }}>prefferd</span>
                  )}
                </Card.Body>
              </Card>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default React.memo(SavedCardsDropdown);
