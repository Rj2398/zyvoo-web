import React from "react";

import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { Link, useNavigate } from "react-router-dom";

const AddMoreTime = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <>
      {/* <Header /> */}

      <main className="mb-0">
        {/* <!-- MOBILE --> */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <a href="/">
                      <i className="fa-regular fa-arrow-left"></i>
                    </a>
                  </div>
                  <div className="mob-filter-in">
                    <a href="mob-filter.html">
                      <img src="/images/mobile/filters/filter.svg" loading="lazy" alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE --> */}

        {/* <!-- ADD-MORE-TIME-PAGE --> */}
        <div className="checkout-wrap add-time-wrap location-wrap notifications-wrap m-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="notifications-in checkout-heading">
                  <h2>New Booking Confirmed</h2>
                </div>
                <div className="location-right">
                  <div className="chat-right-bottom bg-white">
                    <div className="chat-right-bottom-in">
                      <div className="chat-right-bottom-in-image ">
                        <img src="/images/locations-grid/1.svg" loading="lazy" alt="" />
                      </div>
                      <div className="chat-right-bottom-in-text">
                        <h1>Cabin in Peshastin</h1>
                        <p>
                          <img
                            src="/images/locations-grid/star-icon.svg"
                            loading="lazy" alt=""
                          />{" "}
                          <span>5.0</span>(1k+)
                        </p>
                        <p>
                          <img
                            src="/images/locations-grid/location-icon.svg"
                            loading="lazy" alt=""
                          />{" "}
                          37 miles away
                        </p>
                      </div>
                    </div>
                    <hr />
                    <ul>
                      <li>
                        2 Hours <span>$300</span>
                      </li>
                      <li>
                        Cleaning Fee <span>$20</span>
                      </li>
                      <li>
                        Zyvo Service Fee <span>$2</span>
                      </li>
                      <li>
                        Taxes <span>$10</span>
                      </li>
                      <li>
                        Add-on <span>$2</span>
                      </li>
                      <li className="total-cost">
                        Total <span>$322</span>
                      </li>
                    </ul>
                  </div>
                  <div className="location-right-shield">
                    <span className="info-wrap">
                      <img src="/images/create-profile/info.svg" loading="lazy" alt="" />
                      <span className="info-in">
                        Your safety and peace of mind are our top priorities.
                        ZYVO is proud to provide comprehensive liability
                        insurance coverage for all bookings
                      </span>
                    </span>
                    <h2>
                      <img src="/images/location/zyvo-shield.svg" loading="lazy" alt="" />
                      ZYVO Shield
                    </h2>
                    <p>
                      Our Commitment to Your Safety and <br /> Protection on
                      Zyvo.
                    </p>
                  </div>
                  <div className="chat-right-top new-booking-right">
                    <div className="chat-right-top-mob-left">
                      <h3>Hosted by</h3>
                      <div className="chat-right-top-profile">
                        <img
                          className="chat-right-top-profile-image"
                          src="/images/chat/profile/1.svg"
                          loading="lazy" alt=""
                        />
                        <h2>Mia J.</h2>
                        <img
                          className="chat-right-top-batch-image"
                          src="/images/locations-grid/profile/batch.svg"
                          loading="lazy" alt=""
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="chat-right-top-mob-right">
                      <Link to="/chat">Message the host</Link>
                      <p>
                        <img src="/images/guides-articles/time.svg" loading="lazy" alt="" />
                        Typically respond within 1 hr
                      </p>
                      <a
                        href
                        data-bs-toggle="modal"
                        data-bs-target="#report-violation-popup"
                      >
                        Report an Issue
                      </a>
                    </div>
                    <div className="mob-add-more-time-btns">
                      <a
                        href
                        data-bs-target="#cancel-booking-popup"
                        data-bs-toggle="modal"
                        className="cancel-booking-btn"
                      >
                        Cancel Booking
                      </a>
                      <a
                        href
                        className="cancel-booking-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#report-violation-popup"
                      >
                        Report an Issue
                      </a>
                    </div>
                  </div>
                </div>
                <a
                  href
                  data-bs-target="#cancel-booking-popup"
                  data-bs-toggle="modal"
                  className="cancel-booking-btn"
                >
                  Cancel Booking
                </a>
              </div>
              <div className="col-lg-8 col-md-6 order-md-first order-lg-first">
                <div className="notifications-in">
                  <h2>
                    <Link to="/booking">
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                    New Booking Confirmed
                  </h2>
                </div>
                <div className="location-left">
                  <h2>Booking Details</h2>
                  <div className="booking-details">
                    <ul>
                      <li>
                        <img src="/images/filters/time.svg" loading="lazy" alt="" /> 2 hours
                      </li>
                      <li>
                        <img src="/images/filters/calendar-icon.svg" loading="lazy" alt="" />{" "}
                        October 22, 2023
                      </li>
                      <li>
                        <img src="/images/filters/time.svg" loading="lazy" alt="" /> From 01pm
                        to 03pm
                      </li>
                      <li className="addmore-time-btn">
                        <button
                          type="button"
                          className="edit-field location-date-btn ms-0"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                        Add more time
                        <img
                          src="/images/filters/time.svg"
                          loading="lazy" alt=""
                          className="ms-1"
                        />
                        <div
                          className="date-in-list location-date-list add-time-dropdown"
                          //   style="display: none;"
                        >
                          <div className="date-in-data-in">
                            <div className="hour-slider">
                              <div id="slider"></div>
                            </div>
                            <p>OR</p>
                            <div className="date-in-data-dropdown">
                              <select>
                                <option value="1">Select hours</option>
                                <option value="2">30 Minutes</option>
                                <option value="3">1 hours</option>
                                <option value="4">2 hours</option>
                                <option value="5">3 hours</option>
                              </select>
                            </div>
                            <input
                              type="button"
                              data-bs-target="#extra-amount-popup"
                              data-bs-toggle="modal"
                              value="Save Changes"
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <hr />
                  <h2>Cancelation Policies</h2>
                  <div className="location-about">
                    <p className="active">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only. Lorem Ipsum
                      is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry's standard
                      dummy text ever since the 1500s, when an unknown printer
                      took a galley of type and scrambled it to make a type
                      specimen book. It has survived not only.Lorem Ipsum has
                      been the industry's standard dummy text....
                    </p>
                    <a href>Read more</a>
                  </div>
                  <hr />
                  <h2>Rules</h2>
                  <div className="location-rules">
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h3 className="accordion-header" id="headingOne">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <img src="/images/location/included/1.svg" loading="lazy" alt="" />{" "}
                            Parking
                          </button>
                        </h3>
                        <div
                          id="collapseOne"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            This is the first item's accordion body. It is shown
                            by default, until the collapse plugin adds the
                            appropriate classNamees that we use to style each
                            element. These classNamees control the overall
                            appearance, as well as the showing and hiding via
                            CSS transitions. You can modify any of this with
                            custom CSS or overriding our default variables. It's
                            also worth noting that just about any HTML can go
                            within the, though the transition does limit
                            overflow.
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h3 className="accordion-header" id="headingTwo">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                          >
                            <img src="/images/location/included/7.svg" loading="lazy" alt="" />{" "}
                            Host rules
                          </button>
                        </h3>
                        <div
                          id="collapseTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            This is the first item's accordion body. It is shown
                            by default, until the collapse plugin adds the
                            appropriate classNamees that we use to style each
                            element. These classNamees control the overall
                            appearance, as well as the showing and hiding via
                            CSS transitions. You can modify any of this with
                            custom CSS or overriding our default variables. It's
                            also worth noting that just about any HTML can go
                            within the, though the transition does limit
                            overflow.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="/booking" className="checkout-pay-btn">
                    My Bookings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ADD-MORE-TIME-PAGE --> */}
      </main>

      {/* voilation */}

      <div
        className="modal fade custom-modal"
        id="report-violation-popup"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="modal-body">
              <h2>Report Violation</h2>
              <hr />
              <form className="mt-1 align-items-start">
                <p className="mb-0 text-start">
                  <b>Please select a reason for reporting this user.</b>
                </p>
                <div className="chat-left-top-dropdown dropdown">
                  <span
                    className="dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Select
                    <img src="/images/dropdown.svg" loading="lazy" alt="dropdown icon" />
                  </span>
                  <div className="chat-left-top-dropdown-list dropdown-menu">
                    <ul>
                      {[
                        "Inappropriate Content",
                        "Misleading Information",
                        "Spam or Scam",
                        "Harassment",
                        "Discrimination",
                        "Other Issue",
                      ].map((reason, index) => (
                        <li key={index}>
                          <a href>{reason}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mb-0 text-start">
                  <b>Add Additional Details</b>
                </p>
                <textarea defaultValue="You can also add additional details to help us investigate further." />
                <div className="custom-modal-label d-flex gap-3">
                  <input
                    type="button"
                    value="Submit Report"
                    data-bs-dismiss="modal"
                    data-bs-target="#password-changed-successfully-popup"
                    data-bs-toggle="modal"
                  />
                </div>
                <p>
                  Your report has been submitted. Thank you for helping us
                  maintain a safe and respectful community.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* cancel booking */}
      {/* <!-- CANCEL-BOOKING-POPUP --> */}
      <div
        className="modal fade custom-modal"
        id="cancel-booking-popup"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-body">
              <h2>Cancel</h2>
              <div className="password-changed-successfully-icon">
                <img src="/images/popups/cancel.svg" loading="lazy" alt="" />
              </div>
              <p className="mb-3">Are you sure you want to cancel this booking?</p>
              <form onSubmit={handleSubmit} method="post">
                <div className="custom-modal-label d-flex gap-3">
                  <input type="submit" value="Yes" data-bs-dismiss="modal" />
                  <input
                    type="button"
                    className="cancel-btn"
                    value="Cancel"
                    data-bs-dismiss="modal"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- CANCEL-BOOKING-POPUP --> */}
      {/* <!-- NEW-BOOKING-CONFIRME-POPUP --> */}

      <AuthModal />
      <Footer />
    </>
  );
};

export default AddMoreTime;
