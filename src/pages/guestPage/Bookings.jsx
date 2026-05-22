import React, { useState } from "react";
import Header from "../../components/guest/Header";
import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownButton,
  FormControl,
  Container,
  Row,
  Col,
  Image,
  Card,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import BookingReview from "../../components/guest/bookingDetailsModal/BookingReview";
import ReportViolation from "../../components/guest/bookingDetailsModal/ReportVoilation";
import ShareModal from "../../components/guest/bookingDetailsModal/ShareModal";
const includedItems = [
  {
    img: "/images/location/included/1.svg",
    label: "Parking",
  },
  {
    img: "/images/location/included/2.svg",
    label: "Wifi",
  },
  {
    img: "/images/location/included/3.svg",
    label: "2 Rooms",
  },
  {
    img: "/images/location/included/4.svg",
    label: "Kitchen",
  },
  {
    img: "/images/location/included/5.svg",
    label: "Tables",
  },
  {
    img: "/images/location/included/6.svg",
    label: "Chairs",
  },
];

const bookingDetails = [
  {
    icon: "/images/filters/calendar-icon.svg",
    alt: "Calendar",
    text: "October 22, 2023",
  },
  {
    icon: "/images/filters/time.svg",
    alt: "Time",
    text: "2 hours | From 01pm to 03pm",
  },
  {
    icon: "/images/filters/price.svg",
    alt: "Price",
    text: "$30",
  },
];

const chatData = [
  {
    id: 1,
    title: "Cabin in Peshastin",
    date: "October 22, 2023",
    status: "Finished",
    img: "/images/locations-grid/1.svg",
  },
  {
    id: 2,
    title: "Cabin in Peshastin",
    date: "October 22, 2023",
    status: "Confirmed",
    img: "/images/locations-grid/2.svg",
  },
  {
    id: 3,
    title: "Cabin in Peshastin",
    date: "October 24, 2023",
    status: "Waiting payment",
    img: "/images/locations-grid/4.svg",
  },
  {
    id: 4,
    title: "Cabin in Peshastin",
    date: "October 22, 2023",
    status: "Canceled",
    img: "/images/locations-grid/3.svg",
  },
];

const reviewsData = [
  {
    id: 1,
    name: "Emily James",
    text: "Host was very helpful. thank you so much",
    rating: 5,
    date: "Mar 09, 22",
    image: "/images/location/reviews/1.svg",
  },
  {
    id: 2,
    name: "Emily James",
    text: "Host was very helpful. thank you so much",
    rating: 4,
    date: "Mar 09, 22",
    image: "/images/location/reviews/2.svg",
  },
  {
    id: 3,
    name: "James Kristen",
    text: "Host was very helpful. thank you so much",
    rating: 5,
    date: "Mar 09, 22",
    image: "/images/location/reviews/3.svg",
  },
  {
    id: 4,
    name: "Michael Kenny",
    text: "Host was very helpful. thank you so much",
    rating: 5,
    date: "Mar 09, 22",
    image: "/images/location/reviews/4.svg",
  },
];

