import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaShare } from "react-icons/fa";
import {
  FaWhatsapp,
  FaFacebook,
  FaEnvelope,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaLink,
} from "react-icons/fa6";

const SharePopup = () => {
  const [show, setShow] = useState(false);

  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      {/* Share Button */}
      <li className="location-top-share">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShow(true);
          }}
        >
          <FaShare style={{ marginRight: "10px", cursor: "pointer" }} />
        </a>
      </li>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share with friends</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-wrap justify-content-center gap-3">
          <Button onClick={handleCopyLink}
            variant="light"
            style={{
              width: "40%",
            }}
          >
            <FaLink />
          </Button>
          <Button variant="success" onClick={() => window.open(`https://wa.me/?text=${encodedUrl}`, "_blank")}>
            <FaWhatsapp />
          </Button>
          <Button variant="primary" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")}>
            <FaFacebook />
          </Button>
          <Button variant="danger" onClick={() => window.open(`mailto:?subject=Check this out&body=${encodedUrl}`, "_blank")}>
            <FaEnvelope />
          </Button>
          <Button variant="dark" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, "_blank")}>
            <FaXTwitter />
          </Button>
          <Button variant="warning" onClick={() => window.open(`https://www.instagram.com/`, "_blank")}>
            <FaInstagram />
          </Button>
          <Button variant="info" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank")}>
            <FaLinkedin />
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SharePopup;
