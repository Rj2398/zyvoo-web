import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  "pk_test_51OJYBTBtvbMCJV4HYgcTe7suuWdRm8p0YqsRVOT7VU8z1CmCeMwK1MSIYRp0NQRaBiH26gE3VgmENFKybIgNJVrd00UGnNavL3"
);

const CardAddHost = ({ enablePayment, callBack, allowCard }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  // Apple Pay / Google Pay
  const [paymentRequest, setPaymentRequest] = useState(null);
  // console.log(paymentRequest, "request*****");
  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();

    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  // Wallet Payment Setup
  useEffect(() => {
    if (!stripe) return;

    const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isApplePlatform) {
      localStorage.setItem("is_apple_device", "true");
    } else {
      localStorage.setItem("is_apple_device", "false");
    }

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Demo Payment",
        amount: 1000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      try {
        // console.log("PAYMENT METHOD => ", ev.paymentMethod);

        toast.success("Wallet payment method received");

        callBack(ev.paymentMethod.id);

        ev.complete("success");
      } catch (err) {
        // console.log(err);

        ev.complete("fail");

        toast.error("Wallet payment failed");
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (enablePayment) {
      handleSubmit();
    }
  }, [enablePayment]);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardNumberElement);

    try {
      const { token, error } = await stripe.createToken(cardElement, {
        currency: "usd",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const cardType = token?.card?.funding;

      if (allowCard === "debit" && cardType !== "debit") {
        toast.error("Only debit cards are allowed. Please use a debit card.");
        return;
      }

      toast.success("Card added successfully");

      // console.log("TOKEN => ", token);

      callBack(token.id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    base: {
      fontSize: "14px",
      color: "#000",
      "::placeholder": {
        color: "#757575",
      },
    },
    invalid: {
      color: "#f00",
    },
  };

  const wrapperStyle = {
    border: isMobileWidth ? "" : "1px solid #ccc",
    borderRadius: "25px",
    padding: isMobileWidth ? "0px" : "10px",
    width: "100%",
    height: "45px",
    marginBottom: "15px",
  };

  return (
    <div
      className="card-form"
      style={{
        width: "100%",
        margin: "auto",
      }}
    >
      {/* Apple Pay / Google Pay Button */}
      {paymentRequest && (
        <div style={{ marginBottom: "20px" }}>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "default",
                  theme: "dark",
                  height: "45px",
                },
              },
            }}
          />
        </div>
      )}

      <label
        style={{
          fontSize: 13,
          fontWeight: "500",
          marginLeft: isMobileWidth && "40px",
          marginBottom: isMobileWidth && "10px",
        }}
      >
        Card Number:
      </label>

      {isMobileWidth ? (
        <div
          style={{
            ...wrapperStyle,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              backgroundColor: "rgba(255, 193, 7, 0.19)",
              padding: "2px",
            }}
          >
            <rect x="4" y="8" width="56" height="42" rx="6" fill="#4AEAB1" />

            <rect x="12" y="16" width="30" height="6" rx="2" fill="#FFFFFF" />

            <rect x="12" y="28" width="24" height="18" rx="3" fill="#FFFFFF" />
          </svg>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "100%",
              height: "45px",
              marginBottom: "15px",
              marginTop: "10px",
              backgroundColor: "#f5f4f9",
            }}
          >
            <CardNumberElement options={{ style: inputStyle }} />
          </div>
        </div>
      ) : (
        <div style={wrapperStyle}>
          <CardNumberElement options={{ style: inputStyle }} />
        </div>
      )}

      <label
        style={{
          fontSize: 13,
          fontWeight: "500",
          marginLeft: isMobileWidth && "40px",
          marginBottom: isMobileWidth && "10px",
        }}
      >
        CVV Number:
      </label>

      {isMobileWidth ? (
        <div
          style={{
            ...wrapperStyle,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              backgroundColor: "rgba(255, 193, 7, 0.19)",
              padding: "2px",
            }}
          >
            <rect x="4" y="8" width="56" height="42" rx="6" fill="#4AEAB1" />

            <rect x="12" y="16" width="30" height="6" rx="2" fill="#FFFFFF" />

            <rect x="12" y="28" width="24" height="18" rx="3" fill="#FFFFFF" />
          </svg>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "100%",
              height: "45px",
              marginBottom: "15px",
              marginTop: "10px",
              backgroundColor: "#f5f4f9",
            }}
          >
            <CardCvcElement options={{ style: inputStyle }} />
          </div>
        </div>
      ) : (
        <div style={wrapperStyle}>
          <CardCvcElement options={{ style: inputStyle }} />
        </div>
      )}

      <label
        style={{
          fontSize: 13,
          fontWeight: "500",
          marginLeft: isMobileWidth && "40px",
          marginBottom: isMobileWidth && "10px",
        }}
      >
        Expiration Date:
      </label>

      {isMobileWidth ? (
        <div
          style={{
            ...wrapperStyle,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="./images/cardbankPayment/calendar.svg"
            style={{
              width: "25px",
              height: "25px",
              padding: "2px",
              backgroundColor: "rgba(255, 193, 7, 0.19)",
            }}
          />

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "100%",
              height: "45px",
              marginBottom: "15px",
              marginTop: "10px",
              backgroundColor: "#f5f4f9",
            }}
          >
            <CardExpiryElement options={{ style: inputStyle }} />
          </div>
        </div>
      ) : (
        <div style={wrapperStyle}>
          <CardExpiryElement options={{ style: inputStyle }} />
        </div>
      )}
    </div>
  );
};

