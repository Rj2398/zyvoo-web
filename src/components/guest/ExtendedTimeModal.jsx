import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Range from "./bookingDetailsModal/Range";

function ExtendedTimeModal({
  show,
  onHide,
  mergedBooking,
  initialValue,
  setHour = null,
  isExtentionTime = false
}) {
  const [totalPrice, setTotalPrice] = useState(null);
  const [totalHrs, setTotalHrs] = useState(null);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="custom-modal"
    >
      <style>
        {`.custom-modal{
            width:fit-Content;
            margin:"0 auto"
          }`}
      </style>
      <Range perHourRate={mergedBooking?.booking_hourly_rate}
        callbackTotalPrice={(val) => {
          setTotalPrice(val);
        }}
        page={setHour && "extend"}
        bookingData={mergedBooking}
        callbacTotalHrs={(val) => {
          setTotalHrs(val);
          setHour && setHour(val);
        }}
        propertyIDD={
          mergedBooking?.booking_id || mergedBooking?.params?.booking_id
        }
        direct={true}
        onHide={onHide}
        initialValue={initialValue}
        isExtentionTime={isExtentionTime}
      />
    </Modal>
  );
}

export default React.memo(ExtendedTimeModal);
