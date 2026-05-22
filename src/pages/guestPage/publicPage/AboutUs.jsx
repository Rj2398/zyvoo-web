import AuthModal from "../../../components/guest/authModal";
import { Container } from "react-bootstrap";
import useContent from "../../../hooks/useContent";
import { imageBase } from "../../../config/Constant";

function AboutUs() {
  const { AboutUsData } = useContent();

  return (
    <div>
      <main>
        <Container fluid style={{ backgroundColor: "white" }}>
          {AboutUsData?.map((item, index) => (
            <>
              <div key={index} 
                style={{
                  padding: "40px",
                  textAlign: "center",
                  backgroundColor: "white",
                  backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
                  backgroundSize: "20px 20px",
                }} >
                <h2>{item?.main_title}</h2>
                <p style={{ color: "#555", marginBottom: "40px" }}>
                  The Leading Platform for hourly rentals
                </p>

                <div className="row">
                  <div className="col-md-5 text-start py-4" style={{ marginTop: "140px" }} >
                    <h3>{item?.title}</h3>
                    <p style={{ color: "#555" }}>
                      <div dangerouslySetInnerHTML={{ __html: item?.description }} />
                    </p>
                  </div>

                  <div className="col-md-7 d-flex flex-wrap">
                    <img src="/images/about-page/welcome.svg" loading="lazy" alt="Studio shoot" 
                      style={{
                        borderRadius: "15px",
                        width: "90%",
                        height: "auto",
                        margin: "10px 0",
                        padding: "10px",
                        marginLeft: "50px",
                      }} />
                  </div>
                </div>
              </div>

              <div style={{ padding: "40px", backgroundColor: "#f5f5f5" }}>
                <div className="row align-items-center">
                  <div className="col-md-5" style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      padding: "90px 40px",
                      marginRight: "110px",
                    }} >
                    <h3 style={{ fontWeight: "bold" }}>Our Mission</h3>
                    <p style={{ color: "#555" }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>

                  <div className="col-md-5 position-relative">
                    <div style={{
                        position: "absolute",
                        top: "60px",
                        left: "-10px",
                        right: "-10px",
                        bottom: "-90px",
                        backgroundColor: "#ffffff",
                        borderTopRightRadius: "15px",
                        borderTopLeftRadius: "15px",
                        zIndex: 0,
                      }}
                    ></div>
                    <img src="/images/about-page/mission.svg" loading="lazy" alt="Team meeting"
                      style={{
                        width: "100%",
                        borderRadius: "15px",
                        position: "relative",
                        zIndex: 1,
                      }} />
                  </div>
                </div>
              </div>

              <div className="bg-white pt-3 pb-3 row justify-content-center">
                <div className="col-md-10">
                  <div className="about-vision"
                    style={{
                      backgroundImage: `url(${imageBase}${item?.cover_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }} >
                    <h2>Vision</h2>
                    <hr />
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>
                </div>
              </div>

              <div className="container py-5">
                <div className="row align-items-center">
                  <div className="col-md-5 me-5">
                    <h3 style={{ fontWeight: "bold" }}>
                      A World of Possibilities
                    </h3>
                    <p style={{ color: "#555" }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>

                  <div className="col-md-6 position-relative ms-4">
                    <img src="/images/about-page/possibilities.svg" loading="lazy" alt="Workplace desk" style={{ width: "96%", position: "relative", zIndex: 2 }} />

                    <div style={{
                        position: "absolute",
                        bottom: "-30px",
                        left: "-20px",
                        width: "70%",
                        height: "70%",
                        backgroundColor: "#36D7B7",
                        zIndex: 1,
                      }} ></div>

                    <div style={{ 
                        position: "absolute",
                        top: "-30px",
                        right: "0",
                        width: "50%",
                        height: "50%",
                        backgroundColor: "#2C3E50",
                        zIndex: 1,
                      }} ></div>
                  </div>
                </div>
              </div>
              <div className="container py-5">
                <div className="row align-items-center">
                  <div className="col-md-6 me-4">
                    <img src="/images/about-page/flexibility.svg" loading="lazy" alt="Concert Scene" style={{ width: "100%", borderRadius: "15px" }} />
                  </div>

                  <div className="col-md-5 ms-5">
                    <h3 style={{ fontWeight: "bold" }}>Flexibility Your Way</h3>
                    <p style={{ color: "#555" }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ))}
        </Container>
      </main>

      <AuthModal />
    </div>
  );
}

export default AboutUs;