const StripePayment = ({ enablePayment, callBack, allowCard }) => (
  <Elements stripe={stripePromise}>
    <CardAddHost
      enablePayment={enablePayment}
      callBack={callBack}
      allowCard={allowCard}
    />
  </Elements>
);

export default StripePayment;

// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { toast } from "react-toastify";

// const stripePromise = loadStripe(
//   "pk_test_51OJYBTBtvbMCJV4HYgcTe7suuWdRm8p0YqsRVOT7VU8z1CmCeMwK1MSIYRp0NQRaBiH26gE3VgmENFKybIgNJVrd00UGnNavL3"
// );

// const CardAddHost = ({ enablePayment, callBack, allowCard }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const [isMobileWidth, setIsMobileWidth] = useState(false);

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth();
//     window.addEventListener('resize', checkWindowWidth);

//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, []);
//   //

//   useEffect(() => {
//     if (enablePayment) {
//       handleSubmit();
//     }
//   }, [enablePayment]);

//   const handleSubmit = async () => {
//     if (!stripe || !elements) return;

//     setLoading(true);
//     const cardElement = elements.getElement(CardNumberElement);

//     try {
//       const { token, error } = await stripe.createToken(cardElement, {
//         currency: "usd",
//       });

//       const cardType = token.card.funding;
//       if (allowCard == "debit" && cardType !== "debit") {
//         toast.error("Only debit cards are allowed. Please use a debit card.");
//         return;
//       }

//       if (error) {
//         toast.error(error.message);
//       } else {
//         toast.success("Card added successfully");
//         callBack(token.id);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong.";

//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputStyle = {
//     base: {
//       fontSize: "14px",
//       color: "#000",
//       "::placeholder": { color: "#757575" },
//     },
//     invalid: { color: "#f00" },
//   };

//   const wrapperStyle = {
//     // display:'flex',
//     border: isMobileWidth ? "" : "1px solid #ccc",
//     borderRadius: "25px",
//     padding: isMobileWidth ? "0px" : "10px",
//     width: "100%",
//     height: "45px",
//     marginBottom: "15px",

//   };

//   return (
//     <div className="card-form" style={{ width: "100%", margin: "auto" }}>
//       <label style={{ fontSize: 13, fontWeight: "500", marginLeft: isMobileWidth && "40px", marginBottom: isMobileWidth && "10px" }}>
//         Card Number:
//       </label>

//       {
//         isMobileWidth ? (
//           <div
//             style={{
//               ...wrapperStyle,
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             {/* <img
//         src="./images/cardbankPayment/card_number_icon.svg"
//         style={{ width: "25px", height: "25px" }}
//       /> */}

//             <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ backgroundColor: "rgba(255, 193, 7, 0.19)", padding: '2px' }}>
//               {/* <!-- Background Card --> */}
//               <rect x="4" y="8" width="56" height="42" rx="6" fill="#4AEAB1" />

//               {/* <!-- Top White Bar --> */}
//               <rect x="12" y="16" width="30" height="6" rx="2" fill="#FFFFFF" />

