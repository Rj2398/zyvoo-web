import React from "react";
import AuthModal from "../../../components/guest/authModal";
import { Container, Row, Col } from "react-bootstrap";
import {
  FiClock,
  FiGrid,
  FiDollarSign,
  FiUsers,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";

const WhyUs = () => {
  const features = [
    {
      icon: <FiClock size={26} color="#00C49F" />,
      title: "Book by the Hour",
      description:
        "Skip the full-day commitment. Choose the time that fits your plans and book only the hours you need.",
    },
    {
      icon: <FiGrid size={26} color="#00C49F" />,
      title: "More Ways to Use a Space",
      description:
        "From meetings and content creation to events, pop-ups, stays and creative projects, ZYVO is built around flexible use.",
    },
    {
      icon: <FiDollarSign size={26} color="#00C49F" />,
      title: "Pay for the Time You Need",
      description:
        "Hourly booking gives guests more control over cost and gives hosts a practical way to turn open time into revenue.",
    },
    {
      icon: <FiUsers size={26} color="#00C49F" />,
      title: "Built for Guests and Hosts",
      description:
        "Guests get a simpler way to discover and reserve spaces. Hosts get tools to manage listings, availability, bookings and earnings.",
    },
    {
      icon: <FiMapPin size={26} color="#00C49F" />,
      title: "Discover Spaces Around You",
      description:
        "Search by location, explore listings on the map and compare spaces based on the details that matter for your plans.",
    },
    {
      icon: <FiCheckCircle size={26} color="#00C49F" />,
      title: "No Long-Term Commitment",
      description:
        "ZYVO is designed for short-duration needs. Find the right space, use it for the time booked, and move on without unnecessary commitments.",
    },
  ];

  return (
    <>
      <main style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
        {/* HERO SECTION */}
        <section
          style={{
            padding: "80px 20px 60px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 0px)",
            backgroundSize: "24px 24px",
            borderBottom: "1px solid #eaeaea",
          }}
        >
          <Container style={{ maxWidth: "920px" }} className="text-center">
            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                fontWeight: "800",
                color: "#111111",
                marginBottom: "24px",
                letterSpacing: "-0.02em",
              }}
            >
              Why ZYVO?
            </h1>

            <p
              style={{
                fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)",
                lineHeight: "1.6",
                color: "#333333",
                fontWeight: "500",
                marginBottom: "28px",
              }}
            >
              Space should work around your schedule — not the other way around. ZYVO
              makes it easier to find and book spaces for the time you actually
              need, while giving hosts a new way to earn from hours that would
              otherwise go unused.
            </p>

            <div className="d-inline-block mb-4">
              <span
                style={{
                  backgroundColor: "#E8F8F5",
                  color: "#00A884",
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  padding: "10px 24px",
                  borderRadius: "50px",
                  border: "1px solid #B2EBF2",
                  display: "inline-block",
                  letterSpacing: "0.02em",
                }}
              >
                Your time. Your space. Your way.
              </span>
            </div>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: "1.7",
                color: "#555555",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              Whether you need a studio for a shoot, a room for a meeting, a venue
              for an event, or a flexible space for a few hours, ZYVO brings
              discovery, booking, communication and payment into one experience.
            </p>
          </Container>
        </section>

        {/* WHAT SETS US APART SECTION */}
        <section style={{ padding: "80px 20px" }}>
          <Container style={{ maxWidth: "1140px" }}>
            <div className="text-center mb-5">
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#111111",
                  letterSpacing: "-0.01em",
                  marginBottom: "12px",
                }}
              >
                WHAT SETS US APART
              </h2>
              <div
                style={{
                  width: "60px",
                  height: "4px",
                  backgroundColor: "#00C49F",
                  borderRadius: "2px",
                  margin: "0 auto",
                }}
              />
            </div>

            <Row className="g-4">
              {features.map((feature, idx) => (
                <Col key={idx} lg={4} md={6}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      padding: "36px 28px",
                      height: "100%",
                      border: "1px solid #eaeaea",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "54px",
                        height: "54px",
                        borderRadius: "14px",
                        backgroundColor: "#E8F8F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      {feature.icon}
                    </div>

                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#111111",
                        marginBottom: "12px",
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "0.98rem",
                        lineHeight: "1.6",
                        color: "#555555",
                        margin: 0,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* CLOSING CTA SECTION */}
        <section style={{ padding: "0 20px 80px" }}>
          <Container style={{ maxWidth: "1140px" }}>
            <div
              style={{
                background:
                  "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
                borderRadius: "28px",
                padding: "60px 32px",
                color: "#ffffff",
                textAlign: "center",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  fontWeight: "800",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                It’s all on ZYVO.
              </h2>
              <p
                style={{
                  fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                  lineHeight: "1.7",
                  color: "#D1D5DB",
                  maxWidth: "720px",
                  margin: "0 auto",
                }}
              >
                Find a space for the next few hours or put your unused space to
                work. ZYVO gives guests and hosts a more flexible way to book,
                share and use space.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <AuthModal />
    </>
  );
};

export default WhyUs;