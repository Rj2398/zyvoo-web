import { Carousel, Modal } from "react-bootstrap";
import { imageBase } from "../../config/Constant";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const LocationImagesModal = ({ show, handleClose, images }) => {
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  //   const variant = isMobileWidth ? 'dark' : 'light';

  return (
    <Modal show={show} onHide={handleClose} className="location-popup"
      style={{
        backgroundColor: isMobileWidth ? "black" : "",
        // margin: "0px 50px 30px 5px",
        margin: isMobileWidth ? "0" : "0px 50px 30px 5px",
        zIndex:'99999'

      }}>
      {isMobileWidth && (
        <button onClick={handleClose} style={{
            borderRadius: "20px",
            width: "30px",
            height: "30px",
            background: "white",
          }}>
          <MdOutlineKeyboardBackspace size={20} />
        </button>
      )}

      <div className="my-modal-boy">
        <Carousel controls={false} >
          {images?.map((img, index) => (
            <Carousel.Item key={index} style={{ textAlign: "center" }}>
              <img src={`${imageBase}${img}`} 
                style={{
                  height: isMobileWidth ? "250px" : "455px",
                  margin: "auto",
                  borderRadius: isMobileWidth ? "20px" : "0",
                  marginTop: isMobileWidth ? "50%" : "0",
                }} />

              <style>
                {`
                  .carousel-indicators {
                    position: absolute;
                    bottom: 2%;              /* Adjust vertical position */
                    left: 30%;
                    transform: translateX(-50%);
                    z-index: 1;
                    display: flex !important;
                    justify-content: center;
                    gap: 8px;                  /* spacing between bullets */
                  }
                  .carousel-indicators [data-bs-target] {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #fff; /* white bullets */
                    opacity: 0.5;
                    transition: opacity 0.3s ease;

                  }
                  .carousel-indicators .active {
                    opacity: 1;
                    background-color: #fff; /* or use your theme color */
                  }
                `}
              </style>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Modal>
  );
};

export default LocationImagesModal;