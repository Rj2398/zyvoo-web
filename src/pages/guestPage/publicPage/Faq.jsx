import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import useContent from "../../../hooks/useContent";
import Loader from "../../../components/Loader";

const Faq = () => {
  const { FaqData, isLoading } = useContent();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };
    checkWindowWidth(); // run on mount
    window.addEventListener('resize', checkWindowWidth);
    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);
  

  return (
    <>
      <div className="mob-search-filter border-start-0 border-end-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <Link to="/profile">
                    <i className="fa-regular fa-arrow-left"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main>
        <Loader visible={isLoading} />
        <div className="faq-wrap mt-2 pt-lg-3"
          style={{
            backgroundColor: "transparent", // Transparent background for FAQ
            backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0px)",
            backgroundSize: "20px 20px",
          }} >
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="faq-heading">
                  <h1>Frequently Asked Questions</h1>
                </div>
              </div>

              <div className="col-lg-11 col-md-11">
                <div className="faq-in">
                  {!isMobileWidth && <div className="faq-top mb-4">
                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>}

                  <Accordion flush>
                    {FaqData?.map((question, index) => (
                      <Accordion.Item eventKey={index.toString()} key={index}
                        className={`mb-2 ${!isMobileWidth && "border-bottom"}`} style={{ border: isMobileWidth ? "1px solid black" : "none", backgroundColor: "transparent", borderRadius: isMobileWidth ? "10px" : "" }} >

                        <Accordion.Header
                          onClick={() => toggleAccordion(index)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                            padding: "5px 0",
                            backgroundColor: "transparent",
                            color: "#333",
                            fontWeight: "bold",
                          }} >
                          <span style={{ fontSize: isMobileWidth ? "14px" : "16px", fontWeight : isMobileWidth ? "500" : "600" }}>
                           {!isMobileWidth &&( <> {index + 1.} </>)} {question?.question}
                          </span>
                          <span className="faq-plus-icon" > {activeIndex === index ? "-" : "+"} </span>
                        </Accordion.Header>

                        <Accordion.Body className="faq-answer"
                          style={{
                            color: "#777",
                            padding: "10px 20px",
                            fontSize: "14px",
                            backgroundColor: "transparent", 
                          }}>
                          {question?.answer}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </div>

              {!isMobileWidth && <div className="col-lg-12">
                <div className="faq-contact-touch">
                  <p>Have more questions?</p>
                  <Link to="/contactUs">Contact Us</Link>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Faq;