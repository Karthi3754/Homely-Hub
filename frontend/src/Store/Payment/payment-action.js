import { setPaymentDetails } from "./payment-slice";
import { CardNumberElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { createBooking } from "../../Store/Booking/booking-action";

export const processPayment = ({
  totalAmount,
  stripe,
  elements,
  checkinDate,
  checkoutDate,
  propertyName,
  address,
  maximumGuest,
  bookingId,
  nights,
  propertyId,
  dispatch,
  navigate,
}) => {
  return async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe is not initialized");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    try {
      const response = await axios.post(
        "/api/v1/rent/user/checkout-session", // ✅ Corrected endpoint
        {
          amount: totalAmount,
          currency: "inr",
          paymentMethodTypes: ["card"],
          checkinDate,
          checkoutDate,
          propertyName,
          address,
          maximumGuest,
          bookingId,
          propertyId,
          nights,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      // Confirm the card payment with the client secret
      await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      // Dispatch booking to backend
      dispatch(
        createBooking({
          booking: bookingId,
          property: propertyId,
          price: totalAmount,
          guests: maximumGuest,
          fromDate: checkinDate,
          toDate: checkoutDate,
          nights,
        })
      );

      // Store payment details in Redux
      dispatch(
        setPaymentDetails({
          checkinDate,
          checkoutDate,
          totalPrice: totalAmount,
          propertyName,
          address,
          maximumGuest,
          nights,
        })
      );

      // Navigate to booking success page
      navigate("/user/booking");
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };
};
