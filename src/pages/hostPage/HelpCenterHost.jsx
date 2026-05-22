import React, { useState } from "react";
import Header from "../../components/host/Header";
import Footer from "../../components/guest/Footer";
import AuthModal from "../../components/guest/authModal";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function HelpCenterHost() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Guest");

  const guides = [
    "Booking",
    "Payments",
    "Security & Safety",
    "Cancellations & Refunds",
  ];

  const articles = [
    "How to make a booking?",
    "Payment methods available",
    "How to stay safe?",
    "Refund policies explained",
    "Host verification process",
    "Handling disputes and issues",
  ];

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) =>
    article.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guides.filter((guide) =>
    guide.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* <Header /> */}

      <main style={{ fontFamily: "'Arial', sans-serif" }}>
        {/* Hero Section */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#f8f9fa",
            textAlign: "center",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} style={{ textAlign: "center" }}>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "30px",
                    color: "#333",
                  }}
                >
                  Hi Katelyn, how can we help?
                </h1>
                <Form style={{ maxWidth: "600px", margin: "0 auto" }}>
                  <div
                    style={{
                      display: "flex",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search question"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        height: "50px",
                        borderRadius: "4px 0 0 4px",
                        border: "1px solid #ddd",
                        flex: 1,
                      }}
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      style={{
                        height: "50px",
                        borderRadius: "0 4px 4px 0",
                      }}
                    >
                      <i className="fa fa-search"></i>
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Tabs Section */}
        <section
          style={{
            padding: "30px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    style={{
                      padding: "10px 30px",
                      borderRadius: "4px",
                      fontWeight: "600",
                      backgroundColor:
                        activeTab === "Guest" ? "#007bff" : "transparent",
                      color: activeTab === "Guest" ? "white" : "#007bff",
                      border:
                        activeTab === "Guest"
                          ? "1px solid #007bff"
                          : "1px solid #007bff",
                    }}
                    onClick={() => setActiveTab("Guest")}
                  >
                    Guest
                  </Button>
                  <Button
                    style={{
                      padding: "10px 30px",
                      borderRadius: "4px",
                      fontWeight: "600",
                      backgroundColor:
                        activeTab === "Host" ? "#007bff" : "transparent",
                      color: activeTab === "Host" ? "white" : "#007bff",
                      border:
                        activeTab === "Host"
                          ? "1px solid #007bff"
                          : "1px solid #007bff",
                    }}
                    onClick={() => setActiveTab("Host")}
                  >
                    Host
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Guides Section */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Container>
            <Row>
              <Col lg={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h2 style={{ fontSize: "1.8rem", color: "#333" }}>
                    Guides for {activeTab}
                  </h2>
                  <Link
                    to="/explore-guides"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    Browse all Guides <i className="fa fa-chevron-right"></i>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row>
              {filteredGuides.map((guide, index) => (
                <Col lg={3} md={6} key={index}>
                  <Link
                    to="/guide-detail"
                    style={{
                      display: "block",
                      background: "white",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      textDecoration: "none",
                      color: "#333",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                      transition: "transform 0.3s ease",
                      marginBottom: "30px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <div style={{ marginBottom: "15px" }}>
                      <img
                        src={`/images/help-center/guides/${index + 1}.png`}
                        alt={guide}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <h3 style={{ margin: 0 }}>{guide}</h3>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Articles Section */}
        <section style={{ padding: "60px 0" }}>
          <Container>
            <Row>
              <Col lg={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h2 style={{ fontSize: "1.8rem", color: "#333" }}>
                    Top Articles
                  </h2>
                  <Link
                    to="/exploreArticles"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    Browse all Articles <i className="fa fa-chevron-right"></i>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <Col lg={4} md={6} key={index}>
                    <Link
                      to="/articles-detail"
                      style={{
                        display: "block",
                        background: "white",
                        borderRadius: "8px",
                        padding: "25px",
                        textDecoration: "none",
                        color: "#333",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                        transition: "transform 0.3s ease",
                        marginBottom: "30px",
                        height: "100%",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-5px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "")
                      }
                    >
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          marginBottom: "15px",
                          color: "#007bff",
                        }}
                      >
                        {article}
                      </h3>
                      <p style={{ color: "#666" }}>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </p>
                    </Link>
                  </Col>
                ))
              ) : (
                <Col lg={12} style={{ textAlign: "center" }}>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "1.2rem",
                      padding: "30px 0",
                    }}
                  >
                    No articles found.
                  </p>
                </Col>
              )}
            </Row>
          </Container>
        </section>

        {/* Contact Section */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#f8f9fa",
            textAlign: "center",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>
                  Need to get in touch?
                </h2>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    marginBottom: "30px",
                  }}
                >
                  We'll start with some questions and get you to the right
                  place.
                </p>
                <Link
                  to="/contactUs"
                  className="btn btn-primary"
                  style={{
                    padding: "10px 30px",
                    borderRadius: "4px",
                    backgroundColor: "#007bff",
                    color: "white",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Contact Us
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      </main>

      <AuthModal />
      {/* <Footer /> */}
    </>
  );
}

export default HelpCenterHost;
