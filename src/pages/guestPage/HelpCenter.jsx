import React, { useState } from "react";
import Header from "../../components/guest/Header";
import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Guest");
  const guides = [
    "Booking",
    "Payments",
    "Security & Safety",
    "Cancelations & Refunds",
  ];
  const articles = Array(6).fill({
    title: "Article Topic Title",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the",
  });

  return (
    <>
      <Header />

      <main>
        {/* MOBILE */}
        <div className="mob-search-filter border-start-0 border-end-0">
          <Container fluid>
            <Row>
              <Col lg={12}>
                <div className="mob-search-filter-in">
                  <div className="mob-search-bar-back">
                    <Link to="/profile">
                      <i className="fa-regular fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/* MOBILE */}

        {/* HELP-CENTER-PAGE */}
        <div className="help-center-wrap">
          <Container fluid>
            <Row>
              <Col lg={12}>
                <div className="help-center-top">
                  <h1>Hi Katelyn, how can we help?</h1>
                  <Form.Group
                    className="d-flex mb-3"
                    style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search question"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-end-0"
                    />
                    <Button variant="primary" className="border-start-0">
                      <i className="fa fa-search"></i>
                    </Button>
                  </Form.Group>
                </div>
                <div className="help-center-mid">
                  <div className="help-center-btn">
                    <Link to="#" className="active">
                      Guest
                    </Link>
                    <Link to="#">Host</Link>
                    <span></span>
                  </div>
                  <h2>
                    Guides for Guests{" "}
                    <Link to="/explore-guides">
                      Browse all Guides{" "}
                      <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                  </h2>
                </div>
              </Col>

              {/* Guides Section */}
              {guides.map((guide, index) => (
                <Col lg={3} md={3} xs={6} key={index}>
                  <div className="help-center-guides">
                    <Link to="/guides-detail">
                      <img
                        src={`/images/help-center/guides/${index + 1}.png`}
                        loading="lazy" alt=""
                      />
                    </Link>
                    <p>{guide}</p>
                  </div>
                </Col>
              ))}

              {/* Top Articles Section */}
              <Col lg={12} className="mt-4">
                <div className="help-center-mid mb-5">
                  <h2>
                    Top Articles{" "}
                    <Link to="/explore-articles">
                      Browse all Articles{" "}
                      <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                  </h2>
                </div>
              </Col>

              {/* Article List */}
              {articles.map((article, index) => (
                <Col lg={4} md={6} key={index}>
                  <div className="help-center-articles">
                    <h4>
                      <Link to="/articles-detail">{article.title}</Link>
                    </h4>
                    <p>{article.description}</p>
                  </div>
                </Col>
              ))}

              {/* Contact Us Section */}
              <Col lg={12}>
                <div className="help-center-touch">
                  <h4>Need to get in touch?</h4>
                  <p>
                    We'll start with some questions and get you to the right
                    place.
                  </p>
                  <Link
                    to="/contactUs"
                    className="btn"
                    style={{
                      backgroundColor: "#4AEAB1",
                      color: "#000",
                      padding: "10px 20px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      fontWeight: "bold",
                      borderRadius: "30px",
                    }}
                  >
                    Contact Us
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/* HELP-CENTER-PAGE */}
      </main>

      <AuthModal />
      <Footer />
    </>
  );
}

export default HelpCenter;
