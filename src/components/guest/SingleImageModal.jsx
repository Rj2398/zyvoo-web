import React from "react";
import { Modal } from "react-bootstrap";
import { MdClose } from "react-icons/md";

const SingleImageModal = ({ show, handleClose, imageSrc }) => {
  if (!imageSrc) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="single-image-modal"
      style={{ zIndex: 99999 }}
    >
      <Modal.Body
        style={{
          position: "relative",
          padding: "12px",
          backgroundColor: "#000",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(0, 0, 0, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            color: "#fff",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "background-color 0.2s ease",
          }}
        >
          <MdClose size={22} />
        </button>

        <img
          src={imageSrc}
          alt="Selected property preview"
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default SingleImageModal;
