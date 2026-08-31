import React from "react";

import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { Link, useNavigate } from "react-router-dom";
const CANCELLATION_POLICY_TEXT = `1. How refunds are determined
Every booking is subject to the cancellation and refund terms displayed during checkout and in the confirmed booking details. Those terms form part of the booking agreement between the guest and host. Before paying, guests should review the booking date and time, total price, fees, house rules, and the cancellation terms shown for that listing. Where a listing has a host-specific cancellation policy, that policy controls unless this Refund Policy provides a greater remedy because the host cancels, the space is materially unavailable, or applicable law requires otherwise.

2. Guest cancellations
If a guest cancels, the refundable amount is calculated using the cancellation terms that were presented before the booking was confirmed. The app will show the expected refund, when available, before the guest completes the cancellation.
• A cancellation is effective only after it is submitted through ZYVO and the booking status changes to cancelled.
• Not attending, arriving late, leaving early, or using less time than booked does not automatically create a right to a refund.
• Any fee identified as non-refundable before payment will remain non-refundable unless required by law or ZYVO determines otherwise for a qualifying booking issue.
• If a refund is approved, it is returned to the original payment method whenever possible.

3. Host cancellations
If a host cancels a confirmed booking, the guest will generally receive a refund of the amounts paid for that booking. ZYVO may also take account action when a host repeatedly cancels confirmed bookings, including limiting the host’s ability to accept future bookings or publish listings. A host should not ask a guest to cancel on the host’s behalf. If the host cannot honor a booking, the host should cancel it through ZYVO so the booking history and refund can be handled correctly.

4. Space unavailable or materially different
Guests should contact ZYVO promptly if they arrive and the booked space is unavailable, unsafe for the booked use, inaccessible despite following the host’s instructions, or materially different from the listing in a way that prevents the intended booking from reasonably taking place. Depending on the circumstances and the evidence available, ZYVO may issue a full refund, a partial refund, account credit where legally permitted, or another appropriate resolution. Guests may be asked to provide photos, video, messages, receipts, or other information that helps us review the issue.

5. Booking interruptions and early termination
If a booking begins but cannot reasonably continue because of a qualifying issue with the space or host access, ZYVO may consider a partial or full refund based on the portion of the booking affected. Refunds are not guaranteed for issues caused by the guest, members of the guest’s party, or a use that violates the listing rules or these Terms.

6. Cleaning fees, platform fees and taxes
Whether cleaning fees, platform fees, taxes, or other charges are refunded depends on the cancellation terms, the timing and reason for the cancellation, and applicable law. Any amount that will not be refunded should be shown in the cancellation summary before the cancellation is finalized whenever the product supports that calculation.

7. Payment processing time
ZYVO may approve or initiate a refund quickly, but the time it takes to appear in a guest’s account depends on the bank, card issuer, wallet provider, or payment processor. Processing times can vary and are outside ZYVO’s direct control.

8. Chargebacks and payment disputes
If there is a problem with a booking, guests should contact ZYVO first so we can review it. Filing a chargeback does not guarantee a refund and may pause ZYVO’s internal review while the payment provider investigates. Users must provide accurate information in any payment dispute.

9. Fraud, abuse and policy violations
ZYVO may deny or reverse a refund where there is evidence of fraud, fabricated claims, chargeback abuse, unauthorized payment activity, misuse of the platform, or a material violation of the booking rules or Terms & Conditions, subject to applicable law.

10. How to request help with a refund
Open the affected booking and select the available help or support option. Include the booking details and a short explanation of what happened. For active or time-sensitive bookings, contact support as soon as possible so the issue can be reviewed while the booking details are still current.`;

const AddMoreTime = () => {
  const [isCancellationExpanded, setIsCancellationExpanded] = useState(false);
  const charLimit = 250;
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
                      <img
                        src="/images/mobile/filters/filter.svg"
                        loading="lazy"
                        alt=""
                      />
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
                        <img
                          src="/images/locations-grid/1.svg"
                          loading="lazy"
                          alt=""
                        />
                      </div>
                      <div className="chat-right-bottom-in-text">
                        <h1>Cabin in Peshastin</h1>
                        <p>
                          <img
                            src="/images/locations-grid/star-icon.svg"
                            loading="lazy"
                            alt=""
                          />{" "}
                          <span>5.0</span>(1k+)
                        </p>
                        <p>
                          <img
                            src="/images/locations-grid/location-icon.svg"
                            loading="lazy"
                            alt=""
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
                      <img
                        src="/images/create-profile/info.svg"
                        loading="lazy"
                        alt=""
                      />
                      <span className="info-in">
                        Your safety and peace of mind are our top priorities.
                        ZYVO is proud to provide comprehensive liability
                        insurance coverage for all bookings
                      </span>
                    </span>
                    <h2>
                      <img
                        src="/images/location/zyvo-shield.svg"
                        loading="lazy"
                        alt=""
                      />
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
                          loading="lazy"
                          alt=""
                        />
                        <h2>Mia J.</h2>
                        <img
                          className="chat-right-top-batch-image"
                          src="/images/locations-grid/profile/batch.svg"
                          loading="lazy"
                          alt=""
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="chat-right-top-mob-right">
                      <Link to="/chat">Message the host</Link>
                      <p>
                        <img
                          src="/images/guides-articles/time.svg"
                          loading="lazy"
                          alt=""
                        />
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
                        <img
                          src="/images/filters/time.svg"
                          loading="lazy"
                          alt=""
                        />{" "}
                        2 hours
                      </li>
                      <li>
                        <img
                          src="/images/filters/calendar-icon.svg"
                          loading="lazy"
                          alt=""
                        />{" "}
                        October 22, 2023
                      </li>
                      <li>
                        <img
                          src="/images/filters/time.svg"
                          loading="lazy"
                          alt=""
                        />{" "}
                        From 01pm to 03pm
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
                          loading="lazy"
                          alt=""
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
                  <div className="location-about mb-4">
                    <h2>Cancellation Policies</h2>

                    <p
                      className="active"
                      style={{
                        fontSize: "15px",
                        lineHeight: "1.6",
                        whiteSpace: "pre-line", // Newline aur numbered steps preserve karne ke liye
                        color: "#333",
                        marginBottom: "8px",
                      }}
                    >
                      {isCancellationExpanded ||
                      CANCELLATION_POLICY_TEXT.length <= charLimit
                        ? CANCELLATION_POLICY_TEXT
                        : `${CANCELLATION_POLICY_TEXT.slice(0, charLimit)}...`}
                    </p>

                    {CANCELLATION_POLICY_TEXT.length > charLimit && (
                      <button
                        type="button"
                        onClick={() =>
                          setIsCancellationExpanded(!isCancellationExpanded)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: "#4AEAB1",
                          fontWeight: "600",
                          cursor: "pointer",
                          outline: "none",
                          textDecoration: "underline",
                        }}
                      >
                        {isCancellationExpanded ? "Read less" : "Read more"}
                      </button>
                    )}
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
                            <img
                              src="/images/location/included/1.svg"
                              loading="lazy"
                              alt=""
                            />{" "}
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
                            <img
                              src="/images/location/included/7.svg"
                              loading="lazy"
                              alt=""
                            />{" "}
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
                    <img
                      src="/images/dropdown.svg"
                      loading="lazy"
                      alt="dropdown icon"
                    />
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
              <p className="mb-3">
                Are you sure you want to cancel this booking?
              </p>
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
