import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useBook from "../../hooks/host/useBook";
import { KEYS } from "../../config/Constant";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ReviewBookingPopup = ({ property_id, booking_id }) => {
  const { reviewBooking, reviewGuestBooking, isLoading } = useBook();
  const {userInfo} = useSelector(({user})=>user)
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO))||JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userId =userInfo?.user_id||userData?.user_id;
  const userType = localStorage.getItem("USER_TYPE");

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  const [show, setShow] = useState(false);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    setRating1(0);
    setRating2(0);
    setRating3(0);
    setMessage("");
  };

  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating1 == 0 || rating2 == 0 || rating3 == 0) {
      toast.error("Please add rating");
      return;
    }

    if (!message.trim()) {
      toast.error("Please add review message");
      return;
    }

    try {
      const payload = {
        user_id: userId,
        booking_id: booking_id,
        property_id: property_id,
        response_rate: rating1,
        communication: rating2,
        on_time: rating3,
        review_message: message,
      };

      const res =
        userType == "host"
          ? await reviewGuestBooking(payload)
          : await reviewBooking(payload);
      if (res?.success) {
        toast.success(res?.message || "review submitted successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }

    handleClose();
  };

  const StarRating = ({ rating, setRating, name }) => {
    return (
      // <div className="rating-group" style={{ display: "inline-block" }}>
      //   <input
      //     checked={rating === 0}
      //     className="rating__input rating__input--none"
      //     name={name}
      //     id={`${name}-none`}
      //     value="0"
      //     type="radio"
      //     disabled
      //     style={{ position: "absolute", left: "-9999px" }}
      //   />
      //   {[1, 2, 3, 4, 5].map((value) => (
      //     <React.Fragment key={value}>
      //       <label
      //         aria-label={`${value} star`}
      //         className="rating__label"
      //         htmlFor={`${name}-${value}`}
      //         style={{ cursor: "pointer", margin: "0 2px" }}
      //       >
      //         <img
      //           className="rating__icon rating__icon--star"
      //           src="/images/locations-grid/star-icon-blank.svg"
      //           loading="lazy" alt=""
      //           style={{ width: "24px", height: "24px" }}
      //         />
      //         <img
      //           className="rating__icon rating__icon-blank-star"
      //           src="/images/locations-grid/star-icon.svg"
      //           loading="lazy" alt=""
      //           style={{
      //             width: "24px",
      //             height: "24px",
      //             display: rating >= value ? "inline-block" : "none",
      //           }}
      //         />
      //       </label>
      //       <input
      //         className="rating__input"
      //         name={name}
      //         id={`${name}-${value}`}
      //         value={value}
      //         type="radio"
      //         checked={rating === value}
      //         onChange={() => setRating(value)}
      //         style={{ position: "absolute", left: "-9999px" }}
      //       />
      //     </React.Fragment>
      //   ))}
      // </div>
      <div
        className="rating-group"
        style={{ display: "inline-block", fontSize: "0" }}
      >
        <input
          checked={rating === 0}
          className="rating__input rating__input--none"
          name={name}
          id={`${name}-none`}
          value="0"
          type="radio"
          disabled
          style={{ position: "absolute", left: "-9999px" }}
        />
        {[1, 2, 3, 4, 5].map((value) => (
          <React.Fragment key={value}>
            <label
              aria-label={`${value} star`}
              htmlFor={`${name}-${value}`}
              style={{
                cursor: "pointer",
                margin: "0 2px",
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src="/images/locations-grid/star-icon-blank.svg"
                loading="lazy" alt=""
                style={{ width:isMobileWidth?"16px": "24px", height: isMobileWidth?"16px": "24px", }}
              />
              <img
                src="/images/locations-grid/star-icon.svg"
                loading="lazy" alt=""
                style={{
                width:isMobileWidth?"16px": "24px", 
                height: isMobileWidth?"16px": "24px", 
                  display: rating >= value ? "inline-block" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </label>

            <input
              name={name}
              id={`${name}-${value}`}
              value={value}
              type="radio"
              checked={rating === value}
              onChange={() => setRating(value)}
              style={{ position: "absolute", left: "-9999px" }}
            />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    // <>
    //   <Button
    //     variant="primary"
    //     onClick={handleShow}
    //     disabled={isLoading}
    //     style={{ backgroundColor: "#3A4B4C", border: "none" }}
    //   >
    //     {isLoading ? "Loading..." : userType === "host" ? "Review Guest" : "Review Booking"}
    //   </Button>

    //   <Modal show={show} onHide={handleClose} centered>
    //     <Modal.Body style={{ padding: "40px", borderRadius: "50px" }} centered>
    //       <button
    //         type="button"
    //         className="close"
    //         onClick={handleClose}
    //         aria-label="Close"
    //         style={{
    //           position: "absolute",
    //           top: "10px",
    //           right: "10px",
    //           background: "#2F3E46",
    //           border: "none",
    //           fontSize: "18px",
    //           cursor: "pointer",
    //           color: "white",
    //           width: "35px",
    //           height: "35px",
    //           borderRadius: "50%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         &times;
    //       </button>
    //       <h2
    //         style={{
    //           marginBottom: "20px",
    //           textAlign: "center",
    //           fontSize: "25px",
    //         }}
    //       >
    //         Review { userType == "host" ? "Guest" : "Booking"}
    //       </h2>
    //       <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
    //         <div className="full-stars-example-two">
    //           <h4 style={{ fontSize: "18px" }}>Response Rate</h4>
    //           <StarRating
    //             rating={rating1}
    //             setRating={setRating1}
    //             name="rating1"
    //           />
    //         </div>
    //         <div
    //           className="full-stars-example-two"
    //           style={{ marginBottom: "10px" }}
    //         >
    //           <h4 style={{ fontSize: "18px" }}>Communication</h4>
    //           <StarRating
    //             rating={rating2}
    //             setRating={setRating2}
    //             name="rating2"
    //           />
    //         </div>
    //         <div
    //           className="full-stars-example-two"
    //           style={{ marginBottom: "20px" }}
    //         >
    //           <h4 style={{ fontSize: "18px" }}>on time</h4>
    //           <StarRating
    //             rating={rating3}
    //             setRating={setRating3}
    //             name="rating3"
    //           />
    //         </div>
    //         <textarea
    //           placeholder="Message.."
    //           value={message}
    //           onChange={(e) => setMessage(e.target.value)}
    //           style={{
    //             width: "100%",
    //             minHeight: "200px",
    //             padding: "10px",
    //             marginBottom: "20px",
    //             border: "1px solid #ddd",
    //             borderRadius: "4px",
    //           }}
    //         />
    //         <div
    //           className="custom-modal-label"
    //           style={{ display: "flex", gap: "12px" }}
    //         >
    //           <input
    //             type="submit"
    //             value="Publish Review"
    //             // onClick={handleClose}
    //             style={{
    //               padding: "10px 20px",
    //               backgroundColor: "#4AEAB1",
    //               color: "black",
    //               border: "none",
    //               borderRadius: "20px",
    //               cursor: "pointer",
    //             }}
    //           />
    //         </div>
    //       </form>
    //     </Modal.Body>
    //   </Modal>

    // </>

    <>
      <Button
        variant="primary"
        onClick={handleShow}
        disabled={isLoading}
        style={{
          backgroundColor: "#3A4B4C",
          border: "none",
          padding: isMobileWidth ? userType === "host" ? "10px 25px" : "10px 15px" : "10px 20px",
          fontSize: isMobileWidth ? "14px" : "16px",
          borderRadius: "6px",
          width: isMobileWidth ? "auto" : "100%",
          maxWidth: isMobileWidth ? "auto" : "300px",
          height: "fit-content",
        }}
      >
        {isLoading
          ? "Loading..."
          : userType === "host"
          ? "Review Guest"
          : "Review Booking"}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        style={{ zIndex: 9999, backgroundColor: " rgba(0,0,0,0.5)",padding:isMobileWidth ?'20px':"" }}
      >
        <Modal.Body
          style={{
            padding:isMobileWidth?"26px 45px":"50px",
            borderRadius: "12px",
            maxWidth: "95vw",
            width: "100%",
            boxSizing: "border-box",
            zIndex: 9999,
            opacity: "1",
          }}
        >
          {/* Close Button */}
        <button
            type="button"
            className="close"
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#2F3E46",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "white",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            &times;
          </button>


          <h2
            style={{
              marginBottom: "20px",
              textAlign: "center",
              fontSize: isMobileWidth?"14px":"22px",
              // lineHeight: "1.2",
              wordWrap: "break-word",
            }}
          >
            Review {userType === "host" ? "Guest" : "Booking"}
          </h2>

          <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            {/* Response Rate */}
            <div
              className="full-stars-example-two"
              style={{ marginBottom: "20px" }}
            >
              <h4 style={{ fontSize:isMobileWidth?"13px": "16px", marginBottom:isMobileWidth?"": "6px" }}>
                Response Rate
              </h4>
              <StarRating
                rating={rating1}
                setRating={setRating1}
                name="rating1"
              />
            </div>

            {/* Communication */}
            <div
              className="full-stars-example-two"
              style={{ marginBottom: "20px" }}
            >
              <h4 style={{ fontSize:isMobileWidth?"13px": "16px", marginBottom:isMobileWidth?"": "6px"  }}>
                Communication
              </h4>
              <StarRating
                rating={rating2}
                setRating={setRating2}
                name="rating2"
              />
            </div>

            {/* On Time */}
            <div
              className="full-stars-example-two"
              style={{ marginBottom: "20px" }}
            >
              <h4 style={{ fontSize:isMobileWidth?"13px": "16px", marginBottom:isMobileWidth?"": "6px" }}>Property</h4>
              <StarRating
                rating={rating3}
                setRating={setRating3}
                name="rating3"
              />
            </div>

            {/* Textarea */}
            <textarea
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "10px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            {/* Submit Button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <input
                type="submit"
                value="Publish Review"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4AEAB1",
                  color: "black",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "400",
                  fontSize: isMobileWidth?"14px":"16px",
                  width: "100%",
                  maxWidth: "550px",
                }}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReviewBookingPopup;

// import React, { useEffect, useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import useBook from "../../hooks/host/useBook";
// import { KEYS } from "../../config/Constant";
// import { toast } from "react-toastify";

// const ReviewBookingPopup = ({ property_id, booking_id }) => {
//   const { reviewBooking, reviewGuestBooking, isLoading } = useBook();

//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
//   const userId = userData?.user_id ? String(userData?.user_id) : null;
//   const userType = localStorage.getItem("USER_TYPE");

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth(); // run on mount
//     window.addEventListener("resize", checkWindowWidth);

//     return () => window.removeEventListener("resize", checkWindowWidth);
//   }, []);

//   const [show, setShow] = useState(false);
//   const [rating1, setRating1] = useState(0);
//   const [rating2, setRating2] = useState(0);
//   const [rating3, setRating3] = useState(0);
//   const [message, setMessage] = useState("");

//   const handleClose = () => {
//     setShow(false);
//     setRating1(0);
//     setRating2(0);
//     setRating3(0);
//     setMessage("");
//   };

//   const handleShow = () => setShow(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (rating1 == 0 || rating2 == 0 || rating3 == 0) {
//       toast.error("Please add rating");
//       return;
//     }

//     if (!message.trim()) {
//       toast.error("Please add review message");
//       return;
//     }

//     try {
//       const payload = {
//         user_id: userId,
//         booking_id: booking_id,
//         property_id: property_id,
//         response_rate: rating1,
//         communication: rating2,
//         on_time: rating3,
//         review_message: message,
//       };

//       const res =
//         userType == "host"
//           ? await reviewGuestBooking(payload)
//           : await reviewBooking(payload);
//       if (res?.success) {
//         toast.success(res?.message || "review submitted successfully");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }

//     handleClose();
//   };

//   const StarRating = ({ rating, setRating, name }) => {
//     return (
//       // <div className="rating-group" style={{ display: "inline-block" }}>
//       //   <input
//       //     checked={rating === 0}
//       //     className="rating__input rating__input--none"
//       //     name={name}
//       //     id={`${name}-none`}
//       //     value="0"
//       //     type="radio"
//       //     disabled
//       //     style={{ position: "absolute", left: "-9999px" }}
//       //   />
//       //   {[1, 2, 3, 4, 5].map((value) => (
//       //     <React.Fragment key={value}>
//       //       <label
//       //         aria-label={`${value} star`}
//       //         className="rating__label"
//       //         htmlFor={`${name}-${value}`}
//       //         style={{ cursor: "pointer", margin: "0 2px" }}
//       //       >
//       //         <img
//       //           className="rating__icon rating__icon--star"
//       //           src="/images/locations-grid/star-icon-blank.svg"
//       //           loading="lazy" alt=""
//       //           style={{ width: "24px", height: "24px" }}
//       //         />
//       //         <img
//       //           className="rating__icon rating__icon-blank-star"
//       //           src="/images/locations-grid/star-icon.svg"
//       //           loading="lazy" alt=""
//       //           style={{
//       //             width: "24px",
//       //             height: "24px",
//       //             display: rating >= value ? "inline-block" : "none",
//       //           }}
//       //         />
//       //       </label>
//       //       <input
//       //         className="rating__input"
//       //         name={name}
//       //         id={`${name}-${value}`}
//       //         value={value}
//       //         type="radio"
//       //         checked={rating === value}
//       //         onChange={() => setRating(value)}
//       //         style={{ position: "absolute", left: "-9999px" }}
//       //       />
//       //     </React.Fragment>
//       //   ))}
//       // </div>
//       <div
//         className="rating-group"
//         style={{ display: "inline-block", fontSize: "0" }}
//       >
//         <input
//           checked={rating === 0}
//           className="rating__input rating__input--none"
//           name={name}
//           id={`${name}-none`}
//           value="0"
//           type="radio"
//           disabled
//           style={{ position: "absolute", left: "-9999px" }}
//         />
//         {[1, 2, 3, 4, 5].map((value) => (
//           <React.Fragment key={value}>
//             <label
//               aria-label={`${value} star`}
//               htmlFor={`${name}-${value}`}
//               style={{
//                 cursor: "pointer",
//                 margin: "0 2px",
//                 position: "relative",
//                 display: "inline-block",
//               }}
//             >
//               <img
//                 src="/images/locations-grid/star-icon-blank.svg"
//                 loading="lazy" alt=""
//                 style={{ width: "24px", height: "24px" }}
//               />
//               <img
//                 src="/images/locations-grid/star-icon.svg"
//                 loading="lazy" alt=""
//                 style={{
//                   width: "24px",
//                   height: "24px",
//                   display: rating >= value ? "inline-block" : "none",
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                 }}
//               />
//             </label>

//             <input
//               name={name}
//               id={`${name}-${value}`}
//               value={value}
//               type="radio"
//               checked={rating === value}
//               onChange={() => setRating(value)}
//               style={{ position: "absolute", left: "-9999px" }}
//             />
//           </React.Fragment>
//         ))}
//       </div>
//     );
//   };

//   return (
//     // <>
//     //   <Button
//     //     variant="primary"
//     //     onClick={handleShow}
//     //     disabled={isLoading}
//     //     style={{ backgroundColor: "#3A4B4C", border: "none" }}
//     //   >
//     //     {isLoading ? "Loading..." : userType === "host" ? "Review Guest" : "Review Booking"}
//     //   </Button>

//     //   <Modal show={show} onHide={handleClose} centered>
//     //     <Modal.Body style={{ padding: "40px", borderRadius: "50px" }} centered>
//     //       <button
//     //         type="button"
//     //         className="close"
//     //         onClick={handleClose}
//     //         aria-label="Close"
//     //         style={{
//     //           position: "absolute",
//     //           top: "10px",
//     //           right: "10px",
//     //           background: "#2F3E46",
//     //           border: "none",
//     //           fontSize: "18px",
//     //           cursor: "pointer",
//     //           color: "white",
//     //           width: "35px",
//     //           height: "35px",
//     //           borderRadius: "50%",
//     //           display: "flex",
//     //           justifyContent: "center",
//     //           alignItems: "center",
//     //         }}
//     //       >
//     //         &times;
//     //       </button>
//     //       <h2
//     //         style={{
//     //           marginBottom: "20px",
//     //           textAlign: "center",
//     //           fontSize: "25px",
//     //         }}
//     //       >
//     //         Review { userType == "host" ? "Guest" : "Booking"}
//     //       </h2>
//     //       <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
//     //         <div className="full-stars-example-two">
//     //           <h4 style={{ fontSize: "18px" }}>Response Rate</h4>
//     //           <StarRating
//     //             rating={rating1}
//     //             setRating={setRating1}
//     //             name="rating1"
//     //           />
//     //         </div>
//     //         <div
//     //           className="full-stars-example-two"
//     //           style={{ marginBottom: "10px" }}
//     //         >
//     //           <h4 style={{ fontSize: "18px" }}>Communication</h4>
//     //           <StarRating
//     //             rating={rating2}
//     //             setRating={setRating2}
//     //             name="rating2"
//     //           />
//     //         </div>
//     //         <div
//     //           className="full-stars-example-two"
//     //           style={{ marginBottom: "20px" }}
//     //         >
//     //           <h4 style={{ fontSize: "18px" }}>on time</h4>
//     //           <StarRating
//     //             rating={rating3}
//     //             setRating={setRating3}
//     //             name="rating3"
//     //           />
//     //         </div>
//     //         <textarea
//     //           placeholder="Message.."
//     //           value={message}
//     //           onChange={(e) => setMessage(e.target.value)}
//     //           style={{
//     //             width: "100%",
//     //             minHeight: "200px",
//     //             padding: "10px",
//     //             marginBottom: "20px",
//     //             border: "1px solid #ddd",
//     //             borderRadius: "4px",
//     //           }}
//     //         />
//     //         <div
//     //           className="custom-modal-label"
//     //           style={{ display: "flex", gap: "12px" }}
//     //         >
//     //           <input
//     //             type="submit"
//     //             value="Publish Review"
//     //             // onClick={handleClose}
//     //             style={{
//     //               padding: "10px 20px",
//     //               backgroundColor: "#4AEAB1",
//     //               color: "black",
//     //               border: "none",
//     //               borderRadius: "20px",
//     //               cursor: "pointer",
//     //             }}
//     //           />
//     //         </div>
//     //       </form>
//     //     </Modal.Body>
//     //   </Modal>

//     // </>

//     <>
//       <Button
//         variant="primary"
//         onClick={handleShow}
//         disabled={isLoading}
//         style={{
//           backgroundColor: "#3A4B4C",
//           border: "none",
//           padding: isMobileWidth
//             ? userType === "host"
//               ? "10px 25px"
//               : "10px 15px"
//             : "10px 20px",

//           fontSize: "16px",
//           borderRadius: "6px",
//           width: isMobileWidth ? "auto" : "100%",
//           maxWidth: isMobileWidth ? "auto" : "300px",
//           height: "fit-content",
//         }}
//       >
//         {isLoading
//           ? "Loading..."
//           : userType === "host"
//           ? "Review Guest"
//           : "Review Booking"}
//       </Button>

//       <Modal
//         show={show}
//         onHide={handleClose}
//         centered
//         style={{ zIndex: 9999, backgroundColor: " rgba(0,0,0,0.5)" }}
//       >
//         <Modal.Body
//           style={{
//             padding: "20px",
//             borderRadius: "12px",
//             maxWidth: "95vw",
//             width: "100%",
//             boxSizing: "border-box",
//             zIndex: 9999,
//             opacity: "1",
//           }}
//         >
//           {/* Close Button */}
//           <button
//             type="button"
//             className="close"
//             onClick={handleClose}
//             aria-label="Close"
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               background: "#2F3E46",
//               border: "none",
//               fontSize: "18px",
//               cursor: "pointer",
//               color: "white",
//               width: "35px",
//               height: "35px",
//               borderRadius: "50%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             &times;
//           </button>

//           <h2
//             style={{
//               marginBottom: "20px",
//               textAlign: "center",
//               fontSize: "22px",
//               lineHeight: "1.2",
//               wordWrap: "break-word",
//             }}
//           >
//             Review {userType === "host" ? "Guest" : "Booking"}
//           </h2>

//           <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
//             {/* Response Rate */}
//             <div
//               className="full-stars-example-two"
//               style={{ marginBottom: "20px" }}
//             >
//               <h4 style={{ fontSize: "16px", marginBottom: "6px" }}>
//                 Response Rate
//               </h4>
//               <StarRating
//                 rating={rating1}
//                 setRating={setRating1}
//                 name="rating1"
//               />
//             </div>

//             {/* Communication */}
//             <div
//               className="full-stars-example-two"
//               style={{ marginBottom: "20px" }}
//             >
//               <h4 style={{ fontSize: "16px", marginBottom: "6px" }}>
//                 Communication
//               </h4>
//               <StarRating
//                 rating={rating2}
//                 setRating={setRating2}
//                 name="rating2"
//               />
//             </div>

//             {/* On Time */}
//             <div
//               className="full-stars-example-two"
//               style={{ marginBottom: "20px" }}
//             >
//               <h4 style={{ fontSize: "16px", marginBottom: "6px" }}>On Time</h4>
//               <StarRating
//                 rating={rating3}
//                 setRating={setRating3}
//                 name="rating3"
//               />
//             </div>

//             {/* Textarea */}
//             <textarea
//               placeholder="Message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               style={{
//                 width: "100%",
//                 minHeight: "120px",
//                 padding: "10px",
//                 marginBottom: "20px",
//                 border: "1px solid #ddd",
//                 borderRadius: "20px",
//                 fontSize: "14px",
//                 resize: "vertical",
//                 boxSizing: "border-box",
//               }}
//             />

//             {/* Submit Button */}
//             <div style={{ display: "flex", justifyContent: "center" }}>
//               <input
//                 type="submit"
//                 value="Publish Review"
//                 style={{
//                   padding: "10px 20px",
//                   backgroundColor: "#4AEAB1",
//                   color: "black",
//                   border: "none",
//                   borderRadius: "20px",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                   fontSize: "16px",
//                   width: "100%",
//                   maxWidth: "550px",
//                 }}
//               />
//             </div>
//           </form>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default ReviewBookingPopup;
