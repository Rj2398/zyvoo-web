import React, { useState } from "react";
// import Header from "../../components/host/Header";
// import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { X } from "react-feather";

function ProfileHost() {
  // PayOut methord
  const [payoutDropdownOpen, setPayoutDropdownOpen] = useState(false);
  const [payoutMenuOpen, setPayoutMenuOpen] = useState(null);

  const [payoutMethods, setPayoutMethods] = useState({
    banks: [
      {
        id: 1,
        name: "Bank Name",
        details: "Bill Gilbert, Checking ....4898(USD)",
        preferred: true,
      },
      {
        id: 2,
        name: "Bank Name",
        details: "Bill Gilbert, Checking ....1234(USD)",
        preferred: false,
      },
      {
        id: 3,
        name: "Bank Name",
        details: "Bill Gilbert, Checking ....5678(USD)",
        preferred: false,
      },
    ],
    cards: [
      { id: 4, lastDigits: "**** **** **** 78", preferred: true },
      { id: 5, lastDigits: "**** **** **** 12", preferred: false },
      { id: 6, lastDigits: "**** **** **** 45", preferred: false },
    ],
  });

  const togglePayoutDropdown = () => {
    setPayoutDropdownOpen(!payoutDropdownOpen);
    setPayoutMenuOpen(null);
  };

  const togglePayoutMenu = (id) => {
    setPayoutMenuOpen(payoutMenuOpen === id ? null : id);
  };

  const setPreferred = (type, id) => {
    setPayoutMethods((prevState) => ({
      ...prevState,
      [type]: prevState[type].map((item) =>
        item.id === id
          ? { ...item, preferred: true }
          : { ...item, preferred: false }
      ),
    }));
    setPayoutMenuOpen(null); // Close menu after selection
  };

  //Payment method
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);
  const cardList = [
    { id: 1, lastDigits: "....365890", preferred: true },
    { id: 2, lastDigits: "....365890", preferred: false },
    { id: 3, lastDigits: "....365890", preferred: false },
  ];

  const [showForm, setShowForm] = useState(false);
  // Payout Modal function
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("bank");

  const renderTextField = (label, placeholder, type = "text") => (
    <Form.Group
      className="mb-3"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Form.Label
        style={{
          alignSelf: "flex-start",
          marginBottom: "5px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {label}
      </Form.Label>
      <Form.Control
        as={type === "textarea" ? "textarea" : "input"} // ✅ Uses textarea when needed
        type={type !== "textarea" ? type : undefined} // ✅ Avoids setting type for textarea
        placeholder={placeholder}
        style={{
          width: "90%",
          height: type === "textarea" ? "100px" : "40px", // ✅ Adjusts height for textarea
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "25px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          outline: "none",
          resize: "none", // ✅ Prevents textarea from being resized
        }}
      />
    </Form.Group>
  );

  const renderSelectField = (label, options) => (
    <Form.Group
      className="mb-3"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Form.Label
        style={{
          alignSelf: "flex-start",
          marginBottom: "5px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {label}
      </Form.Label>
      <Form.Select
        style={{
          width: "90%", // Matching the text input width
          height: "40px",
          padding: "8px 10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "25px", // Capsule-shaped dropdown
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          outline: "none",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );

  const renderFileUpload = (label, multiple = false) => (
    <Form.Group
      className="mb-3"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Form.Label
        style={{
          marginBottom: "5px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {label}
      </Form.Label>
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <Form.Control
          type="file"
          multiple={multiple}
          style={{
            flex: "1",
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "25px", // Capsule shape
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            outline: "none",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        />

        {/* Only render the second file input if label is NOT "Bank Proof" */}
        {label !== "Bank Proof :" && (
          <Form.Control
            type="file"
            multiple={multiple}
            style={{
              flex: "1",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "25px", // Capsule shape
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </Form.Group>
  );

  return (
    <>
      {/* <Header /> */}

      <main
        style={{
          backgroundColor: "white",
          backgroundImage:
            " radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px",
          backgroundSize: "20px 20px",
        }}
      >
        {/* <!-- MOBILE --> */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-search-filter-in">
                  <div className="mob-search-in">
                    <ul>
                      <li>
                        <a href="mob-src-filter.html">Where</a>
                      </li>
                      <li>
                        <a
                          className="mob-search-in-time"
                          href="mob-src-filter.html"
                        >
                          Time
                        </a>
                      </li>
                      <li>
                        <a href="mob-src-filter.html">Activity</a>
                      </li>
                    </ul>
                    <a href="mob-src-filter.html" className="mob-search-button">
                      <i className="fa-regular fa-magnifying-glass"></i>
                    </a>
                  </div>
                  <div className="mob-filter-in">
                    <a href="mob-filter.html">
                      <img
                        src="/images/mobile/filters/filter.svg"
                        loading="lazy" alt=""
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE --> */}

        <div className="complete-your-profile">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="complete-your-profile-right">
                  <div className="complete-your-profile-right-top">
                    <div className="user-profile-upload-name">
                      <div className="user-profile-upload">
                        <div className="user-profile-upload-image">
                          <img
                            src="/images/create-profile/profile.png"
                            loading="lazy" alt=""
                          />
                        </div>
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#add-profile-picture-popup"
                          type="button"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </div>
                      <div className="user-profile-name">
                        <h2>
                          Hey Katelyn!
                          <button type="button">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <span className="user-name-dropdown">
                            <form>
                              <label>
                                <input type="text" placeholder="First name*" />
                                <input type="text" placeholder="Last name*" />
                              </label>
                              <input type="submit" value="Save Changes" />
                            </form>
                          </span>
                        </h2>
                        <p>
                          {" "}
                          Guest
                          <span className="info-wrap">
                            <img
                              src="/images/create-profile/info.svg"
                              loading="lazy" alt=""
                            />
                            <span className="info-in">
                              Before you can book or host on the platform the
                              name on Id must match verification documents.
                            </span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="complete-your-profile-right-bottom">
                    <div className="complete-your-profile-right-bottom-in">
                      <div className="complete-your-profile-right-bottom-image">
                        <img
                          src="/images/create-profile/mail.svg"
                          loading="lazy" alt=""
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Email Address</h1>
                        <p>
                          Verified <i className="fa-solid fa-badge-check"></i>
                        </p>
                        {/* <!-- <a href="#" data-bs-toggle="modal"
                      data-bs-target="#confirm-email-popup"><u>Confirm now</u></a> --> */}
                      </div>
                    </div>
                    <div className="complete-your-profile-right-bottom-in">
                      <div className="complete-your-profile-right-bottom-image">
                        <img
                          src="/images/create-profile/call.svg"
                          loading="lazy" alt=""
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Phone Number</h1>
                        <p>
                          Verified <i className="fa-solid fa-badge-check"></i>
                        </p>
                        {/* <!-- <a href="#" data-bs-toggle="modal"
                      data-bs-target="#confirm-phone-popup"><u>Confirm now</u></a> --> */}
                      </div>
                    </div>
                    <div className="complete-your-profile-right-bottom-in">
                      <div className="complete-your-profile-right-bottom-image">
                        <img
                          src="/images/create-profile/identity.svg"
                          loading="lazy" alt=""
                        />
                      </div>
                      <div className="complete-your-profile-right-bottom-data">
                        <h1>Verify identity</h1>
                        <p>
                          Verified <i className="fa-solid fa-badge-check"></i>
                        </p>
                        {/* <!-- <a href="#"><u>Confirm now</u></a> --> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-6 order-lg-first">
                <div className="complete-your-profile-left">
                  <form action="">
                    <h2>
                      About Me{" "}
                      <button type="button">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </h2>
                    <div className="about-me">
                      <textarea
                        disabled
                        value="
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took. Lorem Ipsum is simply
                        dummy text of the printing and typesetting industry."
                      />
                    </div>
                    <div className="user-data-list-wrap">
                      <h2>Where I live*</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item">
                          <input
                            type="text"
                            placeholder="New York, US"
                            id="where-search"
                          />
                          <button type="button">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <div className="user-data-list-dropdown">
                            <ul>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/filters/where-icons.svg"
                                    loading="lazy" alt=""
                                  />
                                  Alaska, US
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/filters/where-icons.svg"
                                    loading="lazy" alt=""
                                  />
                                  California, US
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/filters/where-icons.svg"
                                    loading="lazy" alt=""
                                  />
                                  Delaware, US
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/filters/where-icons.svg"
                                    loading="lazy" alt=""
                                  />
                                  Florida, US
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/filters/where-icons.svg"
                                    loading="lazy" alt=""
                                  />
                                  New York, US
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button type="button" className="add-new-btn">
                          Add New <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <h2>My work</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item my-work">
                          <input type="text" placeholder="Lawyer" />
                          <button type="button" className="check">
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <div className="user-data-list-dropdown">
                            <ul>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/create-profile/list-icons/work.svg"
                                    loading="lazy" alt=""
                                  />
                                  Lawyer
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/create-profile/list-icons/work.svg"
                                    loading="lazy" alt=""
                                  />
                                  Lawyer
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button type="button" className="add-new-btn">
                          Add New <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <h2>Languages I speak*</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item languages">
                          <input type="text" placeholder="English" />
                          <button type="button">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <div className="user-data-list-dropdown">
                            <ul>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/create-profile/list-icons/languages.svg"
                                    loading="lazy" alt=""
                                  />
                                  English
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/create-profile/list-icons/languages.svg"
                                    loading="lazy" alt=""
                                  />
                                  English
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button type="button" className="add-new-btn">
                          Add New <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <h2>Hobbies</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item hobbies">
                          <input type="text" placeholder="Hobbies" />
                          <button type="button" className="check">
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <div className="user-data-list-dropdown">
                            <ul>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/create-profile/list-icons/hobbies.svg"
                                    loading="lazy" alt=""
                                  />
                                  Sports
                                </a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">
                                  <img
                                    src="/images/create-profile/list-icons/hobbies.svg"
                                    loading="lazy" alt=""
                                  />
                                  Sports
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button type="button" className="add-new-btn">
                          Add New <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <h2>Pets</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item pets">
                          <input type="text" placeholder="Pets" />
                          <button type="button">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <div className="user-data-list-dropdown">
                            <ul>
                              <li className="where-src-item">
                                <a href="#">Dog</a>
                              </li>
                              <li className="where-src-item">
                                <a href="#">Dog</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button type="button" className="add-new-btn">
                          Add New <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <h2>Email</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item input-field">
                          <input
                            type="text"
                            placeholder="Enter Your Email"
                            value="Katelyncris@email.com"
                          />
                          <button type="button" className="edit-field">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                      </div>
                      <h2>Phone Number</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item input-field">
                          <input
                            type="text"
                            placeholder="Enter Your Phone Number"
                            value="***********4567"
                          />
                          <button type="button" className="edit-field">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                      </div>
                      <h2>Password</h2>
                      <div className="user-data-list-inner">
                        <div className="user-data-list-item input-field">
                          <input
                            type="password"
                            placeholder="Enter Your Password"
                            value="***********"
                          />
                          <button
                            type="button"
                            data-bs-target="#confirm-email-popup"
                            data-bs-toggle="modal"
                            className="edit-field"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        </div>
                      </div>
                      <h2>Mailing Address</h2>
                      <div className="user-data-list-inner mailing-address-wrap">
                        {/* <!-- ITEM --> */}
                        <div className="user-data-list-item input-field">
                          <input type="text" placeholder="Street" />
                          <button type="button" className="edit-field">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                        {/* <!-- ITEM -->
                    <!-- ITEM --> */}
                        <div className="user-data-list-item input-field">
                          <input type="text" placeholder="City" />
                          <button type="button" className="edit-field">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                        {/* <!-- ITEM -->
                    <!-- ITEM --> */}
                        <div className="user-data-list-item input-field">
                          <input type="text" placeholder="State" />
                          <button type="button" className="edit-field">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                        {/* <!-- ITEM -->
                    <!-- ITEM --> */}
                        <div className="user-data-list-item input-field">
                          <input type="text" placeholder="Zip Code" />
                          <button type="button" className="edit-field">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                        {/* <!-- ITEM --> */}
                      </div>

                      <div
                        style={{
                          width: "190px",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {/* Payment Methods Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "18px",
                            fontWeight: "500",
                            padding: "12px",
                            cursor: "pointer",
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
                                transform: dropdownOpen
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            ></i>
                          </span>
                        </div>

                        {/* Dropdown List */}
                        {dropdownOpen && (
                          <div
                            style={{
                              marginTop: "5px",
                              padding: "10px",
                              background: "#fff",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                              position: "absolute",
                              width: "25%",
                              zIndex: 1000,
                              transition: "all 0.3s ease-in-out",
                              opacity: dropdownOpen ? 1 : 0,
                              transform: dropdownOpen
                                ? "translateY(0)"
                                : "translateY(-10px)",
                              visibility: dropdownOpen ? "visible" : "hidden",
                            }}
                          >
                            {cardList.map((card) => (
                              <div
                                key={card.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px",
                                  borderBottom: "1px solid #eee",
                                  fontSize: "14px",
                                  position: "relative",
                                  transition: "opacity 0.3s ease-in-out",
                                  opacity: dropdownOpen ? 1 : 0,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    position: "relative",
                                  }}
                                >
                                  {/* Card Details */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      flexGrow: 1,
                                    }}
                                  >
                                    <img
                                      src="/images/payment-methods/visa.svg"
                                      loading="lazy" alt="Visa"
                                      style={{ width: "30px", height: "auto" }}
                                    />
                                    <h4
                                      style={{
                                        margin: "0 8px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {card.lastDigits}
                                    </h4>
                                    {card.preferred && (
                                      <p
                                        style={{
                                          color: "#28a745",
                                          fontSize: "12px",
                                          fontWeight: "bold",
                                          marginLeft: "auto",
                                          marginRight: "10px",
                                          marginTop: "15px",
                                        }}
                                      >
                                        Preferred
                                      </p>
                                    )}
                                  </div>

                                  {/* Menu Dropdown */}
                                  <div style={{ position: "relative" }}>
                                    <i
                                      className="fa-solid fa-ellipsis-vertical"
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#555",
                                      }}
                                      onClick={() => toggleMenu(card.id)}
                                    ></i>

                                    {/* Dropdown Menu */}
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "-10px",
                                        top: "0",
                                        background: "#fff",
                                        boxShadow:
                                          "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "4px",
                                        padding: "5px 8px",
                                        minWidth: "120px",
                                        fontSize: "12px",
                                        zIndex: 10,
                                        whiteSpace: "nowrap",
                                        transition:
                                          "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                                        opacity: menuOpen === card.id ? 1 : 0,
                                        transform:
                                          menuOpen === card.id
                                            ? "translateY(0)"
                                            : "translateY(-5px)",
                                        visibility:
                                          menuOpen === card.id
                                            ? "visible"
                                            : "hidden",
                                      }}
                                    >
                                      {!card.preferred && (
                                        <a
                                          style={{
                                            display: "block",
                                            padding: "6px",
                                            color: "#333",
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #eee",
                                          }}
                                        >
                                          Make as Preferred
                                        </a>
                                      )}
                                      <a
                                        style={{
                                          display: "block",
                                          padding: "6px",
                                          color: "#d9534f",
                                          textDecoration: "none",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Remove
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add New Card Button */}
                            <div
                              style={{
                                textAlign: "center",
                                paddingTop: "10px",
                              }}
                            >
                              <button
                                style={{
                                  display: "inline-block",
                                  width: "70%",
                                  padding: "10px",
                                  background: "#2EE5A1",
                                  border: "none",
                                  borderRadius: "20px",
                                  color: "#fff",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                Add New Card
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add Card Button */}
                      <div
                        style={{
                          maxWidth: "500px",
                          margin: "8px",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {/* Add Card Button */}
                        <Button
                          onClick={() => setShowForm(!showForm)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#fff",
                            color: "black",
                            border: "1px solid #b6b6b8",
                            borderRadius: "20px",
                            padding: "8px 13px",
                            fontWeight: "500",
                            fontSize: "14px",
                            cursor: "pointer",
                            height: "45px",
                            width: "30%",
                          }}
                        >
                          Add Card
                          <div
                            style={{
                              display: "flex",
                              height: "25px",
                              width: "25px",
                              borderRadius: "50%",
                              backgroundColor: "#2EE5A1",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </div>
                        </Button>

                        {/* Add Card Form (Shown When Button is Clicked) */}
                        {showForm && (
                          <div
                            style={{
                              marginTop: "5px",
                              marginLeft: "-5px",
                              padding: "20px",
                              borderRadius: "10px",
                              border: "1px solid #b6b6b8",
                              background: "#fff",
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                              position: "absolute",
                              zIndex: 1000,
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              Add Card Details111
                            </h5>
                            <Row className="mb-3">
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="Name"
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    width: "100%",
                                    fontSize: "16px", // Increased font size
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="Card Number"
                                  style={{
                                    padding: "12px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="CVV Number"
                                  style={{
                                    padding: "12px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                              <Col>
                                <Form.Select
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                >
                                  <option>Month</option>
                                  <option>Jan</option>
                                  <option>Feb</option>
                                  <option>Mar</option>
                                  <option>Apr</option>
                                </Form.Select>
                              </Col>
                              <Col>
                                <Form.Select
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                >
                                  <option>Year</option>
                                  <option>2023</option>
                                  <option>2024</option>
                                  <option>2025</option>
                                  <option>2026</option>
                                </Form.Select>
                              </Col>
                            </Row>

                            <h5
                              className="mt-2"
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              Add Billing Address
                            </h5>
                            <Row className="mb-3">
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="Street"
                                  style={{
                                    padding: "12px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="City"
                                  style={{
                                    padding: "12px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="State"
                                  style={{
                                    padding: "12px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                              <Col>
                                <Form.Control
                                  type="text"
                                  placeholder="Zip Code"
                                  style={{
                                    padding: "12px",
                                    border: "1px solid #888",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    color: "#333",
                                    height: "80%",
                                  }}
                                />
                              </Col>
                            </Row>
                            <Form.Group controlId="sameAsMailing">
                              <Form.Check
                                type="checkbox"
                                label="Same as Mailing Address"
                                style={{ fontSize: "16px", color: "#333" }}
                              />
                            </Form.Group>
                            <Button
                              style={{
                                display: "block",
                                width: "30%",
                                margin: "15px auto 0 auto", // Centers the button
                                padding: "10px",
                                background: "#2EE5A1",
                                border: "none",
                                borderRadius: "20px",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "16px", // Increased font size
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              Submit
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Horigental Line Divider */}
                      <div
                        style={{
                          marginTop: "15px",
                          height: "1px", // Thin vertical line
                          width: "100%", // Full height relative to parent
                          backgroundColor: "#b6b6b8",
                        }}
                      ></div>
                      {/* Payout Method Section */}
                      <div
                        style={{ position: "relative", width: "fit-content" }}
                      >
                        {/* Dropdown Toggle */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "18px",
                            fontWeight: "500",
                            padding: "12px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            background: "#fff",
                            width: "185px",
                          }}
                          onClick={togglePayoutDropdown}
                        >
                          Payout Method
                          <span>
                            <i
                              className="fa-solid fa-chevron-down"
                              style={{
                                transition: "transform 0.3s",
                                fontSize: "14px",
                                transform: payoutDropdownOpen
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            ></i>
                          </span>
                        </div>

                        {/* Dropdown List */}
                        {payoutDropdownOpen && (
                          <div
                            style={{
                              position: "absolute",
                              top: "40%",
                              left: "0",
                              marginTop: "5px",
                              padding: "10px",
                              background: "#fff",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                              minWidth: "370px",
                              zIndex: 100,
                            }}
                          >
                            {/* Banks */}
                            <h6
                              style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                padding: "5px 10px",
                              }}
                            >
                              Bank
                            </h6>
                            {payoutMethods.banks.map((bank) => (
                              <div
                                key={bank.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px",
                                  borderBottom: "1px solid #eee",
                                  fontSize: "14px",
                                }}
                              >
                                {/* Bank Details */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexGrow: 1,
                                  }}
                                >
                                  <i
                                    className="fa-solid fa-university"
                                    style={{ marginRight: "8px" }}
                                  ></i>
                                  <span>{bank.details}</span>
                                  {bank.preferred && (
                                    <p
                                      style={{
                                        color: "#28a745",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        marginLeft: "auto",
                                        marginRight: "10px",
                                      }}
                                    >
                                      Preferred
                                    </p>
                                  )}
                                </div>

                                {/* Menu Dropdown */}
                                <div style={{ position: "relative" }}>
                                  <i
                                    className="fa-solid fa-ellipsis-vertical"
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      color: "#555",
                                    }}
                                    onClick={() => togglePayoutMenu(bank.id)}
                                  ></i>

                                  {/* Dropdown Menu */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "-10px",
                                      top: "0",
                                      background: "#fff",
                                      boxShadow:
                                        "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                      borderRadius: "4px",
                                      padding: "5px 8px",
                                      minWidth: "120px",
                                      fontSize: "12px",
                                      zIndex: 10,
                                      whiteSpace: "nowrap",
                                      transition:
                                        "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                                      opacity:
                                        payoutMenuOpen === bank.id ? 1 : 0,
                                      transform:
                                        payoutMenuOpen === bank.id
                                          ? "translateY(0)"
                                          : "translateY(-5px)",
                                      visibility:
                                        payoutMenuOpen === bank.id
                                          ? "visible"
                                          : "hidden",
                                    }}
                                  >
                                    {!bank.preferred && (
                                      <a
                                        onClick={() =>
                                          setPreferred("banks", bank.id)
                                        }
                                        style={{
                                          display: "block",
                                          padding: "6px",
                                          color: "#333",
                                          textDecoration: "none",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #eee",
                                        }}
                                      >
                                        Make as Preferred
                                      </a>
                                    )}
                                    <a
                                      style={{
                                        display: "block",
                                        padding: "6px",
                                        color: "#d9534f",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Remove
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Debit Cards */}
                            <h6
                              style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                padding: "5px 10px",
                                marginTop: "10px",
                              }}
                            >
                              Debit Cards
                            </h6>
                            {payoutMethods.cards.map((card) => (
                              <div
                                key={card.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px",
                                  borderBottom: "1px solid #eee",
                                  fontSize: "14px",
                                }}
                              >
                                {/* Card Details */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexGrow: 1,
                                  }}
                                >
                                  <img
                                    src="/images/payment-methods/visa.svg"
                                    loading="lazy" alt="Visa"
                                    style={{ width: "30px", height: "auto" }}
                                  />
                                  <h4
                                    style={{
                                      margin: "0 8px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {card.lastDigits}
                                  </h4>
                                  {card.preferred && (
                                    <p
                                      style={{
                                        color: "#28a745",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        marginLeft: "auto",
                                        marginRight: "10px",
                                      }}
                                    >
                                      Preferred
                                    </p>
                                  )}
                                </div>

                                {/* Menu Dropdown */}
                                <div style={{ position: "relative" }}>
                                  <i
                                    className="fa-solid fa-ellipsis-vertical"
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      color: "#555",
                                    }}
                                    onClick={() => togglePayoutMenu(card.id)}
                                  ></i>

                                  {/* Dropdown Menu */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "-10px",
                                      top: "0",
                                      background: "#fff",
                                      boxShadow:
                                        "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                      borderRadius: "4px",
                                      padding: "5px 8px",
                                      minWidth: "120px",
                                      fontSize: "12px",
                                      zIndex: 10,
                                      whiteSpace: "nowrap",
                                      opacity:
                                        payoutMenuOpen === card.id ? 1 : 0,
                                      transform:
                                        payoutMenuOpen === card.id
                                          ? "translateY(0)"
                                          : "translateY(-5px)",
                                      visibility:
                                        payoutMenuOpen === card.id
                                          ? "visible"
                                          : "hidden",
                                    }}
                                  >
                                    {/* Fix: Use flex-direction: column to stack items vertically */}
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      {!card.preferred && (
                                        <a
                                          onClick={() =>
                                            setPreferred("cards", card.id)
                                          }
                                          style={{
                                            display: "block",
                                            padding: "6px",
                                            color: "#333",
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #eee",
                                          }}
                                        >
                                          Make as Preferred
                                        </a>
                                      )}
                                      <a
                                        style={{
                                          display: "block",
                                          padding: "6px",
                                          color: "#d9534f",
                                          textDecoration: "none",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Remove
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div>
                          <Button
                            onClick={() => setShowPayoutModal(true)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "8px",
                              backgroundColor: "#fff",
                              color: "black",
                              border: "1px solid #b6b6b8",
                              borderRadius: "20px",
                              padding: "10px 13px",
                              fontWeight: "400",
                              fontSize: "16px",
                              cursor: "pointer",
                              height: "45px",
                              width: "80%",
                              margin: "5px 5px",
                            }}
                          >
                            Add Card
                            <div
                              style={{
                                display: "flex",
                                height: "25px",
                                width: "25px",
                                borderRadius: "50%",
                                backgroundColor: "#2EE5A1",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <i className="fa-solid fa-plus"></i>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="user-data-btn">
                      <button type="submit">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE --> */}
        <div className="mob-profile-bottom">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="mob-profile-bottom-in">
                  <h2>Useful Pages</h2>
                  <ul>
                    <li>
                      <a href="notifications.html">
                        <img
                          src="/images/create-profile/mob-profile/1.svg"
                          loading="lazy" alt=""
                        />
                        Notifications
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                  <h2>Support</h2>
                  <ul>
                    <li>
                      <a href="help-center.html">
                        <img
                          src="/images/create-profile/mob-profile/2.svg"
                          loading="lazy" alt=""
                        />
                        Visit the Help Center
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                    <li>
                      <a href="feedback.html">
                        <img
                          src="/images/create-profile/mob-profile/3.svg"
                          loading="lazy" alt=""
                        />
                        Give us feedback
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                  <h2>Legal</h2>
                  <ul>
                    <li>
                      <a href="terms-of-services.html">
                        <img
                          src="/images/create-profile/mob-profile/4.svg"
                          loading="lazy" alt=""
                        />
                        Terms of services
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                    <li>
                      <a href="privacy-policy.html">
                        <img
                          src="/images/create-profile/mob-profile/4.svg"
                          loading="lazy" alt=""
                        />
                        Privacy policy
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                  <div className="mob-profile-bottom-in-btns">
                    <button
                      type="button"
                      data-bs-target="#logout-popup"
                      data-bs-toggle="modal"
                    >
                      <img
                        src="/images/create-profile/mob-profile/logout.svg"
                        loading="lazy" alt=""
                      />
                      Logout
                    </button>
                    <a href="">Switch to Host</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- MOBILE --> */}
      </main>

      {/* Bank Payout modal */}
      <Modal
        show={showPayoutModal}
        onHide={() => setShowPayoutModal(false)}
        size="lg"
        centered
      >
        <Modal.Body
          style={{
            padding: "30px",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center">
            <h5
              style={{
                fontWeight: "bold",
                margin: "0 auto",
                fontSize: "20px",
                borderBottom: "2px solid #ddd",
                paddingBottom: "10px",
                width: "100%",
                textAlign: "center",
              }}
            >
              Select Payment Method
            </h5>
            <X
              onClick={() => setShowPayoutModal(false)}
              style={{ cursor: "pointer", fontSize: "22px", color: "#333" }}
            />
          </div>

          {/* Payment Method Tabs */}
          <div className="d-flex justify-content-center mt-3">
            <Button
              onClick={() => setSelectedMethod("bank")}
              style={{
                borderRadius: "25px",
                padding: "12px 25px",
                backgroundColor: selectedMethod === "bank" ? "#dfdff5" : "#fff",
                color: selectedMethod === "bank" ? "#000" : "#007bff",
                border: "2px solid #dfdff5",
                fontWeight: "600",
                fontSize: "16px",
                marginRight: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                width: "50%",
              }}
            >
              Bank Account
            </Button>
            <Button
              onClick={() => setSelectedMethod("debit")}
              style={{
                borderRadius: "25px",
                padding: "12px 25px",
                backgroundColor:
                  selectedMethod === "debit" ? "#dfdff5" : "#fff",
                color: selectedMethod === "debit" ? "#000" : "#007bff",
                border: "2px solid #dfdff5",
                fontWeight: "600",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                width: "50%",
              }}
            >
              Debit Card
            </Button>
          </div>

          {/* Form Section */}
          <div className="mt-4" style={{ textAlign: "left", padding: "40px" }}>
            <Form>
              {renderTextField("Full Name :", "Enter full name", "text", {
                style: {
                  borderRadius: "50px",
                  padding: "10px 25px",
                  border: "1px solid #ccc",
                  width: "80%",
                  fontSize: "14px",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                  outline: "none",
                },
              })}
              {renderTextField("Email :", "Enter email", "email")}
              {renderTextField("Phone Number :", "Enter phone", "text")}
              {renderTextField("Address :", "Enter address", "textarea")}
              {renderSelectField("Country :", ["USA", "Canada", "UK"])}
              {renderSelectField("State :", ["California", "New York"])}
              {renderSelectField("City :", ["Los Angeles", "Chicago"])}
              {renderTextField("Postal Code :", "Postal Code", "text")}

              {selectedMethod === "bank" && (
                <>
                  {renderTextField("Bank Name :", "Enter Bank Name", "text")}
                  {renderTextField(
                    "Account Holder Name :",
                    "Enter Account Holder Name",
                    "text"
                  )}
                  {renderTextField(
                    "Bank Account Number :",
                    "Enter Account Number",
                    "text"
                  )}
                  {renderTextField(
                    "Confirm Account Number :",
                    "Confirm Account Number",
                    "text"
                  )}
                  {renderTextField(
                    "Routing Number :",
                    "Enter Routing Number",
                    "text"
                  )}
                  {renderFileUpload("Bank Proof :")}
                </>
              )}

              {selectedMethod === "debit" && (
                <>
                  {renderTextField(
                    "Card Number :",
                    "Enter Card Number",
                    "text"
                  )}
                  {renderTextField("CVV Number :", "Enter CVV", "text")}
                  <div className="d-flex justify-content-between">
                    {renderSelectField("Month :", [
                      "01",
                      "02",
                      "03",
                      "04",
                      "05",
                      "06",
                      "07",
                      "08",
                      "09",
                      "10",
                      "11",
                      "12",
                    ])}
                    {renderSelectField("Year :", [
                      "2024",
                      "2025",
                      "2026",
                      "2027",
                      "2028",
                    ])}
                  </div>
                </>
              )}

              {renderFileUpload("Verification Document (front & back) :", true)}

              <Button
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "12px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#fff",
                  width: "100%",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
              >
                {selectedMethod === "bank" ? "Add Bank" : "Add Card"}
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <AuthModal />
      {/* <Footer /> */}
    </>
  );
}

export default ProfileHost;