//               {/* <!-- Bottom White Box --> */}
//               <rect x="12" y="28" width="24" height="18" rx="3" fill="#FFFFFF" />
//             </svg>

//             <div
//               style={{
//                 flex: 1,
//                 border: "1px solid #ccc",
//                 borderRadius: "10px",
//                 padding: "10px",
//                 width: "100%",
//                 height: "45px",
//                 marginBottom: "15px",
//                 marginTop: "10px",
//                 backgroundColor: "#f5f4f9"
//               }}
//             >
//               <CardNumberElement options={{ style: inputStyle }} />
//             </div>
//           </div>
//         ) : (
//           <div
//             style={
//               wrapperStyle}

//           >
//             <CardNumberElement options={{ style: inputStyle }} />
//           </div>
//         )
//       }

//       <label style={{ fontSize: 13, fontWeight: "500", marginLeft: isMobileWidth && "40px", marginBottom: isMobileWidth && "10px" }}>
//         CVV Number:
//       </label>

//       {
//         isMobileWidth ? (
//           <>
//             <div style={{
//               ...wrapperStyle,
//               display: "flex",
//               alignItems: "center",
//               gap: "10px"

//             }}>
//               {/* <img
//     src="./images/cardbankPayment/cvv_number.svg"
//     style={{ width: "25px", height: "25px" }}
//   /> */}

//               <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ backgroundColor: "rgba(255, 193, 7, 0.19)", padding: '2px' }}>
//                 {/* <!-- Background Card --> */}
//                 <rect x="4" y="8" width="56" height="42" rx="6" fill="#4AEAB1" />

//                 {/* <!-- Top White Bar --> */}
//                 <rect x="12" y="16" width="30" height="6" rx="2" fill="#FFFFFF" />

//                 {/* <!-- Bottom White Box --> */}
//                 <rect x="12" y="28" width="24" height="18" rx="3" fill="#FFFFFF" />
//               </svg>
//               <div style={{
//                 flex: 1, border: "1px solid #ccc",
//                 borderRadius: "10px",
//                 padding: "10px",
//                 width: "100%",
//                 height: "45px",
//                 marginBottom: "15px",
//                 marginTop: '10px',
//                 backgroundColor: "#f5f4f9"
//               }}>
//                 <CardCvcElement options={{ style: inputStyle }} />
//               </div>
//             </div>
//           </>
//         ) : (
//           <div style={wrapperStyle}>
//             <CardCvcElement options={{ style: inputStyle }} />
//           </div>
//         )
//       }
//       {/*
//       <div style={wrapperStyle}>
//         <CardCvcElement options={{ style: inputStyle }} />
//       </div> */}

//       <label style={{ fontSize: 13, fontWeight: "500", marginLeft: isMobileWidth && "40px", marginBottom: isMobileWidth && "10px" }}>
//         Expiration Date:
//       </label>

//       {
//         isMobileWidth ? (
//           <>
//             <div style={{
//               ...wrapperStyle,
//               display: "flex",
//               alignItems: "center",
//               gap: "10px"
//             }}>
//               <img
//                 src="./images/cardbankPayment/calendar.svg"
//                 style={{ width: "25px", height: "25px", padding: '2px', backgroundColor: 'rgba(255, 193, 7, 0.19)' }}
//               />

//               <div style={{
//                 flex: 1, border: "1px solid #ccc",
//                 borderRadius: "10px",
//                 padding: "10px",
//                 width: "100%",
//                 height: "45px",
//                 marginBottom: "15px",
//                 marginTop: '10px',
//                 backgroundColor: "#f5f4f9 "
//               }}>
//                 <CardExpiryElement options={{ style: inputStyle }} />
//               </div>
//             </div>
//           </>
//         ) : (
//           <div style={wrapperStyle}>
//             <CardExpiryElement options={{ style: inputStyle }} />
//           </div>
//         )
//       }

//       {/*
//       <div style={wrapperStyle}>
//         <CardExpiryElement options={{ style: inputStyle }} />
//       </div> */}

//     </div>
//   );
// };

// const StripePayment = ({ enablePayment, callBack, allowCard }) => (
//   <Elements stripe={stripePromise}>
//     <CardAddHost enablePayment={enablePayment} callBack={callBack} allowCard={allowCard} />
//   </Elements>
// );

// export default StripePayment;
