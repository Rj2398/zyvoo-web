import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "../../components/guest/Checkout";

// Replace with your Stripe Publishable Key
const stripePromise = loadStripe(
  "pk_test_51OJYBTBtvbMCJV4HYgcTe7suuWdRm8p0YqsRVOT7VU8z1CmCeMwK1MSIYRp0NQRaBiH26gE3VgmENFKybIgNJVrd00UGnNavL3"
);

const CheckoutPage = () => {
  const [extendedTime, setExtendedTime] = useState(false);
  return (
    <Elements stripe={stripePromise}>
      <Checkout setExtendedTime={setExtendedTime} />
    </Elements>
  );
};

export default CheckoutPage;
