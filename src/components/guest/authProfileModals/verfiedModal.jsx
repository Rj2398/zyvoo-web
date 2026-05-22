import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../Loader";

function VerificationDone({ show, onHide, text, isMobileWidth, verEmail, verPhone}) {
  const { isLoading } = useAuth();

  const {reset, formState: { setError }, } = useForm();

  const handleModalClose = () => {
    reset();
    onHide(); 
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} centered dialogClassName="custom-modal" >
        <style>
          {`.custom-modal .modal-content {
              border-radius: 15px !important;
              width: ${isMobileWidth ? "100%" : "80%"};
              padding:20px;
          }`}
        </style>
        <Loader visible={isLoading} />
        <Modal.Header closeButton style={{ border: "none", paddingBottom: "0px" }}>
          <style>
            {` .btn-close {
                width: 10px;               /* Small circle size */
                height: 10px;
                background-color: #000;    /* Black background */
                border-radius: 50%;        /* Circular shape */
                opacity: 1;                /* Ensures visibility */
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .btn-close::after {
                content: '×';             /* Cross symbol */
                color: #fff;               /* White cross color */
                font-weight: bold;
                font-size: 20px;           /* Adjust size of the cross */
                line-height: 1;            /* Center the cross */
                margin-top: -4px;
              }
            `}
          </style>
        </Modal.Header>

        <Modal.Title className="w-100 text-center register-modal-header-title">{(verEmail|| verPhone) ? "Success" : "Verification"}</Modal.Title>
        <Modal.Body className="text-center">
          <img width={100} src="/images/popups/success-icon.svg" loading="lazy" alt=""></img>
          <p className="register-modal-body-p">{text || "Verification done successfully"}</p>

          <div className="custom-modal-label mt-3">
            <Button type="button" onClick={handleModalClose} className="register-modal-body-submit-btn">
            {(verEmail|| verPhone) ? "Okay" : "Done"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VerificationDone;
