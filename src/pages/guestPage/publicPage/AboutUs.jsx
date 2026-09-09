import React from "react";
import AuthModal from "../../../components/guest/authModal";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import useContent from "../../../hooks/useContent";
import { imageBase } from "../../../config/Constant";

function AboutUs() {
  const { AboutUsData, isAboutUsLoading } = useContent();

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    if (path.startsWith("/images/")) return path;
    return `${imageBase}${path}`;
  };

  const renderImageSection = (images) => {
    if (!images || images.length === 0) return null;

    if (images.length === 1) {
      return (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <img
            src={images[0]}
            alt="About us"
            loading="lazy"
            style={{
              width: "100%",
              maxHeight: "420px",
              objectFit: "cover",
              borderRadius: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="d-flex gap-3 align-items-center w-100">
          <div style={{ flex: 1 }}>
            <img
              src={images[0]}
              alt="About us 1"
              loading="lazy"
              style={{
                width: "100%",
                height: "360px",
                objectFit: "cover",
                borderRadius: "28px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <img
              src={images[1]}
              alt="About us 2"
              loading="lazy"
              style={{
                width: "100%",
                height: "360px",
                objectFit: "cover",
                borderRadius: "28px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            />
          </div>
        </div>
      );
    }

    // 3 or more images: collage layout matching screenshot
    const displayImages = images.slice(0, 3);
    return (
      <div className="d-flex gap-3 align-items-center w-100 justify-content-end">
        {/* Left tall image */}
        <div style={{ flex: 1, maxWidth: "50%" }}>
          <img
            src={displayImages[0]}
            alt="About us 1"
            loading="lazy"
            style={{
              width: "100%",
              height: "360px",
              objectFit: "cover",
              borderRadius: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          />
        </div>
        {/* Right stacked 2 images */}
        <div
          className="d-flex flex-column gap-3"
          style={{ flex: 1, maxWidth: "50%" }}
        >
          <img
            src={displayImages[1]}
            alt="About us 2"
            loading="lazy"
            style={{
              width: "100%",
              height: "172px",
              objectFit: "cover",
              borderRadius: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          />
          <img
            src={displayImages[2]}
            alt="About us 3"
            loading="lazy"
            style={{
              width: "100%",
              height: "172px",
              objectFit: "cover",
              borderRadius: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <main>
        <Container fluid style={{ backgroundColor: "#ffffff", padding: 0 }}>
          {isAboutUsLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "400px" }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            AboutUsData?.map((item, index) => {
              let itemImages = [];
              if (Array.isArray(item?.images) && item.images.length > 0) {
                itemImages = item.images.map(getImageUrl);
              } else if (
                Array.isArray(item?.cover_images) &&
                item.cover_images.length > 0
              ) {
                itemImages = item.cover_images.map(getImageUrl);
              } else if (item?.cover_image) {
                if (
                  typeof item.cover_image === "string" &&
                  item.cover_image.includes(",")
                ) {
                  itemImages = item.cover_image
                    .split(",")
                    .map((s) => getImageUrl(s.trim()));
                } else {
                  itemImages = [getImageUrl(item.cover_image)];
                }
              }

              return (
                <div
                  key={index}
                  style={{
                    padding: "60px 40px",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    backgroundImage:
                      "radial-gradient(rgba(0, 0, 0, 0.12) 1.2px, transparent 0px)",
                    backgroundSize: "24px 24px",
                    borderBottom: "1px solid #eeeeee",
                  }}
                >
                  {item?.main_title && (
                    <h2
                      style={{
                        textAlign: "center",
                        fontWeight: "700",
                        marginBottom: "40px",
                        color: "#111111",
                      }}
                    >
                      {item.main_title}
                    </h2>
                  )}

                  <Row className="align-items-center justify-content-between">
                    <Col lg={5} md={6} className="text-start py-3">
                      {item?.title && (
                        <h3
                          style={{
                            fontWeight: "700",
                            fontSize: "2rem",
                            marginBottom: "1.2rem",
                            color: "#1a1a1a",
                          }}
                        >
                          {item.title}
                        </h3>
                      )}
                      {item?.description && (
                        <div
                          style={{ color: "#444444", lineHeight: "1.7" }}
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      )}
                    </Col>

                    <Col lg={7} md={6} className="py-3">
                      {renderImageSection(itemImages)}
                    </Col>
                  </Row>
                </div>
              );
            })
          )}
        </Container>
      </main>

      <AuthModal />
    </div>
  );
}

export default AboutUs;