function Bookings() {
  const [selected, setSelected] = useState("All Bookings");
  const [searchQuery, setSearchQuery] = useState("");

  const options = [
    "All Bookings",
    "Finished",
    "Confirmed",
    "Waiting payment",
    "Canceled",
  ];

  const filteredChats = chatData.filter(
    (chat) =>
      (selected === "All Bookings" || chat.status === selected) &&
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isParkingOpen, setParkingOpen] = useState(false);
  const [isHostRulesOpen, setHostRulesOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [open, setOpen] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };

  const [visibleReviews, setVisibleReviews] = useState(2);

  const [filter, setFilter] = useState("Highest Review");

  const handleShowMore = () => {
    setVisibleReviews(reviewsData.length);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const sortedReviews = [...reviewsData].sort((a, b) => {
    if (filter === "Highest Review") return b.rating - a.rating;
    if (filter === "Lowest Review") return a.rating - b.rating;
    return 0; // Default order
  });

  return (
    <>
      {/* <Header /> */}

      {/* bookings */}

      <main>
        {/* <!-- MOBILE --> */}
        <div className="mob-search-filter border-start-0 border-end-0 mob-booking-filter">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-filter-in ms-auto dropdown">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src="/images/mobile/filters/filter.svg" loading="lazy" alt="" />
                    </a>
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <a href="#">All Bookings</a>
                        </li>
                        <li>
                          <a href="#">Confirmed</a>
                        </li>
                        <li>
                          <a href="#">Pending</a>
                        </li>
                        <li>
                          <a href="#">Finished</a>
                        </li>
                        <li>
                          <a href="#">Cancelled</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE -->
    <!-- MY-MOB-BOOKINGS --> */}
        <div className="mob-bookings-wrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-bookings-in">
                  <a href="mob-booking-details.html">
                    <div className="mob-bookings-in-image">
                      <img src="/images/locations-grid/1.svg" loading="lazy" alt="" />
                    </div>
                    <div className="mob-bookings-in-content">
                      <h1>Cabin in Peshastin</h1>
                      <div className="mob-bookings-in-content-bottom">
                        <div className="booking-tag">Finished</div>
                        <h2>October 22, 2023</h2>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="mob-bookings-in">
                  <a href="mob-booking-details.html">
                    <div className="mob-bookings-in-image">
                      <img src="/images/locations-grid/2.svg" loading="lazy" alt="" />
                    </div>
                    <div className="mob-bookings-in-content">
                      <h1>Cabin in Peshastin</h1>
                      <div className="mob-bookings-in-content-bottom">
                        <div className="booking-tag confirmed">Confirmed</div>
                        <h2>October 22, 2023</h2>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="mob-bookings-in">
                  <a href="mob-booking-details.html">
                    <div className="mob-bookings-in-image">
                      <img src="/images/locations-grid/3.svg" loading="lazy" alt="" />
                    </div>
                    <div className="mob-bookings-in-content">
                      <h1>Cabin in Peshastin</h1>
                      <div className="mob-bookings-in-content-bottom">
                        <div className="booking-tag waiting">
                          Waiting payment
                        </div>
                        <h2>October 22, 2023</h2>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="mob-bookings-in">
                  <a href="mob-booking-details.html">
                    <div className="mob-bookings-in-image">
                      <img src="/images/locations-grid/4.svg" loading="lazy" alt="" />
                    </div>
                    <div className="mob-bookings-in-content">
                      <h1>Cabin in Peshastin</h1>
                      <div className="mob-bookings-in-content-bottom">
                        <div className="booking-tag canceled">Canceled</div>
                        <h2>October 22, 2023</h2>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MY-MOB-BOOKINGS -->

    <!-- BOOKING-PAGE --> */}
        <div className="booking-wrap" style={{ gap: "10px" }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <div className="chat-left">
                  <div className="chat-left-top">
                    <form action="">
                      <Dropdown>
                        <DropdownButton variant="light" title={selected}>
                          {options.map((option) => (
                            <Dropdown.Item
                              key={option}
                              onClick={() => setSelected(option)}
                            >
                              {option}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                      </Dropdown>

                      <button type="button">
                        <i className="fa-regular fa-magnifying-glass"></i>
                      </button>
                    </form>
                  </div>
                  <div
                    className="chat-list"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    {filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        style={{ display: "flex" }}
                        className="chat-list-in nav-link"
                        id={`v-pills-${chat.id}-tab`}
                        data-bs-toggle="pill"
                        data-bs-target={`#v-pills-${chat.id}`}
                        type="button"
                        role="tab"
                        aria-controls={`v-pills-${chat.id}`}
                        aria-selected=""
                      >
                        <div className="chat-list-in-image h-100 p-0 border-0 rounded-1">
                          <img src={chat.img} className="rounded-3" loading="lazy" alt="" />
                        </div>
                        <div className="chat-list-in-content">
                          <h1>{chat.title}</h1>
                          <h2>{chat.date}</h2>
                          <div
                            className={`booking-tag ${chat.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {chat.status}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="chat-mid">
                  <div className="tab-content" id="v-pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="v-pills-1"
                      role="tabpanel"
                      aria-labelledby="v-pills-1-tab"
                      tabindex="0"
                    >
                      <div className="booking-mid-section">
                        <div className="booking-mid-top location-top">
                          <h2>
                            Cabin in Peshastin{" "}
                            <div className="booking-tag">Finished</div>
                          </h2>
                          <ul>
                            {/* <!-- RIGHT --> */}
                            <li style={{ cursor: "pointer", color: "#007BFF" }}>
                              <a
                                onClick={() => setShowModal(true)}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <i
                                  className="fa-solid fa-share-nodes"
                                  style={{ marginRight: "5px" }}
                                ></i>
                                Share
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#add-wishlist"
                              >
                                <i className="fa-solid fa-heart"></i> Wishlist
                              </a>
                            </li>
                            {/* <!-- RIGHT --> */}
                          </ul>

                          {showModal && (
                            <ShareModal onClose={() => setShowModal(false)} />
                          )}
                        </div>
                        <div className="location-image-grid">
                          <div className="location-image-grid-one">
                            <img src="/images/location/grid/1.svg" loading="lazy" alt="" />
                          </div>
                          <div className="location-image-grid-four">
                            <img src="/images/location/grid/2.svg" loading="lazy" alt="" />
                            <img src="/images/location/grid/3.svg" loading="lazy" alt="" />
                            <img src="/images/location/grid/4.svg" loading="lazy" alt="" />
                            <img src="/images/location/grid/5.svg" loading="lazy" alt="" />
                          </div>
                        </div>
                        <hr />
                        <Container style={{ padding: "20px" }}>
                          <h4 style={{ marginBottom: "3%" }}>
                            Booking Details
                          </h4>
                          <Row className="g-3">
                            {bookingDetails.map((detail, index) => (
                              <Col key={index}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "10px",
                                    borderRadius: "20px",
                                    border: "1px solid #ddd",
                                    whiteSpace: "nowrap", // Prevent text wrapping
                                  }}
                                >
                                  <Image
                                    src={detail.icon}
                                    alt={detail.alt}
                                    width="20"
                                  />
                                  <span>{detail.text}</span>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </Container>
                        <hr />

                        <Container className="p-4 bg-white rounded shadow-sm">
                          <h2
                            className="mb-4"
                            style={{ fontSize: "1.5rem", fontWeight: "600" }}
                          >
                            Included in your booking
                          </h2>
                          <Row>
                            {includedItems.map((item, index) => (
                              <Col key={index} md={4} className="mb-3">
                                <Card className="d-flex align-items-center p-2 border rounded shadow-sm bg-light">
                                  <Card.Body className="d-flex align-items-center p-2">
                                    {/* <Image
                                      src={item.img}
                                      alt={item.label}
                                      width={24}
                                      height={24}
                                      className="me-2"
                                    /> */}
                                    <span style={{ color: "#495057" }}>
                                      {item.label}
                                    </span>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </Container>

                        <hr />
                        <div
                          className="accordion"
                          id="rulesAccordion"
                          style={{ marginTop: "2%" }}
                        >
                          {/* Host Rules Section */}
                          <div className="container p-">
                            <h5 className="fw-bold mb-3">Rules</h5>
                            <div className="accordion" id="accordionExample">
                              {/* Parking Rule */}
                              <div>
                                <div className="accordion-item border rounded mb-2">
                                  <h2
                                    className="accordion-header"
                                    id="headingOne"
                                  >
                                    <button
                                      className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                                        open === "collapseOne"
                                          ? ""
                                          : "collapsed"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        toggleAccordion("collapseOne")
                                      }
                                      style={{ padding: "12px" }}
                                    >
                                      <img
                                        src="/images/location/included/1.svg"
                                        loading="lazy" alt="Parking Icon"
                                        className="me-2"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                      <span className="flex-grow-1">
                                        Parking
                                      </span>
                                    </button>
                                  </h2>
                                </div>
                                {open === "collapseOne" && (
                                  <div
                                    className="shadow"
                                    style={{ borderRadius: "10px" }}
                                  >
                                    {" "}
                                    <div
                                      className="accordion-body"
                                      style={{
                                        borderRadius: "10px",
                                        backgroundColor: "#F8F9FA",
                                        margin: "10px",
                                        padding: "10px",
                                      }}
                                    >
                                      This section describes the parking rules
                                      in detail.
                                    </div>
                                    <div
                                      className="accordion-body"
                                      style={{
                                        borderRadius: "10px",
                                        backgroundColor: "#F8F9FA",
                                        margin: "10px",
                                        padding: "10px",
                                      }}
                                    >
                                      This section describes the parking rules
                                      in detail.
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Host Rules */}
                              <div className="accordion-item border rounded mb-2">
                                <h2
                                  className="accordion-header"
                                  id="headingTwo"
                                >
                                  <button
                                    className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                                      open === "collapseTwo" ? "" : "collapsed"
                                    }`}
                                    type="button"
                                    onClick={() =>
                                      toggleAccordion("collapseTwo")
                                    }
                                    style={{ padding: "12px" }}
                                  >
                                    <img
                                      src="/images/location/included/7.svg"
                                      loading="lazy" alt="Host Rules Icon"
                                      className="me-2"
                                      style={{ width: "20px", height: "20px" }}
                                    />
                                    <span className="flex-grow-1">
                                      Host rules
                                    </span>
                                  </button>
                                </h2>
                              </div>
                              {open === "collapseTwo" && (
                                <div
                                  className="shadow"
                                  style={{ borderRadius: "10px" }}
                                >
                                  <div
                                    className="accordion-body "
                                    style={{
                                      borderRadius: "10px",
                                      backgroundColor: "#F8F9FA",
                                      margin: "10px",
                                      padding: "10px",
                                    }}
                                  >
                                    This section describes the host rules in
                                    detail.
                                  </div>
                                  <div
                                    className="accordion-body"
                                    style={{
                                      borderRadius: "10px",
                                      backgroundColor: "#F8F9FA",
                                      margin: "10px",
                                      padding: "10px",
                                    }}
                                  >
                                    This section describes the host rules in
                                    detail.
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="location-left">
                          <h2>Address &amp; Location</h2>
                          <p>
                            <u>Midtown Manhattan, New York, NY</u>
                          </p>
                          <div className="address-location-map">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2261.139268703457!2d-133.14340392403935!3d55.4776704131501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x540e467f9dd315f3%3A0xf4eae0d4d7764524!2s245%20Cold%20Storage%20Rd%2C%20Craig%2C%20AK%2099921%2C%20USA!5e0!3m2!1sen!2sin!4v1723457458145!5m2!1sen!2sin"
                              width="600"
                              height="450"
                              // style="border:0;"
                              allowfullscreen=""
                              loading="lazy"
                              referrerpolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        </div>

                        <div className="location-left">
                          <div className="location-reviews">
                            <div className="location-reviews-top d-flex align-items-center">
                              <h1>
                                Reviews ({reviewsData.length})
                                <span>
                                  <img
                                    src="/images/locations-grid/star-icon.svg"
                                    loading="lazy" alt=""
                                  />
                                  <b>4.9</b> Rating
                                </span>
                              </h1>
                              <p className="ms-auto me-1">Sort by:</p>
                              <Dropdown className="chat-left-top-dropdown">
                                <Dropdown.Toggle variant="light">
                                  {filter}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleFilterChange("Highest Review")
                                    }
                                  >
                                    Highest Review
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleFilterChange("Lowest Review")
                                    }
                                  >
                                    Lowest Review
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleFilterChange("Recent Reviews")
                                    }
                                  >
                                    Recent Reviews
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                            <div className="location-reviews-list d-flex flex-column gap-3">
                              {sortedReviews
                                .slice(0, visibleReviews)
                                .map((review) => (
                                  <div
                                    className="location-reviews-card d-flex align-items-center gap-3 p-3  rounded  bg-white"
                                    key={review.id}
                                    style={{ width: "100%" }}
                                  >
                                    <div className="location-reviews-card-left d-flex align-items-center gap-3">
                                      <span
                                        className="rounded-circle overflow-hidden border"
                                        style={{ padding: "2px" }}
                                      >
                                        <img
                                          src={review.image}
                                          loading="lazy" alt="User Profile"
                                          className="rounded-circle"
                                          style={{
                                            width: "45px",
                                            height: "45px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </span>
                                      <div>
                                        <h6 className="mb-1 fw-bold text-dark">
                                          {review.name}
                                        </h6>
                                        <p
                                          className="mb-0 text-muted"
                                          style={{ fontSize: "14px" }}
                                        >
                                          {review.text}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="location-reviews-card-right ms-auto text-end d-flex flex-column align-items-end">
                                      <div className="location-reviews-list-right-star mb-1">
                                        {[...Array(5)].map((_, index) => (
                                          <img
                                            key={index}
                                            src={
                                              index < review.rating
                                                ? "/images/locations-grid/star-icon.svg"
                                                : "/images/locations-grid/star-icon-blank.svg"
                                            }
                                            loading="lazy" alt="Star"
                                            className="me-1"
                                            style={{ width: "16px" }}
                                          />
                                        ))}
                                      </div>
                                      <p
                                        className="text-muted"
                                        style={{ fontSize: "12px" }}
                                      >
                                        {review.date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              <hr />
                            </div>
                            {visibleReviews < reviewsData.length && (
                              <Button
                                className="location-reviews-btn mt-3"
                                onClick={handleShowMore}
                              >
                                Show More Reviews
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-2"
                      role="tabpanel"
                      aria-labelledby="v-pills-2-tab"
                      tabindex="0"
                    >
                      <div className="chat-mid-top">
                        <div className="booking-mid-section">
                          <div className="booking-mid-top location-top">
                            <h2>
                              Cabin in Peshastin{" "}
                              <div className="booking-tag confirmed">
                                Confirmed
                              </div>
                            </h2>
                            <ul>
                              {/* <!-- RIGHT --> */}

                              <li
                                style={{ cursor: "pointer", color: "#007BFF" }}
                              >
                                <a
                                  onClick={() => setShowModal(true)}
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  <i
                                    className="fa-solid fa-share-nodes"
                                    style={{ marginRight: "5px" }}
                                  ></i>
                                  Share
                                </a>
                              </li>

                              <li>
                                <a href="#">
                                  <i className="fa-solid fa-heart"></i> Wishlist
                                </a>
                              </li>
                              {/* <!-- RIGHT --> */}
                            </ul>

                            {showModal && (
                              <ShareModal onClose={() => setShowModal(false)} />
                            )}
                          </div>
                          <div className="location-image-grid">
                            <div className="location-image-grid-one">
                              <img src="/images/location/grid/1.svg" loading="lazy" alt="" />
                            </div>
                            <div className="location-image-grid-four">
                              <img src="/images/location/grid/2.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/3.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/4.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/5.svg" loading="lazy" alt="" />
                            </div>
                          </div>
                          <hr />
                          <Container style={{ padding: "20px" }}>
                            <h4 style={{ marginBottom: "3%" }}>
                              Booking Details
                            </h4>
                            <Row className="g-3">
                              {bookingDetails.map((detail, index) => (
                                <Col key={index}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      padding: "10px",
                                      borderRadius: "20px",
                                      border: "1px solid #ddd",
                                      whiteSpace: "nowrap", // Prevent text wrapping
                                    }}
                                  >
                                    <Image
                                      src={detail.icon}
                                      alt={detail.alt}
                                      width="20"
                                    />
                                    <span>{detail.text}</span>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </Container>

                          <Container className="p-4 bg-white rounded shadow-sm">
                            <h2
                              className="mb-4"
                              style={{ fontSize: "1.5rem", fontWeight: "600" }}
                            >
                              Included in your booking
                            </h2>
                            <Row>
                              {includedItems.map((item, index) => (
                                <Col key={index} md={4} className="mb-3">
                                  <Card className="d-flex align-items-center p-2 border rounded shadow-sm bg-light">
                                    <Card.Body className="d-flex align-items-center p-2">
                                      {/* <Image
                                        src={item.img}
                                        alt={item.label}
                                        width={24}
                                        height={24}
                                        className="me-2"
                                      /> */}
                                      <span style={{ color: "#495057" }}>
                                        {item.label}
                                      </span>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </Container>

                          <div
                            className="accordion"
                            id="rulesAccordion"
                            style={{ marginTop: "2%" }}
                          >
                            {/* Host Rules Section */}
                            <div className="container p-">
                              <h5 className="fw-bold mb-3">Rules</h5>
                              <div className="accordion" id="accordionExample">
                                {/* Parking Rule */}
                                <div>
                                  <div className="accordion-item border rounded mb-2">
                                    <h2
                                      className="accordion-header"
                                      id="headingOne"
                                    >
                                      <button
                                        className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                                          open === "collapseOne"
                                            ? ""
                                            : "collapsed"
                                        }`}
                                        type="button"
                                        onClick={() =>
                                          toggleAccordion("collapseOne")
                                        }
                                        style={{ padding: "12px" }}
                                      >
                                        <img
                                          src="/images/location/included/1.svg"
                                          loading="lazy" alt="Parking Icon"
                                          className="me-2"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                        />
                                        <span className="flex-grow-1">
                                          Parking
                                        </span>
                                      </button>
                                    </h2>
                                  </div>
                                  {open === "collapseOne" && (
                                    <div
                                      className="shadow"
                                      style={{ borderRadius: "10px" }}
                                    >
                                      {" "}
                                      <div
                                        className="accordion-body"
                                        style={{
                                          borderRadius: "10px",
                                          backgroundColor: "#F8F9FA",
                                          margin: "10px",
                                          padding: "10px",
                                        }}
                                      >
                                        This section describes the parking rules
                                        in detail.
                                      </div>
                                      <div
                                        className="accordion-body"
                                        style={{
                                          borderRadius: "10px",
                                          backgroundColor: "#F8F9FA",
                                          margin: "10px",
                                          padding: "10px",
                                        }}
                                      >
                                        This section describes the parking rules
                                        in detail.
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Host Rules */}
                                <div className="accordion-item border rounded mb-2">
                                  <h2
                                    className="accordion-header"
                                    id="headingTwo"
                                  >
                                    <button
                                      className={`accordion-button d-flex align-items-center bg-white shadow-none rounded ${
                                        open === "collapseTwo"
                                          ? ""
                                          : "collapsed"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        toggleAccordion("collapseTwo")
                                      }
                                      style={{ padding: "12px" }}
                                    >
                                      <img
                                        src="/images/location/included/7.svg"
                                        loading="lazy" alt="Host Rules Icon"
                                        className="me-2"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                      <span className="flex-grow-1">
                                        Host rules
                                      </span>
                                    </button>
                                  </h2>
                                </div>
                                {open === "collapseTwo" && (
                                  <div
                                    className="shadow"
                                    style={{ borderRadius: "10px" }}
                                  >
                                    <div
                                      className="accordion-body "
                                      style={{
                                        borderRadius: "10px",
                                        backgroundColor: "#F8F9FA",
                                        margin: "10px",
                                        padding: "10px",
                                      }}
                                    >
                                      This section describes the host rules in
                                      detail.
                                    </div>
                                    <div
                                      className="accordion-body"
                                      style={{
                                        borderRadius: "10px",
                                        backgroundColor: "#F8F9FA",
                                        margin: "10px",
                                        padding: "10px",
                                      }}
                                    >
                                      This section describes the host rules in
                                      detail.
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="location-left">
                            <h2>Address &amp; Location</h2>
                            <p>
                              <u>Midtown Manhattan, New York, NY</u>
                            </p>
                            <div className="address-location-map">
                              <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2261.139268703457!2d-133.14340392403935!3d55.4776704131501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x540e467f9dd315f3%3A0xf4eae0d4d7764524!2s245%20Cold%20Storage%20Rd%2C%20Craig%2C%20AK%2099921%2C%20USA!5e0!3m2!1sen!2sin!4v1723457458145!5m2!1sen!2sin"
                                width="600"
                                height="450"
                                // style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                              ></iframe>
                            </div>
                          </div>
                          <div className="location-left">
                            <div className="location-reviews">
                              <div className="location-reviews-top d-flex align-items-center">
                                <h1>
                                  Reviews ({reviewsData.length})
                                  <span>
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <b>4.9</b> Rating
                                  </span>
                                </h1>
                                <p className="ms-auto me-1">Sort by:</p>
                                <Dropdown className="chat-left-top-dropdown">
                                  <Dropdown.Toggle variant="light">
                                    {filter}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleFilterChange("Highest Review")
                                      }
                                    >
                                      Highest Review
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleFilterChange("Lowest Review")
                                      }
                                    >
                                      Lowest Review
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleFilterChange("Recent Reviews")
                                      }
                                    >
                                      Recent Reviews
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              <div className="location-reviews-list d-flex flex-column gap-3">
                                {sortedReviews
                                  .slice(0, visibleReviews)
                                  .map((review) => (
                                    <div
                                      className="location-reviews-card d-flex align-items-center gap-3 p-3  rounded  bg-white"
                                      key={review.id}
                                      style={{ width: "100%" }}
                                    >
                                      <div className="location-reviews-card-left d-flex align-items-center gap-3">
                                        <span
                                          className="rounded-circle overflow-hidden border"
                                          style={{ padding: "2px" }}
                                        >
                                          <img
                                            src={review.image}
                                            loading="lazy" alt="User Profile"
                                            className="rounded-circle"
                                            style={{
                                              width: "45px",
                                              height: "45px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </span>
                                        <div>
                                          <h6 className="mb-1 fw-bold text-dark">
                                            {review.name}
                                          </h6>
                                          <p
                                            className="mb-0 text-muted"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {review.text}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="location-reviews-card-right ms-auto text-end d-flex flex-column align-items-end">
                                        <div className="location-reviews-list-right-star mb-1">
                                          {[...Array(5)].map((_, index) => (
                                            <img
                                              key={index}
                                              src={
                                                index < review.rating
                                                  ? "/images/locations-grid/star-icon.svg"
                                                  : "/images/locations-grid/star-icon-blank.svg"
                                              }
                                              loading="lazy" alt="Star"
                                              className="me-1"
                                              style={{ width: "16px" }}
                                            />
                                          ))}
                                        </div>
                                        <p
                                          className="text-muted"
                                          style={{ fontSize: "12px" }}
                                        >
                                          {review.date}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                <hr />
                              </div>
                              {visibleReviews < reviewsData.length && (
                                <Button
                                  className="location-reviews-btn mt-3"
                                  onClick={handleShowMore}
                                >
                                  Show More Reviews
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="v-pills-3"
                      role="tabpanel"
                      aria-labelledby="v-pills-3-tab"
                      tabindex="0"
                    >
                      <div className="chat-mid-top">
                        <div className="booking-mid-section">
                          <div className="booking-mid-top location-top">
                            <h2>
                              Cabin in Peshastin{" "}
                              <div className="booking-tag waiting">
                                Waiting payment
                              </div>
                            </h2>
                            <ul>
                              {/* <!-- RIGHT --> */}
                              <li className="location-top-share">
                                <a
                                  href="#"
                                  data-bs-target="#share-popup"
                                  data-bs-toggle="modal"
                                >
                                  <i className="fa-solid fa-share-nodes"></i>{" "}
                                  Share
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fa-solid fa-heart"></i> Wishlist
                                </a>
                              </li>
                              {/* <!-- RIGHT --> */}
                            </ul>
                          </div>
                          <div className="location-image-grid">
                            <div className="location-image-grid-one">
                              <img src="/images/location/grid/1.svg" loading="lazy" alt="" />
                            </div>
                            <div className="location-image-grid-four">
                              <img src="/images/location/grid/2.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/3.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/4.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/5.svg" loading="lazy" alt="" />
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Booking Details</h2>
                            <div className="booking-details">
                              <ul>
                                <li>
                                  <img
                                    src="/images/filters/calendar-icon.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  October 22, 2023
                                </li>
                                <li>
                                  <img src="/images/filters/time.svg" loading="lazy" alt="" />{" "}
                                  2 hours | From 01pm to 03pm
                                </li>
                                <li>
                                  <img src="/images/filters/price.svg" loading="lazy" alt="" />{" "}
                                  $30
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Included in your booking</h2>
                            <div className="location-included">
                              <ul>
                                <li>
                                  <img
                                    src="/images/location/included/1.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Parking
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/2.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Wifi
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/3.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  2 Rooms
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/4.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Kitchen
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/5.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Tables
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/6.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Chairs
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Rules</h2>
                            <div className="location-rules">
                              <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                  <h3
                                    className="accordion-header"
                                    id="headingOne"
                                  >
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
                                        loading="lazy" alt=""
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
                                      This is the first item's accordion body.
                                      It is shown by default, until the collapse
                                      plugin adds the appropriate classNamees
                                      that we use to style each element. These
                                      classNamees control the overall
                                      appearance, as well as the showing and
                                      hiding via CSS transitions. You can modify
                                      any of this with custom CSS or overriding
                                      our default variables. It's also worth
                                      noting that just about any HTML can go
                                      within the, though the transition does
                                      limit overflow.
                                    </div>
                                  </div>
                                </div>
                                <div className="accordion-item">
                                  <h3
                                    className="accordion-header"
                                    id="headingTwo"
                                  >
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
                                        loading="lazy" alt=""
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
                                      This is the first item's accordion body.
                                      It is shown by default, until the collapse
                                      plugin adds the appropriate classNamees
                                      that we use to style each element. These
                                      classNamees control the overall
                                      appearance, as well as the showing and
                                      hiding via CSS transitions. You can modify
                                      any of this with custom CSS or overriding
                                      our default variables. It's also worth
                                      noting that just about any HTML can go
                                      within the, though the transition does
                                      limit overflow.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Address &amp; Location</h2>
                            <p>
                              <u>Midtown Manhattan, New York, NY</u>
                            </p>
                            <div className="address-location-map">
                              <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2261.139268703457!2d-133.14340392403935!3d55.4776704131501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x540e467f9dd315f3%3A0xf4eae0d4d7764524!2s245%20Cold%20Storage%20Rd%2C%20Craig%2C%20AK%2099921%2C%20USA!5e0!3m2!1sen!2sin!4v1723457458145!5m2!1sen!2sin"
                                width="600"
                                height="450"
                                // style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                              ></iframe>
                            </div>
                          </div>
                          <div className="location-left">
                            <div className="location-reviews">
                              <div className="location-reviews-top">
                                <h1>
                                  Reviews (30)
                                  <span>
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />{" "}
                                    <b>4.9</b>
                                    Rating
                                  </span>
                                </h1>
                                <p className="ms-auto me-1">Sort by:</p>
                                <div className="chat-left-top-dropdown dropdown">
                                  <span
                                    className="dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    Highest Review
                                    <img src="/images/dropdown.svg" loading="lazy" alt="" />
                                  </span>
                                  <div className="chat-left-top-dropdown-list dropdown-menu">
                                    <ul>
                                      <li>
                                        <a href="#">
                                          Highest Review
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          Lowest Review
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          Recent Reviews
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              {/* <!-- LIST --> */}
                              <div className="location-reviews-list">
                                <div className="location-reviews-list-left">
                                  <img
                                    src="/images/location/reviews/1.svg"
                                    loading="lazy" alt=""
                                  />
                                  <h2>
                                    Emily James <br />{" "}
                                    <span>
                                      Host was very helpful. thank you so much
                                    </span>
                                  </h2>
                                </div>
                                <div className="location-reviews-list-right location-reviews-list-right-mob">
                                  <div className="location-reviews-list-right-star">
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                  </div>
                                  <p>Mar 09, 22</p>
                                </div>
                              </div>
                              {/* <!-- LIST -->
                          <!-- LIST --> */}
                              <div className="location-reviews-list">
                                <div className="location-reviews-list-left">
                                  <img
                                    src="/images/location/reviews/2.svg"
                                    loading="lazy" alt=""
                                  />
                                  <h2>
                                    Emily James <br />{" "}
                                    <span>
                                      Host was very helpful. thank you so much
                                    </span>
                                  </h2>
                                </div>
                                <div className="location-reviews-list-right">
                                  <div className="location-reviews-list-right-star">
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon-blank.svg"
                                      loading="lazy" alt=""
                                    />
                                  </div>
                                  <p>Mar 09, 22</p>
                                </div>
                              </div>
                              {/* <!-- LIST -->
                          <!-- LIST --> */}
                              <div className="location-reviews-list">
                                <div className="location-reviews-list-left">
                                  <img
                                    src="/images/location/reviews/3.svg"
                                    loading="lazy" alt=""
                                  />
                                  <h2>
                                    James Kristen <br />{" "}
                                    <span>
                                      Host was very helpful. thank you so much
                                    </span>
                                  </h2>
                                </div>
                                <div className="location-reviews-list-right">
                                  <div className="location-reviews-list-right-star">
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                  </div>
                                  <p>Mar 09, 22</p>
                                </div>
                              </div>
                              {/* <!-- LIST -->
                          <!-- LIST --> */}
                              <div className="location-reviews-list">
                                <div className="location-reviews-list-left">
                                  <img
                                    src="/images/location/reviews/4.svg"
                                    loading="lazy" alt=""
                                  />
                                  <h2>
                                    Michael Kenny <br />{" "}
                                    <span>
                                      Host was very helpful. thank you so much
                                    </span>
                                  </h2>
                                </div>
                                <div className="location-reviews-list-right">
                                  <div className="location-reviews-list-right-star">
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <img
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                  </div>
                                  <p>Mar 09, 22</p>
                                </div>
                              </div>
                              {/* <!-- LIST --> */}
                              <button
                                className="location-reviews-btn"
                                type="button"
                              >
                                Show More Reviews
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-4"
                      role="tabpanel"
                      aria-labelledby="v-pills-4-tab"
                      tabindex="0"
                    >
                      <div className="chat-mid-top">
                        <div className="booking-mid-section">
                          <div className="booking-mid-top location-top">
                            <h2>
                              Cabin in Peshastin{" "}
                              <div className="booking-tag canceled">
                                Canceled
                              </div>
                            </h2>
                            <ul>
                              {/* <!-- RIGHT --> */}
                              <li className="location-top-share">
                                <a
                                  href="#"
                                  data-bs-target="#share-popup"
                                  data-bs-toggle="modal"
                                >
                                  <i className="fa-solid fa-share-nodes"></i>{" "}
                                  Share
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fa-solid fa-heart"></i> Wishlist
                                </a>
                              </li>
                              {/* <!-- RIGHT --> */}
                            </ul>
                          </div>
                          <div className="location-image-grid">
                            <div className="location-image-grid-one">
                              <img src="/images/location/grid/1.svg" loading="lazy" alt="" />
                            </div>
                            <div className="location-image-grid-four">
                              <img src="/images/location/grid/2.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/3.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/4.svg" loading="lazy" alt="" />
                              <img src="/images/location/grid/5.svg" loading="lazy" alt="" />
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Booking Details</h2>
                            <div className="booking-details">
                              <ul>
                                <li>
                                  <img
                                    src="/images/filters/calendar-icon.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  October 22, 2023
                                </li>
                                <li>
                                  <img src="/images/filters/time.svg" loading="lazy" alt="" />{" "}
                                  2 hours | From 01pm to 03pm
                                </li>
                                <li>
                                  <img src="/images/filters/price.svg" loading="lazy" alt="" />{" "}
                                  $30
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Included in your booking</h2>
                            <div className="location-included">
                              <ul>
                                <li>
                                  <img
                                    src="/images/location/included/1.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Parking
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/2.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Wifi
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/3.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  2 Rooms
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/4.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Kitchen
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/5.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Tables
                                </li>
                                <li>
                                  <img
                                    src="/images/location/included/6.svg"
                                    loading="lazy" alt=""
                                  />{" "}
                                  Chairs
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Rules</h2>
                            <div className="location-rules">
                              <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                  <h3
                                    className="accordion-header"
                                    id="headingOne"
                                  >
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
                                        loading="lazy" alt=""
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
                                      This is the first item's accordion body.
                                      It is shown by default, until the collapse
                                      plugin adds the appropriate classNamees
                                      that we use to style each element. These
                                      classNamees control the overall
                                      appearance, as well as the showing and
                                      hiding via CSS transitions. You can modify
                                      any of this with custom CSS or overriding
                                      our default variables. It's also worth
                                      noting that just about any HTML can go
                                      within the, though the transition does
                                      limit overflow.
                                    </div>
                                  </div>
                                </div>
                                <div className="accordion-item">
                                  <h3
                                    className="accordion-header"
                                    id="headingTwo"
                                  >
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
                                        loading="lazy" alt=""
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
                                      This is the first item's accordion body.
                                      It is shown by default, until the collapse
                                      plugin adds the appropriate classNamees
                                      that we use to style each element. These
                                      classNamees control the overall
                                      appearance, as well as the showing and
                                      hiding via CSS transitions. You can modify
                                      any of this with custom CSS or overriding
                                      our default variables. It's also worth
                                      noting that just about any HTML can go
                                      within the, though the transition does
                                      limit overflow.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="location-left">
                            <h2>Address &amp; Location</h2>
                            <p>
                              <u>Midtown Manhattan, New York, NY</u>
                            </p>
                            <div className="address-location-map">
                              <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2261.139268703457!2d-133.14340392403935!3d55.4776704131501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x540e467f9dd315f3%3A0xf4eae0d4d7764524!2s245%20Cold%20Storage%20Rd%2C%20Craig%2C%20AK%2099921%2C%20USA!5e0!3m2!1sen!2sin!4v1723457458145!5m2!1sen!2sin"
                                width="600"
                                height="450"
                                // style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                              ></iframe>
                            </div>
                          </div>
                          {/* <div className="location-left">
                            <div className="location-reviews">
                              <div className="location-reviews-top d-flex align-items-center justify-content-between">
                                <h1>
                                  Reviews ({reviewsData.length})
                                  <span>
                                    <Image
                                      src="/images/locations-grid/star-icon.svg"
                                      loading="lazy" alt=""
                                    />
                                    <b>4.9</b> Rating
                                  </span>
                                </h1>
                                <div className="d-flex align-items-center">
                                  <p className="me-2">Sort by:</p>
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      variant="light"
                                      id="dropdown-basic"
                                    >
                                      {sortOption}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={() =>
                                          setSortOption("Highest Review")
                                        }
                                      >
                                        Highest Review
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          setSortOption("Lowest Review")
                                        }
                                      >
                                        Lowest Review
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          setSortOption("Recent Reviews")
                                        }
                                      >
                                        Recent Reviews
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>

                              {visibleReviews.map((review) => (
                                <div
                                  key={review.id}
                                  className="location-reviews-list d-flex align-items-center justify-content-between"
                                >
                                  <div className="d-flex align-items-center">
                                    <Image
                                      src={review.image}
                                      loading="lazy" alt=""
                                      className="me-3"
                                    />
                                    <h2>
                                      {review.name} <br />
                                      <span>{review.comment}</span>
                                    </h2>
                                  </div>
                                  <div className="d-flex flex-column align-items-end">
                                    <div>
                                      {[...Array(5)].map((_, i) => (
                                        <Image
                                          key={i}
                                          src={
                                            i < review.rating
                                              ? "/images/locations-grid/star-icon.svg"
                                              : "/images/locations-grid/star-icon-blank.svg"
                                          }
                                          loading="lazy" alt="star"
                                        />
                                      ))}
                                    </div>
                                    <p>{review.date}</p>
                                  </div>
                                </div>
                              ))}

                              {!showAll && (
                                <Button
                                  className="location-reviews-btn mt-3"
                                  onClick={() => setShowAll(true)}
                                >
                                  Show More Reviews
                                </Button>
                              )}
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="chat-right">
                  <div className="chat-right-top">
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
                        src="/images/bookings/verify-star.svg"
                        loading="lazy" alt=""
                      />
                    </div>
                    <hr />
                    <a
                      className="review-btn"
                      style={{ padding: "10px", marginBottom: "10px" }}
                    >
                      <BookingReview />
                    </a>

                    <Link to="/chat" className="mb-2">
                      Message the Host
                    </Link>

                    <a
                      href="#"
                      onClick={() => setIsOpen(true)}
                    >
                      Report Violation
                    </a>

                    {/* Show the ReportViolation popup if isOpen is true */}
                    {isOpen && (
                      <ReportViolation
                        style={{ margin: "10px" }}
                        onClose={() => setIsOpen(false)}
                      />
                    )}
                  </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- BOOKING-PAGE --> */}

        {/* for booking modal or review modal */}

        {/* report voilation */}

        {/* <div
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
                        loading="lazy" alt="dropdown icon"
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
                            <a href="#">{reason}</a>
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
        </div> */}
      </main>

      <AuthModal />
      {/* <Footer /> */}
    </>
  );
}

export default Bookings;
