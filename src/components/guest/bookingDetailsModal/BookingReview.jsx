import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useBook from "../../../hooks/host/useBook";
import { KEYS } from "../../../config/Constant";

const BookingReview = ({ user_id, property_id, booking_id }) => {
  const { reviewGuestBooking } = useBook();
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const userId = userData?.user_id ? String(userData?.user_id) : null;

  const [show, setShow] = useState(false);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [message, setMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await reviewGuestBooking({
      user_id: userId,
      booking_id: booking_id,
      property_id: property_id,
      response_rate: rating1,
      communication: rating2,
      on_time: rating3,
      review_message: message,
    });
    handleClose();
  };

  const StarRating = ({ rating, setRating, name }) => {
    return (
      <div className="rating-group" style={{ display: "inline-block" }}>
        <input
          checked={rating === 0}
          className="rating__input rating__input--none"
          name={name}
          id={`${name}-none`}
          value="0"
          type="radio"
          disabled
          style={{ position: "absolute", left: "-9999px" }}
        />
        {[1, 2, 3, 4, 5].map((value) => (
          <React.Fragment key={value}>
            <label
              aria-label={`${value} star`}
              className="rating__label"
              htmlFor={`${name}-${value}`}
              style={{ cursor: "pointer", margin: "0 2px" }}
            >
              <img
                className="rating__icon rating__icon--star"
                src="/images/locations-grid/star-icon-blank.svg"
                loading="lazy" alt=""
                style={{ width: "24px", height: "24px" }}
              />
              <img
                className="rating__icon rating__icon-blank-star"
                src="/images/locations-grid/star-icon.svg"
                loading="lazy" alt=""
                style={{
                  width: "24px",
                  height: "24px",
                  display: rating >= value ? "inline-block" : "none",
                }}
              />
            </label>
            <input
              className="rating__input"
              name={name}
              id={`${name}-${value}`}
              value={value}
              type="radio"
              checked={rating === value}
              onChange={() => setRating(value)}
              style={{ position: "absolute", left: "-9999px" }}
            />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ backgroundColor: "#3A4B4C", border: "none" }}
      >
        Review Guest
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ padding: "40px", borderRadius: "40px" }} centered>
          <button
            type="button"
            className="close"
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              borderRadius: "50px",
              height: "30px",
              width: "30px",
              alignContent: "center",
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
          <h2
            style={{
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "25px",
            }}
          >
            Review Booking
          </h2>
          <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            <div className="full-stars-example-two">
              <h4 style={{ fontSize: "18px" }}>Response Rate</h4>
              <StarRating
                rating={rating1}
                setRating={setRating1}
                name="rating1"
              />
            </div>
            <div
              className="full-stars-example-two"
              style={{ marginBottom: "10px" }}
            >
              <h4 style={{ fontSize: "18px" }}>Communication</h4>
              <StarRating
                rating={rating2}
                setRating={setRating2}
                name="rating2"
              />
            </div>
            <div
              className="full-stars-example-two"
              style={{ marginBottom: "20px" }}
            >
              <h4 style={{ fontSize: "18px" }}>on time</h4>
              <StarRating
                rating={rating3}
                setRating={setRating3}
                name="rating3"
              />
            </div>
            <textarea
              placeholder="Message.."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <div
              className="custom-modal-label"
              style={{ display: "flex", gap: "12px" }}
            >
              <input
                type="submit"
                value="Publish Review"
                onClick={handleClose}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4AEAB1",
                  color: "black",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BookingReview;
